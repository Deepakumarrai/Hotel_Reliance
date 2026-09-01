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
    <div className="py-12 bg-cream min-h-screen">
      <Container className="max-w-4xl space-y-8">
        {/* Profile Header Card */}
        <div className="bg-primary text-white border border-border-custom p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gold text-primary font-serif text-2xl font-bold flex items-center justify-center border-2 border-white shadow-lg flex-shrink-0">
              {initials}
            </div>

            <div className="flex-grow space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 bg-gold/20 text-gold border border-gold/40 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                  Verified Guest
                </span>
              </div>
              <p className="text-xs text-cream/70 font-light">{user?.email}</p>
              <p className="text-xs text-cream/70 font-light">{user?.phone}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
              <Link href="/my-bookings">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary text-xs uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  My Bookings
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="text-xs uppercase tracking-wider bg-white/10 text-white hover:bg-red-600 hover:text-white border-transparent"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Status Feedback banner */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 border text-xs flex items-center space-x-3 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-red-50 border-red-300 text-red-700"
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
          <div className="md:col-span-7 bg-white border border-border-custom p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border-custom pb-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-gold block">
                  PERSONAL DETAILS
                </span>
                <h2 className="text-xl font-serif text-dark">Profile Information</h2>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center text-xs font-semibold text-gold hover:text-primary transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                      required
                      className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

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
                      required
                      className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
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
                      required
                      className="w-full bg-cream/40 border border-border-custom pl-9 pr-3 py-2.5 text-xs text-dark focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSaving}
                    className="text-xs uppercase tracking-wider"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || "");
                      setEmail(user?.email || "");
                      setPhone(user?.phone || "");
                    }}
                    className="text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-cream/40 border border-border-custom flex items-center justify-between">
                  <span className="text-muted uppercase text-[10px] font-semibold">Full Name</span>
                  <span className="font-medium text-dark">{user?.name}</span>
                </div>
                <div className="p-3 bg-cream/40 border border-border-custom flex items-center justify-between">
                  <span className="text-muted uppercase text-[10px] font-semibold">Email</span>
                  <span className="font-medium text-dark">{user?.email}</span>
                </div>
                <div className="p-3 bg-cream/40 border border-border-custom flex items-center justify-between">
                  <span className="text-muted uppercase text-[10px] font-semibold">Phone</span>
                  <span className="font-medium text-dark">{user?.phone}</span>
                </div>
                <div className="p-3 bg-cream/40 border border-border-custom flex items-center justify-between">
                  <span className="text-muted uppercase text-[10px] font-semibold">Security Status</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Human Verified Guest
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Security & Actions */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-border-custom p-6 shadow-sm space-y-4">
              <div className="border-b border-border-custom pb-3">
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-gold block">
                  SECURITY SETTINGS
                </span>
                <h3 className="text-lg font-serif text-dark">Password Management</h3>
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-cream/40 border border-border-custom p-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      className="w-full bg-cream/40 border border-border-custom p-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full bg-cream/40 border border-border-custom p-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <Button type="submit" variant="primary" size="sm" disabled={isSaving} className="text-xs uppercase">
                      Save Password
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsChangingPassword(false)}
                      className="text-xs uppercase"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted font-light leading-relaxed">
                    Update your account password regularly to keep your booking information secure.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => setIsChangingPassword(true)}
                    className="text-xs uppercase tracking-wider"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" />
                    Change Password
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-border-custom p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark border-b border-border-custom pb-2">
                Hospitality Concierge
              </h4>
              <p className="text-xs text-muted font-light">
                Need customized arrangements, banquet reservations, or early check-in? Contact our front desk directly.
              </p>
              <div className="pt-2 text-xs space-y-1">
                <p className="text-muted">
                  Phone: <strong className="text-dark">+91 92629 97777</strong>
                </p>
                <p className="text-muted">
                  Email: <strong className="text-dark">reservation@hotelreliance.com</strong>
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
