import { db } from '../config/firebase';

export class LeadService {
  async updateLeadStatus(leadId, data) {
    await db.collection('leads').doc(leadId).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async markLeadClaimed(leadId, customerId) {
    await this.updateLeadStatus(leadId, {
      status: 'claimed',
      purchasedBy: customerId,
      purchaseDate: new Date().toISOString()
    });
  }
}

export const leadService = new LeadService();