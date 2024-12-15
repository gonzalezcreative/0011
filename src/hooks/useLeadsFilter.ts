import { useState, useMemo } from 'react';
import { Lead } from '../types';

export const useLeadsFilter = (leads: Lead[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const locationMatch = `${lead.location.city} ${lead.location.state}`.toLowerCase().includes(searchTerm.toLowerCase());
      const equipmentMatch = lead.equipment.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()));
      return locationMatch || equipmentMatch;
    });
  }, [leads, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    filteredLeads
  };
};