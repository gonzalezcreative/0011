import { useState, useEffect } from 'react';
import { LeadsService } from '../services/leads.service';
import { db } from '../config/firebase';
import type { Lead } from '../types';

const leadsService = new LeadsService(db);

export const useLeads = (userId?: string) => {
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [purchasedLeads, setPurchasedLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const available = await leadsService.getAvailableLeads();
        setAvailableLeads(available);

        if (userId) {
          const purchased = await leadsService.getPurchasedLeads(userId);
          setPurchasedLeads(purchased);
        }
      } catch (err) {
        setError('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [userId]);

  return { availableLeads, purchasedLeads, loading, error };
};