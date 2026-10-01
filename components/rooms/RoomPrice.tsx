"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface RoomPriceProps {
  price?: number | null;
  slug?: string;
}

export function RoomPrice({ price, slug }: RoomPriceProps) {
  const { getRoomPrice } = useRoomPricing();
  const activePrice = slug ? getRoomPrice(slug) : price;

  return (
    <div className="bg-[#FAF8F5] border border-[#E8DFD2] rounded-2xl p-4 sm:p-4.5 text-center space-y-2 relative overflow-hidden">
      {/* Decorative Gold Accent */}
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-white border border-[#BA8B32]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#BA8B32] shadow-2xs">
        <Sparkles className="w-3 h-3 text-[#BA8B32]" />
        <span>Direct Booking Privilege Rate</span>
      </div>

      {/* Main Tariff Display */}
      <div>
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-2xl sm:text-3xl font-serif text-[#2B2320] font-bold tracking-tight">
            {activePrice && activePrice > 0 ? formatPrice(activePrice) : "Price on Request"}
          </span>
          <span className="text-xs font-sans font-medium text-stone-500 lowercase">
            / night
          </span>
        </div>
        <div className="flex items-center justify-center space-x-1.5 text-emerald-700 text-[11px] font-semibold mt-0.5">
          <CheckCircle2 className="w-3 h-3" />
          <span>All Taxes Included • Zero Hidden Service Fees</span>
        </div>
      </div>

      {/* Trust Guarantee Note */}
      <div className="pt-1.5 border-t border-[#E8DFD2]/80 flex items-center justify-center space-x-1 text-[10.5px] font-medium text-stone-600">
        <ShieldCheck className="w-3 h-3 text-[#BA8B32]" />
        <span>Official Hotel Direct Rate Guarantee</span>
      </div>
    </div>
  );
}
