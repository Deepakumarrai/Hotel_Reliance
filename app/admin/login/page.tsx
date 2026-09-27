"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  KeyRound,
  ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
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
        setErrorMessage(data.message || "Invalid username or master security password.");
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setUsername("admin@HotelReliance");
    setPassword("HotelReliance2026");
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-[#9E712E] selection:text-white overflow-x-hidden bg-[#FAF6F0]">
      {/* Luxury Hotel Architecture Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/admin-login-bg.jpg"
          alt="Hotel Reliance Luxury Interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft Warm Ivory & Sunlit Diffuse Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/80 via-[#FAF6F0]/70 to-[#F5ECE0]/85 backdrop-blur-[1.5px]" />
      </div>

      {/* Decorative Gold Filigree Curves & Architectural Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-50,220 C300,120 400,450 750,550"
          fill="none"
          stroke="#C4984F"
          strokeWidth="1.2"
        />
        <path
          d="M700,600 C950,450 1100,200 1500,150"
          fill="none"
          stroke="#C4984F"
          strokeWidth="1"
        />
        <circle cx="20%" cy="18%" r="180" fill="none" stroke="#D8B875" strokeWidth="0.75" strokeDasharray="3 3" />
      </svg>

      {/* Left Ambient Editorial Branding (Desktop) */}
      <div className="hidden xl:flex flex-col items-start absolute left-12 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-[#9E712E]/70 space-y-4 font-serif text-xs uppercase tracking-[0.45em]">
        <span className="leading-relaxed">M A N A G E</span>
        <span className="leading-relaxed">S E R V E</span>
        <span className="leading-relaxed">G R O W</span>
        <div className="w-10 h-[1px] bg-[#C4984F]/40 mt-2" />
      </div>

      {/* Right Ambient Editorial Branding (Desktop) */}
      <div className="hidden xl:flex flex-col items-end absolute right-12 top-16 z-10 pointer-events-none select-none text-[#9E712E]/70 space-y-1 font-serif text-xs uppercase tracking-[0.35em] text-right">
        <span>E X C E L L E N C E</span>
        <span>I N   H O S P I T A L I T Y</span>
        <div className="w-12 h-[1px] bg-[#C4984F]/40 mt-1 self-end" />
      </div>

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center">
        {/* Hotel Crest & Heading Header */}
        <div className="text-center mb-6 flex flex-col items-center space-y-2">
          {/* Gold Emblem Box with Hotel Building Icon */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#B5853B] via-[#A0702B] to-[#875B1E] flex items-center justify-center text-white shadow-lg shadow-[#9E712E]/20 border border-[#ECCB8E]/50 mb-1 transform hover:scale-105 transition-transform duration-300">
            <Building2 className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>

          <h1 className="font-serif text-[28px] sm:text-[32px] font-bold tracking-[0.12em] text-[#111E31] uppercase leading-tight">
            Hotel Reliance
          </h1>

          <p className="text-[11px] sm:text-[11.5px] uppercase tracking-[0.24em] text-[#8C6228] font-bold">
            Administrative Access Portal
          </p>

          {/* Thin Decorative Gold Divider with Center Diamond */}
          <div className="flex items-center justify-center space-x-2.5 w-44 pt-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C4984F] to-[#9E712E]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#9E712E]" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C4984F] to-[#9E712E]" />
          </div>
        </div>

        {/* High-Fidelity Luxury Login Card */}
        <div className="w-full bg-[#FFFFFF]/92 backdrop-blur-md border border-[#E8DFD2] rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(158,113,46,0.12),0_4px_20px_rgba(0,0,0,0.04)]">
          {/* Card Top Security Bar */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F0E8DD]">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#8C6228]" strokeWidth={2.2} />
              <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#111E31]">
                Authorized Personnel Only
              </span>
            </div>
            <span className="text-[10.5px] text-[#7A7267] font-mono font-medium tracking-wide">
              SEC-TLS 1.3
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
            {/* Admin Username Field */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#8C6228] block mb-1.5">
                Admin Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7267]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@HotelReliance"
                  className="w-full bg-white border border-[#E0D5C5] rounded-xl pl-10 pr-4 py-3 text-sm text-[#111E31] placeholder:text-[#9C9488] focus:outline-none focus:border-[#9E712E] focus:ring-2 focus:ring-[#9E712E]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
                />
              </div>
            </div>

            {/* Master Security Password Field */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#8C6228] block mb-1.5">
                Master Security Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7267]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-white border border-[#E0D5C5] rounded-xl pl-10 pr-11 py-3 text-sm text-[#111E31] placeholder:text-[#9C9488] focus:outline-none focus:border-[#9E712E] focus:ring-2 focus:ring-[#9E712E]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A7267] hover:text-[#111E31] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none text-[#4A4237] hover:text-[#111E31]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#C8BAA7] bg-white text-[#9E712E] focus:ring-[#9E712E] w-4 h-4 cursor-pointer accent-[#9E712E]"
                />
                <span className="text-xs font-medium">Remember Session (7 Days)</span>
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A5752E] via-[#916524] to-[#80551B] hover:from-[#946725] hover:to-[#734914] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md shadow-[#9E712E]/25 hover:shadow-lg hover:shadow-[#9E712E]/35 active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="tracking-wider">AUTHENTICATING...</span>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Auto-Fill Button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="w-full py-2.5 rounded-xl border border-[#D9CABA] bg-[#FAF7F2] hover:bg-[#F2ECE0] text-[#704E1D] text-xs font-semibold tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#8C6228]" />
              <span>Auto-Fill Admin Credentials</span>
            </button>
          </form>
        </div>

        {/* Footer & Copyright */}
        <div className="text-center mt-6 space-y-1.5">
          {/* Diamond accent */}
          <div className="flex justify-center mb-1">
            <div className="w-1.5 h-1.5 rotate-45 bg-[#8C6228]/50" />
          </div>

          <p className="text-[11px] text-[#6B6255]">
            © 2026 Hotel Reliance. All Rights Reserved.
          </p>

          <div className="text-[11px] text-[#8C6228] font-medium flex items-center justify-center space-x-3">
            <Link href="/privacy-policy" className="hover:underline hover:text-[#111E31] transition-colors">
              Privacy
            </Link>
            <span className="text-[#C8BAA7]">|</span>
            <Link href="/terms-and-conditions" className="hover:underline hover:text-[#111E31] transition-colors">
              Security
            </Link>
            <span className="text-[#C8BAA7]">|</span>
            <Link href="/contact" className="hover:underline hover:text-[#111E31] transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

