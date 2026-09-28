import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quizzent_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          setUser(res.data);
        } catch (err) {
          console.error('Failed to load user:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('quizzent_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res;
  };

  const register = async (userDataInput) => {
    const res = await authService.register(userDataInput);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('quizzent_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('quizzent_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
