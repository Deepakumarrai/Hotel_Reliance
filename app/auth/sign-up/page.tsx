"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { HumanVerification } from "@/components/auth/HumanVerification";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { roomsData } from "@/data/rooms";

function SignUpContent() {
  const router = useRouter();
  const { signUp, bookingIntent, clearBookingIntent } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetRoom = bookingIntent?.roomSlug
    ? roomsData.find((r) => r.slug === bookingIntent.roomSlug)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!isHumanVerified) {
      setError("Human verification is required before creating an account.");
      return;
    }

    if (!agreedTerms) {
      setError("Please accept the terms and guest policies.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({
        name,
        email,
        phone,
        password,
        confirmPassword,
        agreedToTerms: agreedTerms,
        isHumanVerified
      });

      if (res.success) {
        setSuccess("Your account has been created successfully! Logging you in...");
        setTimeout(() => {
          if (bookingIntent) {
            const queryParams = new URLSearchParams();
            if (bookingIntent.roomSlug) queryParams.set("room", bookingIntent.roomSlug);
            if (bookingIntent.checkIn) queryParams.set("checkIn", bookingIntent.checkIn);
            if (bookingIntent.checkOut) queryParams.set("checkOut", bookingIntent.checkOut);
            if (bookingIntent.adults) queryParams.set("adults", bookingIntent.adults.toString());
            if (bookingIntent.children) queryParams.set("children", bookingIntent.children.toString());

            router.push(`/booking?${queryParams.toString()}`);
            clearBookingIntent();
          } else {
            router.push("/profile");
          }
        }, 800);
      } else {
        setError(res.error || "Registration failed. Please try again.");
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
        <div className="lg:col-span-5 relative bg-primary text-white p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[260px] lg:min-h-[640px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/gallery/hotel-ext.jpg"
              alt="Hotel Reliance"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
              LUXURY HOSPITALITY
            </span>
            <h2 className="text-3xl font-serif font-light tracking-wide text-white">
              Create Account
            </h2>
          </div>

          <div className="relative z-10 space-y-4 pt-6">
            <div className="w-12 h-[2px] bg-gold" />
            <p className="text-xs text-cream/80 leading-relaxed font-light">
              Join Hotel Reliance guest club for prioritized reservations, express check-in, and personalized accommodations in Bokaro Steel City.
            </p>
            <div className="text-[10px] text-gold tracking-widest uppercase font-semibold">
              45+ Suites • Kwality Restaurant • Banquets
            </div>
          </div>
        </div>

        {/* Right Column: Sign Up Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold block">
              GUEST REGISTRATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-dark mt-1">Register New Account</h1>
            <p className="text-xs text-muted mt-1 font-light">
              Create your account to proceed with bookings and manage your stays.
            </p>
          </div>

          {targetRoom && (
            <div className="bg-cream border border-gold/40 p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gold font-bold block">
                  Preserved Room
                </span>
                <span className="font-semibold text-dark">{targetRoom.name}</span>
              </div>
              <span className="text-[10px] text-primary font-bold px-2 py-0.5 bg-gold/10 border border-gold/20">
                Auto-resuming after sign-up
              </span>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  required
                  className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2 text-xs text-dark focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder="guest@example.com"
                    required
                    className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2 text-xs text-dark focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 92629 97777"
                    required
                    className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2 text-xs text-dark focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full bg-cream/40 border border-border-custom px-3 py-2 text-xs text-dark focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full bg-cream/40 border border-border-custom px-3 py-2 text-xs text-dark focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Human Verification */}
            <HumanVerification
              isVerified={isHumanVerified}
              onVerify={setIsHumanVerified}
            />

            {/* Terms checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="signup-terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 accent-gold cursor-pointer"
                required
              />
              <label htmlFor="signup-terms" className="text-[11px] text-muted leading-tight cursor-pointer">
                I agree to the Hotel Reliance Terms of Service, Guest Registration Policies, and Privacy Policy.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-3 text-xs tracking-widest font-bold uppercase"
            >
              {isSubmitting ? "Registering..." : "Create Account & Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
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
            label="Sign up with Google"
            onSuccess={() => {
              setSuccess("Google sign-in verified. Redirecting...");
              setTimeout(() => {
                if (targetRoom) {
                  router.push(`/booking?room=${targetRoom.slug}`);
                } else {
                  router.push("/profile");
                }
              }, 600);
            }}
          />

          <div className="text-center pt-2 border-t border-border-custom">
            <span className="text-xs text-muted">Already have an account? </span>
            <Link
              href="/auth/sign-in"
              className="text-xs font-bold text-primary hover:text-gold uppercase tracking-wider underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
