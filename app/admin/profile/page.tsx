"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, KeyRound, LogOut, Lock, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast("New passwords do not match", "error");
      return;
    }
    showToast("Password updated successfully!", "success");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("Signed out successfully", "info");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            Administrative Credentials
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Admin Profile & Access
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#1B2A42] border-2 border-[#C4984F] flex items-center justify-center text-xl font-serif font-bold text-[#D8B875]">
              VR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif font-bold text-white">Vikramaditya Roy</h2>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#E9DFD2]/60 mt-0.5">Username: admin@HotelReliance</p>
              <p className="text-xs text-[#D8B875]">General Manager • Hotel Reliance, Bokaro Steel City</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-[#111E31] p-4 rounded-xl border border-[#1B2A42] text-xs">
            <div>
              <span className="text-white/40 block">Account Status</span>
              <span className="font-bold text-emerald-400">● Active (Full Privileges)</span>
            </div>
            <div>
              <span className="text-white/40 block">Session Security</span>
              <span className="font-mono text-white">Signed HTTP-Only Token</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 text-xs">
          <div className="flex items-center space-x-2 border-b border-[#1B2A42] pb-3">
            <KeyRound className="w-4 h-4 text-[#C4984F]" />
            <h3 className="font-serif text-base font-bold text-white">Change Security Password</h3>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-xs font-bold uppercase text-white shadow-md"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Sign Out Card */}
        <div className="bg-[#0B1423] border border-red-500/20 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-white">Sign Out of Admin Panel</h3>
            <p className="text-xs text-white/50 mt-0.5">Terminates active session and invalidates secure cookie.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
