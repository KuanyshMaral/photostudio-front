import { createContext, useContext, useState } from "react";

/* eslint-disable react-refresh/only-export-components */

interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'studio_owner' | 'admin';
  avatar_url?: string;
}

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  refreshUser?: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("token");
    console.log('AuthProvider init - token from localStorage:', !!savedToken);
    return savedToken;
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    console.log('AuthProvider init - user from localStorage:', parsedUser);
    return parsedUser;
  });

  const login = (token: string, user?: User) => {
    console.log('AuthContext.login - token:', !!token, 'user:', user);
    setToken(token);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      console.log('User saved to localStorage and state');
    }
    localStorage.setItem("token", token);
    console.log('Token saved to localStorage');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
