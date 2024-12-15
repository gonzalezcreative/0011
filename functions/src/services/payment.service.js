import { db } from '../config/firebase';

export class PaymentService {
  async updatePaymentRecord(paymentId, data) {
    await db.collection('payments').doc(paymentId).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async markPaymentComplete(paymentId, sessionId, customerId) {
    await this.updatePaymentRecord(paymentId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      stripeSessionId: sessionId,
      stripeCustomerId: customerId
    });
  }
}

export const paymentService = new PaymentService();