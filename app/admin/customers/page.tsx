"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Eye,
  MoreVertical,
  X,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBooking } from "@/lib/admin/store";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalStays: number;
  totalSpent: number;
  lastStayDate: string;
  vipStatus: boolean;
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<CustomerRecord | null>(null);

  // Standard demo customer profiles matching the exact reference screenshot
  const standardCustomers: CustomerRecord[] = useMemo(
    () => [
      {
        id: "CUST-01",
        name: "Rahul Verma",
        phone: "+91 98351 22441",
        email: "rahul.verma@example.com",
        totalStays: 1,
        totalSpent: 5597.76,
        lastStayDate: "2026-09-07",
        vipStatus: false,
      },
      {
        id: "CUST-02",
        name: "Sneha Gupta",
        phone: "+91 94311 88210",
        email: "sneha.gupta@example.com",
        totalStays: 1,
        totalSpent: 3358.88,
        lastStayDate: "2026-09-07",
        vipStatus: false,
      },
      {
        id: "CUST-03",
        name: "Vikram Malhotra",
        phone: "+91 91223 44556",
        email: "vikram.m@sailbokaro.in",
        totalStays: 1,
        totalSpent: 10756.64,
        lastStayDate: "2026-09-07",
        vipStatus: true,
      },
    ],
    []
  );

  const [customers, setCustomers] = useState<CustomerRecord[]>(standardCustomers);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          const map = new Map<string, CustomerRecord>();
          data.bookings.forEach((b: AdminBooking) => {
            const phone = b.guestPhone || "N/A";
            const existing = map.get(phone);
            if (!existing) {
              map.set(phone, {
                id: `cust-${Math.abs(phone.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))}`,
                name: b.guestName,
                phone: b.guestPhone,
                email: b.guestEmail || "—",
                totalStays: 1,
                totalSpent: b.totalAmount,
                lastStayDate: b.checkInDate,
                vipStatus: b.totalAmount > 10000 || b.roomType === "premium" || b.roomType === "family",
              });
            } else {
              existing.totalStays += 1;
              existing.totalSpent += b.totalAmount;
              if (b.checkInDate > existing.lastStayDate) {
                existing.lastStayDate = b.checkInDate;
              }
              if (existing.totalSpent > 10000) existing.vipStatus = true;
            }
          });
          const parsed = Array.from(map.values());
          if (parsed.length > 0) {
            setCustomers(parsed);
          }
        }
      })
      .catch(() => {
        setCustomers(standardCustomers);
      });
  }, [standardCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          {/* Left: Eyebrow, Main Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
                GUEST DIRECTORY & CRM
              </span>
              <span className="w-16 h-[1px] bg-[#A97A38]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Customer Profiles & Stays
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Track lifetime guest history, loyalty spending, and VIP preferences.
            </p>
          </div>

          {/* Right: Total Profiles Box */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl px-6 py-4 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex items-center space-x-4 self-start md:self-auto flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
              <Users className="w-5 h-5 text-[#A97A38]" />
            </div>
            <div>
              <span className="text-[11px] text-[#8A8277] font-medium block">
                Total Profiles:
              </span>
              <div className="text-[26px] font-serif font-bold text-[#A97A38] leading-tight mt-0.5">
                {customers.length} Guests
              </div>
            </div>
          </div>
        </div>

        {/* 2. Obsidian Search Bar */}
        <div className="bg-[#0B141F] border border-[#182635] rounded-2xl px-4 py-3.5 shadow-xl flex items-center">
          <Search className="w-4 h-4 text-[#718295] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guests by name, phone (+91...) or email..."
            className="w-full bg-transparent text-xs sm:text-[13px] text-white placeholder:text-[#64748B] pl-3.5 pr-2 focus:outline-none font-sans"
          />
        </div>

        {/* 3. Obsidian Customers Table */}
        <div className="bg-[#0B141F] border border-[#182635] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#182635] text-[10.5px] uppercase font-bold tracking-wider text-[#A97A38] bg-[#080F18]/50">
                  <th className="py-4 px-6 font-bold whitespace-nowrap">GUEST NAME</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">PHONE</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">EMAIL</th>
                  <th className="py-4 px-4 font-bold text-center whitespace-nowrap">TOTAL STAYS</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">LIFETIME SPEND</th>
                  <th className="py-4 px-5 font-bold whitespace-nowrap">LAST STAY</th>
                  <th className="py-4 px-4 font-bold text-center whitespace-nowrap">STATUS</th>
                  <th className="py-4 px-6 font-bold text-right whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182635] text-white">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#111C28]/60 transition-colors">
                    {/* Guest Name & VIP Tag */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[13.5px] text-white">
                          {c.name}
                        </span>
                        {c.vipStatus && (
                          <span className="px-1.5 py-0.5 rounded bg-[#9E712E] text-white text-[9px] font-bold uppercase tracking-wider">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4.5 px-5 font-mono text-xs text-[#D8B77A] whitespace-nowrap">
                      {c.phone}
                    </td>

                    {/* Email */}
                    <td className="py-4.5 px-5 text-xs text-[#94A3B8] whitespace-nowrap font-normal">
                      {c.email}
                    </td>

                    {/* Total Stays */}
                    <td className="py-4.5 px-4 text-center font-bold text-xs text-white whitespace-nowrap">
                      {c.totalStays}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-4.5 px-5 font-bold text-xs text-[#10B981] whitespace-nowrap font-mono">
                      ₹{c.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Last Stay */}
                    <td className="py-4.5 px-5 text-xs text-[#94A3B8] whitespace-nowrap font-normal">
                      {c.lastStayDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-[#10B981] bg-[#064E3B]/40 border border-[#047857]/50 inline-block">
                        Verified Guest
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedGuest(c)}
                          className="px-3 py-1.5 rounded-lg border border-[#263545] bg-[#111C28] hover:bg-[#182637] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D8B77A]" />
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={() => setSelectedGuest(c)}
                          title="Actions Menu"
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

        {/* Modal: View Profile */}
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#0B141F] border border-[#182635] w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 text-white font-sans">
              <div className="flex justify-between items-center border-b border-[#182635] pb-3.5">
                <div className="flex items-center space-x-2.5">
                  <h3 className="font-serif text-[22px] font-bold text-white">
                    {selectedGuest.name}
                  </h3>
                  {selectedGuest.vipStatus && (
                    <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[9.5px] font-bold uppercase tracking-wider flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-white" />
                      <span>VIP GUEST</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#162332] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#080F18] border border-[#182635]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-0.5">
                      Phone Number
                    </span>
                    <div className="font-mono text-sm text-[#D8B77A] font-semibold">
                      {selectedGuest.phone}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-0.5">
                      Email Address
                    </span>
                    <div className="text-xs text-white truncate font-medium">
                      {selectedGuest.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#080F18] border border-[#182635]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-0.5">
                      Total Completed Stays
                    </span>
                    <div className="text-lg font-bold text-white">
                      {selectedGuest.totalStays} Stays
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#080F18] border border-[#182635]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-0.5">
                      Lifetime Spend
                    </span>
                    <div className="text-lg font-bold text-[#10B981]">
                      ₹{selectedGuest.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080F18] border border-[#182635] flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">
                    Last Stay Date: <strong className="text-white">{selectedGuest.lastStayDate}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#10B981] bg-[#064E3B]/40 border border-[#047857]/50">
                    Verified Loyalty Profile
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#182635]">
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="px-4 py-2 bg-[#182635] hover:bg-[#253649] rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
