import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/api';

class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(STRIPE_CONFIG.publicKey);
  }

  async getStripe(): Promise<Stripe> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    return stripe;
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.getStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export const stripeService = new StripeService();