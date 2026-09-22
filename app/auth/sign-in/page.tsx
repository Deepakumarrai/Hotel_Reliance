"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
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

  // Check if redirect query param exists
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
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white border border-border-custom shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Visual Hotel Editorial */}
        <div className="lg:col-span-5 relative bg-primary text-white p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[260px] lg:min-h-[580px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/gallery/hotel-lobby.jpg"
              alt="Hotel Reliance Lobby"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
              BOKARO STEEL CITY
            </span>
            <h2 className="text-3xl font-serif font-light tracking-wide text-white">
              Hotel Reliance
            </h2>
          </div>

          <div className="relative z-10 space-y-4 pt-6">
            <div className="w-12 h-[2px] bg-gold" />
            <p className="text-xs text-cream/80 leading-relaxed font-light">
              "Experience timeless hospitality and tailored comfort across our 45+ premier guest suites."
            </p>
            <div className="text-[10px] text-gold tracking-widest uppercase font-semibold">
              Guest Services & Reservations
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold block">
              WELCOME BACK
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-dark mt-1">Sign In to Your Account</h1>
            <p className="text-xs text-muted mt-1 font-light">
              Access your reservations, booking preferences, and personalized concierge.
            </p>
          </div>

          {/* Preserved Booking Intent Notice */}
          {targetRoom && (
            <div className="bg-cream border border-gold/40 p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gold font-bold block">
                  Pending Booking
                </span>
                <span className="font-semibold text-dark">{targetRoom.name}</span>
              </div>
              <span className="text-[10px] text-primary font-bold px-2 py-0.5 bg-gold/10 border border-gold/20">
                Preserved
              </span>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-grow">
                <span>{error}</span>
                {error.includes("Account not found") && (
                  <div className="mt-1.5">
                    <Link
                      href="/auth/sign-up"
                      className="inline-flex items-center text-xs font-bold text-primary hover:text-gold underline"
                    >
                      Create an account now <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. demo@example.com"
                  required
                  className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] text-gold hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-cream/40 border border-border-custom pl-9 pr-10 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted hover:text-dark focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-cream/60 border border-border-custom text-[11px] text-muted">
              <span className="font-semibold text-dark">Demo Credentials:</span> demo@example.com / password123
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-3 text-xs tracking-widest font-bold uppercase"
            >
              {isSubmitting ? "Signing In..." : "Sign In to Reliance"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-custom" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-muted font-bold tracking-widest">Or</span>
            </div>
          </div>

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

          <div className="text-center pt-2 border-t border-border-custom">
            <span className="text-xs text-muted">Don't have an account yet? </span>
            <Link
              href="/auth/sign-up"
              className="text-xs font-bold text-primary hover:text-gold uppercase tracking-wider underline ml-1"
            >
              Create Account
            </Link>
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
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
