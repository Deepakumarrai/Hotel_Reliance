"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed, Plus, Search, CheckCircle2, X, Tag, ShieldAlert } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export default function AdminRestaurantPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Main Course",
    description: "",
    price: 350,
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
  });

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/admin/restaurant");
      const data = await res.json();
      if (data.menuItems) {
        setItems(data.menuItems);
      }
    } catch (err) {
      console.error("Failed to load restaurant menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedStatus = !item.isAvailable;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isAvailable: updatedStatus } : i))
    );
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isAvailable: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `'${item.name}' is now ${updatedStatus ? "AVAILABLE" : "SOLD OUT"}`,
          updatedStatus ? "success" : "info"
        );
      } else {
        fetchMenu();
      }
    } catch {
      fetchMenu();
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`New dish '${newItem.name}' added to Kwality menu!`, "success");
        setModalOpen(false);
        fetchMenu();
        setNewItem({
          name: "",
          category: "Main Course",
          description: "",
          price: 350,
          isVeg: true,
          isAvailable: true,
          isFeatured: false,
        });
      } else {
        showToast(data.error || "Failed to add dish", "error");
      }
    } catch {
      showToast("Network error creating dish", "error");
    }
  };

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchesCat = categoryFilter === "ALL" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* Header Banner */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Kwality Restaurant & Dining Management
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Menu Items & Dining Registry
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Control dish prices, toggle live stock availability, and manage fine dining culinary offerings.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#B8893E] hover:bg-[#A37833] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW DISH</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-[#E8DFD2]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategoryFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === "ALL"
                  ? "bg-[#111923] text-white shadow-xs"
                  : "bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] hover:bg-[#F3EDE4]"
              }`}
            >
              All Categories ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#B8893E] text-white shadow-xs"
                    : "bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] hover:bg-[#F3EDE4]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E]"
            />
            <Search className="w-4 h-4 text-[#8C8377] absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                  <th className="py-4 px-6">DISH NAME</th>
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4">TYPE</th>
                  <th className="py-4 px-4">PRICE</th>
                  <th className="py-4 px-4">AVAILABILITY</th>
                  <th className="py-4 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FCFAF6]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-serif font-bold text-sm text-[#111923]">{item.name}</div>
                      <div className="text-[11px] text-[#78716C] mt-0.5 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#A97A38]">{item.category}</td>
                    <td className="py-4 px-4">
                      {item.isVeg ? (
                        <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[10px] font-bold">
                          VEG
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] text-[10px] font-bold">
                          NON-VEG
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#111923]">₹{item.price}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          item.isAvailable
                            ? "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]"
                            : "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]"
                        }`}
                      >
                        {item.isAvailable ? "AVAILABLE" : "SOLD OUT"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.isAvailable
                            ? "bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B]"
                            : "bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46]"
                        }`}
                      >
                        {item.isAvailable ? "Mark Sold Out" : "Mark Available"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Dish */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3">
                <h3 className="font-serif text-xl font-bold text-[#111923]">Add New Menu Dish</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDish} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#A97A38] block mb-1">DISH NAME</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Malai Kofta Special"
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl p-3 text-xs font-bold text-[#111923]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#A97A38] block mb-1">CATEGORY</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl p-3 text-xs font-bold text-[#111923]"
                    >
                      <option value="Main Course">Main Course</option>
                      <option value="Tandoor">Tandoor</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Starters">Starters</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#A97A38] block mb-1">PRICE (₹)</label>
                    <input
                      type="number"
                      required
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl p-3 text-xs font-bold text-[#111923]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#A97A38] block mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Culinary description of preparation and ingredients..."
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl p-3 text-xs font-medium text-[#111923]"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isVeg}
                      onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B8893E]"
                    />
                    <span className="font-bold text-[#111923]">Vegetarian Dish</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isFeatured}
                      onChange={(e) => setNewItem({ ...newItem, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B8893E]"
                    />
                    <span className="font-bold text-[#111923]">Chef Special / Featured</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-[#EDE6DB] flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] font-bold"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#B8893E] hover:bg-[#A37833] text-white font-bold uppercase tracking-wider"
                  >
                    ADD TO KWALITY MENU
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
