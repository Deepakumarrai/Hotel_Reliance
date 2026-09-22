"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface RoomPriceRules {
  base: number;
  baseNetPrice: number;
  gstRate: number;
  gstAmount: number;
  weekend: number;
  peak: number;
  extraAdult: number;
  extraBed: number;
}

export type PricingMap = Record<string, RoomPriceRules>;

const defaultPricing: PricingMap = {
  single: { base: 2310, baseNetPrice: 2200, gstRate: 5, gstAmount: 110, weekend: 2310, peak: 2310, extraAdult: 0, extraBed: 300 },
  double: { base: 2625, baseNetPrice: 2500, gstRate: 5, gstAmount: 125, weekend: 2625, peak: 2625, extraAdult: 0, extraBed: 300 },
  triple: { base: 3360, baseNetPrice: 3200, gstRate: 5, gstAmount: 160, weekend: 3360, peak: 3360, extraAdult: 0, extraBed: 300 },
  family: { base: 3360, baseNetPrice: 3200, gstRate: 5, gstAmount: 160, weekend: 3360, peak: 3360, extraAdult: 0, extraBed: 300 },
};

export const MAP_PLAN_PRICE = 735;
export const MAP_PLAN_BASE = 700;
export const MAP_PLAN_GST = 35;
export const MARRIAGE_COST = 225000;

export function getRoomPrice(slug: string): number {
  const key = slug?.toLowerCase().replace("-room", "").replace("-occupancy", "").replace("-suite", "") || "single";
  if (key === "single" || key === "deluxe") return 2310;
  if (key === "double" || key === "executive") return 2625;
  if (key === "triple" || key === "premium" || key === "family") return 3360;
  return defaultPricing[key]?.base || 2310;
}

export function getRoomBasePrice(slug: string): { final: number; base: number; gst: number; gstRate: number } {
  const key = slug?.toLowerCase().replace("-room", "").replace("-occupancy", "").replace("-suite", "") || "single";
  if (key === "single" || key === "deluxe") return { final: 2310, base: 2200, gst: 110, gstRate: 5 };
  if (key === "double" || key === "executive") return { final: 2625, base: 2500, gst: 125, gstRate: 5 };
  if (key === "triple" || key === "premium" || key === "family") return { final: 3360, base: 3200, gst: 160, gstRate: 5 };
  return { final: 2310, base: 2200, gst: 110, gstRate: 5 };
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
    children?: number,
    includeMapPlan?: boolean
  ) => {
    nights: number;
    nightlyPrice: number;
    baseAmount: number;
    taxAmount: number;
    taxRate: number;
    mapPlanAmount: number;
    extraGuestAmount: number;
    totalAmount: number;
  };
}>({
  prices: defaultPricing,
  getRoomPrice: (slug) => getRoomPrice(slug),
  getRoomRules: (slug) => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-occupancy", "").replace("-suite", "") || "single";
    return defaultPricing[key] || defaultPricing.single;
  },
  calculateStayTotal: (slug, checkIn, checkOut, adults = 2, children = 0, includeMapPlan = false) => {
    const price = getRoomPrice(slug);
    const mapAmount = includeMapPlan ? MAP_PLAN_PRICE : 0;
    return {
      nights: 1,
      nightlyPrice: price,
      baseAmount: price,
      taxAmount: 0,
      taxRate: 0,
      mapPlanAmount: mapAmount,
      extraGuestAmount: 0,
      totalAmount: price + mapAmount,
    };
  },
});

export function RoomPricingProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PricingMap>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hr_room_pricing_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && (parsed.single?.base === 2310 || parsed.single?.baseNetPrice === 2200)) {
            return parsed;
          }
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
        if (data?.prices && (data.prices.single?.base === 2310 || data.prices.single?.baseNetPrice === 2200)) {
          setPrices(data.prices);
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("hr_room_pricing_v2", JSON.stringify(data.prices));
            }
          } catch {}
        }
      }
    } catch {
      // Fallback silently
    }
  };

  useEffect(() => {
    // Clear out any old legacy pricing in client localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hr_room_pricing");
      }
    } catch {}

    // Initial fetch
    fetchPricing();

    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem("hr_room_pricing_v2");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.single?.base === 2310 || parsed.single?.baseNetPrice === 2200)) {
            setPrices(parsed);
          }
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

  const getRoomPriceMethod = (slug: string): number => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-occupancy", "").replace("-suite", "") || "single";
    if (key === "single" || key === "deluxe") return 2310;
    if (key === "double" || key === "executive") return 2625;
    if (key === "triple" || key === "premium" || key === "family") return 3360;
    return prices[key]?.base || defaultPricing[key]?.base || 2310;
  };

  const getRoomRules = (slug: string): RoomPriceRules => {
    const key = slug?.toLowerCase().replace("-room", "").replace("-occupancy", "").replace("-suite", "") || "single";
    return prices[key] || defaultPricing[key] || defaultPricing.single;
  };

  const calculateStayTotal = (
    slug: string,
    checkIn: string,
    checkOut: string,
    adults = 2,
    children = 0,
    includeMapPlan = false
  ) => {
    const rules = getRoomRules(slug);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Exact single final price per room type * nights
    const nightlyPrice = rules.base || getRoomPrice(slug);
    const baseAmount = Math.round(nightlyPrice * nights * 100) / 100;
    const mapPlanAmount = includeMapPlan ? MAP_PLAN_PRICE * nights : 0;
    const totalAmount = Math.round((baseAmount + mapPlanAmount) * 100) / 100;

    return {
      nights,
      nightlyPrice,
      baseAmount,
      taxAmount: 0,
      taxRate: 0,
      mapPlanAmount,
      extraGuestAmount: 0,
      totalAmount,
    };
  };

  return (
    <RoomPricingContext.Provider
      value={{
        prices,
        getRoomPrice: getRoomPriceMethod,
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

