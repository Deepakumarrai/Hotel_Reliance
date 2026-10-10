import React from "react";
import { Calendar, AlertCircle } from "lucide-react";

interface BookingDateSelectorProps {
  checkIn: string;
  checkOut: string;
  onChange: (field: "checkIn" | "checkOut", value: string) => void;
  errors?: Record<string, string>;
}

export function BookingDateSelector({
  checkIn,
  checkOut,
  onChange,
  errors,
}: BookingDateSelectorProps) {
  // Returns local date string in YYYY-MM-DD
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Computes the earliest allowable check-out date: strictly checkIn + 1 day
  const getMinCheckOutDate = (checkInStr: string) => {
    if (!checkInStr) return getTodayString(1);
    const parts = checkInStr.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const d = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    return getTodayString(1);
  };

  const minCheckIn = getTodayString(0);
  const minCheckOut = getMinCheckOutDate(checkIn);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 border border-stone-200/90 p-4 sm:p-5 rounded-2xl shadow-[0_2px_12px_rgba(17,30,49,0.03)]">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              Check-In Date
            </span>
            <span className="text-[10px] text-stone-400 font-normal">From 12:00 PM</span>
          </label>
          <input
            type="date"
            value={checkIn}
            min={minCheckIn}
            onChange={(e) => onChange("checkIn", e.target.value)}
            className={`w-full bg-white border p-3 sm:p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer ${
              errors?.checkIn
                ? "border-red-400 ring-2 ring-red-100 bg-red-50/20"
                : "border-stone-200 hover:border-stone-300"
            }`}
            required
          />
          {errors?.checkIn && (
            <span className="text-[11px] text-red-600 font-sans font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{errors.checkIn}</span>
            </span>
          )}
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              Check-Out Date
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Until 11:00 AM</span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={(e) => onChange("checkOut", e.target.value)}
            className={`w-full bg-white border p-3 sm:p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer ${
              errors?.checkOut
                ? "border-red-400 ring-2 ring-red-100 bg-red-50/20"
                : "border-stone-200 hover:border-stone-300"
            }`}
            required
          />
          {errors?.checkOut && (
            <span className="text-[11px] text-red-600 font-sans font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{errors.checkOut}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
