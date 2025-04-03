
import React, { createContext, useContext, useEffect } from "react";
import { login as apiLogin, User } from "../services/api";
import { useAuthStore } from "../store/authStore";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token, refreshToken, isLoading, setAuth, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Set loading to false once the store has hydrated
    setLoading(false);
  }, [setLoading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin({ email, password });
      
      setAuth(response.user, response.token, response.refreshToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
