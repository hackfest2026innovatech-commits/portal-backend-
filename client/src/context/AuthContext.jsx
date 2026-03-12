import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../services/auth.service';
import { getItem, setItem, removeItem, clearAll } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, verify stored token by fetching user profile
  useEffect(() => {
    async function loadUser() {
      const storedToken = getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const res = await authService.getMe();
        // Server returns { success, message, data: { user } }
        const payload = res.data || res;
        setUser(payload.user || payload);
        setError(null);
      } catch (err) {
        console.error('Failed to load user:', err);
        // Token is invalid, clean up
        removeItem('token');
        removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      // Server returns { success, message, data: { user, accessToken, refreshToken } }
      const payload = res.data || res;
      const authToken = payload.accessToken || payload.token;
      const authUser = payload.user;

      if (!authToken) {
        throw new Error('No token received from server');
      }

      setItem('token', authToken);
      if (payload.refreshToken) {
        setItem('refreshToken', payload.refreshToken);
      }
      setToken(authToken);
      setUser(authUser);
      setItem('user', authUser);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      // Server returns { success, message, data: { user, accessToken, refreshToken } }
      const payload = res.data || res;
      const authToken = payload.accessToken || payload.token;
      const authUser = payload.user;

      if (!authToken) {
        throw new Error('No token received from server');
      }

      setItem('token', authToken);
      if (payload.refreshToken) {
        setItem('refreshToken', payload.refreshToken);
      }
      setToken(authToken);
      setUser(authUser);
      setItem('user', authUser);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAll();
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    setItem('user', updatedUser);
  }, []);

  const isAuthenticated = !!token && !!user;

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) return role.includes(user.role);
      return user.role === role;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
      hasRole,
    }),
    [user, token, loading, error, isAuthenticated, login, register, logout, updateUser, hasRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
