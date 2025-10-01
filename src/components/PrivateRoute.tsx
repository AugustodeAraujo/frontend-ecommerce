// components/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";


export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return null; // ou um spinner/skeleton

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
