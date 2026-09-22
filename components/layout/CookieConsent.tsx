"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged cookie consent
    const consent = localStorage.getItem("hr_cookie_consent");
    if (!consent) {
      // Small delay for smooth entry after hydration
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hr_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("hr_cookie_consent", "essential_only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-dark/95 text-white border border-gold/40 backdrop-blur-md shadow-2xl p-4 sm:p-5 rounded-sm relative">
        <button
          onClick={handleDecline}
          aria-label="Close privacy notice"
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3 pr-4">
          <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gold/30">
            <ShieldCheck className="w-4 h-4 text-gold" />
          </div>
          <div className="space-y-1.5 text-xs font-light text-white/90">
            <h4 className="font-serif text-sm text-white font-medium">Guest Privacy & Cookies</h4>
            <p className="leading-relaxed">
              We use essential cookies to maintain secure reservations and remember your preferences. Review our{" "}
              <Link href="/privacy-policy" className="text-gold underline hover:text-gold-light">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-end space-x-2.5">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors font-medium"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 text-xs bg-gold hover:bg-gold-light text-dark font-semibold tracking-wider uppercase transition-all shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
