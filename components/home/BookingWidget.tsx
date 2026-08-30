"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

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
    // Redirect to booking page with search queries
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString()
    }).toString();
    
    router.push(`/booking?${query}`);
  };

  return (
    <div className="relative z-30 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-dark shadow-2xl p-6 md:p-8 border border-border-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        {/* Check-In */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
            Check-In Date
          </label>
          <input
            type="date"
            value={checkIn}
            min={getTodayString(0)}
            onChange={(e) => {
              setCheckIn(e.target.value);
              // Ensure check-out is at least the next day
              if (new Date(e.target.value) >= new Date(checkOut)) {
                const nextDay = new Date(e.target.value);
                nextDay.setDate(nextDay.getDate() + 1);
                setCheckOut(nextDay.toISOString().split("T")[0]);
              }
            }}
            className="w-full bg-cream border border-border-custom p-3 text-sm focus:border-gold focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Check-Out */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
            Check-Out Date
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn ? getTodayString(1) : getTodayString(1)}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-cream border border-border-custom p-3 text-sm focus:border-gold focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Adults */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold flex items-center">
            <Users className="w-3.5 h-3.5 mr-2 text-primary" />
            Adults
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full bg-cream border border-border-custom p-3 text-sm focus:border-gold focus:outline-none transition-colors"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </div>

        {/* Children */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold flex items-center">
            <Users className="w-3.5 h-3.5 mr-2 text-primary" />
            Children
          </label>
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full bg-cream border border-border-custom p-3 text-sm focus:border-gold focus:outline-none transition-colors"
          >
            {[0, 1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
        </div>

        {/* Search CTA */}
        <div>
          <Button type="submit" variant="primary" fullWidth size="lg" className="h-[48px]">
            Check Rates
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
