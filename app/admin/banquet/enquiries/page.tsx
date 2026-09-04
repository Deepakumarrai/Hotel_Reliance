"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, CheckCircle2, Phone, Calendar, Users, DollarSign } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { BanquetEnquiryRecord } from "@/lib/admin/store";

export default function BanquetEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<BanquetEnquiryRecord[]>([]);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/banquet");
      const data = await res.json();
      if (data.enquiries) setEnquiries(data.enquiries);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: BanquetEnquiryRecord["status"]) => {
    try {
      const res = await fetch("/api/admin/banquet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Quotation #${id} status updated to ${status}`, "success");
        fetchEnquiries();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/banquet"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Quotation Pipeline
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Banquet & Wedding Enquiries
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Enquiry ID</th>
                  <th className="py-3 font-bold">Client</th>
                  <th className="py-3 font-bold">Event Type</th>
                  <th className="py-3 font-bold">Event Date</th>
                  <th className="py-3 font-bold text-center">Guests</th>
                  <th className="py-3 font-bold">Venue</th>
                  <th className="py-3 font-bold">Status</th>
                  <th className="py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D8B875]">{e.id}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{e.name}</div>
                      <div className="text-[10px] text-white/40">{e.phone}</div>
                    </td>
                    <td className="py-3.5 font-medium">{e.eventType}</td>
                    <td className="py-3.5 font-mono">{e.eventDate}</td>
                    <td className="py-3.5 text-center font-bold">{e.guestCount}</td>
                    <td className="py-3.5 text-[#C4984F] font-semibold">{e.venue}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.status === "CONFIRMED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : e.status === "QUOTED"
                            ? "bg-blue-950 text-blue-300 border border-blue-500/30"
                            : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {e.status === "NEW" && (
                        <button
                          onClick={() => updateStatus(e.id, "QUOTED")}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                        >
                          Send Quote
                        </button>
                      )}
                      {e.status === "QUOTED" && (
                        <button
                          onClick={() => updateStatus(e.id, "CONFIRMED")}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Confirm
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
