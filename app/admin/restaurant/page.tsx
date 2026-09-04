"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UtensilsCrossed, Plus, MessageSquare, Check, X, Sparkles, Edit3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { RestaurantMenuItem } from "@/lib/admin/store";

export default function AdminRestaurantMenuPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<RestaurantMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Main Course" as RestaurantMenuItem["category"],
    description: "",
    price: 295,
    isVeg: true,
    isFeatured: false,
    image: "/images/restaurant/murgh-malai-tikka.png",
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/restaurant");
      const data = await res.json();
      if (data.menuItems) setItems(data.menuItems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleAvailability = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isAvailable: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Dish availability updated", "success");
        fetchItems();
      }
    } catch {
      showToast("Failed to update dish", "error");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`'${newItem.name}' added to Kwality Menu!`, "success");
        setModalOpen(false);
        fetchItems();
      }
    } catch {
      showToast("Failed to add menu item", "error");
    }
  };

  const categories = ["ALL", "Starters", "Main Course", "Biryani", "Tandoor", "Desserts", "Beverages"];

  const filtered = items.filter(
    (i) => selectedCategory === "ALL" || i.category === selectedCategory
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Kwality Fine Dining
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Restaurant Menu & Pricing
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Manage multi-cuisine kitchen menu items, live tandoor specialties, and instant availability toggles.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/restaurant/enquiries"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4 text-[#C4984F]" />
              <span>Table Enquiries</span>
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#C4984F] text-white shadow-sm"
                  : "bg-[#111E31] text-[#E9DFD2]/70 hover:bg-[#1B2A42]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full bg-[#111E31]">
                  <Image
                    src={dish.image || "/images/restaurant/image.png"}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        dish.isVeg
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                          : "bg-red-950/80 text-red-400 border-red-500/40"
                      }`}
                    >
                      {dish.isVeg ? "VEG" : "NON-VEG"}
                    </span>
                    {dish.isFeatured && (
                      <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[10px] font-bold shadow-xs">
                        CHEF SIGNATURE
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-bold text-[#D8B875]">
                    ₹{dish.price}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base font-bold text-white">{dish.name}</h3>
                    <span className="text-[10px] text-[#C4984F] uppercase font-bold">{dish.category}</span>
                  </div>
                  <p className="text-xs text-[#E9DFD2]/60 leading-relaxed line-clamp-2">{dish.description}</p>
                </div>
              </div>

              <div className="p-3 border-t border-[#1B2A42] bg-[#070D17] flex justify-between items-center text-xs">
                <button
                  onClick={() => toggleAvailability(dish.id, dish.isAvailable)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                    dish.isAvailable
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900"
                      : "bg-rose-950 text-rose-400 border-rose-500/30 hover:bg-rose-900"
                  }`}
                >
                  {dish.isAvailable ? "● AVAILABLE" : "○ SOLD OUT"}
                </button>
                <span className="text-white/40 text-[10px] font-mono">ID: {dish.id}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#1B2A42] pb-3">
                <h3 className="font-serif text-lg font-bold text-white">Add New Kwality Dish</h3>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Mutton Rogan Josh"
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as RestaurantMenuItem["category"] })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    >
                      {categories.filter((c) => c !== "ALL").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Tariff Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Slow cooked with authentic Kashmiri spices..."
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isVeg}
                      onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                      className="w-4 h-4 rounded text-[#9E712E]"
                    />
                    <span>Vegetarian Dish</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isFeatured}
                      onChange={(e) => setNewItem({ ...newItem, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#9E712E]"
                    />
                    <span>Chef's Signature Feature</span>
                  </label>
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
                    Add to Menu
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
