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

export const DEFAULT_PRICING: PricingMap = {
  deluxe: { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
  executive: { base: 3499, weekend: 3899, peak: 4299, extraAdult: 800, extraBed: 1000 },
  premium: { base: 4999, weekend: 5499, peak: 6199, extraAdult: 1000, extraBed: 1200 },
  family: { base: 5999, weekend: 6599, peak: 7499, extraAdult: 1000, extraBed: 1200 },
  single: { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
  double: { base: 3499, weekend: 3899, peak: 4299, extraAdult: 800, extraBed: 1000 },
  triple: { base: 4999, weekend: 5499, peak: 6199, extraAdult: 1000, extraBed: 1200 },
};

/**
 * Finds room pricing rules for a given room slug, intelligently resolving
 * exact slug matches, stripped slugs, and cross-reference fallbacks.
 */
export function findRulesForSlug(prices: PricingMap, slug: string): RoomPriceRules | null {
  if (!slug) return null;
  const targetMap = prices && typeof prices === "object" && Object.keys(prices).length > 0 ? prices : DEFAULT_PRICING;

  const s = slug.toLowerCase().trim();
  const stripped = s.replace(/-room$/, "").replace(/-suite$/, "");
  const withRoom = stripped + "-room";

  if (targetMap[s]?.base) return targetMap[s];
  if (targetMap[stripped]?.base) return targetMap[stripped];
  if (targetMap[withRoom]?.base) return targetMap[withRoom];

  // Cross-reference fallbacks between legacy catalog slugs & database room slugs
  if ((s === "single" || s === "single-room") && targetMap["deluxe"]?.base) return targetMap["deluxe"];
  if ((s === "double" || s === "double-room") && targetMap["executive"]?.base) return targetMap["executive"];
  if ((s === "triple" || s === "triple-room") && (targetMap["premium"]?.base || targetMap["family"]?.base)) {
    return targetMap["premium"] || targetMap["family"];
  }
  if (s === "deluxe" && (targetMap["single"]?.base || targetMap["single-room"]?.base)) {
    return targetMap["single"] || targetMap["single-room"];
  }
  if (s === "executive" && (targetMap["double"]?.base || targetMap["double-room"]?.base)) {
    return targetMap["double"] || targetMap["double-room"];
  }
  if ((s === "premium" || s === "family") && (targetMap["triple"]?.base || targetMap["triple-room"]?.base)) {
    return targetMap["triple"] || targetMap["triple-room"];
  }

  // Check DEFAULT_PRICING if targetMap was a custom object that missed this slug
  if (targetMap !== DEFAULT_PRICING) {
    return findRulesForSlug(DEFAULT_PRICING, slug);
  }

  // Fallback to first available pricing rule if any exist
  const keys = Object.keys(targetMap);
  if (keys.length > 0 && targetMap[keys[0]]?.base) {
    return targetMap[keys[0]];
  }

  return null;
}

/**
 * Standalone helper — reads cached pricing from localStorage or DEFAULT_PRICING.
 */
export function getRoomPrice(slug: string, fallbackPrice?: number | null): number {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("hr_room_pricing");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          const rules = findRulesForSlug(parsed, slug);
          if (rules && Number(rules.base) > 0) return Number(rules.base);
        }
      }
    } catch {}
  }
  const defaultRules = findRulesForSlug(DEFAULT_PRICING, slug);
  if (defaultRules && Number(defaultRules.base) > 0) return Number(defaultRules.base);
  if (typeof fallbackPrice === "number" && fallbackPrice > 0) return fallbackPrice;
  return 0;
}

const RoomPricingContext = createContext<{
  prices: PricingMap;
  loading: boolean;
  getRoomPrice: (slug: string, fallbackPrice?: number | null) => number;
  getRoomRules: (slug: string, fallbackPrice?: number | null) => RoomPriceRules;
  calculateStayTotal: (
    slug: string,
    checkIn: string,
    checkOut: string,
    adults?: number,
    children?: number,
    fallbackPrice?: number | null
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
  prices: DEFAULT_PRICING,
  loading: true,
  getRoomPrice: (slug, fallback) => getRoomPrice(slug, fallback),
  getRoomRules: (slug, fallback) => findRulesForSlug(DEFAULT_PRICING, slug) || { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
  calculateStayTotal: (slug) => {
    const rules = findRulesForSlug(DEFAULT_PRICING, slug) || DEFAULT_PRICING.single;
    return {
      nights: 1,
      nightlyPrice: rules.base,
      baseAmount: rules.base,
      taxAmount: 0,
      taxRate: 0,
      extraGuestAmount: 0,
      totalAmount: rules.base,
    };
  },
});

export function RoomPricingProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PricingMap>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hr_room_pricing");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            return { ...DEFAULT_PRICING, ...parsed };
          }
        }
      } catch {}
    }
    return DEFAULT_PRICING;
  });
  const [loading, setLoading] = useState(true);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.prices && typeof data.prices === "object" && Object.keys(data.prices).length > 0) {
          const merged = { ...DEFAULT_PRICING, ...data.prices };
          setPrices(merged);
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("hr_room_pricing", JSON.stringify(merged));
            }
          } catch {}
        }
      }
    } catch {
      // Use cached prices silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();

    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem("hr_room_pricing");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Object.keys(parsed).length > 0) {
            setPrices((prev) => ({ ...prev, ...parsed }));
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

  const getRoomPriceFromState = (slug: string, fallbackPrice?: number | null): number => {
    const rules = findRulesForSlug(prices, slug);
    if (rules && Number(rules.base) > 0) return Number(rules.base);
    if (typeof fallbackPrice === "number" && fallbackPrice > 0) return fallbackPrice;
    return 0;
  };

  const getRoomRules = (slug: string, fallbackPrice?: number | null): RoomPriceRules => {
    const rules = findRulesForSlug(prices, slug);
    if (rules && Number(rules.base) > 0) return rules;

    const base = typeof fallbackPrice === "number" && fallbackPrice > 0 ? fallbackPrice : 2499;
    return {
      base,
      weekend: Math.round(base * 1.15),
      peak: Math.round(base * 1.35),
      extraAdult: 800,
      extraBed: 1000,
    };
  };

  const calculateStayTotal = (
    slug: string,
    checkIn: string,
    checkOut: string,
    adults = 2,
    children = 0,
    fallbackPrice?: number | null
  ) => {
    const rules = getRoomRules(slug, fallbackPrice);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

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
        loading,
        getRoomPrice: getRoomPriceFromState,
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
