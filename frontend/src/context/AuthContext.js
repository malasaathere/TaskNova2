import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => { localStorage.clear(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    localStorage.clear();
    setUser(null);
  };

  const resetPassword = async (newPassword) => {
    await api.put('/api/auth/reset-password', { newPassword });
    setUser(prev => ({ ...prev, mustResetPassword: false }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
