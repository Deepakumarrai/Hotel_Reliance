"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Layers, Edit3, Plus, BedDouble, Users, Expand, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { roomsData } from "@/data/rooms";
import { useToast } from "@/components/admin/ToastContext";

export default function RoomCategoriesManagerPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(roomsData);
  const [editingCategory, setEditingCategory] = useState<typeof roomsData[0] | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/rooms"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Category Architecture
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Room Types & Suite Specifications
              </h1>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-[#111E31]">
                  <Image
                    src={cat.images[0] || "/images/hero/hero-bg.jpg"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1423] via-transparent to-black/40" />
                  <div className="absolute bottom-3 left-4">
                    <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[10px] uppercase font-bold tracking-wider">
                      {cat.slug}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-1">{cat.name}</h3>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-bold text-[#D8B875]">
                    ₹{cat.price ? cat.price.toLocaleString() : "2,499"} / night
                  </div>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <p className="text-[#E9DFD2]/70 leading-relaxed">{cat.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-[#111E31] p-3 rounded-lg border border-[#1B2A42] text-center">
                    <div>
                      <span className="text-[10px] uppercase text-white/40 block">Max Guests</span>
                      <span className="font-bold text-white">{cat.occupancy} Adults</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/40 block">Bedding</span>
                      <span className="font-bold text-white">{cat.bedType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/40 block">Room Size</span>
                      <span className="font-bold text-white">{cat.size}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                      Included Amenities ({cat.amenities.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.amenities.slice(0, 6).map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 rounded bg-[#111E31] border border-[#1B2A42] text-[10px] text-white/80"
                        >
                          ✓ {a}
                        </span>
                      ))}
                      {cat.amenities.length > 6 && (
                        <span className="text-[10px] text-[#C4984F] self-center">
                          +{cat.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#1B2A42] bg-[#070D17] flex justify-between items-center text-xs">
                <span className="text-white/40 font-mono">ID: {cat.id}</span>
                <button
                  onClick={() => showToast(`Opening editor for ${cat.name}`, "info")}
                  className="px-3 py-1.5 rounded bg-[#1B2A42] hover:bg-[#253755] text-[#D8B875] font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure Specifications</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
