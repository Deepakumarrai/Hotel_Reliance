"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, ShieldCheck, PhoneCall, MessageCircle, Clock, Sparkles } from "lucide-react";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { formatPrice } from "@/lib/utils";

interface RoomBookingCTAProps {
  roomId: string;
  roomSlug: string;
  price?: number | null;
}

export function RoomBookingCTA({ roomId, roomSlug, price }: RoomBookingCTAProps) {
  const router = useRouter();
  const { getRoomPrice } = useRoomPricing();
  const activePrice = getRoomPrice(roomSlug, price);

  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayString(0));
  const [checkOut, setCheckOut] = useState(getTodayString(1));
  const [adults, setAdults] = useState(2);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  const estimatedTotal = useMemo(() => {
    if (!activePrice || activePrice <= 0) return null;
    return activePrice * nights;
  }, [activePrice, nights]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      room: roomSlug,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: "0",
    }).toString();

    router.push(`/booking?${query}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E8DFD2] pb-2.5">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-semibold text-[#2B2320]">
            Reserve Your Dates
          </h3>
          <p className="text-[10.5px] text-stone-500 font-light">
            Best direct rate guaranteed online
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          Instant Confirm
        </span>
      </div>

      <form onSubmit={handleBooking} className="space-y-3">
        {/* Date Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Check In */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-600 font-bold flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#BA8B32]" />
              <span>Check-In</span>
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
              className="w-full bg-[#FAF8F5] border border-[#E8DFD2] focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/20 rounded-xl px-3 py-2.5 text-xs text-[#2B2320] font-medium outline-none transition-all"
              required
            />
          </div>

          {/* Check Out */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-600 font-bold flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#BA8B32]" />
              <span>Check-Out</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || getTodayString(1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8DFD2] focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/20 rounded-xl px-3 py-2.5 text-xs text-[#2B2320] font-medium outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Guests Count */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-stone-600 font-bold flex items-center space-x-1">
            <Users className="w-3 h-3 text-[#BA8B32]" />
            <span>Guests (Adults)</span>
          </label>
          <div className="relative">
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#E8DFD2] focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/20 rounded-xl px-3 py-2.5 text-xs text-[#2B2320] font-medium outline-none transition-all appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest (Adult)" : "Guests (Adults)"}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Stay Summary / Estimation Badge */}
        <div className="bg-[#FAF8F5] border border-[#E8DFD2] rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-stone-600">
            <Clock className="w-3.5 h-3.5 text-[#BA8B32]" />
            <span>Duration: <strong className="text-[#2B2320]">{nights} {nights === 1 ? "Night" : "Nights"}</strong></span>
          </div>
          {estimatedTotal ? (
            <div className="text-right">
              <span className="text-[10px] text-stone-500 block">Est. Subtotal</span>
              <span className="font-serif font-bold text-sm text-[#2B2320]">{formatPrice(estimatedTotal)}</span>
            </div>
          ) : (
            <span className="text-[11px] text-[#BA8B32] font-semibold">Taxes Included</span>
          )}
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl font-sans font-bold text-xs uppercase tracking-widest bg-[#2B2320] hover:bg-[#BA8B32] text-white transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer touch-press"
        >
          <span>Continue to Reservation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Direct Front Desk & WhatsApp Concierge */}
      <div className="pt-2 border-t border-[#E8DFD2] space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block text-center">
          Need Help or Custom Arrangement?
        </span>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="tel:+919470591800"
            className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl border border-[#E8DFD2] bg-white hover:bg-[#FAF8F5] text-stone-700 hover:text-[#BA8B32] transition-colors text-[11px] font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#BA8B32]" />
            <span className="truncate">Call Front Desk</span>
          </a>
          <a
            href="https://wa.me/919470591800?text=Hello%2C%20I%20am%20interested%20in%20booking%20the%20room%20at%20Hotel%20Reliance."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 transition-colors text-[11px] font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Trust Badges List */}
      <div className="space-y-1.5 pt-1 text-[11px] text-stone-500 font-light">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Free cancellation up to 24 hours prior to check-in</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" />
          <span>Pay at hotel or secure online payment options available</span>
        </div>
      </div>
    </div>
  );
}
