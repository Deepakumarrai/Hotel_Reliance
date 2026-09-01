"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, SignUpCredentials, SignInCredentials, UserProfileUpdate, BookingIntent } from "@/types/auth";
import {
  authenticateMockUser,
  registerMockUser,
  updateMockUser,
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredBookingIntent,
  setStoredBookingIntent
} from "./mockUsers";

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
    // Hydrate user and intent from client storage
    const storedUser = getStoredCurrentUser();
    const storedIntent = getStoredBookingIntent();
    
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedIntent) {
      setBookingIntentState(storedIntent);
    }
    setIsLoading(false);
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
    // Simulate brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const result = authenticateMockUser(credentials.email, credentials.password);
    if (result.success && result.user) {
      setUser(result.user);
      setStoredCurrentUser(result.user);
      return { success: true };
    }
    return {
      success: false,
      error: result.error || "Authentication failed."
    };
  };

  const signUp = async (credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = registerMockUser(credentials);
    if (result.success && result.user) {
      setUser(result.user);
      setStoredCurrentUser(result.user);
      return { success: true };
    }
    return {
      success: false,
      error: result.error || "Registration failed."
    };
  };

  const signOut = () => {
    setUser(null);
    setStoredCurrentUser(null);
    clearBookingIntent();
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // Mock Google sign-in demo flow
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Create or login a mock Google guest
    const googleUser: User = {
      id: "usr_google_demo",
      name: "Google Verified Guest",
      email: "guest.google@example.com",
      phone: "+91 92629 97777",
      createdAt: new Date().toISOString(),
      isVerified: true
    };
    
    setUser(googleUser);
    setStoredCurrentUser(googleUser);
    return { success: true };
  };

  const updateProfile = async (
    data: Partial<UserProfileUpdate>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    const result = updateMockUser(user.id, data);
    if (result.success && result.user) {
      setUser(result.user);
      setStoredCurrentUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || "Update failed" };
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
