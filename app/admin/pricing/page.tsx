"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  Save,
  Percent,
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
    deluxe: { base: 2499, weekend: 2799, peak: 3499, extraAdult: 800, extraBed: 1000 },
    executive: { base: 3499, weekend: 3899, peak: 4499, extraAdult: 1000, extraBed: 1200 },
    premium: { base: 4499, weekend: 4999, peak: 5999, extraAdult: 1200, extraBed: 1500 },
    family: { base: 5999, weekend: 6499, peak: 7499, extraAdult: 1500, extraBed: 1800 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.prices && Object.keys(data.prices).length > 0) {
        setPrices(data.prices);
        if (typeof window !== "undefined") {
          localStorage.setItem("hr_room_pricing", JSON.stringify(data.prices));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        [field]: isNaN(val) ? 0 : val,
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
      if (data.success && data.prices) {
        setPrices(data.prices);
        showToast(`Tariff rules for ${roomType.toUpperCase()} saved & synced live!`, "success");
        if (typeof window !== "undefined") {
          localStorage.setItem("hr_room_pricing", JSON.stringify(data.prices));
          localStorage.setItem("room_pricing_last_sync", Date.now().toString());
          window.dispatchEvent(new Event("room-pricing-updated"));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        showToast(data.error || "Failed to save pricing", "error");
      }
    } catch {
      showToast("Failed to save pricing", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allPrices: prices,
        }),
      });
      const data = await res.json();
      if (data.success && data.prices) {
        setPrices(data.prices);
        showToast("All room tariffs saved & synchronized across website live!", "success");
        if (typeof window !== "undefined") {
          localStorage.setItem("hr_room_pricing", JSON.stringify(data.prices));
          localStorage.setItem("room_pricing_last_sync", Date.now().toString());
          window.dispatchEvent(new Event("room-pricing-updated"));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        showToast(data.error || "Failed to save pricing", "error");
      }
    } catch {
      showToast("Failed to save pricing", "error");
    } finally {
      setSavingAll(false);
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
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Header Banner */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Tariff & Revenue Engine
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Dynamic Pricing Management
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Configure weekday tariffs, weekend surge multipliers, peak holiday pricing, and extra guest surcharges.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 z-10 flex-shrink-0">
            <Link
              href="/admin/pricing/seasonal"
              className="px-4 py-2.5 rounded-xl bg-[#18232F] hover:bg-[#253241] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-2xs cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-white" />
              <span>Seasonal Surge</span>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="px-4 py-2.5 rounded-xl bg-[#B8893E] hover:bg-[#A37833] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingAll ? "Saving..." : "SAVE ALL ROOM TARIFFS"}</span>
            </button>
          </div>
        </div>

        {/* 2. Indian Hospitality GST Slab Configuration Banner */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(40,30,20,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] text-base font-bold flex-shrink-0">
              <Percent className="w-5 h-5 text-[#A97A38]" />
            </div>
            <div>
              <span className="font-bold text-[13px] text-[#111923]">Indian Hospitality GST Slab Config:</span>
              <p className="text-[12px] text-[#6B6255] mt-0.5">
                Tariffs ≤ ₹7,500/night apply 12% GST • Tariffs &gt; ₹7,500 apply 18% GST (Automatically calculated at checkout & synchronized with website).
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[10px] uppercase font-bold tracking-wider whitespace-nowrap self-start md:self-auto">
            ACTIVE TAX ENGINE
          </span>
        </div>

        {/* 3. Pricing Cards 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map(({ key, name, desc }) => {
            const p = prices[key] || { base: 0, weekend: 0, peak: 0, extraAdult: 0, extraBed: 0 };
            const isSaving = saving === key;

            return (
              <div
                key={key}
                className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-5"
              >
                {/* Header of Card */}
                <div className="flex justify-between items-start border-b border-[#EDE6DB] pb-3.5">
                  <div>
                    <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#111923]">{name}</h3>
                    <p className="text-xs text-[#78716C] mt-0.5">{desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[17px] font-bold text-[#111923]">
                      ₹{p.base.toLocaleString()}{" "}
                      <span className="text-xs text-[#78716C] font-normal">/ nt</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#10B981] block mt-0.5">
                      Peak: ₹{p.peak.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
                  {/* Weekday Base Rate */}
                  <div>
                    <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      WEEKDAY BASE TARIFF (MON - THU)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8277] font-semibold text-xs pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={p.base}
                        onChange={(e) => handlePriceChange(key, "base", Number(e.target.value))}
                        className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-8 pr-3.5 py-3 min-h-[46px] text-xs sm:text-[13px] text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Weekend Tariff */}
                  <div>
                    <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      WEEKEND TARIFF (FRI - SUN)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8277] font-semibold text-xs pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={p.weekend}
                        onChange={(e) => handlePriceChange(key, "weekend", Number(e.target.value))}
                        className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-8 pr-3.5 py-3 min-h-[46px] text-xs sm:text-[13px] text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Peak Season */}
                  <div>
                    <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#A97A38] flex items-center space-x-1 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8893E]" />
                      <span>PEAK HOLIDAY / FESTIVE SEASON</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#B8893E] font-semibold text-xs pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={p.peak}
                        onChange={(e) => handlePriceChange(key, "peak", Number(e.target.value))}
                        className="w-full bg-[#FCFAF6] border border-[#C69A55] rounded-xl pl-8 pr-3.5 py-3 min-h-[46px] text-xs sm:text-[13px] text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Extra Adult Surcharge */}
                  <div>
                    <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      EXTRA ADULT SURCHARGE
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8277] font-semibold text-xs pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={p.extraAdult}
                        onChange={(e) => handlePriceChange(key, "extraAdult", Number(e.target.value))}
                        className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-8 pr-3.5 py-3 min-h-[46px] text-xs sm:text-[13px] text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Extra Bed Surcharge */}
                  <div className="sm:col-span-2">
                    <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      EXTRA ROLLAWAY BED (OPTIONAL)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8277] font-semibold text-xs pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={p.extraBed}
                        onChange={(e) => handlePriceChange(key, "extraBed", Number(e.target.value))}
                        className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-8 pr-3.5 py-3 min-h-[46px] text-xs sm:text-[13px] text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-3.5 border-t border-[#EDE6DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-[#78716C]">
                    Live on customer site & booking engine
                  </span>
                  <button
                    onClick={() => handleSave(key)}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Saving..." : "SAVE RATE CHANGES"}</span>
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
