"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus, Sparkles, Trash2 } from "lucide-react";
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
}

export default function SeasonalPricingPage() {
  const { showToast } = useToast();
  const [seasons, setSeasons] = useState<SeasonRule[]>([
    {
      id: "s-1",
      name: "Durga Puja & Festive Holiday Season",
      startDate: "2026-10-01",
      endDate: "2026-10-25",
      multiplier: 25, // +25%
      minNights: 2,
      applicableRooms: "All Categories",
    },
    {
      id: "s-2",
      name: "Winter Wedding & Corporate Peak Surge",
      startDate: "2026-11-15",
      endDate: "2026-12-31",
      multiplier: 20, // +20%
      minNights: 1,
      applicableRooms: "Deluxe & Executive",
    },
  ]);

  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    multiplier: 15,
    minNights: 2,
    applicableRooms: "All Categories",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddSeason = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SeasonRule = {
      id: `s-${Date.now()}`,
      ...newSeason,
    };
    setSeasons([...seasons, created]);
    showToast(`Seasonal surge rule '${created.name}' created!`, "success");
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSeasons(seasons.filter((s) => s.id !== id));
    showToast("Seasonal surge rule removed", "info");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/pricing"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Holiday & Festival Calendar
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Seasonal Surge Rules
              </h1>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Season Rule</span>
          </button>
        </div>

        {/* List of Seasons */}
        <div className="space-y-4">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg font-bold text-white">{season.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-[#9E712E]/30 border border-[#C4984F]/40 text-[#D8B875] text-[10px] font-bold">
                    +{season.multiplier}% SURGE
                  </span>
                </div>
                <p className="text-xs text-[#E9DFD2]/60">
                  {season.startDate} → {season.endDate} • Min Stay: {season.minNights} {season.minNights === 1 ? "Night" : "Nights"} • Applies to: {season.applicableRooms}
                </p>
              </div>

              <button
                onClick={() => handleDelete(season.id)}
                className="p-2 text-white/50 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                title="Delete Rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#1B2A42] pb-3">
                <h3 className="font-serif text-lg font-bold text-white">Create Seasonal Surge Rule</h3>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddSeason} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Season Name</label>
                  <input
                    type="text"
                    required
                    value={newSeason.name}
                    onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                    placeholder="e.g. Chhath Puja / New Year Surge"
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newSeason.startDate}
                      onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={newSeason.endDate}
                      onChange={(e) => setNewSeason({ ...newSeason, endDate: e.target.value })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Surge Multiplier (%)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="100"
                      value={newSeason.multiplier}
                      onChange={(e) => setNewSeason({ ...newSeason, multiplier: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Min Stay (Nights)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="14"
                      value={newSeason.minNights}
                      onChange={(e) => setNewSeason({ ...newSeason, minNights: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-[#1B2A42]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#1B2A42] rounded text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#9E712E] to-[#C4984F] rounded text-white font-bold uppercase"
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
