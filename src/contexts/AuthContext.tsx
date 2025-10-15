import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const isTokenValid = await apiService.verifyToken();
      
      if (isTokenValid) {
        try {
          const stats = await apiService.getUserStats();
          setUser({
            id: stats.id,
            username: stats.username,
            email: stats.email
          });
        } catch (error) {
          // Token might be invalid, try to refresh
          await apiService.refreshToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    await apiService.login(username, password);
    const stats = await apiService.getUserStats();
    setUser({
      id: stats.id,
      username: stats.username,
      email: stats.email
    });
  };

  const register = async (username: string, email: string, password: string) => {
    await apiService.register(username, email, password);
    await login(username, password);
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};