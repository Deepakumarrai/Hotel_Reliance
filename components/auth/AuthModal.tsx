"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, User as UserIcon, Mail, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { HumanVerification } from "./HumanVerification";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { roomsData } from "@/data/rooms";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    signIn,
    signUp,
    bookingIntent,
    clearBookingIntent
  } = useAuth();

  const router = useRouter();

  // Form states
  const [mode, setMode] = useState<"signin" | "signup">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when context changes
  useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Find targeted room details if intent exists
  const targetRoom = bookingIntent?.roomSlug
    ? roomsData.find((r) => r.slug === bookingIntent.roomSlug)
    : bookingIntent?.roomId
    ? roomsData.find((r) => r.id === bookingIntent.roomId)
    : null;

  const handleModeSwitch = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setAuthModalMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn({ email, password });
      if (res.success) {
        setSuccessMessage("Authentication successful. Redirecting...");
        setTimeout(() => {
          closeAuthModal();
          if (bookingIntent) {
            const queryParams = new URLSearchParams();
            if (bookingIntent.roomSlug) queryParams.set("room", bookingIntent.roomSlug);
            if (bookingIntent.checkIn) queryParams.set("checkIn", bookingIntent.checkIn);
            if (bookingIntent.checkOut) queryParams.set("checkOut", bookingIntent.checkOut);
            if (bookingIntent.adults) queryParams.set("adults", bookingIntent.adults.toString());
            if (bookingIntent.children) queryParams.set("children", bookingIntent.children.toString());
            
            router.push(`/booking?${queryParams.toString()}`);
            clearBookingIntent();
          }
        }, 600);
      } else {
        setError(res.error || "Authentication failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!isHumanVerified) {
      setError("Please complete the human verification before proceeding.");
      return;
    }

    if (!agreedTerms) {
      setError("You must agree to the Terms of Service & Privacy Policy.");
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
        setSuccessMessage("Account created successfully! Proceeding to your booking...");
        setTimeout(() => {
          closeAuthModal();
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
        setError(res.error || "Account registration failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-cream border border-border-custom shadow-2xl overflow-hidden my-8"
      >
        {/* Header Gold Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gold via-gold-highlight to-gold" />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-muted hover:text-dark transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Modal Header */}
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold">
              HOTEL RELIANCE • GUEST ACCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-dark">
              {mode === "signin" ? "Sign In to Continue" : "Create Guest Account"}
            </h2>
            <p className="text-xs text-muted max-w-sm mx-auto font-light">
              {targetRoom
                ? `Sign in or create an account to finalize your reservation for ${targetRoom.name}.`
                : "Manage your reservations, room preferences, and hospitality concierge."}
            </p>
          </div>

          {/* Booking intent banner if present */}
          {targetRoom && (
            <div className="p-3 bg-white border border-gold/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gold font-bold block">
                  Preserved Selection
                </span>
                <span className="font-semibold text-dark">{targetRoom.name}</span>
                {bookingIntent?.checkIn && (
                  <span className="text-muted text-[11px] block">
                    {bookingIntent.checkIn} to {bookingIntent.checkOut || ""} • {bookingIntent.adults || 2} Adults
                  </span>
                )}
              </div>
              <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] uppercase font-bold border border-gold/20">
                Ready to Book
              </span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-border-custom text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => handleModeSwitch("signin")}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                mode === "signin"
                  ? "border-gold text-dark font-bold bg-white/50"
                  : "border-transparent text-muted hover:text-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                mode === "signup"
                  ? "border-gold text-dark font-bold bg-white/50"
                  : "border-transparent text-muted hover:text-dark"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-grow">
                <span>{error}</span>
                {error.includes("Account not found") && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="block font-bold text-red-800 underline mt-1 cursor-pointer"
                  >
                    Click here to Create an Account
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Sign In Form */}
          {mode === "signin" ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
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
                    className="w-full bg-white border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      router.push("/auth/forgot-password");
                    }}
                    className="text-[10px] text-gold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white border border-border-custom pl-9 pr-10 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
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

              <div className="text-[11px] text-muted bg-white/70 p-2.5 border border-border-custom">
                <span className="font-semibold text-dark">Demo Test Account:</span> demo@example.com / password123
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className="py-3 text-xs tracking-widest font-bold uppercase"
              >
                {isSubmitting ? "Authenticating..." : "Sign In to Hotel Reliance"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-custom" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-cream px-2 text-muted font-bold tracking-widest">Or</span>
                </div>
              </div>

              <GoogleAuthButton
                onSuccess={() => {
                  setSuccessMessage("Google sign-in verified. Redirecting...");
                  setTimeout(() => {
                    closeAuthModal();
                    if (bookingIntent) {
                      router.push(`/booking?room=${bookingIntent.roomSlug || ""}`);
                      clearBookingIntent();
                    }
                  }, 600);
                }}
              />
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    required
                    className="w-full bg-white border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
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
                      className="w-full bg-white border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
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
                      className="w-full bg-white border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                    Create Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full bg-white border border-border-custom px-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
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
                    className="w-full bg-white border border-border-custom px-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Human Verification Requirement */}
              <HumanVerification
                isVerified={isHumanVerified}
                onVerify={setIsHumanVerified}
              />

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 accent-gold cursor-pointer"
                  required
                />
                <label htmlFor="modal-terms" className="text-[11px] text-muted leading-tight cursor-pointer">
                  I agree to the Hotel Reliance Guest Policies, Terms of Service, and Privacy Policy.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className="py-3 text-xs tracking-widest font-bold uppercase"
              >
                {isSubmitting ? "Creating Account..." : "Create Account & Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
