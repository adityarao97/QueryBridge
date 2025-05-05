import React from 'react';
import { SearchQuery } from '../types';
import { companies } from '../data/companies';

interface RecentSearchesProps {
  searches: SearchQuery[];
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches }) => {
  // Function to format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function to get company name by ID
  const getCompanyName = (companyId: string): string => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : companyId;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
      
      {searches.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent searches available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Query</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Company</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Timestamp</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Result</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search) => (
                <tr key={search.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{search.query}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{getCompanyName(search.companyId)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatTime(search.timestamp)}</td>
                  <td className="py-3 px-4 text-sm">
                    {search.resultUrl ? (
                      <a 
                        href={search.resultUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Result
                      </a>
                    ) : (
                      <span className="text-gray-400">No result</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;