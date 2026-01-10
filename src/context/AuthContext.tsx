import { createContext, useContext, useState } from "react";

/* eslint-disable react-refresh/only-export-components */

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

const AuthContext = createContext<AuthContextType | null>(null);

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
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
