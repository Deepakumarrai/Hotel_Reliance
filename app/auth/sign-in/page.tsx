"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { roomsData } from "@/data/rooms";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, bookingIntent, clearBookingIntent } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectParam = searchParams.get("redirect") || "/profile";
  const roomSlugParam = searchParams.get("room");

  const targetRoom = roomSlugParam
    ? roomsData.find((r) => r.slug === roomSlugParam)
    : bookingIntent?.roomSlug
    ? roomsData.find((r) => r.slug === bookingIntent.roomSlug)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn({ email, password });
      if (res.success) {
        setSuccess("Sign-in successful. Welcome back!");
        setTimeout(() => {
          if (bookingIntent || roomSlugParam) {
            const queryParams = new URLSearchParams();
            if (targetRoom) queryParams.set("room", targetRoom.slug);
            if (bookingIntent?.checkIn) queryParams.set("checkIn", bookingIntent.checkIn);
            if (bookingIntent?.checkOut) queryParams.set("checkOut", bookingIntent.checkOut);
            if (bookingIntent?.adults) queryParams.set("adults", bookingIntent.adults.toString());
            if (bookingIntent?.children) queryParams.set("children", bookingIntent.children.toString());
            router.push(`/booking?${queryParams.toString()}`);
            clearBookingIntent();
          } else {
            router.push(redirectParam);
          }
        }, 700);
      } else {
        setError(res.error || "Authentication failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1524] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#BA8B32]/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#1E4080]/[0.15] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[920px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/[0.08]">

          {/* ── Left Panel: Cinematic editorial ── */}
          <div className="lg:col-span-5 relative overflow-hidden min-h-[220px] lg:min-h-[600px] flex flex-col justify-between p-8 lg:p-10">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/gallery/hotel-lobby.jpg"
                alt="Hotel Reliance"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0C1524]/90 via-[#111E31]/70 to-[#0C1524]/85" />
              {/* Grain texture */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
            </div>

            {/* Top badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-3 py-1.5">
                <Sparkles className="w-3 h-3 text-[#D8B875]" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D8B875]">
                  Bokaro Steel City
                </span>
              </div>
            </div>

            {/* Bottom copy */}
            <div className="relative z-10 space-y-5">
              <div className="w-10 h-[1.5px] bg-[#BA8B32]/60" />
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-[-0.02em] leading-tight">
                  Hotel<br />
                  <em className="italic text-[#D8B875]">Reliance.</em>
                </h2>
                <p className="text-[13px] text-white/50 font-sans font-light leading-[1.75] mt-3 max-w-[240px]">
                  Timeless hospitality across 45+ premier suites — Kwality Restaurant, Banquet Lawns & more.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {["45+ Suites", "Restaurant", "Banquets"].map((tag) => (
                  <span key={tag} className="text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-[#D8B875]/70 bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Panel: Form ── */}
          <div className="lg:col-span-7 bg-[#FAFAF8] flex flex-col justify-center p-7 sm:p-10 space-y-6">
            {/* Header */}
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                Welcome Back
              </span>
              <h1 className="text-2xl sm:text-[28px] font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Sign in to your{" "}
                <em className="italic text-[#BA8B32]">account.</em>
              </h1>
              <p className="text-[12px] text-stone-500 font-sans font-light mt-1.5 leading-[1.7]">
                Access reservations, preferences & personalized concierge.
              </p>
            </div>

            {/* Preserved booking intent */}
            {targetRoom && (
              <div className="bg-[#BA8B32]/8 border border-[#BA8B32]/25 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#BA8B32] font-semibold block mb-0.5">
                    Pending Booking
                  </span>
                  <span className="text-[13px] font-semibold text-[#111E31] font-sans">{targetRoom.name}</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-[#BA8B32] bg-[#BA8B32]/10 border border-[#BA8B32]/20 rounded-full px-2.5 py-1">
                  Preserved
                </span>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-start gap-2.5 rounded-xl font-sans"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span>{error}</span>
                  {error.includes("Account not found") && (
                    <div className="mt-1.5">
                      <Link href="/auth/sign-up" className="inline-flex items-center text-xs font-bold text-[#111E31] hover:text-[#BA8B32] underline">
                        Create an account now <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-center gap-2.5 rounded-xl font-sans"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-[11px] text-[#BA8B32] hover:underline font-medium font-sans">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-11 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#111E31] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#111E31] hover:bg-[#1a2e4a] text-white text-[12px] font-sans font-semibold tracking-[0.12em] uppercase transition-all shadow-[0_8px_30px_rgba(17,30,49,0.3)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In to Reliance <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-400">Or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Google */}
            <GoogleAuthButton
              onSuccess={() => {
                setSuccess("Google sign-in verified. Redirecting...");
                setTimeout(() => {
                  if (targetRoom) {
                    router.push(`/booking?room=${targetRoom.slug}`);
                  } else {
                    router.push(redirectParam);
                  }
                }, 600);
              }}
            />

            {/* Sign up link */}
            <div className="text-center pt-1 border-t border-stone-100">
              <span className="text-[12px] text-stone-500 font-sans">Don&apos;t have an account?{" "}</span>
              <Link href="/auth/sign-up" className="text-[12px] font-semibold text-[#111E31] hover:text-[#BA8B32] transition-colors font-sans ml-1">
                Create Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0C1524] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#BA8B32] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
