"use client";

import React, { useState } from "react";
import { X, Plus, Sparkles, Image as ImageIcon, BedDouble, Trash2, Check } from "lucide-react";
import { useToast } from "./ToastContext";

interface AddCategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const defaultAmenities = [
  "King Size Bed",
  "High-Speed Wi-Fi",
  "Air Conditioning",
  "Smart LED TV",
  "Tea/Coffee Maker",
  "Mini Fridge",
  "24/7 Room Service",
  "Executive Work Desk",
  "Balcony View",
  "Luxury Toiletries",
];

export function AddCategoryModal({ onClose, onSuccess }: AddCategoryModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const [price, setPrice] = useState<number | "">(2499);
  const [image, setImage] = useState("/images/rooms/deluxe/main.jpg");
  const [description, setDescription] = useState("");
  const [maxGuests, setMaxGuests] = useState("2 Adults");
  const [bedding, setBedding] = useState("King Bed");
  const [roomArea, setRoomArea] = useState("300 sq. ft.");
  const [amenities, setAmenities] = useState<string[]>([
    "King Size Bed",
    "High-Speed Wi-Fi",
    "Air Conditioning",
    "Flat Screen TV",
    "Tea/Coffee Maker",
    "Mini Fridge",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!badge) {
      setBadge(val.split(" ")[0].toUpperCase());
    }
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Room category name is required", "error");
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast("Please enter a valid tariff price", "error");
      return;
    }

    setLoading(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const numPrice = Number(price);
      const img = image.trim() || `/images/rooms/${slug}/1.png`;
      const occupancy = parseInt(maxGuests) || 2;
      const desc = description.trim() || `${name} with modern amenities and luxury comfort.`;

      // 1. Save Category
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCategory: {
            id: `${slug}-room`,
            slug,
            name: name.trim(),
            badge: badge.trim() || slug.toUpperCase(),
            price: numPrice,
            image: img,
            images: [img],
            description: desc,
            longDescription: desc,
            maxGuests: maxGuests.trim() || `${occupancy} Guests`,
            occupancy: occupancy,
            bedding: bedding.trim() || "King Bed",
            bedType: bedding.trim() || "King Bed",
            roomArea: roomArea.trim() || "300 sq. ft.",
            size: roomArea.trim() || "300 sq. ft.",
            amenities: amenities.length > 0 ? amenities : ["King Size Bed", "High-Speed Wi-Fi", "Air Conditioning"],
          },
        }),
      });

      // 2. Register Pricing in Admin Pricing Engine
      await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType: slug,
          base: numPrice,
          weekend: Math.round(numPrice * 1.15),
          peak: Math.round(numPrice * 1.35),
          extraAdult: 800,
          extraBed: 1000,
        }),
      }).catch(() => {});

      // 3. Update localStorage & client events
      if (typeof window !== "undefined") {
        try {
          const currentPricing = JSON.parse(localStorage.getItem("hr_room_pricing") || "{}");
          currentPricing[slug] = {
            base: numPrice,
            weekend: Math.round(numPrice * 1.15),
            peak: Math.round(numPrice * 1.35),
            extraAdult: 800,
            extraBed: 1000,
          };
          localStorage.setItem("hr_room_pricing", JSON.stringify(currentPricing));
        } catch {}
        // Invalidate category cache TTL so customer pages fetch fresh data immediately
        localStorage.removeItem("hr_room_categories_v2_ts");
        window.dispatchEvent(new Event("room-categories-updated"));
      }

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ Category "${name}" added to database & live on website!`, "success");
        onSuccess();
        onClose();
      } else {
        throw new Error(data.error || "Failed to add category");
      }
    } catch (err: any) {
      console.error("Error adding category:", err);
      showToast(`Error: ${err.message || "Failed to save category"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] text-[#111E31] w-full max-w-2xl rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-[#EADFCF] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFFFFF] px-6 py-4.5 border-b border-[#F0E8DD] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B5853B] via-[#A0702B] to-[#875B1E] flex items-center justify-center text-white shadow-xs border border-[#ECCB8E]/40 flex-shrink-0">
              <BedDouble className="w-6 h-6 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-[22px] font-bold text-[#111E31] tracking-tight leading-none">
                Add New Room Category
              </h2>
              <p className="text-[11.5px] text-[#6E6659] mt-1 font-normal">
                Saves directly to database & updates customer website (/rooms) automatically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#6E6659] hover:text-[#111E31] p-1.5 rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4.5 flex-1 custom-scrollbar text-xs bg-[#FFFFFF]">
          <div className="bg-[#FAF6F0]/70 border border-[#ECE2D5] rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Suite"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] placeholder:text-[#9C9488] font-semibold focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Badge Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. ROYAL / SUITE"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] placeholder:text-[#9C9488] font-semibold focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Tariff Price per Night (₹) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8C6228] font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={500}
                    placeholder="2499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-white border border-[#DFD5C6] rounded-xl pl-8 pr-3 py-2.5 text-sm text-[#111E31] font-bold focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Cover Image URL / Path
                </label>
                <input
                  type="text"
                  placeholder="/images/rooms/deluxe/main.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-xs text-[#111E31] font-mono focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Elegant comfort with modern amenities, designed for a relaxing stay..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#DFD5C6] rounded-xl p-3 text-sm text-[#111E31] placeholder:text-[#9C9488] focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Max Guests
                </label>
                <input
                  type="text"
                  placeholder="2 Adults"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] font-medium focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Bedding Configuration
                </label>
                <input
                  type="text"
                  placeholder="King Bed"
                  value={bedding}
                  onChange={(e) => setBedding(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] font-medium focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-1.5">
                  Room Area
                </label>
                <input
                  type="text"
                  placeholder="280 sq. ft."
                  value={roomArea}
                  onChange={(e) => setRoomArea(e.target.value)}
                  className="w-full bg-white border border-[#DFD5C6] rounded-xl px-3.5 py-2.5 text-sm text-[#111E31] font-medium focus:outline-none focus:border-[#8C6228] focus:ring-2 focus:ring-[#8C6228]/15 shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Included Amenities Checklist */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#8C6228] block mb-2">
                Select Room Amenities ({amenities.length} selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {defaultAmenities.map((amenity) => {
                  const isSelected = amenities.includes(amenity);
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
                      <span className="text-xs truncate">{amenity}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8C6228] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                  placeholder="Add custom amenity (e.g. Jacuzzi)..."
                  className="flex-1 bg-white border border-[#DFD5C6] rounded-xl px-3 py-2 text-xs text-[#111E31] focus:outline-none focus:border-[#8C6228]"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-4 py-2 bg-[#8C6228] hover:bg-[#734E1A] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#F5EFE6] hover:bg-[#EDE5DA] text-xs font-semibold text-[#2C241B] rounded-xl border border-[#D9CABA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#A67C38] via-[#946927] to-[#805518] hover:from-[#946927] hover:to-[#704812] text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? "Saving Category..." : "Save Room Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
