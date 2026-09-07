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
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { RoomConfigModal } from "@/components/admin/RoomConfigModal";
import { RoomPreviewModal } from "@/components/admin/RoomPreviewModal";
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

  // Exact 4 standard categories matching reference screenshot
  const standardCategories: CategoryData[] = [
    {
      id: "deluxe",
      slug: "deluxe",
      name: "Deluxe Room",
      badge: "DELUXE",
      price: 2499,
      image: "/images/rooms/deluxe/main.jpg",
      description:
        "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay in Bokaro.",
      maxGuests: "2 Adults",
      bedding: "King Bed",
      roomArea: "280 sq. ft.",
      amenitiesCount: 9,
      amenities: [
        "King Size Bed",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "Flat Screen TV",
        "Tea/Coffee Maker",
        "Mini Fridge",
      ],
      moreAmenitiesCount: 3,
    },
    {
      id: "executive",
      slug: "executive",
      name: "Executive Room",
      badge: "EXECUTIVE",
      price: 3499,
      image: "/images/rooms/executive/main.jpg",
      description:
        "Spacious layout with enhanced services and executive desk for premium business guests.",
      maxGuests: "2 Adults",
      bedding: "King Bed",
      roomArea: "350 sq. ft.",
      amenitiesCount: 10,
      amenities: [
        "King Size Bed",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "Smart LED TV",
        "Executive Work Desk",
        "Tea/Coffee Maker",
      ],
      moreAmenitiesCount: 4,
    },
    {
      id: "premium",
      slug: "premium",
      name: "Premium Room",
      badge: "PREMIUM",
      price: 4499,
      image: "/images/rooms/premium/main.jpg",
      description:
        "A perfect blend of luxury and comfort with premium interiors and extended space.",
      maxGuests: "2 Adults",
      bedding: "King Bed",
      roomArea: "420 sq. ft.",
      amenitiesCount: 12,
      amenities: [
        "King Size Bed",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "Smart LED TV",
        "Luxury Sofa Set",
        "Balcony View",
      ],
      moreAmenitiesCount: 6,
    },
    {
      id: "family",
      slug: "family",
      name: "Family Room",
      badge: "FAMILY",
      price: 5999,
      image: "/images/rooms/family/main.jpg",
      description:
        "Thoughtfully designed for families with extra space and added conveniences.",
      maxGuests: "4 Adults",
      bedding: "2 Queen Beds",
      roomArea: "520 sq. ft.",
      amenitiesCount: 11,
      amenities: [
        "2 Queen Beds",
        "High-Speed Wi-Fi",
        "Air Conditioning",
        "2 Smart TVs",
        "Mini Dining Area",
        "Microwave",
      ],
      moreAmenitiesCount: 5,
    },
  ];

  const fetchRoomCategories = () => {
    setIsLoading(true);
    api.rooms
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          let localPricing: any = {};
          if (typeof window !== "undefined") {
            try {
              localPricing = JSON.parse(
                localStorage.getItem("hr_room_pricing") || "{}"
              );
            } catch {}
          }

          const mapped = standardCategories.map((std) => {
            const live = res.data.find(
              (r: any) =>
                r.slug === std.slug ||
                r.name?.toLowerCase().includes(std.slug)
            );
            if (!live) return std;
            return {
              ...std,
              id: live.id || std.id,
              price:
                localPricing[std.slug]?.base ||
                Number(live.pricePerNight) ||
                std.price,
            };
          });
          setCategories(mapped);
        } else {
          setCategories(standardCategories);
        }
      })
      .catch(() => {
        setCategories(standardCategories);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRoomCategories();
  }, []);

  const displayCategories =
    categories.length > 0 ? categories : standardCategories;

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

          {/* Right Action Button & Decorative Motto */}
          <div className="flex flex-col items-start md:items-end space-y-2 z-10 flex-shrink-0">
            <Link
              href="/admin/rooms"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EDE4] border border-[#E2D8CA] text-xs font-semibold text-[#B8893E] shadow-[0_2px_8px_rgba(40,30,20,0.03)] transition-all"
            >
              <Layers className="w-4 h-4 text-[#B8893E]" />
              <span>Physical Rooms Grid (101-412)</span>
            </Link>

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
              className="bg-white border border-[#E5DDD2] rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(40,30,20,0.04)] hover:border-[#B8893E]/50 hover:shadow-[0_6px_22px_rgba(40,30,20,0.08)] transition-all flex flex-col md:flex-row group"
            >
              {/* Left Side: Room Image (40% width) */}
              <div className="relative w-full md:w-[40%] min-h-[240px] md:min-h-[300px] flex-shrink-0 bg-[#FAF7F2] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Top-Left Category Badge */}
                <div className="absolute top-3 left-3 bg-[#181E24]/85 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold text-white border border-white/10 shadow-xs">
                  {cat.badge}
                </div>

                {/* Top-Right Price Badge */}
                <div className="absolute top-3 right-3 bg-[#181E24]/85 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold text-white border border-[#B8893E]/40 shadow-xs">
                  <span className="text-[#D8B77A] font-serif text-[13px] font-bold">
                    ₹{cat.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/75 font-normal">
                    {" "}/ nt
                  </span>
                </div>
              </div>

              {/* Right Side: Room Information (60% width) */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h2 className="font-serif text-[24px] sm:text-[26px] font-bold text-[#111923] tracking-tight leading-snug group-hover:text-[#B8893E] transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-[12.5px] text-[#635C52] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* 3-Column Specifications Row */}
                  <div className="grid grid-cols-3 gap-2 bg-[#FAF7F2] p-2.5 sm:p-3 rounded-xl border border-[#E8DFD2] text-left">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#B8893E] flex-shrink-0" />
                      <div>
                        <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block">
                          MAX GUESTS
                        </span>
                        <span className="text-[12px] font-bold text-[#111923] leading-tight block mt-0.5">
                          {cat.maxGuests}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border-l border-[#E8DFD2] pl-2.5">
                      <Bed className="w-4 h-4 text-[#B8893E] flex-shrink-0" />
                      <div>
                        <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block">
                          BEDDING
                        </span>
                        <span className="text-[12px] font-bold text-[#111923] leading-tight block mt-0.5">
                          {cat.bedding}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border-l border-[#E8DFD2] pl-2.5">
                      <Maximize2 className="w-4 h-4 text-[#B8893E] flex-shrink-0" />
                      <div>
                        <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#8A8277] block">
                          ROOM AREA
                        </span>
                        <span className="text-[12px] font-bold text-[#111923] leading-tight block mt-0.5">
                          {cat.roomArea}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Amenities Chips */}
                  <div>
                    <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#A9824B] block mb-2">
                      INCLUDED AMENITIES ({cat.amenitiesCount})
                    </span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {cat.amenities.map((a) => (
                        <span
                          key={a}
                          className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8DFD2] text-[11px] text-[#554E44] font-medium flex items-center"
                        >
                          <span className="text-[#B8893E] font-bold mr-1.5">✓</span>
                          <span>{a}</span>
                        </span>
                      ))}
                      {cat.moreAmenitiesCount > 0 && (
                        <span className="text-[11px] text-[#B8893E] font-bold px-1.5 py-0.5">
                          +{cat.moreAmenitiesCount} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-3.5 border-t border-[#EDE6DB] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* Preview Card */}
                    <button
                      onClick={() => setPreviewingRoom(cat)}
                      className="px-3.5 py-2 rounded-lg border border-[#E2D8CA] bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#111923] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B8893E] flex-shrink-0" />
                      <span>Preview Card</span>
                    </button>

                    {/* Availability */}
                    <Link
                      href="/admin/availability"
                      className="px-3.5 py-2 rounded-lg border border-[#E2D8CA] bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#111923] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#B8893E] flex-shrink-0" />
                      <span>Availability</span>
                    </Link>
                  </div>

                  {/* Configure Room */}
                  <button
                    onClick={() => setConfiguringRoom(cat)}
                    className="px-4 py-2 rounded-lg bg-[#B38138] hover:bg-[#9E702E] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
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
