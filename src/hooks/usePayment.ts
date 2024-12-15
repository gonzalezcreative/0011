import { useState } from 'react';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (leadId: string, amount: number) => {
    setLoading(true);
    setError(null);

    try {
      await paymentService.createPaymentSession(leadId, amount);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      return await paymentService.handlePaymentSuccess(sessionId);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    verifyPayment,
    loading,
    error,
  };
};