import React from "react";
import { formatPrice } from "@/lib/utils";

interface RoomPriceProps {
  price: number | null;
}

export function RoomPrice({ price }: RoomPriceProps) {
  return (
    <div className="bg-cream border border-border-custom p-6 text-center space-y-2">
      <span className="text-[10px] uppercase tracking-widest font-bold text-muted block">
        Estimated Tariff
      </span>
      <div className="text-2xl sm:text-3xl font-serif text-primary font-medium">
        {price ? `${formatPrice(price)} / Night` : "Price on request"}
      </div>
      <span className="text-[9px] text-muted italic block">
        *Excluding local GST. Holiday seasons subject to surcharge.
      </span>
    </div>
  );
}
