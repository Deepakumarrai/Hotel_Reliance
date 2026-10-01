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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1524]/65 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-stone-200/80 shadow-[0_30px_90px_rgba(17,30,49,0.28)] overflow-hidden my-8"
      >
        {/* Subtle warm luxury top glow */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#BA8B32]/70 to-transparent" />

        {/* Apple style close pill button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all cursor-pointer focus:outline-none z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Modal Header */}
          <div className="text-center space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
              HOTEL RELIANCE • GUEST ACCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] tracking-[-0.01em]">
              {mode === "signin" ? "Sign In to Continue" : "Create Guest Account"}
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans leading-relaxed">
              {targetRoom
                ? `Sign in or create an account to finalize your reservation for ${targetRoom.name}.`
                : "Manage your reservations, special amenities, and direct booking perks."}
            </p>
          </div>

          {/* Booking intent banner if present */}
          {targetRoom && (
            <div className="p-3.5 bg-stone-50/90 border border-stone-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#BA8B32] font-semibold block">
                  Preserved Selection
                </span>
                <span className="font-serif font-medium text-[#111E31] text-[13px]">{targetRoom.name}</span>
                {bookingIntent?.checkIn && (
                  <span className="text-stone-500 text-[11px] block mt-0.5">
                    {bookingIntent.checkIn} to {bookingIntent.checkOut || ""} • {bookingIntent.adults || 2} Adults
                  </span>
                )}
              </div>
              <span className="px-2.5 py-1 bg-[#BA8B32]/10 text-[#BA8B32] text-[10px] uppercase font-semibold rounded-full border border-[#BA8B32]/20">
                Ready to Book
              </span>
            </div>
          )}

          {/* Mode Switcher Pill Tabs */}
          <div className="flex bg-stone-100/80 p-1 rounded-full text-xs font-medium">
            <button
              onClick={() => handleModeSwitch("signin")}
              className={`flex-1 py-2 rounded-full transition-all text-center cursor-pointer text-xs font-sans ${
                mode === "signin"
                  ? "bg-white text-[#111E31] shadow-sm font-semibold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 py-2 rounded-full transition-all text-center cursor-pointer text-xs font-sans ${
                mode === "signup"
                  ? "bg-white text-[#111E31] shadow-sm font-semibold"
                  : "text-stone-500 hover:text-stone-900"
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
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-grow">
                <span>{error}</span>
                {error.includes("Account not found") && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="block font-semibold text-red-800 underline mt-1 cursor-pointer"
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
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Sign In Form */}
          {mode === "signin" ? (
            <div>
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium text-stone-600 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. demo@example.com"
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-sans font-medium text-stone-600 block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        closeAuthModal();
                        router.push("/auth/forgot-password");
                      }}
                      className="text-[11px] text-[#BA8B32] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all pl-10 pr-10 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-[#111E31] focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#111E31]">Demo Account:</span>{" "}
                    <span>demo@example.com / password123</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-[#111E31] hover:bg-[#1a2e4a] text-white rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.3)] active:scale-[0.99] cursor-pointer flex items-center justify-center disabled:opacity-60"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In to Hotel Reliance"}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold">
                  <span className="bg-white px-3 text-stone-400 tracking-wider">Or</span>
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
            </div>
          ) : (
            /* Sign Up Section */
            <div>
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-medium text-stone-600 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Rajesh Sharma"
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-medium text-stone-600 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="guest@example.com"
                        required
                        className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-medium text-stone-600 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 92629 97777"
                        required
                        className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-medium text-stone-600 block">
                      Create Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all px-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-medium text-stone-600 block">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl transition-all px-3.5 py-2.5 text-xs text-[#111E31] placeholder-stone-400 outline-none"
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
                    className="mt-0.5 accent-[#BA8B32] cursor-pointer"
                    required
                  />
                  <label htmlFor="modal-terms" className="text-[11px] text-stone-500 leading-tight cursor-pointer font-sans">
                    I agree to the Hotel Reliance Guest Policies, Terms of Service, and Privacy Policy.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-[#111E31] hover:bg-[#1a2e4a] text-white rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.3)] active:scale-[0.99] cursor-pointer flex items-center justify-center disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account & Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold">
                  <span className="bg-white px-3 text-stone-400 tracking-wider">Or Register With</span>
                </div>
              </div>

              <GoogleAuthButton
                label="Sign Up with Google"
                onSuccess={() => {
                  setSuccessMessage("Google registration verified. Redirecting...");
                  setTimeout(() => {
                    closeAuthModal();
                    if (bookingIntent) {
                      router.push(`/booking?room=${bookingIntent.roomSlug || ""}`);
                      clearBookingIntent();
                    }
                  }, 600);
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
