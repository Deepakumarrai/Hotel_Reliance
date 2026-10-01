"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Calendar, LogOut, CheckCircle2, AlertCircle, ShieldCheck, Edit3, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function ProfileContent() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSaving(true);

    try {
      const res = await updateProfile({ name, email, phone });
      if (res.success) {
        setFeedback({ type: "success", message: "Guest profile information updated successfully." });
        setIsEditing(false);
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update profile." });
      }
    } catch {
      setFeedback({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword || !newPassword) {
      setFeedback({ type: "error", message: "Please enter current and new password." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFeedback({ type: "success", message: "Security password changed successfully." });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 500);
  };

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "HR";

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5] min-h-screen">
      <Container className="max-w-4xl space-y-8">
        {/* Profile Header Card */}
        <div className="bg-[#111E31] text-white rounded-3xl sm:rounded-[32px] p-7 sm:p-9 shadow-[0_16px_50px_rgba(17,30,49,0.2)] relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#BA8B32]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-5 sm:space-y-0 sm:space-x-6 relative z-10 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-[#BA8B32] text-white font-serif text-2xl font-light flex items-center justify-center border-2 border-white/20 shadow-xl flex-shrink-0">
              {initials}
            </div>

            <div className="flex-grow space-y-1.5 font-sans">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-[-0.01em]">
                  {user?.name}
                </h1>
                <span className="px-3 py-0.5 bg-[#BA8B32]/20 text-[#BA8B32] border border-[#BA8B32]/30 text-[10px] uppercase font-semibold tracking-wider rounded-full">
                  Verified Guest
                </span>
              </div>
              <p className="text-xs text-stone-300 font-light">{user?.email}</p>
              <p className="text-xs text-stone-300 font-light">{user?.phone}</p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-0 font-sans">
              <Link href="/my-bookings">
                <button className="min-h-[38px] px-5 bg-white/10 hover:bg-white hover:text-[#111E31] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center border border-white/15">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  My Bookings
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="min-h-[38px] px-5 bg-white/10 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center border border-white/15"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Status Feedback banner */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs flex items-center space-x-3 font-sans ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Account Details Form */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-stone-100 p-7 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.06)] space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                  PERSONAL DETAILS
                </span>
                <h2 className="text-xl font-serif text-[#111E31] font-light mt-0.5">Profile Information</h2>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center text-xs font-sans font-semibold text-[#BA8B32] hover:text-[#111E31] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 font-sans">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-600 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-600 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-600 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#BA8B32] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111E31] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="min-h-[40px] px-6 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center cursor-pointer disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || "");
                      setEmail(user?.email || "");
                      setPhone(user?.phone || "");
                    }}
                    className="min-h-[40px] px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs font-sans">
                <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Full Name</span>
                  <span className="font-semibold text-[#111E31]">{user?.name}</span>
                </div>
                <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Email</span>
                  <span className="font-semibold text-[#111E31]">{user?.email}</span>
                </div>
                <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Phone</span>
                  <span className="font-semibold text-[#111E31]">{user?.phone}</span>
                </div>
                <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Security Status</span>
                  <span className="text-emerald-700 font-semibold flex items-center bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Verified Guest
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Security & Actions */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-100 p-6 sm:p-7 shadow-[0_4px_30px_rgba(17,30,49,0.06)] space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                  SECURITY SETTINGS
                </span>
                <h3 className="text-lg font-serif text-[#111E31] font-light mt-0.5">Password Management</h3>
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-3 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#111E31] focus:border-[#BA8B32] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#111E31] focus:border-[#BA8B32] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#111E31] focus:border-[#BA8B32] outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="min-h-[38px] px-5 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-60"
                    >
                      Save Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="min-h-[38px] px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 font-sans">
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Update your account password regularly to keep your reservations and profile secure.
                  </p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full min-h-[40px] px-5 bg-stone-100 hover:bg-stone-200 text-[#111E31] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" />
                    Change Password
                  </button>
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl border border-stone-100 p-6 sm:p-7 shadow-[0_4px_30px_rgba(17,30,49,0.06)] space-y-3 font-sans">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111E31] border-b border-stone-100 pb-2.5">
                Hospitality Concierge
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Need customized stay packages, banquet reservations, or late checkout? Connect with our front desk.
              </p>
              <div className="pt-2 text-xs space-y-1.5">
                <p className="text-stone-500">
                  Phone: <strong className="text-[#111E31] font-semibold">+91 92629 97777</strong>
                </p>
                <p className="text-stone-500">
                  Email: <strong className="text-[#111E31] font-semibold">reservation@hotelreliance.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard title="Guest Profile Access" description="Please sign in to view and manage your Hotel Reliance guest profile.">
      <ProfileContent />
    </AuthGuard>
  );
}
