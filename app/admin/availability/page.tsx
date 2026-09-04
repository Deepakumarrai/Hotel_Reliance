"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export default function AdminAvailabilityCalendarPage() {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(() => new Date());
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  useEffect(() => {
    fetch("/api/admin/rooms").then((r) => r.json()).then((d) => d.rooms && setRooms(d.rooms));
    fetch("/api/admin/bookings").then((r) => r.json()).then((d) => d.bookings && setBookings(d.bookings));
  }, []);

  // Generate next 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  const shiftDays = (offset: number) => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + offset);
    setStartDate(next);
  };

  const categories = [
    { type: "deluxe", name: "Deluxe Rooms (101-112)", total: 12 },
    { type: "executive", name: "Executive Rooms (201-215)", total: 15 },
    { type: "premium", name: "Premium Suites (301-310)", total: 10 },
    { type: "family", name: "Family Suites (401-408)", total: 8 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Hotel Occupancy & Inventory Matrix
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Visual Availability Calendar
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Prevent double-bookings and view inventory availability across room categories for the upcoming week.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => shiftDays(-7)}
              className="p-2 rounded-lg bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStartDate(new Date())}
              className="px-3 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => shiftDays(7)}
              className="p-2 rounded-lg bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Visual Matrix Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-2xl overflow-hidden space-y-6">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1B2A42]">
                  <th className="p-4 font-bold text-white uppercase tracking-wider text-[11px] w-64 bg-[#111E31]">
                    Room Category
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.dateStr}
                      className="p-3 text-center border-l border-[#1B2A42] bg-[#111E31]/70"
                    >
                      <span className="text-[10px] uppercase font-bold text-[#C4984F] block">
                        {day.dayName}
                      </span>
                      <div className="text-sm font-bold text-white">
                        {day.dayNumber} {day.month}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]">
                {categories.map((cat) => {
                  return (
                    <tr key={cat.type} className="hover:bg-[#111E31]/40 transition-colors">
                      <td className="p-4 font-semibold text-white bg-[#0B1423]">
                        <div className="font-serif text-sm font-bold text-[#D8B875]">{cat.name}</div>
                        <span className="text-[10px] text-white/40">Total Inventory: {cat.total} Units</span>
                      </td>

                      {days.map((day) => {
                        // Count active bookings overlapping this date
                        const bookedCount = bookings.filter((b) => {
                          if (b.roomType !== cat.type || b.bookingStatus === "CANCELLED") return false;
                          return b.checkInDate <= day.dateStr && b.checkOutDate > day.dateStr;
                        }).length;

                        const available = Math.max(0, cat.total - bookedCount);
                        const pct = Math.round((bookedCount / cat.total) * 100);

                        return (
                          <td
                            key={day.dateStr}
                            className="p-3 text-center border-l border-[#1B2A42] align-middle"
                          >
                            <div
                              className={`p-2.5 rounded-lg border text-center transition-all ${
                                available === 0
                                  ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                                  : available <= 3
                                  ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                                  : "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                              }`}
                            >
                              <div className="font-mono text-sm font-bold">{available} Left</div>
                              <span className="text-[9px] uppercase tracking-wider font-semibold block mt-0.5">
                                {pct}% Sold
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-4 border-t border-[#1B2A42] text-white/60">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" />
                <span>Good Availability (&gt; 3 Rooms)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" />
                <span>Limited Inventory (≤ 3 Rooms)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500" />
                <span>Sold Out (0 Available)</span>
              </span>
            </div>
            <span className="text-[11px] text-[#C4984F] font-medium">
              * Synchronized live with hotel booking engine to prevent simultaneous overbooking.
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
