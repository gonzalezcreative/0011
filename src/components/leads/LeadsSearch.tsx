import React from 'react';
import { Search, Filter } from 'lucide-react';

interface LeadsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const LeadsSearch: React.FC<LeadsSearchProps> = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by location or equipment..."
          className="w-full pl-10 p-3 bg-white/90 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
          showFilters
            ? 'bg-white text-purple-600'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        <Filter className="h-5 w-5" />
        Filter
      </button>
    </div>
  );
};