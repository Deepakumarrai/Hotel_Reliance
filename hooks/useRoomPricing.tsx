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
  deluxe: { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
  executive: { base: 3499, weekend: 3899, peak: 4299, extraAdult: 800, extraBed: 1000 },
  premium: { base: 4999, weekend: 5499, peak: 6199, extraAdult: 1000, extraBed: 1200 },
  family: { base: 5999, weekend: 6599, peak: 7499, extraAdult: 1000, extraBed: 1200 },
};

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
    baseAmount: number;
    taxAmount: number;
    taxRate: number;
    extraGuestAmount: number;
    totalAmount: number;
  };
}>({
  prices: defaultPricing,
  getRoomPrice: (slug) => defaultPricing[slug]?.base || 2499,
  getRoomRules: (slug) => defaultPricing[slug] || defaultPricing.deluxe,
  calculateStayTotal: () => ({
    nights: 1,
    baseAmount: 2499,
    taxAmount: 299.88,
    taxRate: 12,
    extraGuestAmount: 0,
    totalAmount: 2798.88,
  }),
});

export function RoomPricingProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PricingMap>(defaultPricing);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.prices) {
          setPrices(data.prices);
        }
      }
    } catch (e) {
      // Fallback silently to default
    }
  };

  useEffect(() => {
    fetchPricing();

    const handleUpdate = () => {
      fetchPricing();
    };

    window.addEventListener("room-pricing-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("room-pricing-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const getRoomPrice = (slug: string): number => {
    const key = slug.toLowerCase().replace("-room", "").replace("-suite", "");
    return prices[key]?.base || defaultPricing[key]?.base || 2499;
  };

  const getRoomRules = (slug: string): RoomPriceRules => {
    const key = slug.toLowerCase().replace("-room", "").replace("-suite", "");
    return prices[key] || defaultPricing[key] || defaultPricing.deluxe;
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

    let roomBaseTotal = 0;

    for (let i = 0; i < nights; i++) {
      const currentNight = new Date(start.getTime() + i * 86400000);
      const dayOfWeek = currentNight.getDay();
      // Friday (5), Saturday (6), Sunday (0) are Weekend Surge rates
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
      roomBaseTotal += isWeekend ? rules.weekend : rules.base;
    }

    // Extra adult surcharge (standard base includes 2 adults)
    const extraAdults = Math.max(0, adults - 2);
    const extraGuestAmount = extraAdults * rules.extraAdult * nights;

    const baseAmount = roomBaseTotal + extraGuestAmount;

    // Indian Hospitality GST Slab Rule:
    // Tariffs <= ₹7,500/night apply 12% GST
    // Tariffs > ₹7,500 apply 18% GST
    const perNightAverage = baseAmount / nights;
    const taxRate = perNightAverage > 7500 ? 18 : 12;
    const taxAmount = Math.round((baseAmount * (taxRate / 100)) * 100) / 100;
    const totalAmount = Math.round((baseAmount + taxAmount) * 100) / 100;

    return {
      nights,
      baseAmount,
      taxAmount,
      taxRate,
      extraGuestAmount,
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
