import { SearchQuery, Company, User, SearchStats, LoginResponse } from '../types';
import { companies } from '../data/companies';
import { searchQueries, mockStats } from '../data/mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8081/api';

// Mock API service
export const api = {
  // Get all available companies
  getCompanies: async (): Promise<Company[]> => {
    await delay(800);
    return [...companies];
  },

  // Get company by ID
  getCompany: async (id: string): Promise<Company | undefined> => {
    await delay(600);
    return companies.find(company => company.id === id);
  },

  // Process search query
  processQuery: async (companyId: string, query: string): Promise<string> => {
    try {
      // First, log the search query
      const company = companies.find(c => c.id === companyId);
      if (!company) throw new Error('Company not found');

      const response = await fetch('http://localhost:8000/log_and_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: company.name,
          query: query
        })
      });

      const data = await response.json();
      return data.llama_response_content;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  },

  // Get search statistics
  getSearchStats: async (): Promise<SearchStats> => {
    await delay(1500);
    return { ...mockStats };
  },

  // Get recent searches
  getRecentSearches: async (): Promise<SearchQuery[]> => {
    await delay(1000);
    return [...searchQueries].sort((a, b) => b.timestamp - a.timestamp);
  },

  // Add a new company
  addCompany: async (company: Omit<Company, 'id'>): Promise<Company> => {
    await delay(1500);
    const newCompany: Company = {
      ...company,
      id: `company-${Date.now()}`
    };
    return newCompany;
  },

  // Register a new user
  register: async (userData: { name: string; email: string; password: string; isAdmin: boolean }): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          userTypeId: userData.isAdmin ? 2 : 1
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      return {
        id: data.id.toString(),
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/logout?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};