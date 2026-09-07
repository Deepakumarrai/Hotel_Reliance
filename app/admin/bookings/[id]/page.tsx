"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Phone,
  Mail,
  BedDouble,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Receipt,
  Hotel,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CheckInModal } from "@/components/admin/CheckInModal";
import { CheckOutModal } from "@/components/admin/CheckOutModal";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export default function SingleBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/rooms"),
      ]);
      const bData = await bRes.json();
      const rData = await rRes.json();
      if (bData.bookings) {
        const found = bData.bookings.find((b: AdminBooking) => b.id === id);
        setBooking(found || null);
      }
      if (rData.rooms) setRooms(rData.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-[#8A8277] text-xs font-serif animate-pulse">
          Loading reservation folio details for #{id}...
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <div className="py-20 text-center space-y-3">
          <h2 className="text-xl font-serif text-[#111923]">Booking #{id} Not Found</h2>
          <p className="text-xs text-[#6B6255]">The requested reservation record does not exist.</p>
          <Link
            href="/admin/bookings"
            className="inline-block px-4 py-2 bg-[#A97A38] text-white text-xs font-semibold rounded-xl"
          >
            ← Back to All Reservations
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Main Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Folio & Invoice Breakdown
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/bookings"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Bookings"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                  {booking.guestName}
                </h1>
                <span className="font-mono text-sm font-bold text-[#A97A38] bg-[#FAF7F2] border border-[#E8DFD2] px-2.5 py-1 rounded-md">
                  #{booking.id}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                    booking.bookingStatus === "CHECKED_IN"
                      ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                      : booking.bookingStatus === "CHECKED_OUT"
                      ? "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]"
                      : booking.bookingStatus === "CANCELLED"
                      ? "bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]"
                      : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Official tax invoice folio, room assignment ledger, and verified payment gateway records.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E8DFD2] hover:bg-[#FAF7F2] text-[#111923] text-xs font-semibold flex items-center space-x-2 transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#A97A38]" />
              <span>Print Tax Invoice</span>
            </button>

            {booking.bookingStatus === "CONFIRMED" && (
              <button
                onClick={() => setCheckInOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <span>Check-In Guest</span>
              </button>
            )}

            {booking.bookingStatus === "CHECKED_IN" && (
              <button
                onClick={() => setCheckOutOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <span>Check-Out & Settle</span>
              </button>
            )}

            {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "CHECKED_OUT" && (
              <button
                onClick={() => setCancelOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-[#FFE4E6] hover:bg-[#FECDD3] text-[#E11D48] border border-[#FECDD3] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* 2. Official Tax Invoice Folio Card */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-6 print:border-black">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-[#EDE6DB] pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6 text-[#A97A38]" />
                <span className="font-serif text-2xl font-bold tracking-wider text-[#111923] uppercase">
                  Hotel Reliance
                </span>
              </div>
              <p className="text-xs text-[#6B6255] max-w-sm">
                Opp. HP Petrol Pump, Bye Pass Road, Chas, Bokaro Steel City, Jharkhand - 827013
              </p>
              <p className="text-xs text-[#A97A38] font-mono font-medium">
                GSTIN: 20AABCH8920K1ZX • Phone: +91 92629 97777 / +91 6542 265000
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A97A38] block">
                OFFICIAL BOOKING CONFIRMATION & TAX INVOICE
              </span>
              <div className="font-mono text-xl font-bold text-[#111923]">
                #{booking.id}
              </div>
              <div className="text-xs text-[#78716C]">
                Issued: {new Date(booking.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
              </div>
            </div>
          </div>

          {/* Grid: Guest & Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FCFAF6] p-5 rounded-2xl border border-[#E8DFD2] text-xs">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                Guest Information
              </span>
              <div className="font-bold text-base text-[#111923]">{booking.guestName}</div>
              <div className="text-[#6B6255] flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A97A38]" />
                <span className="font-mono">{booking.guestPhone}</span>
              </div>
              <div className="text-[#6B6255] flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A97A38]" />
                <span>{booking.guestEmail || "No email recorded"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                Stay Specifications
              </span>
              <div className="font-bold text-base text-[#111923] capitalize">
                {booking.roomType} Room {booking.roomNumber ? `(Room #${booking.roomNumber})` : "(Unassigned)"}
              </div>
              <div className="text-[#6B6255]">
                Check-In: <strong className="text-[#111923]">{booking.checkInDate}</strong> (12:00 PM)
              </div>
              <div className="text-[#6B6255]">
                Check-Out: <strong className="text-[#111923]">{booking.checkOutDate}</strong> (11:00 AM)
              </div>
              <div className="text-[#6B6255]">
                Occupancy: {booking.adults} Adults {booking.children > 0 && `• ${booking.children} Kids`} • {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#E8DFD2] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-[#A97A38] border-b border-[#E8DFD2]">
                <tr>
                  <th className="p-3.5 font-bold">Item Description</th>
                  <th className="p-3.5 font-bold text-center">Nights</th>
                  <th className="p-3.5 font-bold text-right">Rate / Night</th>
                  <th className="p-3.5 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                <tr>
                  <td className="p-3.5">
                    <div className="font-bold capitalize">{booking.roomType} Room Accommodation</div>
                    <div className="text-[10px] text-[#78716C]">Includes High-Speed Wi-Fi & 24/7 Room Service Support</div>
                  </td>
                  <td className="p-3.5 text-center font-medium">{booking.nights}</td>
                  <td className="p-3.5 text-right font-mono">₹{Math.round(booking.baseAmount / booking.nights).toLocaleString()}</td>
                  <td className="p-3.5 text-right font-bold font-mono">₹{booking.baseAmount.toLocaleString()}</td>
                </tr>
                {booking.discountAmount > 0 && (
                  <tr className="text-[#15803D]">
                    <td className="p-3.5">Seasonal / Coupon Discount Applied</td>
                    <td className="p-3.5 text-center">—</td>
                    <td className="p-3.5 text-right">—</td>
                    <td className="p-3.5 text-right font-bold font-mono">-₹{booking.discountAmount.toLocaleString()}</td>
                  </tr>
                )}
                <tr>
                  <td className="p-3.5">Goods & Services Tax (GST @ 12%)</td>
                  <td className="p-3.5 text-center">—</td>
                  <td className="p-3.5 text-right">—</td>
                  <td className="p-3.5 text-right font-mono font-medium">₹{booking.taxAmount.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#FAF7F2] border-t-2 border-[#E8DFD2]">
                <tr>
                  <td colSpan={3} className="p-3.5 text-right font-bold uppercase tracking-wider text-[#A97A38]">
                    Grand Total Amount:
                  </td>
                  <td className="p-3.5 text-right text-base font-bold text-[#111923] font-mono">
                    ₹{booking.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3.5 text-right text-xs font-medium text-[#78716C]">
                    Paid via {booking.paymentMethod}:
                  </td>
                  <td className="p-3.5 text-right text-xs font-bold text-[#15803D] font-mono">
                    ₹{booking.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFD2] text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                Guest Special Requests
              </span>
              <p className="text-[#6B6255] italic">"{booking.specialRequests}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {checkInOpen && (
        <CheckInModal
          booking={booking}
          availableRooms={rooms}
          onClose={() => setCheckInOpen(false)}
          onSuccess={fetchDetails}
        />
      )}

      {checkOutOpen && (
        <CheckOutModal
          booking={booking}
          onClose={() => setCheckOutOpen(false)}
          onSuccess={fetchDetails}
        />
      )}

      {cancelOpen && (
        <CancelBookingModal
          booking={booking}
          onClose={() => setCancelOpen(false)}
          onSuccess={fetchDetails}
        />
      )}
    </AdminLayout>
  );
}
