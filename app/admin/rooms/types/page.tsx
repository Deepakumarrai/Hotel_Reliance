"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, Eye, Calendar, Sparkles, Layers, Sliders, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { RoomConfigModal } from "@/components/admin/RoomConfigModal";
import { RoomPreviewModal } from "@/components/admin/RoomPreviewModal";
import { api } from "@/lib/api";

export default function RoomCategoriesManagerPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [configuringRoom, setConfiguringRoom] = useState<any | null>(null);
  const [previewingRoom, setPreviewingRoom] = useState<any | null>(null);

  const fetchRoomCategories = () => {
    setIsLoading(true);
    api.rooms
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          // Read local synced prices if available
          let localPricing: any = {};
          if (typeof window !== "undefined") {
            try {
              localPricing = JSON.parse(localStorage.getItem("hr_room_pricing") || "{}");
            } catch {}
          }

          setCategories(
            res.data.map((r: any) => ({
              id: r.id,
              slug: r.slug,
              name: r.name,
              description: r.shortDesc || r.description,
              price: localPricing[r.slug]?.base || Number(r.pricePerNight),
              images: r.images && r.images.length > 0 ? r.images : ["/images/hero/hero-bg.jpg"],
              occupancy: r.capacityAdults || 2,
              bedType: r.bedType || "King Bed",
              size: r.roomSizeSqFt ? `${r.roomSizeSqFt} sq. ft.` : "300 sq. ft.",
              amenities: r.amenities || []
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to load live rooms:", err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRoomCategories();
  }, []);

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
                Category Architecture & Master Setup
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Room Categories & Specifications
              </h1>
              <p className="text-xs text-[#E9DFD2]/60 mt-1">
                Control category metadata, custom amenities, high-res photo gallery, capacity limits, and dynamic tariffs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/rooms"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-[#C4984F]" />
              <span>Physical Rooms Grid (101-412)</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 text-[#D8B875] font-serif animate-pulse">
            Loading room categories from database...
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#C4984F]/60 transition-all group"
              >
                <div>
                  {/* Category Image Cover */}
                  <div className="relative h-52 w-full bg-[#111E31] overflow-hidden">
                    <Image
                      src={cat.images[0] || "/images/hero/hero-bg.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1423] via-black/20 to-black/40" />

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold text-[#D8B875] border border-white/10 font-mono">
                      {cat.slug}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded text-xs font-bold text-white border border-[#C4984F]/40 shadow-sm">
                      <span className="text-[#D8B875] font-serif text-sm">₹{cat.price ? cat.price.toLocaleString() : "2,499"}</span>
                      <span className="text-[10px] text-white/60 font-normal"> / nt</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                      <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-4 text-xs">
                    <p className="text-[#E9DFD2]/70 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-[#111E31] p-3 rounded-lg border border-[#1B2A42] text-center">
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-semibold">Max Guests</span>
                        <span className="font-bold text-white">{cat.occupancy} Adults</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-semibold">Bedding</span>
                        <span className="font-bold text-white">{cat.bedType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-white/40 block font-semibold">Room Area</span>
                        <span className="font-bold text-white">{cat.size}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                        Included Amenities ({cat.amenities.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.amenities.slice(0, 6).map((a: string) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded bg-[#111E31] border border-[#1B2A42] text-[10px] text-[#E9DFD2]/90"
                          >
                            ✓ {a}
                          </span>
                        ))}
                        {cat.amenities.length > 6 && (
                          <span className="text-[10px] text-[#C4984F] self-center font-semibold">
                            +{cat.amenities.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 border-t border-[#1B2A42] bg-[#070D17] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setPreviewingRoom(cat)}
                    className="px-3 py-1.5 rounded bg-[#111E31] hover:bg-[#1B2A42] text-white/80 hover:text-white font-medium flex items-center space-x-1.5 transition-colors border border-[#1B2A42]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C4984F]" />
                    <span>Preview Card</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <Link
                      href="/admin/availability"
                      className="px-3 py-1.5 rounded bg-[#111E31] hover:bg-[#1B2A42] text-white/80 hover:text-white font-medium flex items-center space-x-1 transition-colors border border-[#1B2A42]"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C4984F]" />
                      <span>Availability</span>
                    </Link>

                    <button
                      onClick={() => setConfiguringRoom(cat)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-white font-bold uppercase tracking-wider text-[11px] shadow-md flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Configure Room</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Configuration Drawer/Modal */}
      {configuringRoom && (
        <RoomConfigModal
          category={configuringRoom}
          onClose={() => setConfiguringRoom(null)}
          onSaveSuccess={fetchRoomCategories}
        />
      )}

      {/* Room Preview Modal */}
      {previewingRoom && (
        <RoomPreviewModal
          room={previewingRoom}
          onClose={() => setPreviewingRoom(null)}
        />
      )}
    </AdminLayout>
  );
}
