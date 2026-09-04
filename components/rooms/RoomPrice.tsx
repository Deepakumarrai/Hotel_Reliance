"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { Sparkles, Calendar, Users } from "lucide-react";

interface RoomPriceProps {
  price?: number | null;
  slug?: string;
}

export function RoomPrice({ price, slug }: RoomPriceProps) {
  const { getRoomPrice, getRoomRules } = useRoomPricing();
  const rules = slug ? getRoomRules(slug) : null;
  const activePrice = slug ? getRoomPrice(slug) : price;

  return (
    <div className="bg-white border border-border-custom p-6 text-center space-y-3 shadow-sm">
      <span className="text-[10px] uppercase tracking-widest font-bold text-gold block">
        TARIFF ESTIMATE
      </span>
      <div className="space-y-0.5">
        <span className="text-xs text-muted font-medium block">Starting from</span>
        <div className="text-3xl sm:text-4xl font-serif text-primary font-bold">
          {activePrice ? `${formatPrice(activePrice)}` : "Price on request"}
          <span className="text-xs font-sans font-normal text-muted ml-1">/ night</span>
        </div>
      </div>

      {rules && (
        <div className="bg-cream/60 p-3 rounded border border-border-custom text-left text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-muted">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-gold" /> Weekend (Fri-Sun):</span>
            <span className="font-semibold text-dark">{formatPrice(rules.weekend)} / nt</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="flex items-center"><Users className="w-3 h-3 mr-1 text-gold" /> Extra Adult:</span>
            <span className="font-semibold text-dark">{formatPrice(rules.extraAdult)} / person</span>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-border-custom/60 space-y-1">
        <span className="text-[10px] text-muted block font-light">
          *GST applied at checkout (12% standard / 18% luxury). Free Wi-Fi, AC & 24/7 Room Service included.
        </span>
        <span className="text-[9px] text-emerald-700 font-semibold block">
          Best Direct Booking Rate Guarantee
        </span>
      </div>
    </div>
  );
}
