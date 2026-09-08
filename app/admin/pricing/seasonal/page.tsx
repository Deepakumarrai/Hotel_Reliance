"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calendar, Search, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface SeasonRule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  minNights: number;
  applicableRooms: string;
  ruleType?: string;
  status?: string;
}

export default function SeasonalPricingPage() {
  const { showToast } = useToast();
  const [seasons, setSeasons] = useState<SeasonRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [newSeason, setNewSeason] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 14);
    return {
      name: "",
      startDate: today.toISOString().split("T")[0],
      endDate: nextWeek.toISOString().split("T")[0],
      multiplier: 15,
      minNights: 2,
      applicableRooms: "All Categories",
    };
  });
  const [modalOpen, setModalOpen] = useState(false);

  const loadSeasons = () => {
    fetch("/api/admin/pricing/seasonal")
      .then((r) => r.json())
      .then((data) => {
        if (data?.seasons) {
          setSeasons(data.seasons);
        }
      })
      .catch((err) => console.error("Failed to fetch seasons:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/pricing/seasonal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSeason),
      });
      const data = await res.json();
      if (data?.rule) {
        showToast(`Seasonal surge rule '${data.rule.name}' created!`, "success");
        setModalOpen(false);
        loadSeasons();
      } else {
        showToast(data?.error || "Failed to create rule", "error");
      }
    } catch {
      showToast("Network error creating seasonal rule", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/pricing/seasonal/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) {
        showToast("Seasonal surge rule removed", "info");
        setSeasons(seasons.filter((s) => s.id !== id));
      } else {
        showToast(data?.error || "Failed to delete rule", "error");
      }
    } catch {
      showToast("Error deleting rule", "error");
    }
  };

  const filteredSeasons = seasons.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.startDate.includes(q) ||
      s.endDate.includes(q) ||
      s.multiplier.toString().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Button & Main Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Holiday & Festival Calendar
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/pricing"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Pricing Management"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                Seasonal Surge Rules
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Configure weekday tariffs, weekend surge multipliers, peak holiday pricing, and extra guest surcharges.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-2 z-10 flex-shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#B8893E] hover:bg-[#A37833] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ADD SEASON RULE</span>
            </button>
          </div>
        </div>

        {/* 2. Main Card Container */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden space-y-6">
          {/* Top Search Bar */}
          <div className="flex justify-end">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8277]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by season name, date range or multiplier..."
                className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Mobile View: Dedicated Seasonal Rule Cards */}
          <div className="block md:hidden divide-y divide-[#EDE6DB]">
            {filteredSeasons.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Calendar className="w-8 h-8 text-[#B8893E] mx-auto" />
                <div className="font-serif font-bold text-base text-[#111923]">No seasonal rules found</div>
                <p className="text-xs text-[#6B6255]">Add surge rules to manage holiday pricing.</p>
              </div>
            ) : (
              filteredSeasons.map((season) => (
                <div key={season.id} className="p-4 space-y-3 bg-white hover:bg-[#FAF7F2]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#111923]">{season.name}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[10px] font-bold">
                      +{season.multiplier}% SURGE
                    </span>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE2D5] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6B6255]">Rule Type:</span>
                      <span className="font-medium text-[#111923]">{season.ruleType || "Holiday Surge"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6255]">Dates:</span>
                      <span className="font-mono text-[#111923]">{season.startDate} → {season.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6255]">Min Stay:</span>
                      <span className="font-medium text-[#111923]">{season.minNights} Nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6255]">Applies To:</span>
                      <span className="font-medium text-[#A97A38]">{season.applicableRooms}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleDelete(season.id)}
                      className="px-4 py-2 min-h-[40px] rounded-xl text-[#E11D48] hover:bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Rule</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View: Full Table */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 border-b border-[#EDE6DB] pb-3 text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                <div className="col-span-2">SEASON NAME</div>
                <div>TYPE</div>
                <div>DATE RANGE</div>
                <div>SURGE / MULTIPLIER</div>
                <div>APPLIES TO</div>
                <div className="text-right">ACTIONS</div>
              </div>

              {/* Empty State */}
              {filteredSeasons.length === 0 && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#E8DFD2]/60 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-9 h-9 text-[#B8893E]" />
                  </div>
                  <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#111923]">
                    No seasonal surge rules added yet.
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#6B6255] max-w-md mx-auto">
                    Add season rules to apply special pricing during holidays, festivals, or peak periods.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#B8893E] hover:bg-[#A37833] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95 mx-auto mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD SEASON RULE</span>
                  </button>
                </div>
              )}

              {/* Populated Rows */}
              {filteredSeasons.length > 0 && (
                <div className="divide-y divide-[#EDE6DB]">
                  {filteredSeasons.map((season) => (
                    <div
                      key={season.id}
                      className="grid grid-cols-7 py-4 text-xs items-center hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      <div className="col-span-2 font-bold text-[#111923] text-[13px]">
                        {season.name}
                      </div>
                      <div className="text-[#6B6255]">
                        {season.ruleType || "Holiday Surge"}
                      </div>
                      <div className="text-[#111923] font-medium">
                        {season.startDate} → {season.endDate}
                      </div>
                      <div>
                        <span className="px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[10.5px] font-bold">
                          +{season.multiplier}% SURGE
                        </span>
                      </div>
                      <div className="text-[#6B6255]">{season.applicableRooms}</div>
                      <div className="text-right">
                        <button
                          onClick={() => handleDelete(season.id)}
                          className="p-2 text-[#78716C] hover:text-[#E11D48] hover:bg-[#FFE4E6] rounded-lg transition-colors cursor-pointer"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Add Seasonal Rule */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 font-sans">
              <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3.5">
                <h3 className="font-serif text-[22px] font-bold text-[#111923]">
                  Create Seasonal Surge Rule
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#6B6255] hover:text-[#111923] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSeason} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Season / Festival Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSeason.name}
                    onChange={(e) =>
                      setNewSeason({ ...newSeason, name: e.target.value })
                    }
                    placeholder="e.g. Diwali & Chhath Surge / New Year Holiday"
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newSeason.startDate}
                      onChange={(e) =>
                        setNewSeason({ ...newSeason, startDate: e.target.value })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newSeason.endDate}
                      onChange={(e) =>
                        setNewSeason({ ...newSeason, endDate: e.target.value })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Surge Multiplier (%)
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="100"
                      value={newSeason.multiplier}
                      onChange={(e) =>
                        setNewSeason({
                          ...newSeason,
                          multiplier: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Min Stay (Nights)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="14"
                      value={newSeason.minNights}
                      onChange={(e) =>
                        setNewSeason({
                          ...newSeason,
                          minNights: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2.5 pt-4 border-t border-[#EDE6DB]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 min-h-[44px] bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] rounded-xl text-xs font-semibold text-[#111923] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 min-h-[44px] bg-[#B8893E] hover:bg-[#A37833] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
