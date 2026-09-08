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

export default function AdminDashboardPage() {
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

  // Standard Fallback Data matching screenshot
  const displayBookings = bookings.length > 0 ? bookings : [
    {
      id: "HR1024",
      guestName: "Rahul Sharma",
      roomType: "deluxe",
      roomNumber: "204",
      checkInDate: "07 Sep 2026",
      checkOutDate: "09 Sep 2026",
      guests: { adults: 2, children: 0 },
      paidAmount: 4998,
      totalAmount: 4998,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
    },
    {
      id: "HR1023",
      guestName: "Priya Singh",
      roomType: "executive",
      roomNumber: "302",
      checkInDate: "07 Sep 2026",
      checkOutDate: "10 Sep 2026",
      guests: { adults: 2, children: 1 },
      paidAmount: 0,
      totalAmount: 8997,
      paymentStatus: "PENDING",
      bookingStatus: "PENDING",
    },
    {
      id: "HR1022",
      guestName: "Amit Verma",
      roomType: "premium",
      roomNumber: "401",
      checkInDate: "06 Sep 2026",
      checkOutDate: "08 Sep 2026",
      guests: { adults: 2, children: 0 },
      paidAmount: 6999,
      totalAmount: 6999,
      paymentStatus: "PAID",
      bookingStatus: "CHECKED_IN",
    },
    {
      id: "HR1021",
      guestName: "Neha Gupta",
      roomType: "family",
      roomNumber: "105",
      checkInDate: "07 Sep 2026",
      checkOutDate: "09 Sep 2026",
      guests: { adults: 2, children: 2 },
      paidAmount: 9499,
      totalAmount: 9499,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
    },
    {
      id: "HR1020",
      guestName: "Karan Mehta",
      roomType: "deluxe",
      roomNumber: "208",
      checkInDate: "05 Sep 2026",
      checkOutDate: "07 Sep 2026",
      guests: { adults: 2, children: 0 },
      paidAmount: 4998,
      totalAmount: 4998,
      paymentStatus: "PAID",
      bookingStatus: "CHECKED_OUT",
    },
  ];

  const getGuestInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
        return "Deluxe Room";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1520px] mx-auto pb-8 font-sans">
        {/* 1. Welcome Back Hero Banner */}
        <WelcomeHero
          adminName={adminName}
          greeting={getGreeting()}
        />

        {/* 2. Six Luxury KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <KPIStatCard
            icon={<Bed className="w-5 h-5" />}
            label="Occupancy"
            value="72%"
            changeText="↑ +12% from last week"
            isPositive={true}
          />

          <KPIStatCard
            icon={<Plane className="w-5 h-5" />}
            label="Arrivals Today"
            value="18"
            changeText="↑ 4 more than yesterday"
            isPositive={true}
          />

          <KPIStatCard
            icon={<Briefcase className="w-5 h-5" />}
            label="Departures Today"
            value="12"
            changeText="↓ 2 less than yesterday"
            isPositive={false}
          />

          <KPIStatCard
            icon={<DoorOpen className="w-5 h-5" />}
            label="Available Rooms"
            value="26"
            changeText="Out of 45 rooms"
            hasProgressBar={true}
            progressPercent={58}
          />

          <KPIStatCard
            icon={<FileText className="w-5 h-5" />}
            label="Pending Requests"
            value="7"
            changeText="↓ Action needed"
            isPositive={false}
          />

          <KPIStatCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Today's Revenue"
            value="₹84,500"
            changeText="↑ +18% from yesterday"
            isPositive={true}
          />
        </div>

        {/* 3. Middle Section: Occupancy Overview (4.25 Cols) | Revenue Summary (4.5 Cols) | Quick Actions (3.25 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Chart: Occupancy Overview (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <OccupancyChart />
          </div>

          {/* Middle Chart: Revenue Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <RevenueChart />
          </div>

          {/* Right Panel: Quick Actions (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="border-b border-[#EAE2D5]/70 pb-3">
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
                Quick Actions
              </h2>
              <p className="text-[11px] text-[#78716C] font-light mt-0.5">
                Everything you need, right here
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

              {/* 2. Add Room */}
              <Link
                href="/admin/rooms"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <BedDouble className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Add Room</span>
              </Link>

              {/* 3. Update Pricing */}
              <Link
                href="/admin/pricing"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <Sliders className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Update Pricing</span>
              </Link>

              {/* 4. Block Room */}
              <Link
                href="/admin/availability"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <DoorOpen className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Block Room</span>
              </Link>

              {/* 5. Add Staff */}
              <Link
                href="/admin/staff"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <Users className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Add Staff</span>
              </Link>

              {/* 6. Manage Banquet */}
              <Link
                href="/admin/banquet"
                className="p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-[#111E31] flex flex-col items-center justify-center text-center transition-all group"
              >
                <PartyPopper className="w-4 h-4 text-[#8C6527] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold">Manage Banquet</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Bottom Table: Recent Reservations */}
        <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Table Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D5]/70 pb-3.5">
            <div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
                Recent Reservations
              </h2>
              <p className="text-[11px] text-[#78716C] font-light mt-0.5">
                Latest bookings across all channels
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
                  <th className="py-2.5 font-semibold">Guests</th>
                  <th className="py-2.5 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Payment</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5]/60 text-[#2D2A26]">
                {displayBookings.slice(0, 5).map((booking: any) => {
                  const initials = getGuestInitials(booking.guestName || "Guest");
                  const isPaid = booking.paymentStatus === "PAID";
                  const guestCount = booking.guests
                    ? `${booking.guests.adults || 2} Adults${
                        booking.guests.children ? `, ${booking.guests.children} Child` : ""
                      }`
                    : "2 Adults";

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
                        {getRoomTypeLabel(booking.roomType)}
                      </td>

                      {/* Check-In */}
                      <td className="py-3.5 font-mono text-[11px] text-[#57534E]">
                        {booking.checkInDate}
                      </td>

                      {/* Check-Out */}
                      <td className="py-3.5 font-mono text-[11px] text-[#57534E]">
                        {booking.checkOutDate}
                      </td>

                      {/* Guests */}
                      <td className="py-3.5 text-[#57534E]">
                        {guestCount}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 font-semibold text-[#111E31]">
                        ₹{booking.totalAmount?.toLocaleString() || "4,998"}
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
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Reservation Cards - Screen < 768px */}
          <div className="block md:hidden space-y-3">
            {displayBookings.slice(0, 5).map((booking: any) => {
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
