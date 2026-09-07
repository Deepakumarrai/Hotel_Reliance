"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed, CheckCircle2, Phone, Calendar, Clock, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface TableEnquiry {
  id: string;
  guestName: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: string;
  requests?: string;
}

export default function RestaurantEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<TableEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/restaurant")
      .then((r) => r.json())
      .then((d) => {
        if (d?.restaurant?.enquiries) {
          setEnquiries(d.restaurant.enquiries);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const confirmReservation = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "CONFIRMED" } : e))
    );
    showToast(`Table reservation #${id} confirmed!`, "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
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
                Dining & Table Reservations
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Kwality Restaurant Bookings
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-[#D8B875] font-serif">
              Loading table reservation ledger from database...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/50">
              No table reservations recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                    <th className="py-3 font-bold">Booking ID</th>
                    <th className="py-3 font-bold">Guest Name</th>
                    <th className="py-3 font-bold">Phone</th>
                    <th className="py-3 font-bold text-center">Party Size</th>
                    <th className="py-3 font-bold">Dining Slot</th>
                    <th className="py-3 font-bold">Special Notes</th>
                    <th className="py-3 font-bold">Status</th>
                    <th className="py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                  {enquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-[#111E31]/50 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#D8B875]">{e.id}</td>
                      <td className="py-3.5 font-semibold text-white">{e.guestName}</td>
                      <td className="py-3.5 font-mono text-[#D8B875]">{e.phone}</td>
                      <td className="py-3.5 text-center font-bold">{e.guests} Guests</td>
                      <td className="py-3.5">
                        <div className="font-mono text-white">{e.date}</div>
                        <div className="text-[10px] text-white/40">{e.time}</div>
                      </td>
                      <td className="py-3.5 text-white/70 italic text-[11px] max-w-xs truncate">
                        {e.requests || "Standard Table"}
                      </td>
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
                      <td className="py-3.5 text-right">
                        {e.status !== "CONFIRMED" && (
                          <button
                            onClick={() => confirmReservation(e.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Confirm Table
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
