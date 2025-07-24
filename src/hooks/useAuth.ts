
import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    email: null,
  });

  useEffect(() => {
    // Check if user is already authenticated on mount
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setAuthState(parsedAuth);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple hardcoded authentication
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const newAuthState = { isAuthenticated: true, email };
      setAuthState(newAuthState);
      localStorage.setItem('admin_auth', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, email: null });
    localStorage.removeItem('admin_auth');
  };

  return {
    ...authState,
    login,
    logout,
  };
};
