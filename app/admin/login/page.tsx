"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Hotel,
  KeyRound,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMessage(data.message || "Invalid username or password.");
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D17] text-[#E9DFD2] flex flex-col justify-center items-center p-4 selection:bg-[#9E712E] selection:text-white relative overflow-hidden">
      {/* Subtle Luxury Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1B2A42]/30 via-[#0B1423] to-[#070D17] pointer-events-none" />

      {/* Decorative Gold Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#9E712E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Hotel Crest & Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9E712E] to-[#C4984F] items-center justify-center text-white shadow-2xl border border-[#D8B875]/40 mb-2">
            <Hotel className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-white uppercase">
            Hotel Reliance
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C4984F] font-semibold">
            Administrative Access Portal
          </p>
          <div className="w-12 h-[2px] bg-[#9E712E] mx-auto mt-3" />
        </div>

        {/* Login Card */}
        <div className="bg-[#0B1423]/90 backdrop-blur-md border border-[#1B2A42] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="border-b border-[#1B2A42] pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#C4984F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Authorized Personnel Only
              </span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">SEC-TLS 1.3</span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@HotelReliance"
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4984F] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4984F] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Security Policy Note */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-[#E9DFD2]/70 hover:text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1B2A42] bg-[#111E31] text-[#9E712E] focus:ring-[#C4984F] w-4 h-4"
                />
                <span>Remember Session (7 Days)</span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#9E712E] via-[#C4984F] to-[#9E712E] hover:from-[#8C6326] hover:to-[#B38740] text-white text-xs font-bold uppercase tracking-[0.15em] shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner Footer */}
          <div className="mt-6 pt-5 border-t border-[#1B2A42] text-center space-y-1">
            <p className="text-[10px] text-white/40">
              Maximum 4 failed attempts permitted before automatic 2-hour IP lockout.
            </p>
            <p className="text-[10px] text-[#C4984F]/70">
              Hotel Reliance Bokaro • 24/7 Front Desk Operations
            </p>
          </div>
        </div>

        {/* Public Website Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[#E9DFD2]/60 hover:text-[#D8B875] transition-colors inline-flex items-center space-x-1"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
