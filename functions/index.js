import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import Stripe from 'stripe';
import cors from 'cors';

initializeApp();

const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = 'whsec_Zgn6wgq00GPHOdSSHg9woTFWbziL2dOR';

// CORS middleware
const corsHandler = cors({
  origin: [
    'https://rentalfinder.io',
    'https://www.rentalfinder.io',
    'http://localhost:5173'
  ],
  methods: ['POST', 'OPTIONS'],
  credentials: true
});

// Create checkout session
export const createCheckoutSession = onRequest({ cors: true }, async (req, res) => {
  try {
    const { leadId, amount } = req.body;

    if (!leadId || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create payment record in Firestore
    const paymentRef = await db.collection('payments').add({
      leadId,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Lead Purchase',
            description: `Access to lead details (ID: ${leadId})`
          },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/leads?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/leads`,
      metadata: {
        leadId,
        paymentId: paymentRef.id
      }
    });

    // Update payment record with session ID
    await paymentRef.update({ sessionId: session.id });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment
export const verifyPayment = onRequest({ cors: true }, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update lead status
    await db.collection('leads').doc(session.metadata.leadId).update({
      status: 'claimed',
      purchasedBy: session.customer,
      purchaseDate: new Date().toISOString()
    });

    // Update payment status
    await db.collection('payments').doc(session.metadata.paymentId).update({
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    res.json({ success: true, leadId: session.metadata.leadId });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Handle Stripe webhooks
export const stripeWebhook = onRequest({ cors: false }, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret // Using the provided webhook secret
    );

    // Handle successful checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('Processing successful payment:', session.id);

      try {
        // Update lead status
        await db.collection('leads').doc(session.metadata.leadId).update({
          status: 'claimed',
          purchasedBy: session.customer,
          purchaseDate: new Date().toISOString()
        });

        // Update payment status
        await db.collection('payments').doc(session.metadata.paymentId).update({
          status: 'completed',
          completedAt: new Date().toISOString(),
          stripeSessionId: session.id,
          stripeCustomerId: session.customer
        });

        console.log('Successfully processed payment for lead:', session.metadata.leadId);
      } catch (error) {
        console.error('Error updating database after payment:', error);
        // Don't throw here - we still want to return 200 to Stripe
      }
    }

    // Return a 200 success response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});