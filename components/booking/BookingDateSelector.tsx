import React from "react";
import { Calendar } from "lucide-react";

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
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 border border-stone-200/90 p-4 sm:p-5 rounded-2xl shadow-[0_2px_12px_rgba(17,30,49,0.03)]">
      {/* Check-in Date */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
          <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
            <Calendar className="w-3.5 h-3.5" />
          </span>
          Check-In Date
        </label>
        <input
          type="date"
          value={checkIn}
          min={getTodayString(0)}
          onChange={(e) => onChange("checkIn", e.target.value)}
          className={`w-full bg-white border p-3 sm:p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer ${
            errors?.checkIn
              ? "border-red-400 ring-2 ring-red-100"
              : "border-stone-200 hover:border-stone-300"
          }`}
          required
        />
        {errors?.checkIn && (
          <span className="text-[11px] text-red-600 font-sans font-medium block">
            {errors.checkIn}
          </span>
        )}
      </div>

      {/* Check-out Date */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
          <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
            <Calendar className="w-3.5 h-3.5" />
          </span>
          Check-Out Date
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || getTodayString(1)}
          onChange={(e) => onChange("checkOut", e.target.value)}
          className={`w-full bg-white border p-3 sm:p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer ${
            errors?.checkOut
              ? "border-red-400 ring-2 ring-red-100"
              : "border-stone-200 hover:border-stone-300"
          }`}
          required
        />
        {errors?.checkOut && (
          <span className="text-[11px] text-red-600 font-sans font-medium block">
            {errors.checkOut}
          </span>
        )}
      </div>
    </div>
  );
}

