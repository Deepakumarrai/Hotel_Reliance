"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface RoomPriceRules {
  base: number;
  weekend: number;
  peak: number;
  extraAdult: number;
  extraBed: number;
}

export type PricingMap = Record<string, RoomPriceRules>;

const defaultPricing: PricingMap = {
  single: { base: 2403.32, weekend: 2403.32, peak: 2403.32, extraAdult: 0, extraBed: 300 },
  double: { base: 2731.05, weekend: 2731.05, peak: 2731.05, extraAdult: 0, extraBed: 300 },
  triple: { base: 3495.74, weekend: 3495.74, peak: 3495.74, extraAdult: 0, extraBed: 300 },
  // Backward compatible aliases
  deluxe: { base: 2403.32, weekend: 2403.32, peak: 2403.32, extraAdult: 0, extraBed: 300 },
  executive: { base: 2731.05, weekend: 2731.05, peak: 2731.05, extraAdult: 0, extraBed: 300 },
  premium: { base: 3495.74, weekend: 3495.74, peak: 3495.74, extraAdult: 0, extraBed: 300 },
  family: { base: 3495.74, weekend: 3495.74, peak: 3495.74, extraAdult: 0, extraBed: 300 },
};

export function getRoomPrice(slug: string): number {
  const key = slug?.toLowerCase().replace("-room", "").replace("-suite", "") || "single";
  return defaultPricing[key]?.base || 2403.32;
}


const RoomPricingContext = createContext<{
  prices: PricingMap;
  getRoomPrice: (slug: string) => number;
  getRoomRules: (slug: string) => RoomPriceRules;
  calculateStayTotal: (
    slug: string,
    checkIn: string,
    checkOut: string,
    adults?: number,
    children?: number
  ) => {
    nights: number;
    nightlyPrice: number;
    baseAmount: number;
    taxAmount: number;
    taxRate: number;
    extraGuestAmount: number;
    totalAmount: number;
  };
}>({
  prices: defaultPricing,
  getRoomPrice: (slug) => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-suite", "") || "single";
    return defaultPricing[key]?.base || 2403.32;
  },
  getRoomRules: (slug) => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-suite", "") || "single";
    return defaultPricing[key] || defaultPricing.single;
  },
  calculateStayTotal: () => ({
    nights: 1,
    nightlyPrice: 2403.32,
    baseAmount: 2403.32,
    taxAmount: 0,
    taxRate: 0,
    extraGuestAmount: 0,
    totalAmount: 2403.32,
  }),
});

export function RoomPricingProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PricingMap>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hr_room_pricing");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch {}
    }
    return defaultPricing;
  });

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.prices) {
          setPrices(data.prices);
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("hr_room_pricing", JSON.stringify(data.prices));
            }
          } catch {}
        }
      }
    } catch {
      // Fallback silently
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPricing();

    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem("hr_room_pricing");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed) setPrices(parsed);
        }
      } catch {}
      fetchPricing();
    };

    window.addEventListener("room-pricing-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("room-pricing-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);


  const getRoomPrice = (slug: string): number => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-suite", "") || "single";
    return prices[key]?.base || defaultPricing[key]?.base || 2403.32;
  };

  const getRoomRules = (slug: string): RoomPriceRules => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-suite", "") || "single";
    return prices[key] || defaultPricing[key] || defaultPricing.single;
  };

  const calculateStayTotal = (
    slug: string,
    checkIn: string,
    checkOut: string,
    adults = 2,
    children = 0
  ) => {
    const rules = getRoomRules(slug);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Exact single final price per room type * nights
    const nightlyPrice = rules.base;
    const totalAmount = Math.round(nightlyPrice * nights * 100) / 100;

    return {
      nights,
      nightlyPrice,
      baseAmount: totalAmount,
      taxAmount: 0,
      taxRate: 0,
      extraGuestAmount: 0,
      totalAmount,
    };
  };

  return (
    <RoomPricingContext.Provider
      value={{
        prices,
        getRoomPrice,
        getRoomRules,
        calculateStayTotal,
      }}
    >
      {children}
    </RoomPricingContext.Provider>
  );
}

export function useRoomPricing() {
  return useContext(RoomPricingContext);
}
