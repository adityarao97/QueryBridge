import { SearchQuery, SearchStats, User } from '../types';

// Mock users data
export const users: User[] = [
  {
    id: 'admin1',
    email: 'admin@querybridge.com',
    name: 'Admin User',
    isAdmin: true
  }
];

// Mock search queries
export const searchQueries: SearchQuery[] = [
  {
    id: '1',
    companyId: 'amazon',
    query: 'best selling headphones under $100',
    timestamp: Date.now() - 86400000 * 3,
    resultUrl: 'https://www.amazon.com/s?k=headphones+under+100'
  },
  {
    id: '2',
    companyId: 'linkedin',
    query: 'software developer jobs in San Francisco',
    timestamp: Date.now() - 86400000 * 2,
    resultUrl: 'https://www.linkedin.com/jobs/search/?keywords=software%20developer&location=San%20Francisco'
  },
  {
    id: '3',
    companyId: 'booking',
    query: 'hotels in Paris for next weekend',
    timestamp: Date.now() - 86400000,
    resultUrl: 'https://www.booking.com/searchresults.html?ss=Paris'
  }
];

// Mock search stats
export const mockStats: SearchStats = {
  totalSearches: 245,
  avgResponseTime: 0.89,
  topQueries: [
    { query: 'software engineer jobs', count: 32 },
    { query: 'product manager', count: 28 },
    { query: 'hotels in london', count: 26 },
    { query: 'wireless headphones', count: 21 },
    { query: 'flights to new york', count: 19 }
  ],
  dailySearches: [
    { date: '2025-01-01', count: 18 },
    { date: '2025-01-02', count: 22 },
    { date: '2025-01-03', count: 15 },
    { date: '2025-01-04', count: 25 },
    { date: '2025-01-05', count: 30 },
    { date: '2025-01-06', count: 41 },
    { date: '2025-01-07', count: 48 }
  ]
};