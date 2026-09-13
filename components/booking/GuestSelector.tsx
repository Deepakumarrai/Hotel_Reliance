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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#E8DFD2] p-4 sm:p-5 shadow-xs">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold flex items-center">
          <Users className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
          Adults (12+ years)
        </label>
        <select
          value={adults}
          onChange={(e) => onChange("adults", Number(e.target.value))}
          className="w-full bg-[#FAF8F5] border border-[#E8DFD2] p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none rounded-xs"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Adult" : "Adults"}
            </option>
          ))}
        </select>
        {errors?.adults && (
          <span className="text-xs text-red-600 font-medium block mt-1">{errors.adults}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold flex items-center">
          <Users className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
          Children (0-11 years)
        </label>
        <select
          value={children}
          onChange={(e) => onChange("children", Number(e.target.value))}
          className="w-full bg-[#FAF8F5] border border-[#E8DFD2] p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none rounded-xs"
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
