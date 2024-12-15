import { 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Firestore 
} from 'firebase/firestore';
import type { Lead, LeadFormData } from '../types';

export class LeadsService {
  constructor(private db: Firestore) {}

  async createLead(leadData: LeadFormData): Promise<string> {
    const leadsRef = collection(this.db, 'leads');
    const docRef = await addDoc(leadsRef, {
      ...leadData,
      createdAt: new Date().toISOString(),
      status: 'open'
    });
    return docRef.id;
  }

  async getAvailableLeads(): Promise<Lead[]> {
    const leadsRef = collection(this.db, 'leads');
    const q = query(leadsRef, where('status', '==', 'open'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
  }

  async getPurchasedLeads(userId: string): Promise<Lead[]> {
    const leadsRef = collection(this.db, 'leads');
    const q = query(leadsRef, where('purchasedBy', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
  }
}