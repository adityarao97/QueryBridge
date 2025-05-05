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
    await delay(1200);
    
    // Generate a mock URL based on the company and query
    let baseUrl = '';
    let queryParam = '';
    
    switch (companyId) {
      case 'amazon':
        baseUrl = 'https://www.amazon.com/s';
        queryParam = query.replace(/\s+/g, '+');
        return `${baseUrl}?k=${queryParam}`;
      case 'linkedin':
        baseUrl = 'https://www.linkedin.com/jobs/search/';
        queryParam = query.replace(/\s+/g, '%20');
        return `${baseUrl}?keywords=${queryParam}`;
      case 'booking':
        baseUrl = 'https://www.booking.com/searchresults.html';
        queryParam = query.replace(/\s+/g, '+');
        return `${baseUrl}?ss=${queryParam}`;
      case 'google':
        baseUrl = 'https://www.google.com/search';
        queryParam = query.replace(/\s+/g, '+');
        return `${baseUrl}?q=${queryParam}`;
      default:
        return `https://www.google.com/search?q=${query.replace(/\s+/g, '+')}`;
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