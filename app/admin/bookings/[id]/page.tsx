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
        <div className="py-24 text-center text-white/50 text-xs animate-pulse">
          Loading reservation details for #{id}...
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <div className="py-20 text-center space-y-3">
          <h2 className="text-xl font-serif text-white">Booking #{id} Not Found</h2>
          <p className="text-xs text-white/50">The requested reservation record does not exist.</p>
          <Link
            href="/admin/bookings"
            className="inline-block px-4 py-2 bg-[#1B2A42] text-[#D8B875] text-xs font-semibold rounded"
          >
            ← Back to All Bookings
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/bookings"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-[#D8B875]">{booking.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    booking.bookingStatus === "CHECKED_IN"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : booking.bookingStatus === "CHECKED_OUT"
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : booking.bookingStatus === "CANCELLED"
                      ? "bg-red-950 text-red-400 border border-red-500/40"
                      : "bg-[#1B2A42] text-[#D8B875] border border-[#C4984F]/40"
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                {booking.guestName}
              </h1>
            </div>
          </div>

          {/* Actions & Print */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#E9DFD2] border border-[#1B2A42] transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#C4984F]" />
              <span>Print Tax Invoice</span>
            </button>

            {booking.bookingStatus === "CONFIRMED" && (
              <button
                onClick={() => setCheckInOpen(true)}
                className="px-4 py-2 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
              >
                Check-In Guest
              </button>
            )}

            {booking.bookingStatus === "CHECKED_IN" && (
              <button
                onClick={() => setCheckOutOpen(true)}
                className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
              >
                Check-Out & Settle
              </button>
            )}

            {booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "CHECKED_OUT" && (
              <button
                onClick={() => setCancelOpen(true)}
                className="px-3 py-2 rounded bg-red-950 hover:bg-red-900 text-red-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Printable Tax Invoice Card */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 print:bg-white print:text-black print:border-black">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-[#1B2A42] pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6 text-[#C4984F]" />
                <span className="font-serif text-xl font-bold tracking-wider text-white uppercase print:text-black">
                  Hotel Reliance
                </span>
              </div>
              <p className="text-xs text-[#E9DFD2]/60 max-w-sm print:text-gray-600">
                Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001
              </p>
              <p className="text-xs text-[#D8B875] font-mono print:text-black">
                GSTIN: 20AABCH8920K1ZX • Phones: +91 92629 97777 / +91 92628 27777
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
                Official Booking Confirmation & Invoice
              </span>
              <div className="font-mono text-lg font-bold text-white print:text-black">
                {booking.id}
              </div>
              <div className="text-xs text-white/50 print:text-gray-600">
                Issued: {new Date(booking.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
              </div>
            </div>
          </div>

          {/* Grid: Guest & Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111E31] p-5 rounded-xl border border-[#1B2A42] text-xs print:bg-gray-100 print:text-black">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F]">
                Guest Information
              </span>
              <div className="font-bold text-base text-white print:text-black">{booking.guestName}</div>
              <div className="text-[#E9DFD2]/70 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C4984F]" />
                <span>{booking.guestPhone}</span>
              </div>
              <div className="text-[#E9DFD2]/70 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C4984F]" />
                <span>{booking.guestEmail || "No email recorded"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F]">
                Stay Specifications
              </span>
              <div className="font-bold text-white print:text-black capitalize">
                {booking.roomType} Room {booking.roomNumber ? `(Room #${booking.roomNumber})` : "(Unassigned)"}
              </div>
              <div className="text-[#E9DFD2]/70">
                Check-In: <strong>{booking.checkInDate}</strong> (12:00 PM)
              </div>
              <div className="text-[#E9DFD2]/70">
                Check-Out: <strong>{booking.checkOutDate}</strong> (11:00 AM)
              </div>
              <div className="text-[#E9DFD2]/70">
                Occupancy: {booking.adults} Adults {booking.children > 0 && `• ${booking.children} Kids`} • {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
              </div>
            </div>
          </div>

          {/* Tariff Itemized Ledger Table */}
          <div className="border border-[#1B2A42] rounded-xl overflow-hidden print:border-black">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111E31] text-[10px] uppercase tracking-wider text-[#C4984F] border-b border-[#1B2A42] print:bg-gray-200 print:text-black">
                <tr>
                  <th className="p-3 font-bold">Item Description</th>
                  <th className="p-3 font-bold text-center">Nights</th>
                  <th className="p-3 font-bold text-right">Rate / Night</th>
                  <th className="p-3 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42] text-white/90 print:divide-gray-300 print:text-black">
                <tr>
                  <td className="p-3">
                    <div className="font-semibold capitalize">{booking.roomType} Room Accommodation</div>
                    <div className="text-[10px] text-white/40">Includes High-Speed Wi-Fi & 24/7 Room Service Support</div>
                  </td>
                  <td className="p-3 text-center font-medium">{booking.nights}</td>
                  <td className="p-3 text-right">₹{Math.round(booking.baseAmount / booking.nights).toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold">₹{booking.baseAmount.toLocaleString()}</td>
                </tr>
                {booking.discountAmount > 0 && (
                  <tr className="text-emerald-400 print:text-emerald-700">
                    <td className="p-3">Seasonal / Coupon Discount Applied</td>
                    <td className="p-3 text-center">—</td>
                    <td className="p-3 text-right">—</td>
                    <td className="p-3 text-right font-semibold">-₹{booking.discountAmount.toLocaleString()}</td>
                  </tr>
                )}
                <tr>
                  <td className="p-3">Goods & Services Tax (GST @ 12%)</td>
                  <td className="p-3 text-center">—</td>
                  <td className="p-3 text-right">—</td>
                  <td className="p-3 text-right font-semibold">₹{booking.taxAmount.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#111E31] border-t-2 border-[#C4984F]/40 print:bg-gray-100">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-bold uppercase tracking-wider text-[#C4984F] print:text-black">
                    Grand Total Amount:
                  </td>
                  <td className="p-3 text-right text-base font-bold text-[#D8B875] print:text-black">
                    ₹{booking.totalAmount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right text-xs font-medium text-white/60 print:text-black">
                    Paid via {booking.paymentMethod}:
                  </td>
                  <td className="p-3 text-right text-xs font-bold text-emerald-400 print:text-black">
                    ₹{booking.paidAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-4 bg-[#111E31] rounded-xl border border-[#1B2A42] text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1">
                Guest Special Requests
              </span>
              <p className="text-[#E9DFD2]/80 italic">"{booking.specialRequests}"</p>
            </div>
          )}

          {booking.cancellationReason && (
            <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/40 text-xs text-red-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 block mb-1">
                Cancellation Details
              </span>
              <p>Reason: {booking.cancellationReason}</p>
              {booking.refundAmount ? <p className="font-bold mt-1">Refund Processed: ₹{booking.refundAmount.toLocaleString()}</p> : null}
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
