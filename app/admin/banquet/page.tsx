"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Plus,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { BanquetEnquiryRecord } from "@/lib/admin/store";

interface VenueRecord {
  id: string;
  name: string;
  type: string;
  capacity: string;
  location: string;
  size?: string;
  amenities: string[];
  status: string;
}

export default function AdminBanquetPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<BanquetEnquiryRecord[]>([]);
  const [venues, setVenues] = useState<VenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const [newVenue, setNewVenue] = useState({
    name: "",
    type: "Grand Ballroom",
    capacity: "500 Guests",
    location: "Ground Floor",
    size: "6,500 sq. ft.",
    status: "AVAILABLE",
  });

  const loadData = () => {
    Promise.all([
      fetch("/api/admin/banquet").then((r) => r.json()).catch(() => ({ enquiries: [] })),
      fetch("/api/admin/content/banquet_venues").then((r) => r.json()).catch(() => ({ content: { venues: [] } })),
    ])
      .then(([bData, vData]) => {
        if (bData?.enquiries) setEnquiries(bData.enquiries);
        if (vData?.content?.venues && vData.content.venues.length > 0) {
          const mapped = vData.content.venues.map((v: any, idx: number) => ({
            id: v.id || `venue-${idx + 1}`,
            name: v.name,
            type: v.type || v.name,
            capacity: v.capacity || "100+ Guests",
            location: v.location || "Hotel Reliance Campus",
            size: v.size || "Spacious",
            amenities: v.amenities || ["Air Conditioned", "AV System", "Power Backup"],
            status: v.status || "AVAILABLE",
          }));
          setVenues(mapped);
        } else {
          setVenues([]);
        }
      })
      .catch((err) => console.error("Failed to load banquet data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: VenueRecord = {
      id: `venue-${Date.now()}`,
      name: newVenue.name,
      type: newVenue.type,
      capacity: newVenue.capacity,
      location: newVenue.location,
      size: newVenue.size,
      amenities: ["Central AC", "Stage & Podium", "HD Projector", "Sound System"],
      status: newVenue.status,
    };
    const updated = [...venues, created];
    setVenues(updated);
    showToast(`Venue '${newVenue.name}' created successfully!`, "success");
    setModalOpen(false);

    try {
      await fetch("/api/admin/content/banquet_venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venues: updated }),
      });
    } catch (err) {
      console.error("Failed to persist venue to backend:", err);
    }

    setNewVenue({
      name: "",
      type: "Grand Ballroom",
      capacity: "500 Guests",
      location: "Ground Floor",
      size: "6,500 sq. ft.",
      status: "AVAILABLE",
    });
  };

  const handleDeleteVenue = async (id: string) => {
    const updated = venues.filter((v) => v.id !== id);
    setVenues(updated);
    showToast("Venue removed from registry", "info");

    try {
      await fetch("/api/admin/content/banquet_venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venues: updated }),
      });
    } catch (err) {
      console.error("Failed to persist venue deletion to backend:", err);
    }
  };

  const filteredVenues = venues.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      v.capacity.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q);

    const matchesType =
      typeFilter === "ALL" ||
      v.type.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Banquets, Weddings & Corporate Events
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Venues & Event Management
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Manage capacities, audio-visual specs, and quotation pipeline for weddings, anniversaries, and corporate summits.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-2 z-10 flex-shrink-0">
            <Link
              href="/admin/banquet/enquiries"
              className="px-4 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>VIEW ENQUIRIES ({enquiries.length})</span>
            </Link>
          </div>
        </div>

        {/* 2. Main Card Container */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden space-y-6">
          {/* Search, Filter & Add Button Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8277]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by venue name, type, capacity or location..."
                className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
              />
            </div>

            {/* Type Dropdown */}
            <div className="relative w-full md:w-56 flex-shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-2.5 text-xs text-[#111923] font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs appearance-none cursor-pointer pr-9"
              >
                <option value="ALL">All Venue Types</option>
                <option value="ballroom">Grand Ballroom</option>
                <option value="banquet">AC Banquet Hall</option>
                <option value="lawn">Wedding Lawn</option>
                <option value="conference">Conference Hall</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A8277]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Add New Venue CTA */}
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW VENUE</span>
            </button>
          </div>

          {/* Table Header & Empty/Populated State */}
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-7 border-b border-[#EDE6DB] pb-3 text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                <div className="col-span-2">VENUE NAME</div>
                <div>TYPE</div>
                <div>CAPACITY</div>
                <div>LOCATION</div>
                <div>KEY AMENITIES</div>
                <div>STATUS</div>
                <div className="text-right">ACTIONS</div>
              </div>

              {/* Empty State matching reference screenshot */}
              {filteredVenues.length === 0 && (
                <div className="py-20 text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#E8DFD2]/60 flex items-center justify-center mx-auto mb-4">
                    {/* Architectural Building/Pavilion with Star Emblem */}
                    <svg
                      className="w-10 h-10 text-[#B8893E]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 2 7 22 7 12 2" />
                      <polyline points="2 7 2 20 22 20 22 7" />
                      <line x1="6" y1="20" x2="6" y2="11" />
                      <line x1="10" y1="20" x2="10" y2="11" />
                      <line x1="14" y1="20" x2="14" y2="11" />
                      <line x1="18" y1="20" x2="18" y2="11" />
                      <polygon
                        points="12 11 13 13 15 13 13.5 14.5 14 16.5 12 15 10 16.5 10.5 14.5 9 13 11 13 12 11"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#111923]">
                    No venues registered in database yet.
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#6B6255] max-w-md mx-auto leading-relaxed">
                    Add venues to manage capacities, audio-visual specs, and receive event inquiries for weddings, anniversaries, and corporate summits.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95 mx-auto mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW VENUE</span>
                  </button>
                </div>
              )}

              {/* Populated Rows */}
              {filteredVenues.length > 0 && (
                <div className="divide-y divide-[#EDE6DB]">
                  {filteredVenues.map((v) => (
                    <div
                      key={v.id || v.name}
                      className="grid grid-cols-7 py-4 text-xs items-center hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      <div className="col-span-2">
                        <span className="font-bold text-[13px] text-[#111923] block">
                          {v.name}
                        </span>
                        {v.size && (
                          <span className="text-[11px] text-[#78716C] mt-0.5 block">
                            Area: {v.size}
                          </span>
                        )}
                      </div>
                      <div className="text-[#6B6255] font-medium">{v.type}</div>
                      <div className="text-[#111923] font-bold">{v.capacity}</div>
                      <div className="text-[#6B6255]">{v.location}</div>
                      <div className="text-[#6B6255] text-[11px]">
                        {v.amenities?.slice(0, 2).join(", ")}
                        {v.amenities?.length > 2 && ` +${v.amenities.length - 2}`}
                      </div>
                      <div>
                        <span className="px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[10px] uppercase font-bold tracking-wider">
                          {v.status || "AVAILABLE"}
                        </span>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => handleDeleteVenue(v.id)}
                          className="p-2 text-[#78716C] hover:text-[#E11D48] hover:bg-[#FFE4E6] rounded-lg transition-colors cursor-pointer"
                          title="Delete Venue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Add New Venue */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 font-sans">
              <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3.5">
                <h3 className="font-serif text-[22px] font-bold text-[#111923]">
                  Register New Banquet Venue
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVenue} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newVenue.name}
                    onChange={(e) =>
                      setNewVenue({ ...newVenue, name: e.target.value })
                    }
                    placeholder="e.g. Grand Kohinoor Ballroom / Royal Wedding Lawn"
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Venue Type
                    </label>
                    <select
                      value={newVenue.type}
                      onChange={(e) =>
                        setNewVenue({ ...newVenue, type: e.target.value })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      <option value="Grand Ballroom">Grand Ballroom</option>
                      <option value="AC Banquet Hall">AC Banquet Hall</option>
                      <option value="Wedding Lawn">Wedding Lawn</option>
                      <option value="Conference Hall">Conference Hall</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Max Guest Capacity
                    </label>
                    <input
                      type="text"
                      required
                      value={newVenue.capacity}
                      onChange={(e) =>
                        setNewVenue({ ...newVenue, capacity: e.target.value })
                      }
                      placeholder="e.g. 500 Guests"
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Floor Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newVenue.location}
                      onChange={(e) =>
                        setNewVenue({ ...newVenue, location: e.target.value })
                      }
                      placeholder="e.g. Ground Floor / 2nd Floor"
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Floor Area (Size)
                    </label>
                    <input
                      type="text"
                      required
                      value={newVenue.size}
                      onChange={(e) =>
                        setNewVenue({ ...newVenue, size: e.target.value })
                      }
                      placeholder="e.g. 6,500 sq. ft."
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2.5 pt-4 border-t border-[#EDE6DB]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] rounded-xl text-xs font-semibold text-[#111923] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Register Venue
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
