"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, Download, Search, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KPIStatCard } from "@/components/admin/KPIStatCard";
import { AdminBooking } from "@/lib/admin/store";

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  useEffect(() => {
    fetch("/api/admin/bookings").then((r) => r.json()).then((d) => d.bookings && setBookings(d.bookings));
  }, []);

  const totalCollected = bookings.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
  const pendingCollection = bookings
    .filter((b) => b.paymentStatus === "PENDING" && b.bookingStatus !== "CANCELLED")
    .reduce((acc, b) => acc + (b.totalAmount - (b.paidAmount || 0)), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Financial Ledger & Gateway Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Payment Transactions & Settlements
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Real-time records for Razorpay gateway, POS credit card, and direct hotel UPI payments.
            </p>
          </div>

          <Link
            href="/admin/refunds"
            className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund Ledger</span>
          </Link>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KPIStatCard
            title="Total Settled Revenue"
            value={`₹${totalCollected.toLocaleString()}`}
            subtitle="Verified in bank account"
            icon={<CreditCard className="w-5 h-5" />}
            variant="emerald"
          />
          <KPIStatCard
            title="Pending Collections"
            value={`₹${pendingCollection.toLocaleString()}`}
            subtitle="Pay-at-hotel bookings"
            icon={<AlertCircle className="w-5 h-5" />}
            variant="amber"
          />
          <KPIStatCard
            title="Gateway Compliance"
            value="100% SECURE"
            subtitle="TLS 1.3 • HMAC SHA-256 Webhooks"
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="navy"
          />
        </div>

        {/* Transactions Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Transaction / Booking</th>
                  <th className="py-3 font-bold">Customer</th>
                  <th className="py-3 font-bold">Method</th>
                  <th className="py-3 font-bold">Amount</th>
                  <th className="py-3 font-bold">Status</th>
                  <th className="py-3 font-bold text-right">Gateway Ref ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-mono font-bold text-[#D8B875]">{b.id}</div>
                      <div className="text-[10px] text-white/40">{b.createdAt ? b.createdAt.split("T")[0] : "Today"}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{b.guestName}</div>
                      <div className="text-[10px] text-white/40">{b.guestPhone}</div>
                    </td>
                    <td className="py-3.5 capitalize font-medium text-white/80">{b.paymentMethod}</td>
                    <td className="py-3.5 font-bold text-white">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.paymentStatus === "SUCCESS"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-purple-950 text-purple-400 border border-purple-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-[11px] text-white/50">
                      {b.transactionId || "OFFLINE_CASH_POS"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
