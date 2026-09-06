"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, SignUpCredentials, SignInCredentials, UserProfileUpdate, BookingIntent } from "@/types/auth";
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredBookingIntent,
  setStoredBookingIntent
} from "./storage";
import { api, setAuthToken, getAuthToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfileUpdate>) => Promise<{ success: boolean; error?: string }>;
  bookingIntent: BookingIntent | null;
  setBookingIntent: (intent: BookingIntent | null) => void;
  clearBookingIntent: () => void;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup", intent?: BookingIntent) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: "signin" | "signup") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingIntent, setBookingIntentState] = useState<BookingIntent | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    // Hydrate user and intent from client storage and verify with backend
    const storedUser = getStoredCurrentUser();
    const storedIntent = getStoredBookingIntent();
    
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedIntent) {
      setBookingIntentState(storedIntent);
    }

    const token = getAuthToken();
    if (token) {
      api.auth.getMe()
        .then((res) => {
          if (res?.user) {
            setUser(res.user);
            setStoredCurrentUser(res.user);
          }
        })
        .catch(() => {
          // Token expired or invalid
          setAuthToken(null);
          setUser(null);
          setStoredCurrentUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const setBookingIntent = (intent: BookingIntent | null) => {
    setBookingIntentState(intent);
    setStoredBookingIntent(intent);
  };

  const clearBookingIntent = () => {
    setBookingIntentState(null);
    setStoredBookingIntent(null);
  };

  const openAuthModal = (mode: "signin" | "signup" = "signin", intent?: BookingIntent) => {
    setAuthModalMode(mode);
    if (intent) {
      setBookingIntent(intent);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (credentials: SignInCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.auth.signin({
        email: credentials.email,
        password: credentials.password
      });

      if (res?.token && res?.user) {
        setAuthToken(res.token);
        setUser(res.user);
        setStoredCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Authentication failed."
      };
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.auth.signup({
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password
      });

      if (res?.token && res?.user) {
        setAuthToken(res.token);
        setUser(res.user);
        setStoredCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Registration failed." };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Registration failed."
      };
    }
  };

  const signOut = () => {
    setAuthToken(null);
    setUser(null);
    setStoredCurrentUser(null);
    clearBookingIntent();
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // In demo environment, sign in as demo verified guest through backend or test guest
    try {
      const res = await api.auth.signin({
        email: "demo@example.com",
        password: "Password123!"
      });
      if (res?.token && res?.user) {
        setAuthToken(res.token);
        setUser(res.user);
        setStoredCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Google authentication failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Google authentication failed" };
    }
  };

  const updateProfile = async (
    data: Partial<UserProfileUpdate>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const res = await api.auth.updateProfile(data);
      if (res?.user) {
        setUser(res.user);
        setStoredCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Update failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Update failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        updateProfile,
        bookingIntent,
        setBookingIntent,
        clearBookingIntent,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
