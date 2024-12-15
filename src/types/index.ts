export interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Location {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Lead {
  id: string;
  equipment: string[];
  startDate: string;
  duration: string;
  location: Location;
  budget: string;
  name: string;
  email: string;
  phone: string;
  details?: string;
  status: 'open' | 'claimed';
  createdAt: string;
  purchasedBy?: string;
  purchaseDate?: string;
}

export interface LeadFormData {
  equipment: string[];
  startDate: string;
  duration: string;
  location: Location;
  budget: string;
  name: string;
  email: string;
  phone: string;
  details?: string;
}

export interface PaymentSession {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  leadId: string;
  userId: string;
  createdAt: string;
}

export interface PaymentError {
  message: string;
  code?: string;
}