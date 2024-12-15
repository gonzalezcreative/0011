import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LeadsErrorProps {
  message: string;
}

export const LeadsError: React.FC<LeadsErrorProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
};