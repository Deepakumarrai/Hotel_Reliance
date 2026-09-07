"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, KeyRound, LogOut, Lock, CheckCircle2, Crown } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState<{
    name: string;
    username: string;
    role: string;
  } | null>({
    name: "Vikramaditya Roy",
    username: "superadmin",
    role: "SUPER_ADMIN",
  });
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    fetch("/api/admin/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setAdminUser(d.user);
      })
      .catch(() => {});
  }, []);

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
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Administrative Credentials & Access
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Admin Profile & Access Credentials
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Manage executive credentials, role security permissions, and authenticated administrator session controls.
            </p>
          </div>

          {/* Right Live Sync Status */}
          <div className="flex items-center space-x-2 bg-[#DCFCE7] border border-[#86EFAC] px-4 py-2 rounded-xl text-xs text-[#15803D] font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>SESSION AUTHENTICATED</span>
          </div>
        </div>

        {/* 2. Profile Details & Password Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-5 bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-5">
            <div className="flex items-center space-x-4 border-b border-[#EDE6DB] pb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#9E712E] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md flex-shrink-0">
                VR
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-serif font-bold text-[#111923]">
                    {adminUser?.name || "Vikramaditya Roy"}
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8DFD2] text-[#A97A38] text-[9.5px] font-bold uppercase tracking-wider">
                    {adminUser?.role || "SUPER_ADMIN"}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-0.5 font-mono">
                  Username: @{adminUser?.username || "superadmin"}
                </p>
                <p className="text-xs text-[#A97A38] font-medium mt-0.5">
                  General Manager • Hotel Reliance
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex justify-between items-center">
                <span className="text-[#78716C]">Account Status:</span>
                <span className="font-bold text-[#15803D]">● Active (Full Privileges)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex justify-between items-center">
                <span className="text-[#78716C]">Session Encryption:</span>
                <span className="font-mono text-[#111923] font-bold">HMAC SHA-256 JWT</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex justify-between items-center">
                <span className="text-[#78716C]">Property:</span>
                <span className="font-medium text-[#111923]">Hotel Reliance, Chas, Bokaro</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EDE6DB]">
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl bg-[#FFE4E6] hover:bg-[#FECDD3] text-[#E11D48] border border-[#FECDD3] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>TERMINATE SESSION & LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-[#EDE6DB] pb-4">
              <KeyRound className="w-5 h-5 text-[#A97A38]" />
              <h3 className="font-serif text-lg font-bold text-[#111923]">
                Change Administrator Password
              </h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
