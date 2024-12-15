import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  onChange: (value: { street: string; city: string; state: string; zip: string; }) => void;
  error?: string;
}

export const LocationInput = ({ value, onChange, error }: LocationInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sample data for state suggestions
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Location
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Street Address"
            value={value.street}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="City"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <select
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="ZIP Code"
            value={value.zip}
            onChange={(e) => onChange({ ...value, zip: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            maxLength={5}
            pattern="[0-9]*"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};