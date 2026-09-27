"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Save,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  BedDouble,
  Sliders,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useToast } from "./ToastContext";
import { RoomPreviewModal } from "./RoomPreviewModal";

const standardAmenitiesList = [
  "King Size Bed",
  "High-Speed Wi-Fi",
  "Climate Control AC",
  "43-inch Smart LED TV",
  "Tea / Coffee Maker",
  "Mini Bar & Fridge",
  "Executive Work Desk",
  "Wardrobe with Electronic Safe",
  "24/7 In-Room Dining",
  "24/7 Hot & Cold Shower",
  "Hair Dryer & Toiletries",
  "Intercom Telephone",
  "Iron & Ironing Board",
  "Private Balcony with City View",
  "Daily Housekeeping",
  "Mineral Water Bottles",
];

interface RoomConfigModalProps {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string;
    longDescription?: string;
    price: number;
    images?: string[];
    image?: string;
    occupancy?: number;
    maxGuests?: string;
    bedType?: string;
    bedding?: string;
    size?: string;
    roomArea?: string;
    amenities?: string[];
    badge?: string;
    view?: string;
  };
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export function RoomConfigModal({
  category,
  onClose,
  onSaveSuccess,
}: RoomConfigModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "basic" | "specs" | "amenities" | "gallery" | "pricing"
  >("basic");

  // Room Form State
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [shortDesc, setShortDesc] = useState(category.description);
  const [fullDesc, setFullDesc] = useState(
    category.longDescription ||
      category.description ||
      "Designed for both business and leisure travelers seeking supreme comfort, refined decor, and attentive hospitality in Bokaro Steel City."
  );
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "MAINTENANCE">("ACTIVE");
  const [isPublished, setIsPublished] = useState(true);

  // Specs & Capacity
  const [occupancyAdults, setOccupancyAdults] = useState(
    category.occupancy || parseInt(category.maxGuests || "") || 2
  );
  const [occupancyKids, setOccupancyKids] = useState(1);
  const [maxTotalGuests, setMaxTotalGuests] = useState(3);
  const [bedType, setBedType] = useState(category.bedType || category.bedding || "King Bed");
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [roomSize, setRoomSize] = useState(category.size || category.roomArea || "300 sq. ft.");
  const [viewType, setViewType] = useState(category.view || "City View");
  const [smokingPolicy, setSmokingPolicy] = useState("Non-Smoking");
  const [roomRange, setRoomRange] = useState("101-115");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    category.amenities && category.amenities.length > 0
      ? category.amenities
      : standardAmenitiesList.slice(0, 8)
  );
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  // Gallery
  const [images, setImages] = useState<string[]>(
    category.images && category.images.length > 0
      ? category.images
      : category.image
      ? [category.image]
      : [`/images/rooms/${category.slug || "single"}/1.png`]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Pricing & Surcharges
  const [basePrice, setBasePrice] = useState(category.price || 2499);
  const [weekendPrice, setWeekendPrice] = useState(
    Math.round((category.price || 2499) * 1.15)
  );
  const [peakPrice, setPeakPrice] = useState(
    Math.round((category.price || 2499) * 1.35)
  );
  const [extraAdultPrice, setExtraAdultPrice] = useState(800);
  const [extraBedPrice, setExtraBedPrice] = useState(1000);

  // Rate Plans
  const [ratePlans, setRatePlans] = useState([
    { id: "ep", name: "European Plan (Room Only)", discountPct: 0, isActive: true },
    { id: "cp", name: "Continental Plan (Breakfast Included)", extraCost: 350, isActive: true },
    { id: "map", name: "Modified American Plan (Breakfast + Dinner)", extraCost: 850, isActive: true },
  ]);

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handlers
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenityInput.trim()) {
      if (!selectedAmenities.includes(customAmenityInput.trim())) {
        setSelectedAmenities((prev) => [...prev, customAmenityInput.trim()]);
      }
      setCustomAmenityInput("");
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
      showToast("Image added to gallery", "info");
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
    showToast("Primary cover photo updated", "info");
  };

  const handleDeleteImage = (index: number) => {
    if (images.length <= 1) {
      showToast("At least one cover photo is required", "error");
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    showToast("Image removed", "info");
  };

  const handleSave = async (publishLive: boolean) => {
    setSaving(true);
    try {
      // 1. Sync Pricing
      await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType: slug,
          base: basePrice,
          weekend: weekendPrice,
          peak: peakPrice,
          extraAdult: extraAdultPrice,
          extraBed: extraBedPrice,
        }),
      });

      // 2. Sync Room Category Details to Database (/api/rooms)
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCategory: {
            id: category.id || `${slug}-room`,
            slug,
            name,
            badge: (category as any).badge || slug.toUpperCase(),
            price: basePrice,
            image: images[0] || `/images/rooms/${slug}/1.png`,
            images,
            description: shortDesc || fullDesc,
            longDescription: fullDesc || shortDesc,
            maxGuests: `${occupancyAdults} Adults`,
            occupancy: occupancyAdults,
            bedding: bedType,
            bedType: bedType,
            roomArea: roomSize,
            size: roomSize,
            view: viewType,
            amenities: selectedAmenities,
          },
        }),
      });

      // Update local room pricing store & categories
      if (typeof window !== "undefined") {
        const currentPricing = JSON.parse(localStorage.getItem("hr_room_pricing") || "{}");
        currentPricing[slug] = {
          base: basePrice,
          weekend: weekendPrice,
          peak: peakPrice,
          extraAdult: extraAdultPrice,
          extraBed: extraBedPrice,
        };
        localStorage.setItem("hr_room_pricing", JSON.stringify(currentPricing));
        localStorage.setItem("room_pricing_last_sync", Date.now().toString());
        // Invalidate category cache TTL so customer pages fetch fresh data immediately
        localStorage.removeItem("hr_room_categories_v2_ts");
        window.dispatchEvent(new Event("room-pricing-updated"));
        window.dispatchEvent(new Event("room-categories-updated"));
      }


      setIsPublished(publishLive);
      showToast(
        publishLive
          ? `✓ ${name} configured and published live to customer website!`
          : `✓ ${name} configuration saved as draft.`,
        "success"
      );

      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch {
      showToast("Error updating room configuration.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-[#FFFFFF] text-[#111E31] w-full max-w-5xl rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-[#EADFCF] flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#FFFFFF] px-6 py-4.5 border-b border-[#F0E8DD] flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B5853B] via-[#A0702B] to-[#875B1E] flex items-center justify-center text-white shadow-xs border border-[#ECCB8E]/40 flex-shrink-0">
                <BedDouble className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="font-serif text-xl sm:text-[22px] font-bold text-[#111E31] tracking-tight leading-none">
                    Configure {name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5EBD9] text-[#8C6228] text-[10.5px] font-bold uppercase tracking-wider border border-[#E5D2B3]">
                    {(category as any).badge || slug.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#6E6659] mt-1 font-normal">
                  Full category master controller • Updates customer frontend & booking engine live
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE0] text-xs font-semibold text-[#785724] border border-[#C8B69E] flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#8C6228]" />
                <span className="hidden sm:inline">Live Preview</span>
              </button>
              <button
                onClick={onClose}
                className="text-[#6E6659] hover:text-[#111E31] p-1.5 rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 5-Step Navigation Tabs */}
          <div className="flex items-center space-x-1 px-6 bg-[#FFFFFF] border-b border-[#F0E8DD] overflow-x-auto custom-scrollbar">
            {[
              { id: "basic", num: "1", label: "Basic Info & Status" },
              { id: "specs", num: "2", label: "Capacity & Layout" },
              { id: "amenities", num: "3", label: `Amenities (${selectedAmenities.length})` },
              { id: "gallery", num: "4", label: `Photo Gallery (${images.length})` },
              { id: "pricing", num: "5", label: "Tariffs & Plans" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 text-xs whitespace-nowrap transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
                    isActive
                      ? "border-[#8C6228] text-[#8C6228] font-bold"
                      : "border-transparent text-[#6E6659] hover:text-[#111E31] font-medium"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
                      isActive
                        ? "bg-[#8C6228] text-white"
                        : "bg-[#EAE2D5] text-[#6E6659]"
                    }`}
                  >
                    {tab.num}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs bg-[#FFFFFF]">
            {/* TAB 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 sm:p-6 space-y-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      ROOM CATEGORY NAME *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Deluxe Room"
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] font-semibold focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      CATEGORY SLUG (SYSTEM ID)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={slug}
                      className="w-full bg-[#F0EBE1]/70 border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#5C5447] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      PUBLISHING STATUS
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] font-medium focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all appearance-none cursor-pointer pr-9"
                      >
                        <option value="ACTIVE">● ACTIVE (Available for Booking)</option>
                        <option value="INACTIVE">○ INACTIVE (Hidden from Website)</option>
                        <option value="MAINTENANCE">▲ TEMPORARY MAINTENANCE</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8C6228]">
                        <Sliders className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                    SHORT OVERVIEW SUMMARY (LISTING CARD)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Short summary displayed on room selection cards..."
                    className="w-full bg-white border border-[#DFD5C6] rounded-xl p-3 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                    FULL DESCRIPTION (ROOM DETAIL PAGE)
                  </label>
                  <textarea
                    rows={3}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    placeholder="Comprehensive description covering aesthetics, lighting, comfort, and hospitality..."
                    className="w-full bg-white border border-[#DFD5C6] rounded-xl p-3 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Capacity & Specs */}
            {activeTab === "specs" && (
              <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      MAX ADULTS
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={occupancyAdults}
                      onChange={(e) => setOccupancyAdults(Number(e.target.value))}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] font-bold focus:outline-none focus:border-[#8C6228]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      MAX CHILDREN
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={occupancyKids}
                      onChange={(e) => setOccupancyKids(Number(e.target.value))}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] font-bold focus:outline-none focus:border-[#8C6228]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      TOTAL MAX CAPACITY
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={maxTotalGuests}
                      onChange={(e) => setMaxTotalGuests(Number(e.target.value))}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] font-bold focus:outline-none focus:border-[#8C6228]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      BEDDING CONFIGURATION
                    </label>
                    <select
                      value={bedType}
                      onChange={(e) => setBedType(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    >
                      <option value="King Bed">1 King Size Bed</option>
                      <option value="Queen Bed">1 Queen Size Bed</option>
                      <option value="Twin Beds">2 Twin Beds</option>
                      <option value="Double + Single">1 Double + 1 Single Bed</option>
                      <option value="2 King Beds">2 King Size Beds</option>
                      <option value="4 Separate Beds">4 Individual Beds (Family)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      FLOOR AREA (SQ. FT.)
                    </label>
                    <input
                      type="text"
                      value={roomSize}
                      onChange={(e) => setRoomSize(e.target.value)}
                      placeholder="e.g. 280 sq. ft."
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      PHYSICAL ROOM NUMBERS RANGE
                    </label>
                    <input
                      type="text"
                      value={roomRange}
                      onChange={(e) => setRoomRange(e.target.value)}
                      placeholder="e.g. 101 - 115"
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] font-mono focus:outline-none focus:border-[#8C6228]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      VIEW TYPE
                    </label>
                    <select
                      value={viewType}
                      onChange={(e) => setViewType(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    >
                      <option value="City View">City Skyline & Boulevard View</option>
                      <option value="Garden View">Royal Garden & Lawn View</option>
                      <option value="Courtyard View">Quiet Internal Courtyard View</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      SMOKING POLICY
                    </label>
                    <select
                      value={smokingPolicy}
                      onChange={(e) => setSmokingPolicy(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-sm text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    >
                      <option value="Non-Smoking">100% Non-Smoking Room</option>
                      <option value="Smoking Allowed">Smoking Permitted (Balcony Only)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Amenities Manager */}
            {activeTab === "amenities" && (
              <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 sm:p-6 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-2.5">
                    STANDARD LUXURY HOTEL AMENITIES
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {standardAmenitiesList.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#FAF7F2] border-[#8C6228] text-[#111E31] font-semibold shadow-2xs"
                              : "bg-white border-[#DFD5C6] text-[#6E6659] hover:text-[#111E31]"
                          }`}
                        >
                          <span className="text-xs">{amenity}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#8C6228]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Amenity */}
                <div className="pt-3 border-t border-[#ECE2D5]">
                  <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                    + ADD CUSTOM AMENITY
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                      placeholder="e.g. Nespresso Machine, Pillow Menu, Jacuzzi Tub..."
                      className="flex-1 bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-xs text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    />
                    <button
                      type="button"
                      onClick={addCustomAmenity}
                      className="px-4 py-2.5 bg-[#8C6228] hover:bg-[#734E1A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Add Amenity
                    </button>
                  </div>
                </div>

                {/* Selected Amenities Pill List */}
                <div className="p-3.5 bg-white rounded-xl border border-[#DFD5C6]">
                  <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-2">
                    Active Included Amenities on Customer Page ({selectedAmenities.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E3D8C8] text-[#704E1D] text-[11px] font-medium flex items-center space-x-1.5"
                      >
                        <span>✓ {a}</span>
                        <button
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          className="text-[#9E712E] hover:text-rose-600 ml-1 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Gallery & Media */}
            {activeTab === "gallery" && (
              <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228]">
                    ROOM PHOTO GALLERY ({images.length} PHOTOS)
                  </span>
                  <span className="text-[10px] text-[#6E6659]">
                    First image is always the primary cover photo
                  </span>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#DFD5C6] group bg-white shadow-2xs"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${name} photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 bg-[#8C6228] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          ★ PRIMARY COVER
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="px-2 py-1 bg-white text-[#8C6228] text-[10px] font-semibold rounded hover:bg-[#FAF7F2]"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Photo URL */}
                <div className="pt-3 border-t border-[#ECE2D5]">
                  <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                    ADD HIGH-RESOLUTION IMAGE URL / PATH
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
                      placeholder="e.g. /images/rooms/deluxe/1.png or https://..."
                      className="flex-1 bg-white border border-[#DFD5C6] rounded-xl p-2.5 text-xs text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2.5 bg-[#8C6228] hover:bg-[#734E1A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Tariffs & Rate Plans */}
            {activeTab === "pricing" && (
              <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      WEEKDAY BASE PRICE (MON - THU)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6E6659] font-bold">₹</span>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-7 pr-3 py-2.5 text-[#111E31] font-bold text-sm focus:outline-none focus:border-[#8C6228]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      WEEKEND TARIFF (FRI - SUN)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6E6659] font-bold">₹</span>
                      <input
                        type="number"
                        value={weekendPrice}
                        onChange={(e) => setWeekendPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-7 pr-3 py-2.5 text-[#111E31] font-bold text-sm focus:outline-none focus:border-[#8C6228]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      PEAK FESTIVE / HOLIDAY RATE
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6E6659] font-bold">₹</span>
                      <input
                        type="number"
                        value={peakPrice}
                        onChange={(e) => setPeakPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-7 pr-3 py-2.5 text-[#111E31] font-bold text-sm focus:outline-none focus:border-[#8C6228]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      EXTRA ADULT SURCHARGE
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6E6659] font-bold">₹</span>
                      <input
                        type="number"
                        value={extraAdultPrice}
                        onChange={(e) => setExtraAdultPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-7 pr-3 py-2.5 text-[#111E31] font-bold text-sm focus:outline-none focus:border-[#8C6228]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                      EXTRA ROLLAWAY BED SURCHARGE
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#6E6659] font-bold">₹</span>
                      <input
                        type="number"
                        value={extraBedPrice}
                        onChange={(e) => setExtraBedPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-7 pr-3 py-2.5 text-[#111E31] font-bold text-sm focus:outline-none focus:border-[#8C6228]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate Plans */}
                <div className="p-4 bg-white rounded-xl border border-[#DFD5C6] space-y-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block">
                    SUPPORTED GUEST MEAL PLANS & BUNDLES
                  </span>
                  <div className="space-y-2">
                    {ratePlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DFD2]"
                      >
                        <span className="text-xs font-semibold text-[#111E31]">{plan.name}</span>
                        <span className="text-[11px] text-[#8C6228] font-bold">
                          {plan.extraCost ? `+₹${plan.extraCost} / guest` : "Standard Base"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions: Save Draft vs Publish */}
          <div className="bg-[#FFFFFF] px-6 py-4 border-t border-[#F0E8DD] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-[#6E6659] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct backend PostgreSQL synchronization enabled</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2.5 bg-[#F5EFE6] hover:bg-[#EDE5DA] text-xs font-semibold text-[#2C241B] rounded-xl border border-[#D9CABA] transition-colors cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-[#A67C38] via-[#946927] to-[#805518] hover:from-[#946927] hover:to-[#704812] text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Publishing..." : "PUBLISH LIVE CHANGES"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <RoomPreviewModal
          room={{
            name,
            slug,
            description: shortDesc,
            price: basePrice,
            images,
            occupancy: occupancyAdults,
            bedType,
            size: roomSize,
            amenities: selectedAmenities,
            isPublished,
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
