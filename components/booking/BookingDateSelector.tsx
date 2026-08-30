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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white border border-border-custom p-6 shadow-sm">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          Arrival Date (Check-In)
        </label>
        <input
          type="date"
          value={checkIn}
          min={getTodayString(0)}
          onChange={(e) => onChange("checkIn", e.target.value)}
          className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
            errors?.checkIn ? "border-primary" : "border-border-custom"
          }`}
          required
        />
        {errors?.checkIn && (
          <span className="text-[10px] text-primary block mt-1">{errors.checkIn}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          Departure Date (Check-Out)
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || getTodayString(1)}
          onChange={(e) => onChange("checkOut", e.target.value)}
          className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
            errors?.checkOut ? "border-primary" : "border-border-custom"
          }`}
          required
        />
        {errors?.checkOut && (
          <span className="text-[10px] text-primary block mt-1">{errors.checkOut}</span>
        )}
      </div>
    </div>
  );
}
