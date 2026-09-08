"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Layers,
  Edit3,
  Users,
  Bed,
  Maximize2,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { RoomConfigModal } from "@/components/admin/RoomConfigModal";
import { RoomPreviewModal } from "@/components/admin/RoomPreviewModal";
import { AddCategoryModal } from "@/components/admin/AddCategoryModal";
import { api } from "@/lib/api";

interface CategoryData {
  id: string;
  slug: string;
  name: string;
  badge: string;
  price: number;
  image: string;
  description: string;
  maxGuests: string;
  bedding: string;
  roomArea: string;
  amenitiesCount: number;
  amenities: string[];
  moreAmenitiesCount: number;
}

export default function RoomCategoriesManagerPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [configuringRoom, setConfiguringRoom] = useState<any | null>(null);
  const [previewingRoom, setPreviewingRoom] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? It will also be removed from website.`)) return;
    try {
      const res = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Category "${name}" deleted from database & website.`, "success");
        fetchRoomCategories();
      } else {
        showToast(data.error || "Failed to delete category.", "error");
      }
    } catch (err) {
      showToast("Error deleting category.", "error");
    }
  };

  const fetchRoomCategories = async () => {
    setIsLoading(true);
    try {
      const [roomsRes, pricingRes] = await Promise.all([
        fetch("/api/rooms").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/pricing").then((r) => r.json()).catch(() => ({ prices: {} })),
      ]);

      const liveRooms = roomsRes?.data || [];
      const livePrices = pricingRes?.prices || {};

      if (liveRooms.length > 0) {
        const mapped: CategoryData[] = liveRooms.map((r: any) => {
          const slug = r.slug || r.id;
          const liveBasePrice = livePrices[slug]?.base || Number(r.pricePerNight) || 2499;
          return {
            id: r.id,
            slug: r.slug,
            name: r.name,
            badge: r.category || slug.toUpperCase(),
            price: liveBasePrice,
            image: r.images?.[0] || `/images/rooms/${slug}/main.jpg`,
            description: r.description || r.shortDesc || "",
            maxGuests: `${r.capacityAdults || 2} Adults`,
            bedding: r.bedType || "King Bed",
            roomArea: `${r.roomSizeSqFt || 300} sq. ft.`,
            amenitiesCount: r.amenities?.length || 8,
            amenities: r.amenities || [],
            moreAmenitiesCount: Math.max(0, (r.amenities?.length || 0) - 6),
          };
        });
        setCategories(mapped);
      }
    } catch (err) {
      console.error("Failed to load room categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomCategories();
  }, []);

  const displayCategories = categories;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923] animate-in fade-in duration-200">
          <div className="h-32 w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-2xl p-6 shadow-xs animate-pulse" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white border border-[#E8DFD2] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Main Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Category Architecture & Master Setup
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/rooms"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Physical Rooms Grid"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[32px] font-serif font-bold text-[#111923] tracking-tight leading-none">
                Room Categories & Specifications
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Control category metadata, custom amenities, high-res photo gallery, capacity limits, and dynamic tariffs.
            </p>
          </div>

          {/* Right Action Buttons & Decorative Motto */}
          <div className="flex flex-col items-start md:items-end space-y-2.5 z-10 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(158,113,46,0.25)] transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>ADD ROOM CATEGORY</span>
              </button>

              <Link
                href="/admin/rooms"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EDE4] border border-[#E2D8CA] text-xs font-semibold text-[#B8893E] shadow-[0_2px_8px_rgba(40,30,20,0.03)] transition-all"
              >
                <Layers className="w-4 h-4 text-[#B8893E]" />
                <span>Physical Rooms Grid (101-412)</span>
              </Link>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-center pt-0.5 select-none w-full">
              <div className="flex items-center space-x-2 text-[#B8893E]/50">
                <span className="w-8 h-[1px] bg-[#B8893E]/30" />
                <span className="text-[7px] text-[#B8893E]">◇</span>
                <span className="w-8 h-[1px] bg-[#B8893E]/30" />
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.28em] text-[#B8893E]/80 font-serif mt-0.5">
                M A N A G E . S E R V E . G R O W .
              </span>
            </div>
          </div>
        </div>

        {/* 2. Room Category 2-Column Grid (4 Cards) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E5DDD2] rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(40,30,20,0.04)] hover:border-[#B8893E]/50 hover:shadow-[0_6px_22px_rgba(40,30,20,0.08)] transition-all flex flex-col md:flex-row group min-w-0"
            >
              {/* Left Side: Room Image (38-40% width) */}
              <div className="relative w-full md:w-[38%] min-h-[220px] md:min-h-[280px] self-stretch flex-shrink-0 bg-[#FAF7F2] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Top-Left Category Badge */}
                <div className="absolute top-3 left-3 bg-[#181E24]/85 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold text-white border border-white/10 shadow-xs z-10">
                  {cat.badge}
                </div>

                {/* Top-Right Price Badge */}
                <div className="absolute top-3 right-3 bg-[#181E24]/85 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-white border border-[#B8893E]/40 shadow-xs z-10">
                  <span className="text-[#D8B77A] font-serif text-[13px] font-bold">
                    ₹{cat.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/75 font-normal">
                    {" "}/ nt
                  </span>
                </div>
              </div>

              {/* Right Side: Room Information (60-62% width) */}
              <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between space-y-3.5 min-w-0 overflow-hidden">
                <div className="space-y-3 min-w-0">
                  {/* Title & Description */}
                  <div className="space-y-1 min-w-0">
                    <h2 className="font-serif text-[22px] sm:text-[25px] font-bold text-[#111923] tracking-tight leading-snug group-hover:text-[#B8893E] transition-colors truncate">
                      {cat.name}
                    </h2>
                    <p className="text-[12px] sm:text-[12.5px] text-[#635C52] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* 3-Column Specifications Row */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#FAF7F2] p-2 sm:p-2.5 rounded-xl border border-[#E8DFD2] text-left min-w-0">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8893E] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block truncate">
                          MAX GUESTS
                        </span>
                        <span className="text-[11px] sm:text-[11.5px] font-bold text-[#111923] leading-tight block mt-0.5 truncate">
                          {cat.maxGuests}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-[#E8DFD2] pl-1.5 sm:pl-2.5 min-w-0">
                      <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8893E] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block truncate">
                          BEDDING
                        </span>
                        <span className="text-[11px] sm:text-[11.5px] font-bold text-[#111923] leading-tight block mt-0.5 truncate">
                          {cat.bedding}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-[#E8DFD2] pl-1.5 sm:pl-2.5 min-w-0">
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B8893E] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block truncate">
                          ROOM AREA
                        </span>
                        <span className="text-[11px] sm:text-[11.5px] font-bold text-[#111923] leading-tight block mt-0.5 truncate">
                          {cat.roomArea}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Amenities Chips */}
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[9.5px] uppercase font-bold tracking-wider text-[#A9824B] block mb-1.5">
                      INCLUDED AMENITIES ({cat.amenitiesCount})
                    </span>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center">
                      {cat.amenities.map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FAF7F2] border border-[#E8DFD2] text-[10px] sm:text-[10.5px] text-[#554E44] font-medium flex items-center whitespace-nowrap"
                        >
                          <span className="text-[#B8893E] font-bold mr-1">✓</span>
                          <span>{a}</span>
                        </span>
                      ))}
                      {cat.moreAmenitiesCount > 0 && (
                        <span className="text-[10px] sm:text-[10.5px] text-[#B8893E] font-bold px-1 sm:px-1.5 py-0.5 whitespace-nowrap">
                          +{cat.moreAmenitiesCount} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-3 border-t border-[#EDE6DB] flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    {/* Preview Card */}
                    <button
                      onClick={() => setPreviewingRoom(cat)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#E2D8CA] bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#111923] text-[11px] sm:text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B8893E] flex-shrink-0" />
                      <span>Preview Card</span>
                    </button>

                    {/* Delete Category */}
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="px-2 py-1.5 sm:py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] sm:text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer whitespace-nowrap"
                      title="Delete category from database & website"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    </button>
                  </div>

                  {/* Configure Room */}
                  <button
                    onClick={() => setConfiguringRoom(cat)}
                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#B38138] hover:bg-[#9E702E] text-white text-[10.5px] sm:text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap flex-shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>CONFIGURE ROOM</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Room Category Modal */}
      {isAddModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchRoomCategories}
        />
      )}

      {/* Room Configuration Modal */}
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
