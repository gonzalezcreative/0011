import React from 'react';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="mb-6 animate-bounce">
        <PartyPopper className="h-16 w-16 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Request Submitted Successfully!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Your rental request has been sent to our network of providers. 
        You can track its status in the leads section.
      </p>
      <div className="flex gap-4">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View Leads
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-3 text-purple-600 hover:text-purple-800 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
};