import React from "react";
import { Users, ChevronDown } from "lucide-react";

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
  errors,
}: GuestSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 border border-stone-200/90 p-4 sm:p-5 rounded-2xl shadow-[0_2px_12px_rgba(17,30,49,0.03)]">
      {/* Adults Selector */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
          <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
            <Users className="w-3.5 h-3.5" />
          </span>
          Adults (12+ yrs)
        </label>
        <div className="relative">
          <select
            value={adults}
            onChange={(e) => onChange("adults", Number(e.target.value))}
            className="w-full appearance-none bg-white border border-stone-200 p-3 sm:p-3.5 pr-10 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:border-stone-300"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors?.adults && (
          <span className="text-[11px] text-red-600 font-sans font-medium block">
            {errors.adults}
          </span>
        )}
      </div>

      {/* Children Selector */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
          <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
            <Users className="w-3.5 h-3.5" />
          </span>
          Children (0-11 yrs)
        </label>
        <div className="relative">
          <select
            value={children}
            onChange={(e) => onChange("children", Number(e.target.value))}
            className="w-full appearance-none bg-white border border-stone-200 p-3 sm:p-3.5 pr-10 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:border-stone-300"
          >
            {[0, 1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

