import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { getApiError } from "../services/api";
import { userService } from "../services/userService";
import type { RegisterPayload, UpdateProfilePayload, User } from "../services/types";

interface AuthActionResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  loginWithGoogle: () => Promise<AuthActionResult>;
  register: (data: RegisterData) => Promise<AuthActionResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: UpdateProfilePayload) => Promise<AuthActionResult>;
}

export type RegisterData = RegisterPayload;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("skillswap_token");
      const storedUser = localStorage.getItem("skillswap_user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await userService.getProfile();
        setUser(profile);
        localStorage.setItem("skillswap_user", JSON.stringify(profile));
      } catch {
        localStorage.removeItem("skillswap_token");
        localStorage.removeItem("skillswap_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrapAuth();
  }, []);

  const persistSession = (token: string, nextUser: User) => {
    localStorage.setItem("skillswap_token", token);
    localStorage.setItem("skillswap_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email: string, password: string): Promise<AuthActionResult> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      persistSession(response.token, response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: getApiError(error, "Unable to sign in.") };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<AuthActionResult> => {
    return {
      success: false,
      error: "Google sign-in is not connected in this backend yet. Use email and password for now.",
    };
  };

  const register = async (data: RegisterData): Promise<AuthActionResult> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      persistSession(response.token, response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: getApiError(error, "Unable to create account.") };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillswap_token");
    localStorage.removeItem("skillswap_user");
  };

  const refreshUser = async () => {
    const profile = await userService.getProfile();
    setUser(profile);
    localStorage.setItem("skillswap_user", JSON.stringify(profile));
  };

  const updateUser = async (data: UpdateProfilePayload): Promise<AuthActionResult> => {
    try {
      const updated = await userService.updateProfile(data);
      setUser(updated);
      localStorage.setItem("skillswap_user", JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      return { success: false, error: getApiError(error, "Unable to update profile.") };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
