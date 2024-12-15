import React, { useState } from 'react';
import { LeadPreview } from '../components/LeadPreview';
import { LeadsHeader } from '../components/leads/LeadsHeader';
import { LeadsSearch } from '../components/leads/LeadsSearch';
import { LeadsError } from '../components/leads/LeadsError';
import { useAuth } from '../contexts/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useLeadsFilter } from '../hooks/useLeadsFilter';

export const LeadsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'purchased'>('available');
  const { availableLeads, purchasedLeads, loading, error } = useLeads(user?.uid);

  const currentLeads = activeTab === 'available' ? availableLeads : purchasedLeads;
  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    filteredLeads
  } = useLeadsFilter(currentLeads);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <LeadsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAuthenticated={!!user}
      />

      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8">
        <LeadsSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {error && <LeadsError message={error} />}

        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : (
          <LeadPreview
            leads={filteredLeads}
            isPurchased={activeTab === 'purchased'}
          />
        )}
      </div>
    </div>
  );
};