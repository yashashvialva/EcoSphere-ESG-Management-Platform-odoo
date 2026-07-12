import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await authService.getProfile();
      setUser(res);
      setError(null);
    } catch (err) {
      console.error('Failed to load user', err);
      localStorage.removeItem('token');
      setUser(null);
      setError(err.message || 'Session expired');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await authService.login(credentials);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setError(null);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await authService.register(userData);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setError(null);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasPermission = (permissionCode) => {
    if (!user) return false;
    if (user.role === 'Administrator') return true;
    return user.permissions?.includes(permissionCode);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, hasPermission, isAuthenticated: !!user }}>
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
