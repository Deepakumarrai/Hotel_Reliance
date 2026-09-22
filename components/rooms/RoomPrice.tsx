"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing, getRoomBasePrice, MAP_PLAN_PRICE, MAP_PLAN_BASE } from "@/hooks/useRoomPricing";
import { ShieldCheck, Utensils, Sparkles, CheckCircle2 } from "lucide-react";

interface RoomPriceProps {
  price?: number | null;
  slug?: string;
}

export function RoomPrice({ price, slug }: RoomPriceProps) {
  const { getRoomPrice } = useRoomPricing();
  const roomSlug = slug || "single";
  const activePrice = getRoomPrice(roomSlug) || price || 2310;
  const priceDetails = getRoomBasePrice(roomSlug);

  return (
    <div className="space-y-4">
      {/* Main Room Price Card */}
      <div className="bg-white border-2 border-[#BA8B32]/50 p-6 sm:p-7 text-center space-y-3 shadow-xl relative overflow-hidden rounded-xs">
        <div className="border-b border-[#E8DFD2] pb-3.5">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#BA8B32] block">
            OFFICIAL ROOM TARIFF
          </span>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-3xl sm:text-4xl font-serif text-[#2B2320] font-extrabold tracking-tight">
                {formatPrice(activePrice)}
              </span>
              <span className="text-xs font-sans font-normal text-[#5C4F46]">/ night</span>
            </div>
            <p className="text-xs font-sans font-medium text-[#7A6B61]">
              ₹{priceDetails.base.toLocaleString("en-IN")}/- + 5% GST = {formatPrice(activePrice)}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold block pt-1">
              ✓ All-Inclusive Final Room Rate
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-2 text-center text-xs text-[#5C4F46]">
          <p className="font-light text-[11.5px] leading-relaxed">
            Includes high-speed Wi-Fi, air conditioning, LED TV, daily housekeeping, and 24/7 dedicated in-room dining.
          </p>
          <div className="pt-2 border-t border-[#E8DFD2] flex items-center justify-center space-x-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Best Direct Booking Rate Guarantee</span>
          </div>
        </div>
      </div>

      {/* Map Plan Add-On Option Display (Requirement 4) */}
      <div className="bg-[#FAF8F5] border border-[#BA8B32]/40 p-4 rounded-xs text-left space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-[#BA8B32]" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-wide text-[#2B2320]">
              Map Plan Add-On
            </h4>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-[#BA8B32]/15 text-[#8C6418] px-2 py-0.5 rounded-xs">
            Optional Add-On
          </span>
        </div>

        <div className="flex items-baseline space-x-2 pt-0.5">
          <span className="text-xl font-serif font-bold text-[#2B2320]">
            ₹{MAP_PLAN_PRICE}/-
          </span>
          <span className="text-xs text-[#7A6B61]">
            ₹{MAP_PLAN_BASE}/- + 5% GST
          </span>
        </div>

        <p className="text-[11px] text-[#5C4F46] leading-relaxed font-light">
          Includes comprehensive breakfast and dinner (Modified American Plan). You can choose to add this option during checkout.
        </p>
      </div>
    </div>
  );
}

