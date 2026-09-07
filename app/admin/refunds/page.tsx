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
      })
      .catch(() => {});
  }, []);

  const totalRefunded = refunds.reduce((acc, r) => acc + (r.refundAmount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Financial Audit & Reversals
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/payments"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Payments"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                Refund Processing Records
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Track cancellations, gateway reversals, and approved guest refund disbursements.
            </p>
          </div>

          {/* Right: Total Refunded Box */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl px-6 py-4 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex items-center space-x-4 self-start md:self-auto flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#7E22CE] flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8A8277] font-medium block">
                Total Refunded:
              </span>
              <div className="text-[26px] font-serif font-bold text-[#7E22CE] leading-tight mt-0.5">
                ₹{totalRefunded.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Table */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden">
          {refunds.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#15803D]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#111923]">
                No pending or processed refunds in database.
              </div>
              <p className="text-xs text-[#6B6255]">
                All transactions are clean and settled.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                    <th className="py-3.5 px-5 font-bold">BOOKING ID</th>
                    <th className="py-3.5 px-4 font-bold">GUEST</th>
                    <th className="py-3.5 px-4 font-bold">REASON</th>
                    <th className="py-3.5 px-4 font-bold">ORIGINAL PAID</th>
                    <th className="py-3.5 px-4 font-bold">REFUND AMOUNT</th>
                    <th className="py-3.5 px-5 font-bold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                  {refunds.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-[#A97A38]">
                        {r.id}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#111923]">
                        {r.guestName}
                      </td>
                      <td className="py-4 px-4 text-[#6B6255]">
                        {r.cancellationReason || "Guest Cancellation"}
                      </td>
                      <td className="py-4 px-4 font-mono">
                        ₹{r.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#7E22CE]">
                        ₹{r.refundAmount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#D8B4FE]">
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
