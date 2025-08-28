import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  user_id: number;
  email: string;
  username: string;
  join_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, sec_password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      apiService.setToken(token);
      // Verify token is still valid by fetching user data
      apiService.getMe().then(userData => {
        setUser(userData);
      }).catch(() => {
        localStorage.removeItem('access_token');
        apiService.setToken(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    localStorage.setItem('access_token', response.access_token);
    apiService.setToken(response.access_token);
    
    const userData = await apiService.getMe();
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string, sec_password?: string) => {
    const response = await apiService.register(username, email, password, sec_password);
    localStorage.setItem('access_token', response.access_token);
    apiService.setToken(response.access_token);
    
    const userData = await apiService.getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    apiService.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
