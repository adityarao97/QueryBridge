import { User, LoginResponse, JwtPayload } from '../types';
import { api } from './api';

const USER_KEY = 'querybridge_user';
const TOKEN_KEY = 'querybridge_token';

const decodeJwt = (token: string): JwtPayload => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    throw new Error('Invalid token');
  }
};

export const authService = {
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!userJson || !token) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    
    try {
      const user = JSON.parse(userJson) as User;
      user.token = token;
      return user;
    } catch (e) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  setCurrentUser: (user: User, token: string): void => {
    const userToStore = { ...user };
    delete userToStore.token; // Don't store token in user object
    localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event('auth-change')); // Trigger auth change event
  },

  login: async (email: string, password: string, type: 'user' | 'admin' = 'user'): Promise<User | null> => {
    try {
      const response = await api.login(email, password);
      if (response && response.jwtToken) {
        const decoded = decodeJwt(response.jwtToken);
        
        // Check if the user type matches
        if (type === 'admin' && decoded.role !== 'Admin') {
          return null;
        }
        
        const user: User = {
          id: response.userId.toString(),
          email: decoded.email,
          name: decoded.name,
          isAdmin: decoded.role === 'Admin',
          token: response.jwtToken
        };
        
        authService.setCurrentUser(user, response.jwtToken);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  register: async (userData: { email: string; name: string; password: string; isAdmin: boolean }): Promise<User | null> => {
    try {
      const user = await api.register(userData);
      if (user && user.token) {
        authService.setCurrentUser(user, user.token);
      }
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      try {
        await api.logout(user.token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('auth-change')); // Trigger auth change event
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user && !!user.token;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user && user.isAdmin;
  }
};