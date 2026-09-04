"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck2,
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CheckInModal } from "@/components/admin/CheckInModal";
import { CheckOutModal } from "@/components/admin/CheckOutModal";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { QuickBookingModal } from "@/components/admin/QuickBookingModal";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

function BookingsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "ALL";

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter.toUpperCase());
  const [roomTypeFilter, setRoomTypeFilter] = useState("ALL");

  // Modals
  const [checkInBooking, setCheckInBooking] = useState<AdminBooking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<AdminBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<AdminBooking | null>(null);
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/rooms"),
      ]);
      const bData = await bRes.json();
      const rData = await rRes.json();
      if (bData.bookings) setBookings(bData.bookings);
      if (rData.rooms) setRooms(rData.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.toLowerCase().includes(q) ||
      (b.roomNumber && b.roomNumber.toLowerCase().includes(q));

    const matchesRoomType = roomTypeFilter === "ALL" || b.roomType === roomTypeFilter;

    let matchesStatus = true;
    if (statusFilter === "ARRIVALS") {
      matchesStatus = b.checkInDate === todayStr && (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING");
    } else if (statusFilter === "DEPARTURES") {
      matchesStatus = b.checkOutDate === todayStr && b.bookingStatus === "CHECKED_IN";
    } else if (statusFilter !== "ALL") {
      matchesStatus = b.bookingStatus === statusFilter;
    }

    return matchesSearch && matchesRoomType && matchesStatus;
  });

  const exportCSV = () => {
    const headers = "Booking ID,Guest Name,Phone,Email,Room Type,Room Number,Check-In,Check-Out,Nights,Total Amount,Paid,Payment Status,Booking Status\n";
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.guestName}","${b.guestPhone}","${b.guestEmail}","${b.roomType}","${b.roomNumber || ""}","${b.checkInDate}","${b.checkOutDate}",${b.nights},${b.totalAmount},${b.paidAmount},"${b.paymentStatus}","${b.bookingStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hotel-reliance-bookings-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: "ALL", label: "All Stays" },
    { id: "ARRIVALS", label: "Today's Arrivals" },
    { id: "DEPARTURES", label: "Today's Departures" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "CHECKED_IN", label: "Checked In" },
    { id: "CHECKED_OUT", label: "Checked Out" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & New Booking CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            Reservation Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Guest Reservations & Stays
          </h1>
          <p className="text-xs text-[#E9DFD2]/60 mt-1">
            Manage booking lifecycle, check-in guests, assign rooms 101-412, and process checkouts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#E9DFD2] border border-[#1B2A42] transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-[#C4984F]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setQuickBookingOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-[#1B2A42] custom-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === t.id
                ? "bg-[#111E31] text-[#D8B875] border border-[#C4984F]/40 shadow-sm"
                : "text-[#E9DFD2]/60 hover:text-white hover:bg-[#111E31]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID (e.g. HR-98214), Guest Name, Phone or Room..."
            className="w-full bg-[#0B1423] border border-[#1B2A42] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4984F]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="w-full bg-[#0B1423] border border-[#1B2A42] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
          >
            <option value="ALL">All Room Categories</option>
            <option value="deluxe">Deluxe Room</option>
            <option value="executive">Executive Room</option>
            <option value="premium">Premium Suite</option>
            <option value="family">Family Suite</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CalendarCheck2 className="w-10 h-10 text-white/20 mx-auto" />
            <div className="text-sm font-semibold text-white/60">No bookings match the selected filter.</div>
            <p className="text-xs text-white/40">Try adjusting your search criteria or create a new reservation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Booking ID</th>
                  <th className="py-3 font-bold">Guest Details</th>
                  <th className="py-3 font-bold">Category & Room</th>
                  <th className="py-3 font-bold">Dates</th>
                  <th className="py-3 font-bold">Total Amount</th>
                  <th className="py-3 font-bold">Payment</th>
                  <th className="py-3 font-bold">Status</th>
                  <th className="py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D8B875]">{b.id}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{b.guestName}</div>
                      <div className="text-[10px] text-white/40">{b.guestPhone}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#E9DFD2]">
                        {b.roomNumber ? `Room ${b.roomNumber}` : "Unassigned"}
                      </span>
                      <div className="text-[10px] text-[#C4984F] capitalize">{b.roomType} Room</div>
                    </td>
                    <td className="py-3.5">
                      <div>{b.checkInDate} → {b.checkOutDate}</div>
                      <div className="text-[10px] text-white/40">{b.nights} Nights • {b.adults} Adults</div>
                    </td>
                    <td className="py-3.5 font-bold text-white">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.paymentStatus === "SUCCESS"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-purple-950 text-purple-400 border border-purple-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          b.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-900/60 text-emerald-300"
                            : b.bookingStatus === "CHECKED_OUT"
                            ? "bg-blue-900/60 text-blue-300"
                            : b.bookingStatus === "CANCELLED"
                            ? "bg-red-950 text-red-400"
                            : "bg-[#1B2A42] text-[#D8B875]"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="px-2.5 py-1 rounded bg-[#1B2A42] hover:bg-[#253755] text-white text-[11px] font-medium transition-colors inline-block"
                      >
                        Invoice / View
                      </Link>
                      {b.bookingStatus === "CONFIRMED" && (
                        <button
                          onClick={() => setCheckInBooking(b)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                        >
                          Check-In
                        </button>
                      )}
                      {b.bookingStatus === "CHECKED_IN" && (
                        <button
                          onClick={() => setCheckOutBooking(b)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors"
                        >
                          Check-Out
                        </button>
                      )}
                      {b.bookingStatus !== "CANCELLED" && b.bookingStatus !== "CHECKED_OUT" && (
                        <button
                          onClick={() => setCancelBooking(b)}
                          className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 text-[11px] transition-colors"
                        >
                          Cancel
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

      {/* Modals */}
      {checkInBooking && (
        <CheckInModal
          booking={checkInBooking}
          availableRooms={rooms}
          onClose={() => setCheckInBooking(null)}
          onSuccess={fetchData}
        />
      )}

      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          onClose={() => setCheckOutBooking(null)}
          onSuccess={fetchData}
        />
      )}

      {cancelBooking && (
        <CancelBookingModal
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onSuccess={fetchData}
        />
      )}

      {quickBookingOpen && (
        <QuickBookingModal
          onClose={() => setQuickBookingOpen(false)}
          onBookingCreated={fetchData}
        />
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="py-20 text-center text-xs text-white/50">Loading Bookings Ledger...</div>}>
        <BookingsContent />
      </Suspense>
    </AdminLayout>
  );
}
