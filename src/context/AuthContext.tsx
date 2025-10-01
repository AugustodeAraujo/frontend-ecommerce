// context/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import api from "@/api/axios";
import type { User } from "@/models/User";

type AuthContextType = {
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // login: salva token e estado de usuário
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.token, { expires: 3 });
    setUser(res.data.user);
  };

  // register: mantém comportamento atual (sem auto-login)
  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  // refresh inicial
  useEffect(() => {
    const refresh = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return; // sem token, permanece deslogado
        const res = await api.get("/auth/refresh");
        Cookies.set("token", res.data.token, { expires: 3 });
        setUser(res.data.user);
      } catch {
        logout();
      } finally {
        setAuthLoading(false);
      }
    };
    refresh();
  }, []);

  // garante que authLoading seja false mesmo sem token
  useEffect(() => {
    if (authLoading && !Cookies.get("token")) setAuthLoading(false);
  }, [authLoading]);

  const value = useMemo(
    () => ({ user, authLoading, login, register, logout }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
