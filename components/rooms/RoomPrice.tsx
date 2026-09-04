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
  const { getRoomPrice, getRoomRules } = useRoomPricing();
  const rules = slug ? getRoomRules(slug) : null;
  const activePrice = slug ? getRoomPrice(slug) : price;

  return (
    <div className="bg-white border-2 border-gold/40 p-6 sm:p-7 text-center space-y-4 shadow-xl relative overflow-hidden rounded-sm">
      <div className="border-b border-border-custom pb-3">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold block">
          OFFICIAL TARIFF & RATE RULES
        </span>
        <div className="mt-1">
          <span className="text-xs text-muted font-medium block">Starting from</span>
          <div className="text-3xl sm:text-4xl font-serif text-primary font-bold">
            {activePrice ? `${formatPrice(activePrice)}` : "Price on request"}
            <span className="text-xs font-sans font-normal text-muted ml-1">/ night</span>
          </div>
        </div>
      </div>

      {rules && (
        <div className="space-y-3 text-left text-xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted flex items-center justify-between">
            <span>Dynamic Rate Structure</span>
            <span className="text-emerald-700 font-bold">Live Admin Sync</span>
          </div>

          <div className="grid grid-cols-1 gap-2 bg-cream/70 p-3.5 rounded border border-border-custom font-medium">
            {/* Weekday Base */}
            <div className="flex items-center justify-between py-1 border-b border-border-custom/50 text-dark">
              <span className="flex items-center text-muted">
                <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Weekday Base (Mon-Thu):
              </span>
              <span className="font-bold text-primary">{formatPrice(rules.base)} / nt</span>
            </div>

            {/* Weekend Surge */}
            <div className="flex items-center justify-between py-1 border-b border-border-custom/50 text-dark">
              <span className="flex items-center text-muted">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#C4984F]" /> Weekend Tariff (Fri-Sun):
              </span>
              <span className="font-bold text-primary">{formatPrice(rules.weekend)} / nt</span>
            </div>

            {/* Peak Holiday Season */}
            <div className="flex items-center justify-between py-1 border-b border-border-custom/50 text-dark bg-gold/10 -mx-3.5 px-3.5">
              <span className="flex items-center text-[#9E712E] font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C4984F]" /> Peak Holiday / Festive:
              </span>
              <span className="font-bold text-[#9E712E]">{formatPrice(rules.peak)} / nt</span>
            </div>

            {/* Extra Adult Surcharge */}
            <div className="flex items-center justify-between py-1 border-b border-border-custom/50 text-dark">
              <span className="flex items-center text-muted">
                <Users className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Extra Adult Surcharge:
              </span>
              <span className="font-bold text-primary">+{formatPrice(rules.extraAdult)} / person / nt</span>
            </div>

            {/* Extra Bed Surcharge */}
            <div className="flex items-center justify-between py-1 text-dark">
              <span className="flex items-center text-muted">
                <Bed className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Extra Bed (Optional):
              </span>
              <span className="font-bold text-primary">+{formatPrice(rules.extraBed)} / bed</span>
            </div>
          </div>
        </div>
      )}

      {/* Tax Slab Notice */}
      <div className="p-2.5 bg-[#0B1423] text-white rounded text-[10px] space-y-1 text-left">
        <div className="flex items-center space-x-1.5 text-[#D8B875] font-bold uppercase tracking-wider">
          <Info className="w-3 h-3" />
          <span>GST Slab Configuration</span>
        </div>
        <p className="text-[#E9DFD2]/70 leading-relaxed font-light">
          Tariffs $\le$ ₹7,500 apply 12% GST. Tariffs &gt; ₹7,500 apply 18% GST (Calculated automatically at checkout).
        </p>
      </div>

      <div className="pt-2 border-t border-border-custom/60 space-y-1 text-center">
        <span className="text-[10px] text-muted block font-light">
          Free High-Speed Wi-Fi, AC Climate Control & 24/7 Room Service included.
        </span>
        <span className="text-[9px] text-emerald-700 font-semibold block flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Best Direct Booking Rate Guarantee</span>
        </span>
      </div>
    </div>
  );
}
