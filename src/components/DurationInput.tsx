import React from 'react';
import { Clock } from 'lucide-react';

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DurationInput = ({ value, onChange, error }: DurationInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rental Duration
      </label>
      <div className="relative">
        <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <select
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select duration</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="long-term">Long Term</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};