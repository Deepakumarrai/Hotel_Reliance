"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, CheckCircle2, Phone, Calendar, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface TableEnquiry {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED";
}

export default function RestaurantEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<TableEnquiry[]>([
    {
      id: "TBL-101",
      name: "Sanjay Singhania (SAIL GM)",
      phone: "+91 94311 99882",
      guests: 6,
      date: "2026-09-04",
      time: "08:00 PM",
      status: "CONFIRMED",
    },
    {
      id: "TBL-102",
      name: "Meenakshi Mukherjee",
      phone: "+91 98350 44211",
      guests: 4,
      date: "2026-09-04",
      time: "08:30 PM",
      status: "NEW",
    },
  ]);

  const updateStatus = (id: string, status: TableEnquiry["status"]) => {
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast(`Table reservation #${id} marked as ${status}`, "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/restaurant"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Kwality Dining Operations
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Table Reservation Enquiries
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Ref ID</th>
                  <th className="py-3 font-bold">Guest</th>
                  <th className="py-3 font-bold">Phone</th>
                  <th className="py-3 font-bold text-center">Party Size</th>
                  <th className="py-3 font-bold">Slot</th>
                  <th className="py-3 font-bold">Status</th>
                  <th className="py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D8B875]">{e.id}</td>
                    <td className="py-3.5 font-semibold text-white">{e.name}</td>
                    <td className="py-3.5 font-mono text-[#E9DFD2]/80">{e.phone}</td>
                    <td className="py-3.5 text-center font-bold">{e.guests} Guests</td>
                    <td className="py-3.5">{e.date} • {e.time}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.status === "CONFIRMED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {e.status === "NEW" && (
                        <button
                          onClick={() => updateStatus(e.id, "CONFIRMED")}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Confirm
                        </button>
                      )}
                      {e.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateStatus(e.id, "COMPLETED")}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                        >
                          Seated
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
