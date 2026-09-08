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

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCategory: {
            slug,
            name: name.trim(),
            badge: badge.trim() || slug.toUpperCase(),
            price: Number(price),
            image: image.trim() || `/images/rooms/${slug}/main.jpg`,
            description: description.trim() || `${name} with modern amenities and luxury comfort.`,
            maxGuests: maxGuests.trim() || "2 Adults",
            bedding: bedding.trim() || "King Bed",
            roomArea: roomArea.trim() || "300 sq. ft.",
            amenities: amenities.length > 0 ? amenities : ["King Size Bed", "High-Speed Wi-Fi", "Air Conditioning"],
          },
        }),
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0B1423] text-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#1B2A42] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#111E31] px-6 py-4 border-b border-[#1B2A42] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9E712E] to-[#C4984F] flex items-center justify-center text-white shadow-md">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                Add New Room Category
              </h2>
              <p className="text-[11px] text-[#E9DFD2]/60">
                Saves directly to database & updates customer website (/rooms) automatically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Suite"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-[#C4984F]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                placeholder="e.g. ROYAL / SUITE"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Tariff Price per Night (₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#C4984F]">₹</span>
                <input
                  type="number"
                  required
                  min={500}
                  placeholder="2499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-7 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#C4984F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Cover Image URL / Path
              </label>
              <input
                type="text"
                placeholder="/images/rooms/deluxe/main.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Elegant comfort with modern amenities, designed for a relaxing stay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Max Guests
              </label>
              <input
                type="text"
                placeholder="2 Adults"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Bedding Configuration
              </label>
              <input
                type="text"
                placeholder="King Bed"
                value={bedding}
                onChange={(e) => setBedding(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Room Area
              </label>
              <input
                type="text"
                placeholder="280 sq. ft."
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          {/* Included Amenities Checklist */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
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
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1B2A42] border-[#C4984F] text-white font-medium"
                        : "bg-[#111E31] border-[#1B2A42] text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] truncate">{amenity}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B875] flex-shrink-0" />}
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
                className="flex-1 bg-[#111E31] border border-[#1B2A42] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="px-3 py-2 bg-[#1B2A42] hover:bg-[#253755] text-[#D8B875] border border-[#C4984F]/40 font-bold rounded-lg text-xs cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#1B2A42] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-white/80 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
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
