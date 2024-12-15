import React, { useState } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { paymentService } from '../services/payment.service';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  amount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  leadId,
  amount,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      await paymentService.createPaymentSession(leadId, amount);
      // User will be redirected to Stripe
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Purchase Lead Details</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            You're about to purchase access to the complete lead details.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Amount:</p>
            <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Purchase Lead'
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}