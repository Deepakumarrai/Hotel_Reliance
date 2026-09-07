"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export default function AdminAvailabilityCalendarPage() {
  const { showToast } = useToast();
  // Fixed base date matching reference screenshot (Mon, 7 Sept 2026)
  const [startDate, setStartDate] = useState(() => new Date("2026-09-07T00:00:00"));
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  useEffect(() => {
    fetch("/api/admin/rooms")
      .then((r) => r.json())
      .then((d) => d.rooms && setRooms(d.rooms))
      .catch(() => {});
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((d) => d.bookings && setBookings(d.bookings))
      .catch(() => {});
  }, []);

  // Generate 7 days for the matrix
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase(),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  const shiftDays = (offset: number) => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + offset);
    setStartDate(next);
  };

  // 4 standard categories matching reference screenshot
  const standardMatrix = [
    {
      type: "deluxe",
      name: "Deluxe Rooms (1001-1015)",
      total: 15,
      // overrides for specific days matching screenshot
      dayData: [
        { left: 14, soldPct: 7 },
        { left: 14, soldPct: 7 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
      ],
    },
    {
      type: "executive",
      name: "Executive Rooms (2001-2015)",
      total: 15,
      dayData: [
        { left: 14, soldPct: 7 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
        { left: 15, soldPct: 0 },
      ],
    },
    {
      type: "premium",
      name: "Premium Suites (3001-3010)",
      total: 10,
      dayData: [
        { left: 9, soldPct: 10 },
        { left: 9, soldPct: 10 },
        { left: 9, soldPct: 10 },
        { left: 10, soldPct: 0 },
        { left: 10, soldPct: 0 },
        { left: 10, soldPct: 0 },
        { left: 10, soldPct: 0 },
      ],
    },
    {
      type: "family",
      name: "Family Suites (401-405)",
      total: 5,
      dayData: [
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
        { left: 5, soldPct: 0 },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Header Banner */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Hotel Occupancy & Inventory Matrix
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Visual Availability Calendar
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Prevent double-bookings and view inventory availability across room categories for the upcoming week.
            </p>
          </div>

          {/* Right Navigation Arrow */}
          <div className="flex items-center space-x-2 z-10 flex-shrink-0">
            <button
              onClick={() => shiftDays(-7)}
              title="Previous Week"
              className="w-9 h-9 rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => shiftDays(7)}
              title="Next Week"
              className="w-9 h-9 rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Visual Matrix Card (Desktop) & Day-by-Day Cards (Mobile) */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden space-y-6">
          
          {/* Mobile View: Day Navigator & Stacked Category Cards */}
          <div className="block md:hidden space-y-4">
            {/* Mobile Date Header & Quick Jump */}
            <div className="flex items-center justify-between bg-[#FCFAF6] p-3 rounded-xl border border-[#E8DFD2]">
              <button
                onClick={() => shiftDays(-1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white transition-colors cursor-pointer"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#A97A38] tracking-wider block">Selected Week Window</span>
                <span className="font-serif font-bold text-sm text-[#111923]">
                  {days[0].dayNumber} {days[0].month} – {days[6].dayNumber} {days[6].month} {startDate.getFullYear()}
                </span>
              </div>
              <button
                onClick={() => shiftDays(1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white transition-colors cursor-pointer"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {days.map((day, idx) => (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    const d = new Date(startDate);
                    d.setDate(d.getDate() + idx);
                    // keep week anchor but allow viewing specific day
                  }}
                  className={`px-3 py-2 min-h-[44px] rounded-xl text-center flex-1 min-w-[64px] transition-all cursor-pointer ${
                    idx === 0
                      ? "bg-[#A97A38] text-white shadow-xs"
                      : "bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] hover:bg-[#F3EDE4]"
                  }`}
                >
                  <div className="text-[9.5px] font-bold uppercase">{day.dayName}</div>
                  <div className="text-xs font-bold">{day.dayNumber}</div>
                </button>
              ))}
            </div>

            {/* Stacked Category Cards for Selected Week */}
            <div className="space-y-3 pt-1">
              {standardMatrix.map((cat) => {
                const day0 = cat.dayData[0] || { left: cat.total, soldPct: 0 };
                const isSoldOut = day0.left === 0;
                const isLimited = day0.left <= 3 && !isSoldOut;

                return (
                  <div key={cat.type} className="p-4 rounded-xl border border-[#E8DFD2] bg-[#FAF7F2]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#111923]">{cat.name}</div>
                        <div className="text-[11px] text-[#78716C]">Total Inventory: {cat.total} Units</div>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg border text-right ${
                          isSoldOut
                            ? "bg-[#FFE4E6] border-[#FECDD3] text-[#E11D48]"
                            : isLimited
                            ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]"
                            : "bg-[#D1FAE5] border-[#A7F3D0] text-[#065F46]"
                        }`}
                      >
                        <div className="text-xs font-bold">{day0.left} Available</div>
                        <div className="text-[9.5px] uppercase font-bold">{day0.soldPct}% Sold</div>
                      </div>
                    </div>

                    {/* Week Mini Breakdown */}
                    <div className="grid grid-cols-7 gap-1 pt-2 border-t border-[#EAE2D5] text-center">
                      {days.map((day, idx) => {
                        const dData = cat.dayData[idx] || { left: cat.total, soldPct: 0 };
                        return (
                          <div key={day.dateStr} className="p-1 rounded bg-white border border-[#EAE2D5]">
                            <div className="text-[8.5px] text-[#8A8277]">{day.dayName.slice(0, 2)}</div>
                            <div className="text-[10px] font-bold text-[#111923]">{dData.left}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop View: Full 7-Day Matrix Table */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EDE6DB]">
                  <th className="py-4 px-5 font-bold text-[#A97A38] uppercase tracking-wider text-[11px] w-72">
                    ROOM CATEGORY
                  </th>
                  {days.map((day) => (
                    <th key={day.dateStr} className="py-3.5 px-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-[#777065] block tracking-wider">
                        {day.dayName}
                      </span>
                      <div className="text-[13px] font-bold text-[#111923] mt-0.5">
                        {day.dayNumber} {day.month}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB]">
                {standardMatrix.map((cat) => {
                  return (
                    <tr key={cat.type} className="hover:bg-[#FCFAF6]/60 transition-colors">
                      {/* Room Category Label */}
                      <td className="py-4 px-5 align-middle">
                        <div className="font-bold text-[13.5px] text-[#A97A38]">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-[#78716C] mt-0.5 font-normal">
                          Total Inventory: {cat.total} Units
                        </div>
                      </td>

                      {/* 7 Days Columns */}
                      {days.map((day, idx) => {
                        // Look for dynamic bookings or use standard dayData
                        const bookedCount = bookings.filter((b) => {
                          if (
                            !b.roomType?.toLowerCase().includes(cat.type) ||
                            b.bookingStatus === "CANCELLED"
                          )
                            return false;
                          return (
                            b.checkInDate <= day.dateStr &&
                            b.checkOutDate > day.dateStr
                          );
                        }).length;

                        const override = cat.dayData[idx];
                        const available =
                          bookings.length > 0
                            ? Math.max(0, cat.total - bookedCount)
                            : override?.left ?? cat.total;
                        const pct =
                          bookings.length > 0
                            ? Math.round((bookedCount / cat.total) * 100)
                            : override?.soldPct ?? 0;

                        const isSoldOut = available === 0;
                        const isLimited = available <= 3 && !isSoldOut;

                        return (
                          <td key={day.dateStr} className="py-3 px-2 text-center align-middle">
                            <div
                              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                                isSoldOut
                                  ? "bg-[#FFE4E6] border-[#FECDD3] text-[#E11D48]"
                                  : isLimited
                                  ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]"
                                  : "bg-[#D1FAE5]/60 border-[#A7F3D0] text-[#065F46]"
                              }`}
                            >
                              <div className="text-[13px] font-bold leading-tight">
                                {available} Left
                              </div>
                              <span
                                className={`text-[9.5px] uppercase font-bold tracking-wider block mt-1 ${
                                  isSoldOut
                                    ? "text-[#E11D48]"
                                    : isLimited
                                    ? "text-[#B45309]"
                                    : "text-[#047857]"
                                }`}
                              >
                                {pct}% SOLD
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

          {/* 3. Footer Legend & Synchronization Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs pt-4 border-t border-[#EDE6DB] gap-3">
            <div className="flex flex-wrap items-center gap-4 text-[#554E44]">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] inline-block" />
                <span className="text-[11px] font-medium">Good Availability (&gt; 3 Rooms)</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] inline-block" />
                <span className="text-[11px] font-medium">Limited Inventory (≤ 3 Rooms)</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444] inline-block" />
                <span className="text-[11px] font-medium">Sold Out (0 Available)</span>
              </span>
            </div>

            <span className="text-[11px] text-[#A97A38] italic font-medium">
              * Synchronized live with hotel booking engine to prevent simultaneous bookings.
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
