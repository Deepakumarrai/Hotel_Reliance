"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { Sparkles, Calendar, Users, Bed, Info, ShieldCheck, Sun, Moon } from "lucide-react";

interface RoomPriceProps {
  price?: number | null;
  slug?: string;
}

export function RoomPrice({ price, slug }: RoomPriceProps) {
  const { getRoomPrice } = useRoomPricing();
  const activePrice = slug ? getRoomPrice(slug) : price;

  return (
    <div className="bg-white border-2 border-gold/40 p-6 sm:p-7 text-center space-y-4 shadow-xl relative overflow-hidden rounded-sm">
      <div className="border-b border-border-custom pb-3">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold block">
          OFFICIAL ALL-INCLUSIVE TARIFF
        </span>
        <div className="mt-2">
          <div className="text-3xl sm:text-4xl font-serif text-primary font-bold">
            {activePrice ? `${formatPrice(activePrice)}` : "Price on request"}
            <span className="text-xs font-sans font-normal text-muted ml-1">/ night</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            ✓ Final Payable Price • No Hidden Fees
          </span>
        </div>
      </div>

      <div className="pt-2 space-y-2 text-center text-xs text-muted">
        <p className="font-light text-[11px] leading-relaxed">
          Includes high-speed Wi-Fi, air conditioning, LED TV, daily housekeeping, and 24/7 in-room dining service.
        </p>
        <div className="pt-2 border-t border-border-custom/60 flex items-center justify-center space-x-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Best Direct Booking Rate Guarantee</span>
        </div>
      </div>
    </div>
  );
}
