import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompanyProfileForm {
  companyName: string;
  domain: string;
  description: string;
  apiEndpoint: string;
  parameters: string[];
  exampleQueries: string[];
}

const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyProfileForm>({
    companyName: '',
    domain: '',
    description: '',
    apiEndpoint: '',
    parameters: [],
    exampleQueries: ['', '']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to save company profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleParameterChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      parameters: value.split(',').map(p => p.trim()).filter(Boolean)
    }));
  };

  const handleExampleQueryChange = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      exampleQueries: prev.exampleQueries.map((q, i) => i === index ? value : q)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Register Company Profile</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={e => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g., LinkedIn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <input
                type="text"
                value={form.domain}
                onChange={e => setForm(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="e.g., linkedin.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Professional platform for networking and job search."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Endpoint
              </label>
              <input
                type="text"
                value={form.apiEndpoint}
                onChange={e => setForm(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                placeholder="e.g., /searchProfiles"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameters (comma-separated)
              </label>
              <input
                type="text"
                value={form.parameters.join(', ')}
                onChange={e => handleParameterChange(e.target.value)}
                placeholder="e.g., company, title, school"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.parameters.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.parameters.map((param, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Example Natural Language Queries
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.exampleQueries[0]}
                  onChange={e => handleExampleQueryChange(0, e.target.value)}
                  placeholder="e.g., Find PMs at Google from MIT"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  value={form.exampleQueries[1]}
                  onChange={e => handleExampleQueryChange(1, e.target.value)}
                  placeholder="e.g., Show engineers at Amazon from IIT"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;