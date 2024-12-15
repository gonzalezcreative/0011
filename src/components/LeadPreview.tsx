import React, { useState } from 'react';
import { Calendar, MapPin, Package, ExternalLink, Phone, Mail, User } from 'lucide-react';
import type { Lead } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { PaymentModal } from './PaymentModal';
import { equipmentOptions } from '../data/equipment';

interface LeadPreviewProps {
  leads: Lead[];
  isPurchased?: boolean;
}

export const LeadPreview = ({ leads, isPurchased = false }: LeadPreviewProps) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handlePurchase = (leadId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedLeadId(leadId);
    setIsPaymentModalOpen(true);
  };

  const getEquipmentNames = (equipmentIds: string[]) => {
    return equipmentIds.map(id => {
      const equipment = equipmentOptions.find(e => e.id === id);
      return equipment ? equipment.name : '';
    }).filter(Boolean);
  };

  const formatLocation = (location: Lead['location'], showFull: boolean) => {
    if (!showFull) {
      return `${location.city}, ${location.state}`;
    }
    return `${location.street}, ${location.city}, ${location.state} ${location.zip}`;
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-white text-lg">
          {isPurchased 
            ? "You haven't purchased any leads yet"
            : "No rental requests available at the moment"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">
                    {getEquipmentNames(lead.equipment).join(', ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{lead.startDate} ({lead.duration})</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{formatLocation(lead.location, isPurchased)}</span>
                </div>

                {isPurchased && (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Customer Details:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{lead.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${lead.email}`} className="text-purple-600 hover:text-purple-800">
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${lead.phone}`} className="text-purple-600 hover:text-purple-800">
                            {lead.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isPurchased && (
                <button
                  onClick={() => handlePurchase(lead.id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Customer Details ($5)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {selectedLeadId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedLeadId(null);
          }}
          leadId={selectedLeadId}
          amount={5}
        />
      )}
    </>
  );
};