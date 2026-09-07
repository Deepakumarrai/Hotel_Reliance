"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Eye,
  MoreVertical,
  X,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface TransactionRecord {
  id: string;
  date: string;
  guestName: string;
  guestPhone: string;
  method: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "REFUNDED";
  gatewayRefId: string;
}

export default function AdminPaymentsPage() {
  const [selectedTrx, setSelectedTrx] = useState<TransactionRecord | null>(null);

  // Exact data from the reference screenshot
  const transactions: TransactionRecord[] = useMemo(
    () => [
      {
        id: "BK-90214",
        date: "2026-09-07",
        guestName: "Rahul Verma",
        guestPhone: "+91 98351 22441",
        method: "RAZORPAY",
        amount: 5597.76,
        status: "SUCCESS",
        gatewayRefId: "pay_rzp_994821",
      },
      {
        id: "BK-88412",
        date: "2026-09-07",
        guestName: "Sneha Gupta",
        guestPhone: "+91 94311 88210",
        method: "UPI",
        amount: 3358.88,
        status: "SUCCESS",
        gatewayRefId: "upi_449102",
      },
      {
        id: "BK-77219",
        date: "2026-09-06",
        guestName: "Vikram Malhotra",
        guestPhone: "+91 91223 44556",
        method: "RAZORPAY",
        amount: 10756.64,
        status: "SUCCESS",
        gatewayRefId: "OFFLINE_CASH_POS",
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className="text-[10.5px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
                FINANCIAL LEDGER & GATEWAY RECORDS
              </span>
              <span className="w-16 h-[1px] bg-[#A97A38]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Payment Transactions & Settlements
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Real-time records for Razorpay gateway, POS credit card, and direct hotel UPI payments.
            </p>
          </div>

          {/* Right: Refund Ledger Button */}
          <div className="flex items-center space-x-2.5 self-start md:self-auto flex-shrink-0">
            <Link
              href="/admin/refunds"
              className="px-4 py-2.5 rounded-xl bg-[#0B141F] border border-[#182635] hover:bg-[#152333] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-xl cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>Refund Ledger</span>
            </Link>
          </div>
        </div>

        {/* 2. Three Luxury KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Settled Revenue */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  TOTAL SETTLED REVENUE
                </span>
                <div className="text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1">
                  ₹19,713.28
                </div>
                <span className="text-xs font-medium text-[#10B981] block mt-1">
                  Verified in bank account
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>

          {/* Card 2: Pending Collections */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  PENDING COLLECTIONS
                </span>
                <div className="text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1">
                  ₹0
                </div>
                <span className="text-xs font-medium text-[#B91C1C] block mt-1">
                  Pay-at-hotel bookings
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>

          {/* Card 3: Gateway Compliance */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  GATEWAY COMPLIANCE
                </span>
                <div className="text-[24px] font-serif font-bold text-[#111923] leading-tight mt-1 tracking-tight">
                  100% SECURE
                </div>
                <span className="text-xs font-medium text-[#B91C1C] block mt-1">
                  TLS 1.3 • HMAC SHA-256 Webhooks
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>
        </div>

        {/* 3. Obsidian Transactions Ledger Table (Desktop) & Cards (Mobile) */}
        <div className="bg-[#0B141F] border border-[#182635] rounded-2xl shadow-xl overflow-hidden">
          {/* Mobile View: Transaction Cards */}
          <div className="block md:hidden divide-y divide-[#182635]">
            {transactions.map((trx) => (
              <div key={trx.id} className="p-4 space-y-3 bg-[#0B141F] hover:bg-[#111C28]/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-[#D8B77A]">{trx.id}</span>
                    <span className="text-[10px] text-[#94A3B8]">{trx.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-[#10B981] bg-[#064E3B]/40 border border-[#047857]/50 inline-block">
                    ✓ {trx.status}
                  </span>
                </div>

                <div className="bg-[#080F18] p-3 rounded-xl border border-[#182635] space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#94A3B8]">Guest:</span>
                    <span className="font-bold text-white text-[13px]">{trx.guestName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#94A3B8]">Phone:</span>
                    <span className="text-[#94A3B8] font-mono">{trx.guestPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#94A3B8]">Method:</span>
                    <span className="uppercase text-white font-medium">{trx.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#94A3B8]">Gateway Ref:</span>
                    <span className="font-mono text-[#94A3B8] text-[11px] truncate max-w-[180px]">{trx.gatewayRefId}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#182635]">
                    <span className="text-[#94A3B8] font-semibold">Amount:</span>
                    <span className="font-mono font-bold text-base text-white">
                      ₹{trx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setSelectedTrx(trx)}
                    className="w-full min-h-[44px] flex items-center justify-center space-x-2 rounded-xl border border-[#263545] bg-[#111C28] hover:bg-[#182637] text-white text-xs font-bold active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D8B77A]" />
                    <span>View Receipt & Voucher</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Full Ledger Table */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#182635] text-[10px] uppercase font-bold tracking-wider text-[#A97A38] bg-[#080F18]/50">
                  <th className="py-4 px-6 font-bold whitespace-nowrap">TRANSACTION / BOOKING</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">CUSTOMER</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">METHOD</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">AMOUNT</th>
                  <th className="py-4 px-4 font-bold text-center whitespace-nowrap">STATUS</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">GATEWAY REF ID</th>
                  <th className="py-4 px-6 font-bold text-right whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182635] text-white">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#111C28]/60 transition-colors">
                    {/* Booking / Trx */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-[#D8B77A]">
                        {trx.id}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">
                        {trx.date}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4.5 px-5 whitespace-nowrap">
                      <div className="font-bold text-[13.5px] text-white">
                        {trx.guestName}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5 font-normal">
                        {trx.guestPhone}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-4.5 px-5 uppercase font-medium text-xs text-white/90 whitespace-nowrap">
                      {trx.method}
                    </td>

                    {/* Amount */}
                    <td className="py-4.5 px-5 font-bold font-mono text-xs text-white whitespace-nowrap">
                      ₹{trx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-[#10B981] bg-[#064E3B]/40 border border-[#047857]/50 inline-block">
                        {trx.status}
                      </span>
                    </td>

                    {/* Gateway Ref ID */}
                    <td className="py-4.5 px-5 font-mono text-xs text-[#94A3B8] whitespace-nowrap font-normal">
                      {trx.gatewayRefId}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedTrx(trx)}
                          className="px-3 py-1.5 rounded-lg border border-[#263545] bg-[#111C28] hover:bg-[#182637] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D8B77A]" />
                          <span>View Receipt</span>
                        </button>
                        <button
                          onClick={() => setSelectedTrx(trx)}
                          title="Options"
                          className="p-1.5 rounded-lg border border-[#263545] bg-[#111C28] hover:bg-[#182637] text-[#94A3B8] hover:text-white transition-colors shadow-2xs cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Receipt */}
        {selectedTrx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#0B141F] border border-[#182635] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 text-white font-sans">
              <div className="flex justify-between items-center border-b border-[#182635] pb-3.5">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-[#A97A38]" />
                  <h3 className="font-serif text-[20px] font-bold text-white">
                    Payment Receipt & Voucher
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTrx(null)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#162332] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-xl bg-[#080F18] border border-[#182635] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Booking ID:</span>
                    <span className="font-mono font-bold text-[#D8B77A]">{selectedTrx.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Guest Name:</span>
                    <span className="font-bold text-white">{selectedTrx.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Phone:</span>
                    <span className="font-mono text-white">{selectedTrx.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Payment Method:</span>
                    <span className="uppercase text-white font-medium">{selectedTrx.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Gateway Ref:</span>
                    <span className="font-mono text-white/80">{selectedTrx.gatewayRefId}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#182635]">
                    <span className="text-[#94A3B8] font-bold">Total Settled:</span>
                    <span className="font-mono font-bold text-[#10B981] text-sm">
                      ₹{selectedTrx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#064E3B]/20 border border-[#047857]/40 text-center text-[#10B981] text-[11px] font-bold flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>TRANSACTION VERIFIED & SETTLED WITH BANK</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-[#182635]">
                <button
                  type="button"
                  onClick={() => setSelectedTrx(null)}
                  className="px-4 py-2 bg-[#182635] hover:bg-[#253649] rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
