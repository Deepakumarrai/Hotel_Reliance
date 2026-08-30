import React from "react";
import { Users } from "lucide-react";

interface GuestSelectorProps {
  adults: number;
  children: number;
  onChange: (field: "adults" | "children", value: number) => void;
  errors?: Record<string, string>;
}

export function GuestSelector({
  adults,
  children,
  onChange,
  errors
}: GuestSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white border border-border-custom p-6 shadow-sm">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center">
          <Users className="w-4 h-4 mr-2 text-primary" />
          Adults (12+ years)
        </label>
        <select
          value={adults}
          onChange={(e) => onChange("adults", Number(e.target.value))}
          className="w-full bg-cream border border-border-custom p-3 text-xs focus:border-gold focus:outline-none"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Adult" : "Adults"}
            </option>
          ))}
        </select>
        {errors?.adults && (
          <span className="text-[10px] text-primary block mt-1">{errors.adults}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center">
          <Users className="w-4 h-4 mr-2 text-primary" />
          Children (0-11 years)
        </label>
        <select
          value={children}
          onChange={(e) => onChange("children", Number(e.target.value))}
          className="w-full bg-cream border border-border-custom p-3 text-xs focus:border-gold focus:outline-none"
        >
          {[0, 1, 2, 3].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Child" : "Children"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
