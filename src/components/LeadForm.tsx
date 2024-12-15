import React, { useState } from 'react';
import { Calendar, Send } from 'lucide-react';
import { LeadsService } from '../services/leads.service';
import { db } from '../config/firebase';
import type { LeadFormData } from '../types';
import { EquipmentSearch } from './EquipmentSearch';
import { BudgetInput } from './BudgetInput';
import { LocationInput } from './LocationInput';
import { DurationInput } from './DurationInput';
import { SuccessMessage } from './SuccessMessage';

const leadsService = new LeadsService(db);

export const LeadForm = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    equipment: [],
    startDate: '',
    duration: '',
    location: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<LeadFormData> = {};
    if (formData.equipment.length === 0) newErrors.equipment = 'Select at least one item';
    if (!formData.startDate) newErrors.startDate = 'Required';
    if (!formData.duration) newErrors.duration = 'Required';
    if (!formData.location) newErrors.location = 'Required';
    if (!formData.budget) newErrors.budget = 'Required';
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.phone) newErrors.phone = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      equipment: [],
      startDate: '',
      duration: '',
      location: '',
      budget: '',
      name: '',
      email: '',
      phone: '',
      details: ''
    });
    setSubmitSuccess(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await leadsService.createLead(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 relative z-10">
        <SuccessMessage onReset={resetForm} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rest of the form fields remain the same */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment Needed
          </label>
          <EquipmentSearch
            selectedEquipment={formData.equipment}
            onEquipmentChange={(selected) => setFormData({ ...formData, equipment: selected })}
          />
          {errors.equipment && (
            <p className="text-red-500 text-sm mt-1">{errors.equipment}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <DurationInput
          value={formData.duration}
          onChange={(value) => setFormData({ ...formData, duration: value })}
          error={errors.duration}
        />

        <div className="col-span-full">
          <LocationInput
            value={formData.location}
            onChange={(value) => setFormData({ ...formData, location: value })}
            error={errors.location}
          />
        </div>

        <div className="col-span-full">
          <BudgetInput
            value={formData.budget}
            onChange={(value) => setFormData({ ...formData, budget: value })}
            error={errors.budget}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details (Optional)
          </label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
};