"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  LogIn,
  LogOut,
  BedDouble,
  CircleDollarSign,
  TrendingUp,
  Percent,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  PartyPopper,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KPIStatCard } from "@/components/admin/KPIStatCard";
import { CheckInModal } from "@/components/admin/CheckInModal";
import { CheckOutModal } from "@/components/admin/CheckOutModal";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal active states
  const [checkInBooking, setCheckInBooking] = useState<AdminBooking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<AdminBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<AdminBooking | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/rooms"),
      ]);

      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();

      if (bookingsData.bookings) setBookings(bookingsData.bookings);
      if (roomsData.rooms) setRooms(roomsData.rooms);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live operational statistics
  const totalRoomsCount = rooms.length || 45;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const cleaningRooms = rooms.filter((r) => r.status === "CLEANING").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "MAINTENANCE").length;
  const reservedRooms = rooms.filter((r) => r.status === "RESERVED").length;
  const occupancyRate = Math.round((occupiedRooms / totalRoomsCount) * 100);

  const todayStr = new Date().toISOString().split("T")[0];

  const todaysArrivals = bookings.filter(
    (b) => b.checkInDate === todayStr && (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING")
  );

  const todaysDepartures = bookings.filter(
    (b) => b.checkOutDate === todayStr && b.bookingStatus === "CHECKED_IN"
  );

  const pendingBookings = bookings.filter((b) => b.bookingStatus === "PENDING" || b.paymentStatus === "PENDING");
  const completedBookings = bookings.filter((b) => b.bookingStatus === "CHECKED_OUT");
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === "CANCELLED");

  // Financial calculations
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== "CANCELLED")
    .reduce((acc, b) => acc + (b.paidAmount || 0), 0);

  const pendingRevenue = bookings
    .filter((b) => b.bookingStatus !== "CANCELLED" && b.paymentStatus === "PENDING")
    .reduce((acc, b) => acc + (b.totalAmount - (b.paidAmount || 0)), 0);

  const totalRefunds = bookings.reduce((acc, b) => acc + (b.refundAmount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#111E31] via-[#1B2A42]/50 to-[#111E31] p-6 rounded-2xl border border-[#1B2A42] shadow-xl">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Hotel Management Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Good Morning, Vikramaditya Roy
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Hotel Reliance • Co-operative Colony, Bokaro Steel City • 45 Rooms Active
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>All Bookings ({bookings.length})</span>
            </Link>
            <Link
              href="/admin/rooms"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
            >
              <BedDouble className="w-4 h-4" />
              <span>Rooms Grid</span>
            </Link>
          </div>
        </div>

        {/* Primary Operational KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPIStatCard
            title="Today's Arrivals"
            value={todaysArrivals.length}
            subtitle={`${todaysArrivals.filter((a) => a.paymentStatus === "SUCCESS").length} prepaid arrivals`}
            icon={<LogIn className="w-5 h-5" />}
            variant="emerald"
          />
          <KPIStatCard
            title="Today's Departures"
            value={todaysDepartures.length}
            subtitle={`${todaysDepartures.length} checkout inspections due`}
            icon={<LogOut className="w-5 h-5" />}
            variant="amber"
          />
          <KPIStatCard
            title="Occupied Rooms"
            value={`${occupiedRooms} / ${totalRoomsCount}`}
            subtitle={`${occupancyRate}% current hotel occupancy`}
            icon={<BedDouble className="w-5 h-5" />}
            variant="gold"
          />
          <KPIStatCard
            title="Total Revenue (MTD)"
            value={`₹${totalRevenue.toLocaleString()}`}
            subtitle={`₹${pendingRevenue.toLocaleString()} pending payments`}
            trend="14.8%"
            trendUp={true}
            icon={<CircleDollarSign className="w-5 h-5" />}
            variant="navy"
          />
        </div>

        {/* Secondary Metric Quick Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Available</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{availableRooms}</div>
            <span className="text-[10px] text-white/40">Ready to Book</span>
          </div>
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Cleaning</span>
            <div className="text-xl font-bold text-blue-400 mt-1">{cleaningRooms}</div>
            <span className="text-[10px] text-white/40">Housekeeping</span>
          </div>
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Maintenance</span>
            <div className="text-xl font-bold text-rose-400 mt-1">{maintenanceRooms}</div>
            <span className="text-[10px] text-white/40">Under Service</span>
          </div>
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Pending</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{pendingBookings.length}</div>
            <span className="text-[10px] text-white/40">Awaiting Action</span>
          </div>
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Avg Booking</span>
            <div className="text-xl font-bold text-[#D8B875] mt-1">₹4,250</div>
            <span className="text-[10px] text-white/40">Per Stay</span>
          </div>
          <div className="bg-[#111E31] border border-[#1B2A42] p-4 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#E9DFD2]/60">Total Stays</span>
            <div className="text-xl font-bold text-white mt-1">{bookings.length}</div>
            <span className="text-[10px] text-white/40">Ledger Count</span>
          </div>
        </div>

        {/* Two-Column Section: Today's Arrivals & Departures */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Today's Arrivals Table (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1B2A42] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-white">Today's Expected Arrivals</h2>
                  <p className="text-[11px] text-[#E9DFD2]/50">Check-In Window: 12:00 PM Onwards</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {todaysArrivals.length} Guests
              </span>
            </div>

            {todaysArrivals.length === 0 ? (
              <div className="py-12 text-center text-xs text-white/40">
                No pending arrivals scheduled for today.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                      <th className="py-2.5 font-bold">Booking ID</th>
                      <th className="py-2.5 font-bold">Guest</th>
                      <th className="py-2.5 font-bold">Category</th>
                      <th className="py-2.5 font-bold">Payment</th>
                      <th className="py-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                    {todaysArrivals.map((arrival) => (
                      <tr key={arrival.id} className="hover:bg-[#111E31]/50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#D8B875]">{arrival.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-white">{arrival.guestName}</div>
                          <div className="text-[10px] text-white/40">{arrival.guestPhone}</div>
                        </td>
                        <td className="py-3 capitalize text-[#E9DFD2]/80">{arrival.roomType}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              arrival.paymentStatus === "SUCCESS"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-950 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {arrival.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setCheckInBooking(arrival)}
                            className="px-3 py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Check-In
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Today's Departures Table (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1B2A42] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-white">Today's Departures</h2>
                  <p className="text-[11px] text-[#E9DFD2]/50">Check-Out Deadline: 11:00 AM</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
                {todaysDepartures.length} Rooms
              </span>
            </div>

            {todaysDepartures.length === 0 ? (
              <div className="py-12 text-center text-xs text-white/40">
                No check-outs scheduled for today.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                      <th className="py-2.5 font-bold">Guest</th>
                      <th className="py-2.5 font-bold">Room</th>
                      <th className="py-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                    {todaysDepartures.map((departure) => (
                      <tr key={departure.id} className="hover:bg-[#111E31]/50 transition-colors">
                        <td className="py-3">
                          <div className="font-semibold text-white">{departure.guestName}</div>
                          <div className="text-[10px] text-white/40">{departure.id}</div>
                        </td>
                        <td className="py-3 font-bold text-[#D8B875]">
                          Room {departure.roomNumber || "N/A"}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setCheckOutBooking(departure)}
                            className="px-3 py-1 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Check-Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Master Recent Bookings Ledger Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Recent Stays & Booking Ledger</h2>
              <p className="text-xs text-[#E9DFD2]/60">Complete audit trail of all online and direct walk-in reservations</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[#C4984F] hover:text-[#D8B875] flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>View All Reservations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Booking ID</th>
                  <th className="py-3 font-bold">Customer</th>
                  <th className="py-3 font-bold">Room Assigned</th>
                  <th className="py-3 font-bold">Check-In / Out</th>
                  <th className="py-3 font-bold">Amount</th>
                  <th className="py-3 font-bold">Payment</th>
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
                      <span className="font-medium text-[#E9DFD2]">
                        {booking.roomNumber ? `Room ${booking.roomNumber}` : "Unassigned"}
                      </span>
                      <div className="text-[10px] text-white/40 capitalize">{booking.roomType}</div>
                    </td>
                    <td className="py-3.5">
                      <div>{booking.checkInDate}</div>
                      <div className="text-[10px] text-white/40">to {booking.checkOutDate} ({booking.nights}N)</div>
                    </td>
                    <td className="py-3.5 font-bold text-white">₹{booking.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          booking.paymentStatus === "SUCCESS"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : booking.paymentStatus === "REFUNDED"
                            ? "bg-purple-950 text-purple-400 border border-purple-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          booking.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-900/60 text-emerald-300"
                            : booking.bookingStatus === "CHECKED_OUT"
                            ? "bg-blue-900/60 text-blue-300"
                            : booking.bookingStatus === "CANCELLED"
                            ? "bg-red-950 text-red-400"
                            : "bg-[#1B2A42] text-[#D8B875]"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="px-2.5 py-1 rounded bg-[#1B2A42] hover:bg-[#253755] text-white text-[11px] font-medium transition-colors"
                      >
                        View
                      </Link>
                      {booking.bookingStatus === "CONFIRMED" && (
                        <button
                          onClick={() => setCheckInBooking(booking)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                        >
                          Check-In
                        </button>
                      )}
                      {booking.bookingStatus === "CHECKED_IN" && (
                        <button
                          onClick={() => setCheckOutBooking(booking)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors"
                        >
                          Check-Out
                        </button>
                      )}
                      {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "CHECKED_OUT" && (
                        <button
                          onClick={() => setCancelBooking(booking)}
                          className="px-2 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 text-[11px] transition-colors"
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
    </AdminLayout>
  );
}
