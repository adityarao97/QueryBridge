import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  companyName: string;
  isLoading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, companyName, isLoading }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderText = `Search ${companyName} with natural language...`;

  useEffect(() => {
    // Auto focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-12 py-4 bg-white border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-base"
            placeholder={placeholderText}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className={`
                px-4 py-2 rounded-full font-medium focus:outline-none
                ${isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : query.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? 'Processing...' : 'Search'}
            </button>
          </div>
        </div>
      </form>
      
      <p className="mt-2 text-sm text-gray-500 text-center">
        {isLoading ? 'Analyzing your query...' : 'Try asking a specific question or use natural language.'}
      </p>
    </div>
  );
};

export default SearchBox;