import { createContext, useContext, useMemo, useState } from 'react';

// This context manages authentication state, including the token and user information.
const AuthContext = createContext(null);
// Keys for localStorage
const TOKEN_KEY = 'ecar_token';
const USER_KEY = 'ecar_user';

// Helper function to get stored user from localStorage
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
    
  } catch (error) {
    return null;
  }
  
};

// The AuthProvider component wraps the app and provides authentication state and functions to its children.
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(getStoredUser());

  const saveAuth = (payload) => {
    const newToken = payload?.token || '';
    const newUser = payload?.user || null;

    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }

    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  // Logout handler that clears auth state and redirects to login page.
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      saveAuth,
      logout,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin'
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext in components.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

