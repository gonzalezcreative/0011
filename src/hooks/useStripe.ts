import { useState } from 'react';
import { StripeService } from '../services/stripe.service';
import { useAuth } from '../contexts/AuthContext';

const stripeService = new StripeService();

export const useStripe = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseLead = async (leadId: string, amount: number) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const { sessionId } = await stripeService.createPaymentSession(leadId, amount);
      await stripeService.processPayment(sessionId);
      // Don't record the payment here - it will be handled by the webhook
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    purchaseLead,
    loading,
    error,
  };
};