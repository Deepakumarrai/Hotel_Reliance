"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CircleDollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Save,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface RoomPriceEntry {
  base: number;
  weekend: number;
  peak: number;
  extraAdult: number;
  extraBed: number;
}

export default function AdminPricingPage() {
  const { showToast } = useToast();
  const [prices, setPrices] = useState<Record<string, RoomPriceEntry>>({
    deluxe: { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 },
    executive: { base: 3499, weekend: 3899, peak: 4299, extraAdult: 800, extraBed: 1000 },
    premium: { base: 4999, weekend: 5499, peak: 6199, extraAdult: 1000, extraBed: 1200 },
    family: { base: 5999, weekend: 6599, peak: 7499, extraAdult: 1000, extraBed: 1200 },
  });
  const [saving, setSaving] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.prices) setPrices(data.prices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (roomType: string, field: keyof RoomPriceEntry, val: number) => {
    setPrices((prev) => ({
      ...prev,
      [roomType]: {
        ...prev[roomType],
        [field]: val,
      },
    }));
  };

  const handleSave = async (roomType: string) => {
    setSaving(roomType);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType,
          ...prices[roomType],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Tariff rules for ${roomType.toUpperCase()} saved & synced to website!`, "success");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("room-pricing-updated"));
          localStorage.setItem("room_pricing_last_sync", Date.now().toString());
        }
      }
    } catch {
      showToast("Failed to save pricing", "error");
    } finally {
      setSaving(null);
    }
  };

  const categories = [
    { key: "deluxe", name: "Deluxe Room", desc: "Base Corporate & Couple Lodging" },
    { key: "executive", name: "Executive Room", desc: "Spacious Business Suite" },
    { key: "premium", name: "Premium Suite", desc: "Luxury Suite with Living Lounge" },
    { key: "family", name: "Family Suite", desc: "Multi-Guest 4-Bed Luxury Room" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Tariff & Revenue Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Dynamic Pricing Management
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Configure weekday tariffs, weekend surge multipliers, peak holiday pricing, and extra guest surcharges.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/pricing/seasonal"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <CalendarDays className="w-4 h-4 text-[#C4984F]" />
              <span>Seasonal Holiday Surge</span>
            </Link>
          </div>
        </div>

        {/* GST Tax Rules Callout */}
        <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#9E712E]/30 flex items-center justify-center text-[#D8B875]">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Indian Hospitality GST Slab Config:</span>
              <p className="text-white/60">Tariffs ≤ ₹7,500/night apply 12% GST • Tariffs &gt; ₹7,500 apply 18% GST (Automatically calculated at checkout).</p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
            ACTIVE TAX ENGINE
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(({ key, name, desc }) => {
            const p = prices[key] || { base: 2499, weekend: 2799, peak: 3199, extraAdult: 600, extraBed: 800 };
            const isSaving = saving === key;

            return (
              <div
                key={key}
                className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-5"
              >
                <div className="flex justify-between items-start border-b border-[#1B2A42] pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">{name}</h3>
                    <p className="text-xs text-[#E9DFD2]/60">{desc}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#D8B875]">
                    ₹{p.base.toLocaleString()} / nt
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Base Weekday Rate */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Weekday Base Tariff (Mon - Thu)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={p.base}
                        onChange={(e) => handlePriceChange(key, "base", Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>

                  {/* Weekend Surge */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Weekend Tariff (Fri - Sun)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={p.weekend}
                        onChange={(e) => handlePriceChange(key, "weekend", Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>

                  {/* Peak Season Surge */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Peak Holiday / Wedding Season
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={p.peak}
                        onChange={(e) => handlePriceChange(key, "peak", Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>

                  {/* Extra Adult Surcharge */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Extra Adult Surcharge
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={p.extraAdult}
                        onChange={(e) => handlePriceChange(key, "extraAdult", Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1B2A42] flex justify-end">
                  <button
                    onClick={() => handleSave(key)}
                    disabled={isSaving}
                    className="px-4 py-2 rounded bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Updating..." : "Save Rate Changes"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
