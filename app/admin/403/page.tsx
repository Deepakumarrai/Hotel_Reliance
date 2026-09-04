import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Hotel } from "lucide-react";

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#070D17] text-[#E9DFD2] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-red-400 block">
          403 Access Forbidden
        </span>
        <h1 className="text-3xl font-serif font-bold text-white">
          Unauthorized Privilege Area
        </h1>
        <p className="text-xs text-[#E9DFD2]/60 leading-relaxed">
          Your current administrative account role does not have permission to access this module. Please contact the General Manager.
        </p>
        <div className="pt-4">
          <Link
            href="/admin/dashboard"
            className="px-6 py-2.5 rounded bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-xs font-semibold text-[#D8B875] inline-flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
