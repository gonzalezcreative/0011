import { stripe, webhookSecret } from '../config/stripe';
import { paymentService } from '../services/payment.service';
import { leadService } from '../services/lead.service';

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

async function handleCheckoutCompleted(session) {
  try {
    const { leadId, paymentId } = session.metadata;
    
    await Promise.all([
      leadService.markLeadClaimed(leadId, session.customer),
      paymentService.markPaymentComplete(paymentId, session.id, session.customer)
    ]);

    console.log('Successfully processed checkout completion:', {
      sessionId: session.id,
      leadId,
      paymentId
    });
  } catch (error) {
    console.error('Error processing checkout completion:', error);
    // Don't throw - we still want to return 200 to Stripe
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
}