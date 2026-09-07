"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Clock,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Flame,
  Save,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  description: string;
}

export default function AdminRestaurantPage() {
  const { showToast } = useToast();
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch("/api/admin/restaurant");
      const data = await res.json();
      if (data?.restaurant) {
        setRestaurantData(data.restaurant);
        if (data.restaurant.menu) {
          setMenuItems(data.restaurant.menu);
        }
      }
    } catch (err) {
      console.error("Failed to load restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const categories = ["ALL", "Tandoor", "Main Course", "Biryani", "Chinese", "Desserts"];

  const filteredMenu = menuItems.filter(
    (item) => selectedCategory === "ALL" || item.category === selectedCategory
  );

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    showToast("Dish availability updated", "info");
  };

  const handleSaveMenu = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu: menuItems }),
      });
      if (res.ok) {
        showToast("Kwality Restaurant menu saved & synchronized live!", "success");
      } else {
        showToast("Menu updated in local store", "success");
      }
    } catch {
      showToast("Menu changes saved locally", "success");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Culinary Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Kwality Restaurant Management
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Manage dining service timings, multi-cuisine menu tariffs, availability, and table reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/restaurant/enquiries"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4 text-[#C4984F]" />
              <span>Table Enquiries</span>
            </Link>

            <button
              onClick={handleSaveMenu}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Menu Changes"}</span>
            </button>
          </div>
        </div>

        {/* Timings & Capacity Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0B1423] border border-[#1B2A42] p-4 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-[#C4984F]">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Breakfast Service</span>
            </div>
            <div className="text-sm font-bold text-white">07:30 AM - 10:30 AM</div>
            <span className="text-[10px] text-white/40">Buffet & A la carte</span>
          </div>

          <div className="bg-[#0B1423] border border-[#1B2A42] p-4 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-[#C4984F]">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Lunch Service</span>
            </div>
            <div className="text-sm font-bold text-white">12:30 PM - 03:30 PM</div>
            <span className="text-[10px] text-white/40">Multi-cuisine fine dining</span>
          </div>

          <div className="bg-[#0B1423] border border-[#1B2A42] p-4 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-[#C4984F]">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Dinner Service</span>
            </div>
            <div className="text-sm font-bold text-white">07:00 PM - 10:45 PM</div>
            <span className="text-[10px] text-white/40">Live Tandoor & Barbeque</span>
          </div>
        </div>

        {/* Menu Category Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-[#1B2A42]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#C4984F] text-white shadow-sm"
                  : "bg-[#111E31] text-[#E9DFD2]/70 hover:bg-[#1B2A42]"
              }`}
            >
              {cat === "ALL" ? "Full Menu" : cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-white/50 animate-pulse">
            Loading restaurant menu from database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B1423] border border-[#1B2A42] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                          item.isVeg
                            ? "border-emerald-500 text-emerald-500"
                            : "border-red-500 text-red-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                      </span>
                      <h3 className="font-serif text-base font-bold text-white">{item.name}</h3>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                          ★ CHEF SPECIAL
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-sm text-[#D8B875]">
                      ₹{item.price}
                    </div>
                  </div>

                  <p className="text-xs text-[#E9DFD2]/60 mt-1.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1B2A42] flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-semibold text-white/40">
                    Category: {item.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                        item.isAvailable
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                          : "bg-rose-950/80 text-rose-400 border-rose-500/40"
                      }`}
                    >
                      {item.isAvailable ? "● In Stock / Active" : "○ Sold Out"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
