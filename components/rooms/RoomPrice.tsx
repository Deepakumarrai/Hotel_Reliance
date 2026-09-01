import React from "react";
import { formatPrice } from "@/lib/utils";

interface RoomPriceProps {
  price: number | null;
}

export function RoomPrice({ price }: RoomPriceProps) {
  return (
    <div className="bg-white border border-border-custom p-6 text-center space-y-2.5 shadow-sm">
      <span className="text-[10px] uppercase tracking-widest font-bold text-gold block">
        TARIFF ESTIMATE
      </span>
      <div className="space-y-0.5">
        <span className="text-xs text-muted font-medium block">Starting from</span>
        <div className="text-3xl sm:text-4xl font-serif text-primary font-bold">
          {price ? `${formatPrice(price)}` : "Price on request"}
          <span className="text-xs font-sans font-normal text-muted ml-1">/ night</span>
        </div>
      </div>
      <div className="pt-2 border-t border-border-custom/60 space-y-1">
        <span className="text-[10px] text-muted block font-light">
          *Plus applicable taxes. Free Wi-Fi, AC & 24/7 Room Service included.
        </span>
        <span className="text-[9px] text-emerald-700 font-semibold block">
          Best Direct Booking Rate Guarantee
        </span>
      </div>
    </div>
  );
}
