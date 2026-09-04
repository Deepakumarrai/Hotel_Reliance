"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, Phone, Mail, Award, CalendarCheck2, ArrowRight } from "lucide-react";
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
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings) {
          // Aggregate unique guests by phone
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
          setCustomers(Array.from(map.values()));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Guest Directory & CRM
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Customer Profiles & Stays
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Track lifetime guest history, loyalty spending, and VIP preferences.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/50">Total Profiles:</span>
            <div className="text-2xl font-serif font-bold text-[#D8B875]">{customers.length} Guests</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guests by name, phone (+91...) or email..."
            className="w-full bg-[#0B1423] border border-[#1B2A42] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4984F]"
          />
        </div>

        {/* Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Guest Name</th>
                  <th className="py-3 font-bold">Phone</th>
                  <th className="py-3 font-bold">Email</th>
                  <th className="py-3 font-bold text-center">Total Stays</th>
                  <th className="py-3 font-bold">Lifetime Spend</th>
                  <th className="py-3 font-bold">Last Stay</th>
                  <th className="py-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <span>{c.name}</span>
                        {c.vipStatus && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/40 text-[9px] font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-[#D8B875] font-mono">{c.phone}</td>
                    <td className="py-3.5 text-white/60">{c.email}</td>
                    <td className="py-3.5 text-center font-bold">{c.totalStays}</td>
                    <td className="py-3.5 font-bold text-emerald-400">₹{c.totalSpent.toLocaleString()}</td>
                    <td className="py-3.5 text-white/60">{c.lastStayDate}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Verified Guest
                      </span>
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
