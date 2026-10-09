"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Calendar, Clock, MapPin, Phone, Mail, CheckCircle2, AlertCircle, Ban, Download } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { api } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HOTEL_INFO } from "@/lib/constants";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

function BookingDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.bookings.getById(bookingId);
        if (res.status === "success" && res.booking) {
          const b = res.booking;
          const roomImages =
            Array.isArray(b.room?.images) && b.room.images.length > 0
              ? b.room.images
              : Array.isArray(b.images) && b.images.length > 0
              ? b.images
              : [b.roomImage || b.room?.heroImage || "/images/rooms/deluxe.png"];

          const safeRoom = {
            ...(b.room || {}),
            id: b.room?.id || b.roomId || "deluxe-room",
            name: b.room?.name || b.roomName || `${(b.roomType || "deluxe").toUpperCase()} Room`,
            slug: b.room?.slug || b.roomType || "deluxe",
            type: b.roomType || "deluxe",
            price: Number(b.baseAmount || b.totalAmount || 2499),
            description: b.room?.description || "Luxury hotel accommodation with modern amenities.",
            shortDescription: b.room?.shortDescription || "Luxury stay at Hotel Reliance.",
            capacity: b.room?.capacity || { adults: b.adults || 2, children: b.children || 0, maxTotal: 4 },
            amenities: Array.isArray(b.room?.amenities)
              ? b.room.amenities
              : ["Free High-Speed Wi-Fi", "Air Conditioning", "HD TV", "Room Service"],
            features: Array.isArray(b.room?.features)
              ? b.room.features
              : ["City View", "King Bed", "Ensuite Bathroom"],
            images: roomImages,
            heroImage: roomImages[0] || "/images/rooms/deluxe.png",
            bedType: b.room?.bedType || "King Bed",
            size: b.room?.size || "350 sq.ft",
            view: b.room?.view || "City View",
            rating: b.room?.rating || 4.8,
            reviewCount: b.room?.reviewCount || 120,
            isFeatured: false,
            inventory: 10
          };

          const formatted: Booking = {
            id: b.id,
            bookingId: b.bookingId || b.id,
            roomId: safeRoom.id,
            roomSlug: safeRoom.slug,
            roomName: safeRoom.name,
            roomImage: safeRoom.images[0],
            room: safeRoom,
            checkIn: b.checkInDate || b.checkIn,
            checkOut: b.checkOutDate || b.checkOut,
            adults: b.adults || 2,
            children: b.children || 0,
            nights: b.nights || 1,
            basePrice: b.baseAmount || b.totalAmount,
            discount: b.discountAmount || 0,
            taxes: b.taxAmount || 0,
            totalPrice: b.totalAmount,
            status: (b.bookingStatus?.toLowerCase() || b.status?.toLowerCase() || "confirmed") as any,
            paymentStatus: (b.paymentStatus?.toLowerCase() || "paid") as any,
            paymentMethod: b.paymentMethod || "online",
            roomNumber: b.roomNumber,
            guest: {
              name: b.guestName || "",
              email: b.guestEmail || "",
              phone: b.guestPhone || "",
              specialRequests: b.specialRequests,
            },
            createdAt: b.createdAt || new Date().toISOString(),
          };
          setBooking(formatted);
        } else {
          setBooking(null);
        }
      } catch (err) {
        console.error("Failed to fetch booking detail:", err);
        setBooking(null);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (booking === undefined) {
    return (
      <div className="py-24 bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#BA8B32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (booking === null) {
    return (
      <div className="pt-32 pb-24 bg-[#FAF8F5] min-h-screen">
        <Container className="max-w-md text-center space-y-6">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-light text-[#111E31]">Reservation Not Found</h1>
            <p className="text-xs text-stone-500 font-sans">
              We could not find any active or past booking matching reference <strong className="font-mono text-[#111E31]">{bookingId}</strong>.
            </p>
          </div>
          <Link href="/my-bookings">
            <button className="min-h-[42px] px-6 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer">
              Back to My Bookings
            </button>
          </Link>
        </Container>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      try {
        const res = await api.bookings.cancel(booking.id);
        if (res.status === "success") {
          setBooking({ ...booking, status: "cancelled" });
          setFeedback("Your reservation has been cancelled.");
        }
      } catch (err: any) {
        alert(err.message || "Failed to cancel booking");
      }
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5] min-h-screen">
      <Container className="max-w-4xl space-y-8">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/my-bookings"
            className="inline-flex items-center text-xs font-sans font-semibold uppercase tracking-wider text-stone-500 hover:text-[#111E31] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Bookings
          </Link>

          <div className="flex items-center space-x-3 print:hidden">
            <button
              onClick={handlePrint}
              className="min-h-[38px] px-5 bg-white hover:bg-stone-50 border border-stone-200 text-[#111E31] text-xs font-sans font-semibold uppercase tracking-wider rounded-full shadow-xs flex items-center transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
              Print Voucher
            </button>
          </div>
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2.5 font-sans"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </motion.div>
        )}

        {/* Official Hotel Reliance Reservation Voucher */}
        <div className="bg-white rounded-3xl sm:rounded-[32px] border border-stone-100 shadow-[0_12px_50px_rgba(17,30,49,0.08)] overflow-hidden print:border-none print:shadow-none">
          {/* Header Banner */}
          <div className="bg-[#111E31] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.3em] text-[#BA8B32] block">
                OFFICIAL RESERVATION VOUCHER
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-[-0.01em]">
                Hotel Reliance
              </h1>
              <p className="text-xs text-stone-300 font-sans font-light">
                Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City - 827001
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/[0.07] p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <span className="text-[9px] uppercase tracking-widest text-[#BA8B32] font-semibold block">
                Booking Reference
              </span>
              <span className="text-lg font-mono font-semibold text-white tracking-wider block mt-0.5">
                {booking.id}
              </span>
              <div className="flex flex-col sm:items-end gap-1.5 mt-2">
                <span
                  className={`inline-block px-3 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-emerald-500 text-white"
                      : booking.status === "completed"
                      ? "bg-stone-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  Status: {booking.status}
                </span>
                {booking.roomNumber && (
                  <span className="inline-block px-2.5 py-0.5 bg-[#BA8B32] text-white text-[10px] uppercase font-semibold tracking-wider rounded-full">
                    Assigned Room #{booking.roomNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Stay Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-stone-50/80 p-6 rounded-2xl border border-stone-100">
              <div className="space-y-1 font-sans">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Check-In
                </span>
                <span className="text-lg font-serif font-light text-[#111E31] block">
                  {booking.checkIn}
                </span>
                <span className="text-xs text-stone-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                  From 12:00 PM
                </span>
              </div>

              <div className="space-y-1 font-sans">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Check-Out
                </span>
                <span className="text-lg font-serif font-light text-[#111E31] block">
                  {booking.checkOut}
                </span>
                <span className="text-xs text-stone-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                  Until 11:00 AM
                </span>
              </div>

              <div className="space-y-1 font-sans">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Occupancy
                </span>
                <span className="text-lg font-serif font-light text-[#111E31] block">
                  {booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Child` : ""}
                </span>
                <span className="text-xs text-stone-500">{booking.room?.bedType || "King Bed"}</span>
              </div>
            </div>

            {/* Room & Guest Details Split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Room overview */}
              <div className="md:col-span-6 space-y-4 font-sans">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#BA8B32] border-b border-stone-100 pb-2.5">
                  Accommodations Details
                </h3>

                <div className="flex space-x-4">
                  <div className="w-24 h-24 relative flex-shrink-0 rounded-2xl overflow-hidden border border-stone-200">
                    <Image
                      src={booking.room?.images?.[0] || booking.roomImage || "/images/rooms/deluxe/main.jpg"}
                      alt={booking.room?.name || "Room"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-serif font-light text-[#111E31]">
                        {booking.room?.name || "Accommodations"}
                      </h4>
                      {booking.roomNumber && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-[#BA8B32]/10 text-[#BA8B32] text-xs font-semibold rounded-full">
                          Room #{booking.roomNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{booking.room?.description || ""}</p>
                    <span className="text-[11px] text-[#BA8B32] font-medium block">
                      Bedding: {booking.room?.bedType || "King Bed"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h5 className="text-[10px] uppercase font-semibold text-stone-400 mb-2">Key Amenities Included:</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#111E31]">
                    {(booking.room?.amenities || []).slice(0, 6).map((am, i) => (
                      <span key={i} className="flex items-center text-[11px] text-stone-500">
                        • {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Guest & Billing overview */}
              <div className="md:col-span-6 space-y-4 font-sans">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#BA8B32] border-b border-stone-100 pb-2.5">
                  Primary Guest & Billing
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Primary Guest:</span>
                    <span className="font-semibold text-[#111E31]">{booking.guest?.name || "Guest"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Email:</span>
                    <span className="font-semibold text-[#111E31]">{booking.guest?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Phone:</span>
                    <span className="font-semibold text-[#111E31]">{booking.guest?.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Payment Option:</span>
                    <span className="font-semibold text-[#111E31]">{booking.paymentMethod || "Pay at Check-In"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-stone-500">Total Tariff:</span>
                    <span className="font-serif text-lg text-[#111E31] font-light">{booking.estimatedTotal || "Price on Request"}</span>
                  </div>

                  {booking.guest.specialRequests && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                        Special Requests:
                      </span>
                      <p className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-600 italic">
                        &ldquo;{booking.guest.specialRequests}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotel Policies and Contact Note */}
            <div className="border-t border-stone-100 pt-6 space-y-4 text-xs text-stone-500 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-stone-50/70 p-5 rounded-2xl border border-stone-100">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-semibold text-[#111E31] tracking-wider">Hotel Location & Concierge</h4>
                  <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32] flex-shrink-0" /> Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City</p>
                  <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32] flex-shrink-0" /> +91 92629 97777 / +91 92628 27777</p>
                  <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32] flex-shrink-0" /> reservation@hotelreliance.com</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-semibold text-[#111E31] tracking-wider">Check-in Guidelines</h4>
                  <p>• Government photo ID proof is mandatory for all staying adult guests at check-in.</p>
                  <p>• Early check-in & late check-out subject to availability upon advance request.</p>
                </div>
              </div>
            </div>

            {/* Actions for active bookings */}
            {booking.status === "confirmed" && (
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 print:hidden font-sans">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-red-600 hover:text-red-700 uppercase font-semibold tracking-wider cursor-pointer"
                >
                  Cancel This Reservation
                </button>

                <Link href="/contact">
                  <button className="min-h-[38px] px-5 border border-stone-200 bg-white hover:bg-stone-50 text-[#111E31] text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer">
                    Contact Hotel Concierge
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  return (
    <AuthGuard
      title="Booking Voucher Access"
      description="Please sign in to view the detailed voucher for this reservation."
    >
      <BookingDetailContent params={params} />
    </AuthGuard>
  );
}
