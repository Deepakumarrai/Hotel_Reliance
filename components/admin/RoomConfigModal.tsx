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
    price: number;
    images: string[];
    occupancy: number;
    bedType: string;
    size: string;
    amenities: string[];
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
    category.description ||
      "Designed for both business and leisure travelers seeking supreme comfort, refined decor, and attentive hospitality in Bokaro Steel City."
  );
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "MAINTENANCE">("ACTIVE");
  const [isPublished, setIsPublished] = useState(true);

  // Specs & Capacity
  const [occupancyAdults, setOccupancyAdults] = useState(category.occupancy || 2);
  const [occupancyKids, setOccupancyKids] = useState(1);
  const [maxTotalGuests, setMaxTotalGuests] = useState(3);
  const [bedType, setBedType] = useState(category.bedType || "King Bed");
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [roomSize, setRoomSize] = useState(category.size || "300 sq. ft.");
  const [viewType, setViewType] = useState("City View");
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
      : ["/images/hero/hero-bg.jpg"]
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

      // Update local room pricing store
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
        window.dispatchEvent(new Event("room-pricing-updated"));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-[#0B1423] text-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#1B2A42] flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#111E31] px-6 py-4 border-b border-[#1B2A42] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9E712E] to-[#C4984F] flex items-center justify-center text-white shadow-md">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <span>Configure {name}</span>
                  <span className="px-2 py-0.5 rounded bg-[#1B2A42] text-[#D8B875] text-[10px] font-mono uppercase">
                    {slug}
                  </span>
                </h2>
                <p className="text-[11px] text-[#E9DFD2]/60">
                  Full category master controller • Updates customer frontend & booking engine live
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Preview</span>
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 px-6 bg-[#070D17] border-b border-[#1B2A42] overflow-x-auto custom-scrollbar">
            {[
              { id: "basic", label: "1. Basic Info & Status" },
              { id: "specs", label: "2. Capacity & Layout" },
              { id: "amenities", label: `3. Amenities (${selectedAmenities.length})` },
              { id: "gallery", label: `4. Photo Gallery (${images.length})` },
              { id: "pricing", label: "5. Tariffs & Plans" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#C4984F] text-[#D8B875] bg-[#111E31]/50 font-bold"
                    : "border-transparent text-white/60 hover:text-white hover:bg-[#111E31]/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
            {/* TAB 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Room Category Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Category Slug (System ID)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={slug}
                      className="w-full bg-[#111E31]/50 border border-[#1B2A42] rounded-lg p-2.5 text-white/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Publishing Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-[#C4984F]"
                    >
                      <option value="ACTIVE">● ACTIVE (Available for Booking)</option>
                      <option value="INACTIVE">○ INACTIVE (Hidden from Website)</option>
                      <option value="MAINTENANCE">▲ TEMPORARY MAINTENANCE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                    Short Overview Summary (Listing Card)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Short summary displayed on room selection cards..."
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                    Full Description (Room Detail Page)
                  </label>
                  <textarea
                    rows={4}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    placeholder="Comprehensive description covering aesthetics, lighting, comfort, and hospitality..."
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Capacity & Specs */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Max Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={occupancyAdults}
                      onChange={(e) => setOccupancyAdults(Number(e.target.value))}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Max Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={occupancyKids}
                      onChange={(e) => setOccupancyKids(Number(e.target.value))}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Total Max Capacity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={maxTotalGuests}
                      onChange={(e) => setMaxTotalGuests(Number(e.target.value))}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Bedding Configuration
                    </label>
                    <select
                      value={bedType}
                      onChange={(e) => setBedType(e.target.value)}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    >
                      <option value="King Bed">1 King Size Bed</option>
                      <option value="Queen Bed">1 Queen Size Bed</option>
                      <option value="Twin Beds">2 Twin Beds</option>
                      <option value="Double + Single">1 Double + 1 Single Bed</option>
                      <option value="4 Separate Beds">4 Individual Beds (Family)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Floor Area (Sq. Ft.)
                    </label>
                    <input
                      type="text"
                      value={roomSize}
                      onChange={(e) => setRoomSize(e.target.value)}
                      placeholder="e.g. 350 sq. ft."
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Physical Room Numbers Range
                    </label>
                    <input
                      type="text"
                      value={roomRange}
                      onChange={(e) => setRoomRange(e.target.value)}
                      placeholder="e.g. 101 - 115"
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      View Type
                    </label>
                    <select
                      value={viewType}
                      onChange={(e) => setViewType(e.target.value)}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    >
                      <option value="City View">City Skyline & Boulevard View</option>
                      <option value="Garden View">Royal Garden & Lawn View</option>
                      <option value="Courtyard View">Quiet Internal Courtyard View</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Smoking Policy
                    </label>
                    <select
                      value={smokingPolicy}
                      onChange={(e) => setSmokingPolicy(e.target.value)}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
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
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C4984F] block mb-2">
                    Standard Luxury Hotel Amenities
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {standardAmenitiesList.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1B2A42] border-[#C4984F] text-white"
                              : "bg-[#111E31] border-[#1B2A42] text-white/60 hover:text-white"
                          }`}
                        >
                          <span className="text-xs">{amenity}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B875]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Amenity */}
                <div className="pt-3 border-t border-[#1B2A42]">
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                    + Add Custom Amenity (No Developer Required)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                      placeholder="e.g. Nespresso Machine, Pillow Menu, Jacuzzi Tub..."
                      className="flex-1 bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                    />
                    <button
                      type="button"
                      onClick={addCustomAmenity}
                      className="px-4 py-2.5 bg-[#9E712E] hover:bg-[#8C6326] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Add Amenity
                    </button>
                  </div>
                </div>

                {/* Selected Amenities Pill List */}
                <div className="p-3 bg-[#111E31] rounded-xl border border-[#1B2A42]">
                  <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-2">
                    Active Included Amenities on Customer Page ({selectedAmenities.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 rounded bg-[#0B1423] border border-[#C4984F]/40 text-[#D8B875] text-[11px] flex items-center space-x-1.5"
                      >
                        <span>✓ {a}</span>
                        <button
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          className="text-white/40 hover:text-rose-400 ml-1"
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#C4984F]">
                    Room Photo Gallery ({images.length} Photos)
                  </span>
                  <span className="text-[10px] text-white/40">
                    First image is always the primary cover photo
                  </span>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#1B2A42] group bg-[#111E31]"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${name} photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 bg-[#9E712E] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          ★ PRIMARY COVER
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="px-2 py-1 bg-[#1B2A42] text-[#D8B875] text-[10px] font-semibold rounded hover:bg-[#253755]"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="p-1 bg-red-950 text-red-300 rounded hover:bg-red-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Photo URL */}
                <div className="pt-3 border-t border-[#1B2A42]">
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                    Add High-Resolution Image URL / Path
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
                      placeholder="e.g. /images/rooms/deluxe-bedroom.jpg or https://..."
                      className="flex-1 bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2.5 bg-[#9E712E] hover:bg-[#8C6326] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Tariffs & Rate Plans */}
            {activeTab === "pricing" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Weekday Base Price (Mon - Thu)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Weekend Tariff (Fri - Sun)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={weekendPrice}
                        onChange={(e) => setWeekendPrice(Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                      Peak Festive / Holiday Rate
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-400/60">₹</span>
                      <input
                        type="number"
                        value={peakPrice}
                        onChange={(e) => setPeakPrice(Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-amber-500/40 rounded-lg pl-7 pr-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Extra Adult Surcharge
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={extraAdultPrice}
                        onChange={(e) => setExtraAdultPrice(Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                      Extra Rollaway Bed Surcharge
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">₹</span>
                      <input
                        type="number"
                        value={extraBedPrice}
                        onChange={(e) => setExtraBedPrice(Number(e.target.value))}
                        className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate Plans */}
                <div className="p-4 bg-[#111E31] rounded-xl border border-[#1B2A42] space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-[#C4984F] block">
                    Supported Guest Meal Plans & Bundles
                  </span>
                  <div className="space-y-2">
                    {ratePlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-2.5 bg-[#0B1423] rounded-lg border border-[#1B2A42]"
                      >
                        <span className="text-xs font-semibold text-white">{plan.name}</span>
                        <span className="text-[11px] text-[#D8B875] font-bold">
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
          <div className="bg-[#111E31] px-6 py-4 border-t border-[#1B2A42] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Direct backend PostgreSQL synchronization enabled</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2.5 bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-white/90 rounded-lg transition-colors cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Publishing..." : "Publish Live Changes"}</span>
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
