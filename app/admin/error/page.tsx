"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AdminErrorPage() {
  return (
    <div className="min-h-screen bg-[#070D17] text-[#E9DFD2] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 block">
          500 Operational System Warning
        </span>
        <h1 className="text-3xl font-serif font-bold text-white">
          Unexpected Error Occurred
        </h1>
        <p className="text-xs text-[#E9DFD2]/60 leading-relaxed">
          The server encountered an unexpected error while processing administrative data. No sensitive information was compromised.
        </p>
        <div className="pt-4 space-x-3">
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
