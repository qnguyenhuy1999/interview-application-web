import { useCallback, useEffect, useState } from "react";
import { loginUser, registerUser } from "../../features/auth/api/auth-api";
import { cacheUtils } from "../lib/api-client";
import { mapError } from "../lib/error-mapper";
import type { User } from "../types";

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(token: string | null): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Decode JWT to get user info (without verification - server validates)
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload)) as {
        sub?: string;
        email?: string;
      };
      setUser({
        id: decoded.sub || "",
        email: decoded.email || "",
      });
    } catch {
      setUser(null);
    }
  }, [token]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await loginUser(email, password);
        return true;
      } catch (err) {
        setError(mapError(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await registerUser(email, password);
        return true;
      } catch (err) {
        setError(mapError(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    cacheUtils.clear();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
