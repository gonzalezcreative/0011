import { apiClient } from '../utils/api';
import { stripeService } from './stripe.service';
import { API_CONFIG } from '../config/api';

interface CheckoutSession {
  id: string;
  url: string;
}

interface PaymentVerification {
  success: boolean;
  leadId: string;
}

export class PaymentService {
  async createPaymentSession(leadId: string, amount: number): Promise<void> {
    try {
      // Check server health first
      const isHealthy = await apiClient.checkHealth();
      if (!isHealthy) {
        throw new Error('Payment service is currently unavailable. Please try again later.');
      }

      // Create checkout session
      const session = await apiClient.post<CheckoutSession>(
        API_CONFIG.endpoints.createCheckoutSession,
        {
          leadId,
          amount: amount * 100, // Convert to cents
        }
      );

      // Redirect to Stripe Checkout
      await stripeService.redirectToCheckout(session.id);
    } catch (error: any) {
      console.error('Payment session creation failed:', error);
      throw new Error(
        error.message || 'Unable to process payment. Please try again later.'
      );
    }
  }

  async handlePaymentSuccess(sessionId: string): Promise<PaymentVerification> {
    try {
      return await apiClient.post<PaymentVerification>(
        API_CONFIG.endpoints.verifyPayment,
        { sessionId }
      );
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      throw new Error(
        error.message || 'Unable to verify payment. Please contact support.'
      );
    }
  }
}

export const paymentService = new PaymentService();