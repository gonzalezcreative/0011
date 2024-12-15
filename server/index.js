import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const isProd = process.env.NODE_ENV === 'production';

// Configure CORS with appropriate origin
const corsOptions = {
  origin: isProd 
    ? ['https://rentalfinder.io', 'https://www.rentalfinder.io']
    : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { leadId, amount } = req.body;

    if (!leadId || !amount) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    const successUrl = isProd
      ? 'https://rentalfinder.io/leads?session_id={CHECKOUT_SESSION_ID}'
      : 'http://localhost:5173/leads?session_id={CHECKOUT_SESSION_ID}';

    const cancelUrl = isProd
      ? 'https://rentalfinder.io/leads'
      : 'http://localhost:5173/leads';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lead Purchase',
              description: `Access to lead details (ID: ${leadId})`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        leadId,
      },
    });

    res.json({ 
      id: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session' 
    });
  }
});

// Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID is required' 
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed' 
      });
    }

    res.json({
      success: true,
      leadId: session.metadata.leadId
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});