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
  // Admin functions
  promoteToAdmin: (userId: number) => Promise<void>;
  demoteFromAdmin: (userId: number) => Promise<void>;
  isAdmin: (userId: number) => Promise<boolean>;
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

  const promoteToAdmin = async (userId: number): Promise<void> => {
    // This would be implemented with API call
    console.log('Promoting user to admin:', userId);
  };

  const demoteFromAdmin = async (userId: number): Promise<void> => {
    // This would be implemented with API call
    console.log('Demoting user from admin:', userId);
  };

  const isAdmin = async (userId: number): Promise<boolean> => {
    // Check if user has admin role
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      return userData.user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
      console.log('refreshUser - currentUser from localStorage:', currentUser);
      const isAdmin = currentUser?.role === 'admin';
      console.log('refreshUser - isAdmin:', isAdmin);
      
      if (isAdmin) {
        console.log('refreshUser - skipping refresh for admin user (already have user data)');
        return; // Admin users don't need to refresh
      }
      
      const endpoint = '/api/v1/users/me';
      const fullUrl = `${import.meta.env.VITE_API_URL}${endpoint}`;
      console.log('refreshUser - calling endpoint:', fullUrl);
      
      const response = await fetch(fullUrl, {
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
    <AuthContext.Provider value={{ token, user, login, logout, refreshUser, promoteToAdmin, demoteFromAdmin, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
