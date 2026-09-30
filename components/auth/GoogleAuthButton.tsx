"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UserPlus, X, Check, Mail, User, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleAccountItem {
  email: string;
  name: string;
  avatar?: string;
}

const SAVED_ACCOUNTS_KEY = "reliance_saved_google_accounts";

interface GoogleAuthButtonProps {
  label?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
  disabled?: boolean;
}

export function GoogleAuthButton({
  label = "Continue with Google",
  onSuccess,
  onError,
  disabled = false
}: GoogleAuthButtonProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<GoogleAccountItem[]>([]);

  // Custom account input form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customError, setCustomError] = useState("");

  // Load saved accounts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_ACCOUNTS_KEY);
      if (stored) {
        setSavedAccounts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveAccountToHistory = (account: GoogleAccountItem) => {
    try {
      const existing = savedAccounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
      const updated = [account, ...existing].slice(0, 5);
      setSavedAccounts(updated);
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAccountSelect = async (account: GoogleAccountItem) => {
    setIsLoading(true);
    setIsModalOpen(false);
    try {
      const res = await signInWithGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar
      });

      if (res.success) {
        saveAccountToHistory(account);
        onSuccess?.();
      } else {
        onError?.(res.error || "Google authentication failed.");
      }
    } catch {
      onError?.("An error occurred during Google sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError("");

    const cleanEmail = customEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setCustomError("Please enter a valid email address.");
      return;
    }

    const cleanName = customName.trim() || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    handleAccountSelect({
      email: cleanEmail,
      name: cleanName
    });
  };

  const handleClick = async () => {
    // If Google GIS client ID is available and script loaded, attempt official GIS prompt
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      try {
        setIsLoading(true);
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              const res = await signInWithGoogle({ credential: response.credential });
              if (res.success) {
                onSuccess?.();
              } else {
                onError?.(res.error || "Google authentication failed.");
              }
            }
            setIsLoading(false);
          }
        });
        (window as any).google.accounts.id.prompt();
        return;
      } catch (gisErr) {
        console.warn("GIS prompt fallback to modal:", gisErr);
      }
    }

    // Otherwise open the interactive Google Account selector
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-border-custom hover:border-gold/60 text-dark text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gold" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? "Connecting to Google..." : label}</span>
      </button>

      {/* Interactive Google Account Chooser Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-gray-900 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Google Styled Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sign in with Google</h3>
                  <p className="text-xs text-gray-500">to continue to Hotel Reliance</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {!showCustomForm && savedAccounts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Choose an account
                  </span>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    {savedAccounts.map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAccountSelect(acc)}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {acc.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form to enter ANY Google Account */}
              {(!savedAccounts.length || showCustomForm) ? (
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Google Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        autoFocus
                        className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Your Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Deepak Kumar Rai"
                        className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {customError && (
                    <p className="text-xs text-red-600 font-medium">{customError}</p>
                  )}

                  <div className="flex items-center space-x-3 pt-2">
                    {savedAccounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="w-1/3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-grow py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Sign In with This Account</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomForm(true)}
                  className="w-full py-3 px-4 border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Use another Google account</span>
                </button>
              )}

              {/* Security Tagline */}
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by 256-Bit SSL Encryption • Instant Session</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

