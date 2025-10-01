import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import type { User } from "@/models/User";
import type { AuthContextType } from "@/@types/AuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const api = axios.create({
    baseURL: "http://localhost:3333/api",
  });

  api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.token, { expires: 3 });
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.get("/auth/refresh");
        Cookies.set("token", res.data.token, { expires: 3 });
        setUser(res.data.user);
      } catch (err) {
        logout();
      }
    };
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
