export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  searchDescription: string;
  apiStructure: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  token?: string;
}

export interface LoginResponse {
  id: number;
  userId: number;
  jwtToken: string;
  refreshToken: string | null;
  createdDate: string;
  modifiedDate: string;
  expiresAt: string;
}

export interface JwtPayload {
  name: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SearchQuery {
  id: string;
  companyId: string;
  query: string;
  timestamp: number;
  resultUrl: string | null;
}

export interface SearchStats {
  totalSearches: number;
  avgResponseTime: number;
  topQueries: {
    query: string;
    count: number;
  }[];
  dailySearches: {
    date: string;
    count: number;
  }[];
}