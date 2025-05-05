import React from 'react';

interface TopQueriesProps {
  queries: {
    query: string;
    count: number;
  }[];
}

const TopQueries: React.FC<TopQueriesProps> = ({ queries }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Top Queries</h3>
      
      <div className="space-y-3">
        {queries.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <span className="text-gray-700">{item.query}</span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              {item.count} searches
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopQueries;