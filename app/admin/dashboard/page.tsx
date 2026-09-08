"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bed,
  Plane,
  Briefcase,
  DoorOpen,
  FileText,
  IndianRupee,
  CalendarCheck2,
  BedDouble,
  Sliders,
  Calendar,
  Users,
  PartyPopper,
  ArrowRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { WelcomeHero } from "@/components/admin/WelcomeHero";
import { KPIStatCard } from "@/components/admin/KPIStatCard";
import { OccupancyChart } from "@/components/admin/OccupancyChart";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { QuickBookingModal } from "@/components/admin/QuickBookingModal";
import { CheckInModal } from "@/components/admin/CheckInModal";
import { CheckOutModal } from "@/components/admin/CheckOutModal";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

interface DashboardStats {
  totalRooms: number;
  occupancyRate: number;
  occupiedRooms: number;
  availableRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  todayArrivals: number;
  todayDepartures: number;
  totalRevenue: number;
  totalPaid: number;
  roomCounts: {
    available: number;
    occupied: number;
    reserved: number;
    cleaning: number;
    maintenance: number;
    outOfService: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [adminName, setAdminName] = useState("Vikramaditya Roy");
  const [loading, setLoading] = useState(true);

  // Modals
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);
  const [checkInBooking, setCheckInBooking] = useState<AdminBooking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<AdminBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<AdminBooking | null>(null);

  // Time greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboardData = async () => {
    try {
      const [dashRes, roomsRes, sessionRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/rooms"),
        fetch("/api/admin/auth/session"),
      ]);

      const dashData = await dashRes.json();
      const roomsData = await roomsRes.json();
      const sessionData = await sessionRes.json();

      if (dashData?.stats) {
        setStats(dashData.stats);
      }
      if (Array.isArray(dashData?.recentBookings)) {
        setBookings(dashData.recentBookings);
      }
      if (Array.isArray(roomsData?.rooms)) {
        setRooms(roomsData.rooms);
      }
      if (sessionData?.user?.name) {
        setAdminName(sessionData.user.name);
      }
    } catch (err) {
      console.error("Failed to load live dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGuestInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GU";
  };

  const getRoomTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "deluxe":
        return "Deluxe Room";
      case "executive":
        return "Executive Room";
      case "premium":
        return "Premium Room";
      case "family":
        return "Family Room";
      default:
        return type ? `${type.charAt(0).toUpperCase()}${type.slice(1)} Room` : "Deluxe Room";
    }
  };

  const pendingCount = bookings.filter((b) => b.bookingStatus === "PENDING").length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 max-w-[1520px] mx-auto pb-8 font-sans animate-in fade-in duration-200">
          <div className="h-32 w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-2xl p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-[#E8DFD2]/60 rounded animate-pulse" />
              <div className="h-8 w-64 bg-[#E8DFD2]/80 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-white border border-[#E8DFD2] rounded-xl p-4 animate-pulse" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1520px] mx-auto pb-8 font-sans">
        {/* 1. Welcome Back Hero Banner */}
        <WelcomeHero
          adminName={adminName}
          greeting={getGreeting()}
        />

        {/* 2. Six Luxury KPI Stat Cards Connected to Live Neon PostgreSQL */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <KPIStatCard
            icon={<Bed className="w-5 h-5" />}
            label="Occupancy"
            value={`${stats ? stats.occupancyRate : 0}%`}
            changeText={stats && stats.occupancyRate > 0 ? "Live occupied units" : "Ready for check-ins"}
            isPositive={true}
          />

          <KPIStatCard
            icon={<Plane className="w-5 h-5" />}
            label="Arrivals Today"
            value={String(stats?.todayArrivals ?? 0)}
            changeText={stats?.todayArrivals ? "Scheduled today" : "No arrivals today"}
            isPositive={(stats?.todayArrivals ?? 0) > 0}
          />

          <KPIStatCard
            icon={<Briefcase className="w-5 h-5" />}
            label="Departures Today"
            value={String(stats?.todayDepartures ?? 0)}
            changeText={stats?.todayDepartures ? "Check-outs pending" : "No departures today"}
            isPositive={true}
          />

          <KPIStatCard
            icon={<DoorOpen className="w-5 h-5" />}
            label="Available Rooms"
            value={String(stats?.availableRooms ?? rooms.filter((r) => r.status === "AVAILABLE").length)}
            changeText={`Out of ${(stats?.totalRooms ?? rooms.length) || 45} rooms`}
            hasProgressBar={true}
            progressPercent={
              stats && stats.totalRooms > 0
                ? Math.round((stats.availableRooms / stats.totalRooms) * 100)
                : 100
            }
          />

          <KPIStatCard
            icon={<FileText className="w-5 h-5" />}
            label="Pending Bookings"
            value={String(pendingCount)}
            changeText={pendingCount > 0 ? "Action required" : "All settled"}
            isPositive={pendingCount === 0}
          />

          <KPIStatCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Total Revenue"
            value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
            changeText={`₹${(stats?.totalPaid ?? 0).toLocaleString("en-IN")} collected`}
            isPositive={true}
          />
        </div>

        {/* 3. Middle Section: Occupancy Overview | Revenue Summary | Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Chart: Occupancy Overview (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <OccupancyChart
              roomCounts={stats?.roomCounts}
              totalRooms={stats?.totalRooms ?? 45}
            />
          </div>

          {/* Middle Chart: Revenue Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <RevenueChart
              totalRevenue={stats?.totalRevenue ?? 0}
              totalBookings={bookings.length}
            />
          </div>

          {/* Right Panel: Quick Actions (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="border-b border-[#EAE2D5]/70 pb-3">
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
                Quick Actions
              </h2>
              <p className="text-[11px] text-[#78716C] font-light mt-0.5">
                Front desk & operational shortcuts
              </p>
            </div>

            {/* 6 Grid Action Tiles */}
            <div className="grid grid-cols-2 gap-2.5 pt-3.5 pb-1 flex-1">
              {/* 1. New Reservation */}
              <button
                onClick={() => setQuickBookingOpen(true)}
                className="p-3 rounded-lg bg-[#9E712E] hover:bg-[#8A6124] text-white shadow-xs flex flex-col items-center justify-center text-center transition-all group cursor-pointer active:scale-95"
              >
                <CalendarCheck2 className="w-4 h-4 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold tracking-wide">New Reservation</span>
              </button>

              {/* 2. Physical Rooms */}
              <Link
                href="/admin/rooms"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <BedDouble className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Rooms (45)</span>
              </Link>

              {/* 3. Update Pricing */}
              <Link
                href="/admin/pricing"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <Sliders className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Update Pricing</span>
              </Link>

              {/* 4. Availability Calendar */}
              <Link
                href="/admin/availability"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <DoorOpen className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Availability</span>
              </Link>

              {/* 5. Staff Directory */}
              <Link
                href="/admin/staff"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <Users className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Staff Team</span>
              </Link>

              {/* 6. Manage Banquet */}
              <Link
                href="/admin/banquet"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <PartyPopper className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Banquets</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Bottom Table: Live Recent Reservations */}
        <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Table Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D5]/70 pb-3.5">
            <div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
                Recent Reservations
              </h2>
              <p className="text-[11px] text-[#78716C] font-light mt-0.5">
                Live bookings from Neon PostgreSQL database
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="text-[11px] font-semibold text-[#8C6527] hover:text-[#5E4419] flex items-center space-x-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Reservations</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Table Data Container - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE2D5] text-[10px] uppercase tracking-wider text-[#78716C]">
                  <th className="py-2.5 font-semibold">#</th>
                  <th className="py-2.5 font-semibold">Guest Name</th>
                  <th className="py-2.5 font-semibold">Room</th>
                  <th className="py-2.5 font-semibold">Check-in</th>
                  <th className="py-2.5 font-semibold">Check-out</th>
                  <th className="py-2.5 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Payment</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5]/60 text-[#2D2A26]">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-[#78716C]">
                      <div className="font-medium text-sm">No reservations recorded yet.</div>
                      <div className="text-xs text-[#A8A29E] mt-1">Walk-in and online bookings will stream here live.</div>
                    </td>
                  </tr>
                ) : (
                  bookings.slice(0, 6).map((booking) => {
                    const initials = getGuestInitials(booking.guestName || "Guest");
                    const isPaid = booking.paymentStatus === "PAID" || booking.paymentStatus === "SUCCESS";

                    return (
                      <tr key={booking.id} className="hover:bg-[#FAF7F2] transition-colors">
                        {/* Booking ID */}
                        <td className="py-3.5 font-mono text-[11px] font-semibold text-[#111E31]">
                          {booking.id}
                        </td>

                        {/* Guest Name with Circle Initial */}
                        <td className="py-3.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-6 h-6 rounded-full bg-[#E5DEC9] text-[#8C6527] font-semibold text-[9px] flex items-center justify-center flex-shrink-0">
                              {initials}
                            </div>
                            <span className="font-semibold text-[#111E31]">
                              {booking.guestName}
                            </span>
                          </div>
                        </td>

                        {/* Room Type */}
                        <td className="py-3.5 text-[#57534E]">
                          {booking.roomNumber ? `Room ${booking.roomNumber} (${getRoomTypeLabel(booking.roomType)})` : getRoomTypeLabel(booking.roomType)}
                        </td>

                        {/* Check-In */}
                        <td className="py-3.5 font-mono text-[11px] text-[#57534E]">
                          {booking.checkInDate}
                        </td>

                        {/* Check-Out */}
                        <td className="py-3.5 font-mono text-[11px] text-[#57534E]">
                          {booking.checkOutDate}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 font-semibold text-[#111E31]">
                          ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                        </td>

                        {/* Payment Status Dot */}
                        <td className="py-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPaid ? "bg-[#10B981]" : "bg-[#F59E0B]"
                              }`}
                            />
                            <span
                              className={`text-[11px] font-medium ${
                                isPaid ? "text-[#10B981]" : "text-[#D97706]"
                              }`}
                            >
                              {isPaid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </td>

                        {/* Status Pill Badge */}
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              booking.bookingStatus === "CHECKED_IN"
                                ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                                : booking.bookingStatus === "CHECKED_OUT"
                                ? "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                                : booking.bookingStatus === "CANCELLED"
                                ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                                : booking.bookingStatus === "PENDING"
                                ? "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                                : "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                booking.bookingStatus === "CHECKED_IN"
                                  ? "bg-[#2563EB]"
                                  : booking.bookingStatus === "CHECKED_OUT"
                                  ? "bg-[#6B7280]"
                                  : booking.bookingStatus === "CANCELLED"
                                  ? "bg-[#DC2626]"
                                  : booking.bookingStatus === "PENDING"
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#10B981]"
                              }`}
                            />
                            <span>
                              {booking.bookingStatus === "CHECKED_IN"
                                ? "Checked In"
                                : booking.bookingStatus === "CHECKED_OUT"
                                ? "Checked Out"
                                : booking.bookingStatus === "CANCELLED"
                                ? "Cancelled"
                                : booking.bookingStatus === "PENDING"
                                ? "Pending"
                                : "Confirmed"}
                            </span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <Link
                              href={`/admin/bookings/${booking.id}`}
                              className="px-2.5 py-1 rounded border border-[#EAE2D5] bg-white hover:bg-[#FAF7F2] text-[#111E31] text-[11px] font-medium transition-colors shadow-2xs"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => {
                                if (booking.bookingStatus === "CONFIRMED") setCheckInBooking(booking);
                                else if (booking.bookingStatus === "CHECKED_IN") setCheckOutBooking(booking);
                                else setCancelBooking(booking);
                              }}
                              className="p-1 text-[#A8A29E] hover:text-[#111E31] rounded hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Reservation Cards - Screen < 768px */}
          <div className="block md:hidden space-y-3">
            {bookings.slice(0, 5).map((booking: any) => {
              const initials = getGuestInitials(booking.guestName || "Guest");
              const isPaid = booking.paymentStatus === "PAID";

              return (
                <div
                  key={booking.id}
                  className="bg-[#FCFAF6] border border-[#EAE2D5] rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E5DEC9] text-[#8C6527] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <span className="font-semibold text-[#111E31] text-sm block leading-tight">
                          {booking.guestName}
                        </span>
                        <span className="font-mono text-[11px] text-[#8C6527] font-bold">
                          {booking.id}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        booking.bookingStatus === "CHECKED_IN"
                          ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                          : booking.bookingStatus === "CHECKED_OUT"
                          ? "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                          : booking.bookingStatus === "PENDING"
                          ? "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                          : "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                      }`}
                    >
                      {booking.bookingStatus === "CHECKED_IN"
                        ? "Checked In"
                        : booking.bookingStatus === "CHECKED_OUT"
                        ? "Checked Out"
                        : booking.bookingStatus === "PENDING"
                        ? "Pending"
                        : "Confirmed"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E] bg-white p-2.5 rounded-lg border border-[#EAE2D5]">
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">Room</span>
                      <span className="font-medium text-[#111E31]">{getRoomTypeLabel(booking.roomType)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">Stay Dates</span>
                      <span className="font-mono text-[11px] text-[#111E31]">{booking.checkInDate} → {booking.checkOutDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">Amount</span>
                      <span className="font-bold text-[#111E31]">₹{booking.totalAmount?.toLocaleString() || "4,998"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">Payment</span>
                      <span className={`font-semibold ${isPaid ? "text-[#10B981]" : "text-[#D97706]"}`}>
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="flex-1 py-2 rounded-lg border border-[#EAE2D5] bg-white hover:bg-[#FAF7F2] text-[#111E31] text-xs font-semibold text-center transition-colors shadow-2xs"
                    >
                      View Details
                    </Link>
                    {booking.bookingStatus === "CONFIRMED" && (
                      <button
                        onClick={() => setCheckInBooking(booking)}
                        className="flex-1 py-2 rounded-lg bg-[#0AA878] hover:bg-[#088c64] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Check-In
                      </button>
                    )}
                    {booking.bookingStatus === "CHECKED_IN" && (
                      <button
                        onClick={() => setCheckOutBooking(booking)}
                        className="flex-1 py-2 rounded-lg bg-[#9E712E] hover:bg-[#8A6124] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Check-Out
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modals for Functional Interaction */}
        {quickBookingOpen && (
          <QuickBookingModal
            onClose={() => setQuickBookingOpen(false)}
            onBookingCreated={() => fetchDashboardData()}
          />
        )}

        {checkInBooking && (
          <CheckInModal
            booking={checkInBooking}
            availableRooms={rooms}
            onClose={() => setCheckInBooking(null)}
            onSuccess={() => {
              setCheckInBooking(null);
              fetchDashboardData();
            }}
          />
        )}

        {checkOutBooking && (
          <CheckOutModal
            booking={checkOutBooking}
            onClose={() => setCheckOutBooking(null)}
            onSuccess={() => {
              setCheckOutBooking(null);
              fetchDashboardData();
            }}
          />
        )}

        {cancelBooking && (
          <CancelBookingModal
            booking={cancelBooking}
            onClose={() => setCancelBooking(null)}
            onSuccess={() => {
              setCancelBooking(null);
              fetchDashboardData();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
