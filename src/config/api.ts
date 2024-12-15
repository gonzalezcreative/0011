// API configuration and constants
const isProd = import.meta.env.PROD;
const FIREBASE_REGION = 'us-central1';
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const API_CONFIG = {
  baseUrl: isProd 
    ? `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`
    : 'http://localhost:3000',
  endpoints: {
    health: '/health',
    createCheckoutSession: '/createCheckoutSession',
    verifyPayment: '/verifyPayment'
  }
} as const;

export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY
} as const;

export const APP_CONFIG = {
  clientUrl: isProd
    ? 'https://rentalfinder.io'
    : 'http://localhost:5173'
} as const;