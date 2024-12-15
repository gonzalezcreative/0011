import React from 'react';
import { DollarSign } from 'lucide-react';
import { budgetRanges } from '../data/budgetRanges';

interface BudgetInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const BudgetInput = ({ value, onChange, error }: BudgetInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Budget Range
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <select
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select a budget range</option>
          {budgetRanges.map((range) => (
            <option key={range.id} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};