import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile } from '../features/auth/auth.types';

interface AuthContextType {
    token: string | null;
    user: Profile | null;
    login: (token: string, user: Profile) => void;
    logout: () => void;
    isLoading: boolean;
}

<<<<<<< HEAD
const AuthContext = createContext<AuthContextType | undefined>(undefined);
=======
interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'studio_owner' | 'admin';
}

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
};
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<Profile | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
    const login = (newToken: string, newUser: Profile) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
=======
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (token: string, user?: User) => {
    setToken(token);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};