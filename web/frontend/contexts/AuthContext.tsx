'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  login as apiLogin, 
  register as apiRegister, 
  companyLogin as apiCompanyLogin,
  companyRegister as apiCompanyRegister,
  getCurrentUser 
} from '@/lib/api';
import api from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  user_type: 'student' | 'company';
  first_name: string;
  last_name: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string, isCompany?: boolean) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'student' | 'company';
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Session expired. Please login again.');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string, isCompany: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Logging in...');
      
      let response: TokenResponse;
      if (isCompany) {
        console.log('Using company login endpoint');
        response = await apiCompanyLogin(username, password);
      } else {
        console.log('Using standard login endpoint');
        response = await apiLogin(username, password);
      }
      
      // Store tokens in both localStorage and cookies
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      Cookies.set('accessToken', response.access, { sameSite: 'strict' });
      Cookies.set('refreshToken', response.refresh, { sameSite: 'strict' });
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
      
      // If user data isn't included in the response, fetch it
      let userData = response.user;
      if (!userData) {
        try {
          // Fetch user data after successful login
          const userResponse = await getCurrentUser();
          userData = userResponse;
          console.log('Fetched user data:', userData);
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setError('Logged in but failed to fetch user profile');
          return;
        }
      }
      
      // Set user from the response or fetched data
      setUser(userData);

      // Redirect based on user type
      if (userData.user_type === 'student') {
        localStorage.setItem('studentProfile', JSON.stringify(userData));
        window.location.href = '/student';
      } else if (userData.user_type === 'company') {
        localStorage.setItem('companyProfile', JSON.stringify(userData));
        window.location.href = '/company';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('An error occurred during login. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'student' | 'company';
  }) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Registering...');
      
      let response;
      if (data.user_type === 'company') {
        console.log('Using company registration endpoint');
        response = await apiCompanyRegister(data);
        // After registration, log the user in with company login
        await login(data.email, data.password, true);
      } else {
        console.log('Using student registration endpoint');
        response = await apiRegister(data);
        // After registration, log the user in
        await login(data.email, data.password);
      }
      
      // Redirect based on user type (this is handled in the login function)
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle validation errors
        const validationErrors = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        setError(validationErrors);
      } else {
        setError('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('studentProfile');
    localStorage.removeItem('companyProfile');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;