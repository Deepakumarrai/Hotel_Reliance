"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { HumanVerification } from "@/components/auth/HumanVerification";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
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
      const res = await signUp({ name, email, phone, password, confirmPassword, agreedToTerms: agreedTerms, isHumanVerified });
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
    <div className="min-h-screen bg-[#0C1524] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#BA8B32]/[0.07] blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#1E4080]/[0.14] blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[960px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/[0.08]">

          {/* ── Left panel ── */}
          <div className="lg:col-span-4 relative overflow-hidden min-h-[180px] lg:min-h-[680px] flex flex-col justify-between p-8 lg:p-10">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/gallery/hotel-ext.jpg"
                alt="Hotel Reliance"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0C1524]/92 via-[#111E31]/72 to-[#0C1524]/85" />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-3 py-1.5">
                <Sparkles className="w-3 h-3 text-[#D8B875]" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D8B875]">
                  Guest Registration
                </span>
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="w-10 h-[1.5px] bg-[#BA8B32]/60" />
              <div>
                <h2 className="text-3xl font-serif font-light text-white tracking-[-0.02em] leading-tight">
                  Join the<br />
                  <em className="italic text-[#D8B875]">Guest Club.</em>
                </h2>
                <p className="text-[13px] text-white/50 font-sans font-light leading-[1.75] mt-3 max-w-[220px]">
                  Priority reservations, express check-in, and personalised accommodations in Bokaro.
                </p>
              </div>
              <div className="space-y-2">
                {["45+ Curated Suites", "Kwality Restaurant", "Banquet Lawns"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#BA8B32]" />
                    <span className="text-[11px] text-white/60 font-sans">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel: Form ── */}
          <div className="lg:col-span-8 bg-[#FAFAF8] flex flex-col justify-center p-7 sm:p-10 space-y-5">
            {/* Header */}
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                New Account
              </span>
              <h1 className="text-2xl sm:text-[28px] font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Register with{" "}
                <em className="italic text-[#BA8B32]">Hotel Reliance.</em>
              </h1>
              <p className="text-[12px] text-stone-500 font-sans font-light mt-1.5 leading-[1.7]">
                Create your account to book rooms and manage your stays.
              </p>
            </div>

            {/* Preserved room */}
            {targetRoom && (
              <div className="bg-[#BA8B32]/8 border border-[#BA8B32]/25 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#BA8B32] font-semibold block mb-0.5">Preserved Room</span>
                  <span className="text-[13px] font-semibold text-[#111E31] font-sans">{targetRoom.name}</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-[#BA8B32] bg-[#BA8B32]/10 border border-[#BA8B32]/20 rounded-full px-2.5 py-1">
                  Auto-resuming after sign-up
                </span>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center gap-2.5 rounded-xl font-sans"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
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
              {/* Row 1: Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma" required
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@example.com" required
                      className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-3 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 92629 97777" required
                      className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-3 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters" required
                      className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-10 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#111E31] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-stone-500 block">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password" required
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[13px] text-[#111E31] font-sans placeholder:text-stone-400 focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Human verification */}
              <HumanVerification isVerified={isHumanVerified} onVerify={setIsHumanVerified} />

              {/* Terms */}
              <label htmlFor="signup-terms" className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox" id="signup-terms" checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)} required
                    className="sr-only peer"
                  />
                  <div className="w-4.5 h-4.5 w-[18px] h-[18px] border-2 border-stone-300 rounded-[5px] peer-checked:bg-[#BA8B32] peer-checked:border-[#BA8B32] transition-all flex items-center justify-center">
                    {agreedTerms && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-[11.5px] text-stone-500 font-sans leading-[1.6]">
                  I agree to the Hotel Reliance{" "}
                  <Link href="/terms-and-conditions" className="text-[#BA8B32] hover:underline font-medium">Terms of Service</Link>,{" "}
                  <Link href="/policies" className="text-[#BA8B32] hover:underline font-medium">Guest Policies</Link>, and{" "}
                  <Link href="/privacy-policy" className="text-[#BA8B32] hover:underline font-medium">Privacy Policy</Link>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#111E31] hover:bg-[#1a2e4a] text-white text-[12px] font-sans font-semibold tracking-[0.12em] uppercase transition-all shadow-[0_8px_30px_rgba(17,30,49,0.3)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
                ) : (
                  <>Create Account &amp; Continue <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-400">Or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <GoogleAuthButton
              label="Sign up with Google"
              onSuccess={() => {
                setSuccess("Google sign-in verified. Redirecting...");
                setTimeout(() => {
                  if (targetRoom) { router.push(`/booking?room=${targetRoom.slug}`); }
                  else { router.push("/profile"); }
                }, 600);
              }}
            />

            <div className="text-center pt-1 border-t border-stone-100">
              <span className="text-[12px] text-stone-500 font-sans">Already have an account?{" "}</span>
              <Link href="/auth/sign-in" className="text-[12px] font-semibold text-[#111E31] hover:text-[#BA8B32] transition-colors font-sans ml-1">
                Sign In →
              </Link>
            </div>
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
        <div className="min-h-screen bg-[#0C1524] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#BA8B32] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
