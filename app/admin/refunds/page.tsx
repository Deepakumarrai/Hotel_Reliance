"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBooking } from "@/lib/admin/store";

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<AdminBooking[]>([]);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((d) => {
        if (d.bookings) {
          setRefunds(d.bookings.filter((b: AdminBooking) => b.refundAmount && b.refundAmount > 0));
        }
      });
  }, []);

  const totalRefunded = refunds.reduce((acc, r) => acc + (r.refundAmount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/payments"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Financial Audit
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Refund Processing Records
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/50">Total Refunded:</span>
            <div className="text-2xl font-serif font-bold text-purple-400">₹{totalRefunded.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          {refunds.length === 0 ? (
            <div className="py-16 text-center text-xs text-white/40">
              No refunds processed yet.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                    <th className="py-3 font-bold">Booking ID</th>
                    <th className="py-3 font-bold">Guest</th>
                    <th className="py-3 font-bold">Reason</th>
                    <th className="py-3 font-bold">Original Paid</th>
                    <th className="py-3 font-bold">Refund Amount</th>
                    <th className="py-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                  {refunds.map((r) => (
                    <tr key={r.id} className="hover:bg-[#111E31]/50 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#D8B875]">{r.id}</td>
                      <td className="py-3.5 font-semibold text-white">{r.guestName}</td>
                      <td className="py-3.5 text-white/60">{r.cancellationReason || "Guest Cancellation"}</td>
                      <td className="py-3.5">₹{r.paidAmount.toLocaleString()}</td>
                      <td className="py-3.5 font-bold text-purple-400">₹{r.refundAmount?.toLocaleString()}</td>
                      <td className="py-3.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                          PROCESSED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
