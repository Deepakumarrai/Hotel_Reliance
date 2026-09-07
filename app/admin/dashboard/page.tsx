"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  LogIn,
  LogOut,
  BedDouble,
  CircleDollarSign,
  Users,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sliders,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Eye,
  Calendar,
  Layers,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KPIStatCard } from "@/components/admin/KPIStatCard";
import { CheckInModal } from "@/components/admin/CheckInModal";
import { CheckOutModal } from "@/components/admin/CheckOutModal";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { QuickBookingModal } from "@/components/admin/QuickBookingModal";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [adminName, setAdminName] = useState("Vikramaditya Roy (GM)");
  const [loading, setLoading] = useState(true);

  // Modal active states
  const [checkInBooking, setCheckInBooking] = useState<AdminBooking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<AdminBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<AdminBooking | null>(null);
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);

  // Time greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, roomsRes, sessionRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/rooms"),
        fetch("/api/admin/auth/session"),
      ]);

      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();
      const sessionData = await sessionRes.json();

      if (bookingsData.bookings) setBookings(bookingsData.bookings);
      if (roomsData.rooms) setRooms(roomsData.rooms);
      if (sessionData?.user?.name) setAdminName(sessionData.user.name);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Operational statistics
  const totalRoomsCount = rooms.length || 45;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const cleaningRooms = rooms.filter((r) => r.status === "CLEANING").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "MAINTENANCE").length;
  const occupancyRate = Math.round((occupiedRooms / totalRoomsCount) * 100) || 72;

  const todayStr = new Date().toISOString().split("T")[0];

  const todaysArrivals = bookings.filter(
    (b) => b.checkInDate === todayStr && (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING")
  );

  const todaysDepartures = bookings.filter(
    (b) => b.checkOutDate === todayStr && b.bookingStatus === "CHECKED_IN"
  );

  const pendingBookings = bookings.filter((b) => b.bookingStatus === "PENDING" || b.paymentStatus === "PENDING");

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== "CANCELLED")
    .reduce((acc, b) => acc + (b.paidAmount || 0), 0);

  // 7-day occupancy mock trend for visual chart
  const weeklyOccupancy = [
    { day: "Mon", rate: 58, count: 26 },
    { day: "Tue", rate: 64, count: 29 },
    { day: "Wed", rate: 72, count: 32 },
    { day: "Thu", rate: 78, count: 35 },
    { day: "Fri", rate: 89, count: 40 },
    { day: "Sat", rate: 93, count: 42 },
    { day: "Sun", rate: 82, count: 37 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Executive Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#111E31] via-[#1B2A42]/80 to-[#111E31] p-6 sm:p-7 rounded-2xl border border-[#1B2A42] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#9E712E]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Hotel Reliance • Executive Control Room
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {getGreeting()}, {adminName}
            </h1>
            <p className="text-xs sm:text-sm text-[#E9DFD2]/70 mt-1 font-light">
              Here's what's happening at Hotel Reliance today across all 4 floors and banquet halls.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuickBookingOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Reservation</span>
            </button>
          </div>
        </div>

        {/* 6 Core Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-[#C4984F]/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Occupancy</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#D8B875]">{occupancyRate}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">{occupiedRooms} Rooms In-House</span>
          </div>

          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Arrivals Today</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{todaysArrivals.length}</div>
            <span className="text-[10px] text-white/40 block mt-0.5">Expected Guests</span>
          </div>

          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-amber-500/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Departures Today</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{todaysDepartures.length}</div>
            <span className="text-[10px] text-white/40 block mt-0.5">Checkouts Due</span>
          </div>

          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-[#C4984F]/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Available Rooms</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">{availableRooms}</div>
            <span className="text-[10px] text-white/40 block mt-0.5">Ready for Guests</span>
          </div>

          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-rose-500/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Pending Requests</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-400">{pendingBookings.length}</div>
            <span className="text-[10px] text-white/40 block mt-0.5">Action Needed</span>
          </div>

          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl shadow-lg relative overflow-hidden hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60 block mb-1">Total Revenue</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 truncate">₹{totalRevenue.toLocaleString()}</div>
            <span className="text-[10px] text-[#D8B875] block mt-0.5">Verified Collections</span>
          </div>
        </div>

        {/* Visual Occupancy Graph & Room Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 7-Day Room Occupancy Chart (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1B2A42] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
                  Hotel Capacity Dynamics
                </span>
                <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                  7-Day Occupancy Visual Trend
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#D8B875]">Peak Weekend: 93%</span>
                <span className="text-[10px] text-white/40 block">42 of 45 Rooms</span>
              </div>
            </div>

            {/* Visual Bar Graph */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 border-b border-[#1B2A42] pb-2">
                {weeklyOccupancy.map((item) => (
                  <div key={item.day} className="flex flex-col items-center justify-end h-full group">
                    <span className="text-[10px] text-[#D8B875] font-mono font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.rate}%
                    </span>
                    <div
                      style={{ height: `${item.rate}%` }}
                      className={`w-full max-w-[38px] rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                        item.rate >= 90
                          ? "bg-gradient-to-t from-[#9E712E] to-[#D8B875]"
                          : item.rate >= 75
                          ? "bg-gradient-to-t from-emerald-700 to-teal-400"
                          : "bg-gradient-to-t from-[#1B2A42] to-[#275992]"
                      }`}
                    />
                    <span className="text-xs text-white/70 font-semibold mt-2">{item.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/40 pt-3">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D8B875]" />
                    <span>Peak Weekend</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span>High Demand</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#275992]" />
                    <span>Regular</span>
                  </span>
                </div>
                <span className="text-[#C4984F]">Average Weekly Occupancy: 77%</span>
              </div>
            </div>
          </div>

          {/* Right: Live Room Status Breakdown (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
                Physical Inventory
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                45 Room Status Matrix
              </h2>
              <p className="text-xs text-[#E9DFD2]/60 mt-1">Floors 1 - 4 live front desk distribution</p>

              <div className="space-y-3 mt-4 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111E31] border border-[#1B2A42]">
                  <span className="flex items-center space-x-2 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Available & Ready</span>
                  </span>
                  <span className="font-bold text-white">{availableRooms} Rooms</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111E31] border border-[#1B2A42]">
                  <span className="flex items-center space-x-2 text-blue-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Occupied by Guests</span>
                  </span>
                  <span className="font-bold text-white">{occupiedRooms} Rooms</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111E31] border border-[#1B2A42]">
                  <span className="flex items-center space-x-2 text-cyan-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Housekeeping Cleaning</span>
                  </span>
                  <span className="font-bold text-white">{cleaningRooms} Rooms</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111E31] border border-[#1B2A42]">
                  <span className="flex items-center space-x-2 text-rose-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Maintenance / Service</span>
                  </span>
                  <span className="font-bold text-white">{maintenanceRooms} Rooms</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/rooms"
              className="mt-4 w-full py-2.5 text-center rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors block"
            >
              Open Interactive Floor Grid →
            </Link>
          </div>
        </div>

        {/* Large Luxury Quick Action Buttons */}
        <div className="bg-[#0B1423] border border-[#1B2A42] p-6 rounded-2xl shadow-xl space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
            Executive Command Actions
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <button
              onClick={() => setQuickBookingOpen(true)}
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">+ New Booking</span>
              <span className="text-[10px] text-white/40">Front desk walk-in</span>
            </button>

            <Link
              href="/admin/rooms/types"
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group"
            >
              <BedDouble className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Configure Room</span>
              <span className="text-[10px] text-white/40">Category specs</span>
            </Link>

            <Link
              href="/admin/pricing"
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group"
            >
              <Sliders className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Update Pricing</span>
              <span className="text-[10px] text-white/40">Weekend & surge</span>
            </Link>

            <Link
              href="/admin/availability"
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group"
            >
              <Calendar className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Block / Calendar</span>
              <span className="text-[10px] text-white/40">7-Day matrix</span>
            </Link>

            <Link
              href="/admin/staff"
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group"
            >
              <Users className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Staff Roster</span>
              <span className="text-[10px] text-white/40">Leadership & HR</span>
            </Link>

            <Link
              href="/admin/content/gallery"
              className="p-4 rounded-xl bg-[#111E31] border border-[#1B2A42] hover:border-[#C4984F] text-center transition-all group"
            >
              <ImageIcon className="w-5 h-5 text-[#D8B875] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Upload Gallery</span>
              <span className="text-[10px] text-white/40">Visual media</span>
            </Link>
          </div>
        </div>

        {/* Today's Reservations Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
                Front Desk Operations
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Today's Guest Ledger & Activity
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[#C4984F] hover:text-[#D8B875] flex items-center space-x-1 uppercase tracking-wider transition-colors"
            >
              <span>View Full Ledger ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Booking ID</th>
                  <th className="py-3 font-bold">Guest Details</th>
                  <th className="py-3 font-bold">Category & Room</th>
                  <th className="py-3 font-bold">Check-In</th>
                  <th className="py-3 font-bold">Check-Out</th>
                  <th className="py-3 font-bold">Status</th>
                  <th className="py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {bookings.slice(0, 6).map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D8B875]">{booking.id}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{booking.guestName}</div>
                      <div className="text-[10px] text-white/40">{booking.guestPhone}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#E9DFD2]">
                        {booking.roomNumber ? `Room ${booking.roomNumber}` : "Unassigned"}
                      </span>
                      <div className="text-[10px] text-[#C4984F] capitalize">{booking.roomType} Room</div>
                    </td>
                    <td className="py-3.5 font-mono text-white">{booking.checkInDate}</td>
                    <td className="py-3.5 font-mono text-white">{booking.checkOutDate}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          booking.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                            : booking.bookingStatus === "CHECKED_OUT"
                            ? "bg-blue-900/60 text-blue-300 border border-blue-500/30"
                            : booking.bookingStatus === "CANCELLED"
                            ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                            : "bg-[#1B2A42] text-[#D8B875] border border-[#C4984F]/30"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="px-2.5 py-1 rounded bg-[#1B2A42] hover:bg-[#253755] text-white text-[11px] font-medium transition-colors inline-block"
                      >
                        View Booking
                      </Link>
                      {booking.bookingStatus === "CONFIRMED" && (
                        <button
                          onClick={() => setCheckInBooking(booking)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Check-In
                        </button>
                      )}
                      {booking.bookingStatus === "CHECKED_IN" && (
                        <button
                          onClick={() => setCheckOutBooking(booking)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Check-Out
                        </button>
                      )}
                      <a
                        href={`tel:${booking.guestPhone.replace(/\s+/g, "")}`}
                        className="px-2.5 py-1 rounded bg-[#111E31] hover:bg-[#1B2A42] text-[#D8B875] text-[11px] font-medium transition-colors inline-flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contact</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {checkInBooking && (
        <CheckInModal
          booking={checkInBooking}
          availableRooms={rooms}
          onClose={() => setCheckInBooking(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          onClose={() => setCheckOutBooking(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {cancelBooking && (
        <CancelBookingModal
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {quickBookingOpen && (
        <QuickBookingModal
          onClose={() => setQuickBookingOpen(false)}
          onBookingCreated={fetchDashboardData}
        />
      )}
    </AdminLayout>
  );
}
