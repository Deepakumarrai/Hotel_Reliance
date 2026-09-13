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
  errors
}: BookingDateSelectorProps) {
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#E8DFD2] p-4 sm:p-5 shadow-xs">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
          Arrival Date (Check-In)
        </label>
        <input
          type="date"
          value={checkIn}
          min={getTodayString(0)}
          onChange={(e) => onChange("checkIn", e.target.value)}
          className={`w-full bg-[#FAF8F5] border p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none transition-colors rounded-xs ${
            errors?.checkIn ? "border-red-600 ring-1 ring-red-600" : "border-[#E8DFD2]"
          }`}
          required
        />
        {errors?.checkIn && (
          <span className="text-xs text-red-600 font-medium block mt-1">{errors.checkIn}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
          Departure Date (Check-Out)
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || getTodayString(1)}
          onChange={(e) => onChange("checkOut", e.target.value)}
          className={`w-full bg-[#FAF8F5] border p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none transition-colors rounded-xs ${
            errors?.checkOut ? "border-red-600 ring-1 ring-red-600" : "border-[#E8DFD2]"
          }`}
          required
        />
        {errors?.checkOut && (
          <span className="text-xs text-red-600 font-medium block mt-1">{errors.checkOut}</span>
        )}
      </div>
    </div>
  );
}
