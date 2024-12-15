import React from 'react';

interface LeadsHeaderProps {
  activeTab: 'available' | 'purchased';
  setActiveTab: (tab: 'available' | 'purchased') => void;
  isAuthenticated: boolean;
}

export const LeadsHeader: React.FC<LeadsHeaderProps> = ({
  activeTab,
  setActiveTab,
  isAuthenticated
}) => {
  return (
    <div className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md md:relative md:bg-transparent md:shadow-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 p-4">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 px-6 rounded-lg transition-all ${
              activeTab === 'available'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 md:bg-white/10 md:text-white md:hover:bg-white/20'
            }`}
          >
            Available Requests
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('purchased')}
              className={`flex-1 py-3 px-6 rounded-lg transition-all ${
                activeTab === 'purchased'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 md:bg-white/10 md:text-white md:hover:bg-white/20'
              }`}
            >
              Purchased Requests
            </button>
          )}
        </div>
      </div>
    </div>
  );
};