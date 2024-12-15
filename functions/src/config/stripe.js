import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const webhookSecret = 'whsec_Zgn6wgq00GPHOdSSHg9woTFWbziL2dOR';