import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { handleStripeWebhook } from './webhooks/stripe.webhook';

initializeApp();

// Handle Stripe webhooks
export const stripeWebhook = onRequest(
  { 
    cors: false,
    timeoutSeconds: 60
  }, 
  handleStripeWebhook
);