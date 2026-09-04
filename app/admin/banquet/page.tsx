"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PartyPopper, MessageSquare, Users, Sparkles, Building, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BanquetEnquiryRecord } from "@/lib/admin/store";

export default function AdminBanquetPage() {
  const [enquiries, setEnquiries] = useState<BanquetEnquiryRecord[]>([]);

  useEffect(() => {
    fetch("/api/admin/banquet").then((r) => r.json()).then((d) => d.enquiries && setEnquiries(d.enquiries));
  }, []);

  const venues = [
    {
      name: "Grand AC Banquet Hall",
      capacity: "Up to 350 Guests",
      size: "4,200 sq. ft.",
      amenities: ["Integrated AV Setup", "Stage Lighting", "Buffet Area", "Bride/Groom Makeup Suites"],
      status: "ACTIVE",
    },
    {
      name: "Executive Meeting Boardroom",
      capacity: "Up to 30 Guests",
      size: "800 sq. ft.",
      amenities: ["Digital Projector & LED Display", "High-Speed Wi-Fi", "Ergonomic Conference Seating"],
      status: "ACTIVE",
    },
    {
      name: "Celebration Open Lawn",
      capacity: "Up to 500 Guests",
      size: "12,000 sq. ft.",
      amenities: ["Landscaped Greenery", "Grand Entry Gate", "Weatherproof Canopy Layout", "Silent Generator Backup"],
      status: "ACTIVE",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Banquets, Weddings & Corporate Events
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Venues & Event Management
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Manage capacities, audio-visual specs, and quotation pipeline for weddings, anniversaries, and corporate summits.
            </p>
          </div>

          <Link
            href="/admin/banquet/enquiries"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Enquiries ({enquiries.length})</span>
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.map((v) => (
            <div
              key={v.name}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-[#C4984F]">VENUE SPECIFICATION</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                    {v.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-2">{v.name}</h3>

                <div className="grid grid-cols-2 gap-2 bg-[#111E31] p-3 rounded-lg border border-[#1B2A42] text-xs mt-3 text-center">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Max Capacity</span>
                    <span className="font-bold text-white">{v.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Floor Area</span>
                    <span className="font-bold text-white">{v.size}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#C4984F] block">Key Amenities</span>
                  {v.amenities.map((a) => (
                    <div key={a} className="text-white/80 flex items-center space-x-1.5">
                      <span className="text-[#D8B875]">✓</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1B2A42] text-right">
                <Link
                  href="/admin/banquet/enquiries"
                  className="text-xs text-[#C4984F] hover:text-[#D8B875] font-semibold"
                >
                  Manage Bookings →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
