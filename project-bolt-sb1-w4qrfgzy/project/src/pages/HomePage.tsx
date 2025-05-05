import React, { useState, useEffect } from 'react';
import CompanyCard from '../components/CompanyCard';
import SearchBox from '../components/SearchBox';
import SearchResult from '../components/SearchResult';
import { api } from '../services/api';
import { Company } from '../types';
import { Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await api.getCompanies();
        setCompanies(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setSearchQuery('');
    setSearchResult(null);
  };
  
  const handleSearch = async (query: string) => {
    if (!selectedCompany) return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setSearchResult(null);
    
    try {
      const result = await api.processQuery(selectedCompany.id, query);
      setSearchResult(result);
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-md bg-blue-400 h-12 w-12 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Natural Language Search</span>
            <span className="block text-blue-600">Across Top Platforms</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Select a platform to start searching with natural language
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isSelected={selectedCompany?.id === company.id}
              onClick={() => handleSelectCompany(company)}
            />
          ))}
        </div>

        {selectedCompany && (
          <div className="space-y-8 transition-all duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
              <p className="text-gray-600 mt-2">{selectedCompany.searchDescription}</p>
            </div>
            
            <SearchBox 
              onSearch={handleSearch}
              companyName={selectedCompany.name}
              isLoading={isSearching}
            />
            
            {(searchQuery || isSearching) && (
              <SearchResult 
                query={searchQuery}
                resultUrl={searchResult}
                companyName={selectedCompany.name}
                isLoading={isSearching}
              />
            )}
            
            {!searchQuery && !isSearching && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching {selectedCompany.name}</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter your query using natural language in the search box above
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;