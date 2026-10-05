"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: (overrideConfig?: any) => void;
          };
        };
      };
    };
  }
}

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
  const [errorMessage, setErrorMessage] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // 1. Ensure Google Identity Services script is available
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.google?.accounts?.oauth2) {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const handleButtonClick = async () => {
    setErrorMessage("");

    if (!clientId) {
      console.error(
        "[Google OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in .env.local. Add your Google OAuth Client ID to enable real-time sign-in."
      );
      setErrorMessage("Google Sign-In is temporarily unavailable. Please sign in with your email or phone.");
      onError?.("Google Sign-In is not configured.");
      return;
    }

    if (typeof window === "undefined" || !window.google?.accounts?.oauth2) {
      setErrorMessage("Connecting to Google authentication services. Please click again in a second.");
      return;
    }

    try {
      setIsLoading(true);

      // Launch official Google OAuth 2.0 popup
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error !== "access_denied") {
              const msg = tokenResponse.error_description || "Google sign-in was cancelled.";
              setErrorMessage(msg);
              onError?.(msg);
            }
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Real-time server verification of access token
              const res = await signInWithGoogle({
                accessToken: tokenResponse.access_token
              });

              if (res.success) {
                onSuccess?.();
              } else {
                const msg = res.error || "Google authentication failed.";
                setErrorMessage(msg);
                onError?.(msg);
              }
            } catch (err: any) {
              const msg = err.message || "An error occurred during Google sign in.";
              setErrorMessage(msg);
              onError?.(msg);
            } finally {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
            setErrorMessage("No authorization token received from Google.");
          }
        }
      });

      // Opens Google's authentic accounts popup window directly
      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message || "Failed to initialize Google authentication.";
      setErrorMessage(msg);
      onError?.(msg);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-border-custom hover:border-gold/60 text-dark text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="Continue with Google"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gold" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start space-x-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="flex-1 font-medium">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-400 hover:text-red-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
