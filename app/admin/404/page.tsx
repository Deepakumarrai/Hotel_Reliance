import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Hotel } from "lucide-react";

export default function AdminNotFoundPage() {
  return (
    <div className="min-h-screen bg-[#070D17] text-[#E9DFD2] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#111E31] border border-[#1B2A42] text-[#D8B875] flex items-center justify-center mx-auto shadow-2xl">
          <Hotel className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
          404 Admin Route Not Found
        </span>
        <h1 className="text-3xl font-serif font-bold text-white">
          Page Not Located
        </h1>
        <p className="text-xs text-[#E9DFD2]/60 leading-relaxed">
          The administrative module or record you requested does not exist or has been relocated.
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
