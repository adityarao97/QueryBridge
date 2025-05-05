import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

interface CompanyMetrics {
  CompanyName: string;
  CompanyId: string;
  total_searches: number;
}

const AdminAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<CompanyMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/metrics/company-searches');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const maxSearches = Math.max(...metrics.map(m => m.total_searches));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Search Analytics</h1>
              <p className="text-gray-600 mt-1">Overview of search metrics across platforms</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="space-y-6">
            {metrics.map((metric) => (
              <div key={metric.CompanyId} className="relative">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 w-24">{metric.CompanyName}</span>
                  <div className="flex-1 ml-4">
                    <div className="h-8 bg-gray-100 rounded-lg relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-500 rounded-lg transition-all duration-500"
                        style={{ 
                          width: `${(metric.total_searches / maxSearches) * 100}%`,
                        }}
                      >
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-white font-medium">
                          {metric.total_searches}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              * Search counts represent total queries processed for each platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;