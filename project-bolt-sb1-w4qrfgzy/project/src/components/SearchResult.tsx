import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SearchResultProps {
  query: string;
  resultUrl: string | null;
  companyName: string;
  isLoading: boolean;
}

const SearchResult: React.FC<SearchResultProps> = ({ 
  query, 
  resultUrl, 
  companyName,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
        <p className="text-center text-gray-500 mt-4">Processing your query with AI...</p>
      </div>
    );
  }

  if (!resultUrl) return null;

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto border border-gray-200 transition-all duration-500 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Result</h3>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500">Your query:</div>
        <div className="text-md font-medium text-gray-700 mt-1">{query}</div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500">Platform:</div>
        <div className="text-md font-medium text-gray-700 mt-1">{companyName}</div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="text-sm text-blue-600 mb-2">Generated URL:</div>
        <div className="flex items-center">
          <a 
            href={resultUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
          >
            {resultUrl}
          </a>
          <a 
            href={resultUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <a 
          href={resultUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-5 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          Visit Result <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default SearchResult;