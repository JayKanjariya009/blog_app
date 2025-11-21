import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      // Validate JWT structure
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser && !isTokenExpired()) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.warn('Invalid user data in localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (storedUser && isTokenExpired()) {
      // Clear expired data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          token: response.token
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed',
          requiresVerification: response.requiresVerification,
          userId: response.userId
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.error || error.message || 'An error occurred during login' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await registerUser(username, email, password);
      console.log('API response:', response);
      
      if (response.success) {
        return { success: true, userId: response.userId };
      } else {
        console.error('Registration API error:', response);
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || error.error || 'An error occurred during registration' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};