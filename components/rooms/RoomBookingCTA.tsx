"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RoomBookingCTAProps {
  roomId: string;
  roomSlug: string;
}

export function RoomBookingCTA({ roomId, roomSlug }: RoomBookingCTAProps) {
  const router = useRouter();

  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayString(0));
  const [checkOut, setCheckOut] = useState(getTodayString(1));
  const [adults, setAdults] = useState(2);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      room: roomSlug,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: "0"
    }).toString();

    router.push(`/booking?${query}`);
  };

  return (
    <div className="bg-white border border-border-custom p-6 shadow-md space-y-6">
      <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
        Book This Room
      </h3>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Check In */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-muted font-bold block">
            Check-In Date
          </label>
          <div className="relative">
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
              className="w-full bg-cream border border-border-custom p-2.5 text-xs focus:border-gold focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-muted font-bold block">
            Check-Out Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={checkOut}
              min={checkIn ? getTodayString(1) : getTodayString(1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-cream border border-border-custom p-2.5 text-xs focus:border-gold focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Guests count */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-muted font-bold block">
            Adults
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full bg-cream border border-border-custom p-2.5 text-xs focus:border-gold focus:outline-none"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="primary" fullWidth className="pt-3 pb-3">
          Check Rates & Book
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
