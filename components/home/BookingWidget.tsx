"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BookingWidget() {
  const router = useRouter();

  // Initialize dates: Check-in (today), Check-out (tomorrow)
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayString(0));
  const [checkOut, setCheckOut] = useState(getTodayString(1));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString()
    }).toString();
    
    router.push(`/booking?${query}`);
  };

  return (
    <div className="relative z-30 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-3 sm:px-6">
      <div className="bg-[#FAF7F2] text-[#111E31] shadow-2xl rounded-xl sm:rounded-2xl border-2 border-[#C5A880]/70 p-4 sm:p-7 md:p-8 backdrop-blur-md">
        {/* Top Header Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5D7C5]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#BA8B32]" />
            <span className="text-[11px] sm:text-xs font-serif uppercase tracking-[0.22em] text-[#9E712E] font-bold">
              Direct Booking Privileges
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-[#6B5E54] font-serif flex-wrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" />
            <span>Best Rate Guaranteed • No Booking Fees • Instant Confirmation</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end"
        >
          {/* Check-In */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E712E] flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayString(0)}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (new Date(e.target.value) >= new Date(checkOut)) {
                  const nextDay = new Date(e.target.value);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setCheckOut(nextDay.toISOString().split("T")[0]);
                }
              }}
              className="w-full bg-white border border-[#D9C6AF] rounded-lg p-3 text-sm text-[#111E31] font-medium focus:border-[#BA8B32] focus:ring-1 focus:ring-[#BA8B32] focus:outline-none transition-all shadow-sm"
              required
            />
          </div>

          {/* Check-Out */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E712E] flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn ? getTodayString(1) : getTodayString(1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-white border border-[#D9C6AF] rounded-lg p-3 text-sm text-[#111E31] font-medium focus:border-[#BA8B32] focus:ring-1 focus:ring-[#BA8B32] focus:outline-none transition-all shadow-sm"
              required
            />
          </div>

          {/* Adults */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E712E] flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              Adults
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-white border border-[#D9C6AF] rounded-lg p-3 text-sm text-[#111E31] font-medium focus:border-[#BA8B32] focus:ring-1 focus:ring-[#BA8B32] focus:outline-none transition-all shadow-sm cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Adult" : "Adults"}
                </option>
              ))}
            </select>
          </div>

          {/* Children */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E712E] flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              Children
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full bg-white border border-[#D9C6AF] rounded-lg p-3 text-sm text-[#111E31] font-medium focus:border-[#BA8B32] focus:ring-1 focus:ring-[#BA8B32] focus:outline-none transition-all shadow-sm cursor-pointer"
            >
              {[0, 1, 2, 3].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Child" : "Children"}
                </option>
              ))}
            </select>
          </div>

          {/* Check Rates CTA */}
          <div>
            <button
              type="submit"
              className="w-full h-[48px] bg-gradient-to-r from-[#9E712E] via-[#BA8B32] to-[#B5853B] hover:brightness-105 text-white font-serif uppercase tracking-[0.16em] text-xs font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-[#BA8B32]"
            >
              <span>Check Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

