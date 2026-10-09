"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Calendar,
  MapPin,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  Utensils,
  Wifi,
  ChevronRight,
  MessageCircle,
  Share2,
  PhoneCall,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Booking } from "@/types/booking";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { formatPrice, formatDate, formatFullDate, getNightsCount } from "@/lib/utils";
import { api } from "@/lib/api";

function formatFullDateWithDay(dateString: string): string {
  return formatFullDate(dateString);
}

function SuccessContent() {
  const settings = useHotelSettings();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      setIsLoading(true);

      const paramId = searchParams.get("bookingId") || searchParams.get("id");

      // 1. If sessionStorage has the booking matching paramId (or if no paramId was specified)
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("confirmedBooking");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id) {
              if (!paramId || parsed.id === paramId) {
                setBooking(parsed);
                // Synchronize address bar URL with bookingId if not already present
                if (!paramId && typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.set("bookingId", parsed.id);
                  window.history.replaceState(null, "", url.toString());
                }
                setIsLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error("Failed to parse booking from sessionStorage", err);
          }
        }
      }

      // 2. Otherwise check query parameter for booking reference and fetch live from backend
      if (paramId) {
        try {
          const res = await api.bookings.getById(paramId);
          if (res?.status === "success" && res.booking) {
            const b = res.booking;
            const formatted: Booking = {
              id: b.id,
              bookingId: b.id,
              checkIn: b.checkInDate ? new Date(b.checkInDate).toISOString().split("T")[0] : b.checkIn,
              checkOut: b.checkOutDate ? new Date(b.checkOutDate).toISOString().split("T")[0] : b.checkOut,
              nights: b.nights || 1,
              adults: b.adults || 2,
              children: b.children || 0,
              room: b.room || {
                id: b.roomId || "suite",
                slug: b.room?.slug || "executive",
                name: b.room?.name || "Suite Reservation",
                description: b.room?.description || "Confirmed guest suite accommodation.",
                images: b.room?.images || ["/images/rooms/deluxe/main.jpg"],
                amenities: b.room?.amenities || ["High-Speed Wi-Fi", "Air Conditioning", "Room Service"],
                occupancy: b.adults || 2,
                bedType: b.room?.bedType || "King Size Bed",
                price: Number(b.room?.pricePerNight || b.baseAmount || 0)
              },
              baseAmount: Number(b.baseAmount || 0),
              basePrice: Number(b.baseAmount || 0),
              discountAmount: Number(b.discountAmount || 0),
              taxAmount: Number(b.taxAmount || 0),
              totalPrice: Number(b.totalAmount || b.totalPrice || 0),
              grandTotal: Number(b.totalAmount || b.grandTotal || 0),
              status: (b.status?.toLowerCase() || "confirmed") as any,
              paymentStatus: (b.paymentStatus?.toLowerCase() || "paid") as any,
              paymentMethod: b.paymentMethod || "Online Payment",
              transactionId: b.payment?.paymentId || b.transactionId,
              createdAt: b.createdAt || new Date().toISOString(),
              guest: {
                name: b.guestName || "",
                email: b.guestEmail || "",
                phone: b.guestPhone || "",
                specialRequests: b.specialRequests || ""
              }
            };
            setBooking(formatted);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to fetch booking by ID from live backend:", err);
        }
      }

      // No booking found in session or backend
      setBooking(null);
      setIsLoading(false);
    };

    loadBookingData();
  }, [searchParams]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-9 h-9 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-[#86868B] tracking-wider uppercase">
            Loading Confirmation...
          </p>
        </div>
      </div>
    );
  }

  // Not Found / No Active Booking State
  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white pb-24 pt-28 sm:pt-36 [&_*]:font-sans">
        <Container className="max-w-xl px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-black/[0.04] text-[#86868B] flex items-center justify-center mx-auto border border-black/[0.06]">
            <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              No Active Reservation Found
            </h1>
            <p className="text-sm text-[#6E6E73] leading-relaxed max-w-md mx-auto">
              We couldn't retrieve an active reservation session. If you recently completed a reservation, you can review it in My Bookings or contact our front desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/rooms">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold tracking-tight transition-all active:scale-[0.98] shadow-sm cursor-pointer">
                <span>Browse Rooms & Suites</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>

            <Link href="/my-bookings">
              <button className="px-5 py-3 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] text-xs font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer">
                View My Bookings
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Resolve room image
  const roomImage =
    booking.room?.images?.[0] ||
    booking.roomImage ||
    (booking.room?.slug === "single" || booking.room?.id === "single-occupancy"
      ? "/images/rooms/deluxe/main.jpg"
      : booking.room?.slug === "double" || booking.room?.id === "double-occupancy"
      ? "/images/rooms/executive/main.jpg"
      : booking.room?.slug === "premium" || booking.room?.id === "premium-suite"
      ? "/images/rooms/premium/main.jpg"
      : booking.room?.slug === "family" || booking.room?.id === "family-suite"
      ? "/images/rooms/family/main.jpg"
      : "/images/rooms/deluxe/main.jpg");

  const nights =
    booking.nights ||
    getNightsCount(booking.checkIn, booking.checkOut) ||
    1;

  const handleCopyBookingId = () => {
    if (!booking?.id) return;
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!booking) return;
    const bookingUrl = typeof window !== "undefined"
      ? `${window.location.origin}/booking/success?bookingId=${booking.id}`
      : `/booking/success?bookingId=${booking.id}`;

    const shareData = {
      title: `Hotel Reliance Reservation #${booking.id}`,
      text: `Confirmed booking for ${booking.room?.name || "Suite"} at Hotel Reliance, Bokaro. Check-in: ${formatDate(booking.checkIn)}`,
      url: bookingUrl
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyBookingId();
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate real .ics calendar file download
  const handleDownloadICS = () => {
    if (!booking) return;
    const startStr = booking.checkIn.replace(/-/g, "");
    const endStr = booking.checkOut.replace(/-/g, "");
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hotel Reliance//Booking Voucher//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:hotel-reliance-${booking.id}@hotelreliance.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${startStr}`,
      `DTEND;VALUE=DATE:${endStr}`,
      `SUMMARY:Stay at Hotel Reliance (${booking.room?.name || "Room"})`,
      `DESCRIPTION:Booking ID: ${booking.id}\\nGuest: ${booking.guest?.name || "Guest"}\\nTotal: ₹${booking.totalPrice || booking.grandTotal || 0}\\nFront Desk: ${settings.primaryPhone}\\nAddress: ${settings.fullAddress}`,
      `LOCATION:${settings.fullAddress}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Hotel-Reliance-Booking-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const whatsappDeskUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Hello Hotel Reliance, I have confirmed reservation #${booking.id} under ${booking.guest?.name || "Guest"}. I would like to inquire about my arrival.`
  )}`;

  const isPaidOnline =
    booking.paymentStatus?.toLowerCase() === "paid" ||
    booking.paymentMethod?.toLowerCase().includes("razorpay") ||
    booking.paymentMethod?.toLowerCase().includes("online");

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white pb-28 pt-24 sm:pt-28 [&_*]:font-sans">
      
      {/* Toast Notification (Apple Dynamic Island style) */}
      <AnimatePresence>
        {(copied || showShareToast) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1D1D1F]/90 backdrop-blur-xl text-white px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] text-xs font-medium flex items-center gap-2 border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
            <span>{copied ? `Booking ID ${booking.id} copied to clipboard` : "Booking summary copied to clipboard"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Container className="max-w-3xl px-4 sm:px-6 space-y-8 sm:space-y-10">

        {/* 1. APPLE HERO CONFIRMATION HEADER */}
        <div className="text-center space-y-4 print:hidden">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#34C759] text-white flex items-center justify-center mx-auto shadow-[0_8px_24px_rgba(52,199,89,0.3)] ring-4 ring-[#34C759]/20"
          >
            <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/10 text-[#248A3D] text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
              Reservation Confirmed
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#1D1D1F]">
              You're all set.
            </h1>
            <p className="text-sm sm:text-base text-[#6E6E73] font-normal max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you{booking.guest?.name ? `, ${booking.guest.name}` : ""}.
            </p>
          </motion.div>

          {/* Apple Pill Action Dock */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-2"
          >
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-tight transition-all active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#1D1D1F]" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={handleDownloadICS}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-tight transition-all active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1D1D1F]" />
              <span>Add to Calendar</span>
            </button>

            <a
              href={whatsappDeskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F7] text-[#10B981] border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-tight transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Front Desk</span>
            </a>

            <a
              href={settings.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-tight transition-all active:scale-[0.98]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1D1D1F]" />
              <span>Directions</span>
            </a>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-tight transition-all active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1D1D1F]" />
              <span>Share</span>
            </button>
          </motion.div>
        </div>

        {/* 2. THE APPLE WALLET PASS (DIGITAL FOLIO) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-[28px] border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.05)] overflow-hidden print:border-none print:shadow-none print:rounded-none relative"
        >
          {/* Pass Top Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-white via-white to-[#FBFBFC] border-b border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1D1D1F]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868B]">
                  Hotel Reliance • Bokaro Steel City
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                {booking.room?.name || "Suite Reservation"}
              </h2>
              <p className="text-xs text-[#86868B]">
                {settings.fullAddress}
              </p>
            </div>

            {/* Apple Booking ID Pill */}
            <div className="flex items-center gap-2 bg-[#F5F5F7] px-3.5 py-2 rounded-2xl border border-black/[0.04]">
              <div>
                <span className="text-[9px] uppercase font-semibold text-[#86868B] tracking-wider block">
                  Booking Reference
                </span>
                <span className="font-mono text-sm font-semibold text-[#1D1D1F]">
                  {booking.id}
                </span>
              </div>
              <button
                onClick={handleCopyBookingId}
                title="Copy Reference Number"
                className="ml-1 p-1.5 rounded-xl hover:bg-black/[0.05] text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer print:hidden"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Perforated Apple Ticket Divider Notch */}
          <div className="relative border-b border-black/[0.06] bg-[#FAFAFC] print:hidden">
            <div className="absolute -top-3 -left-3.5 w-6 h-6 rounded-full bg-[#F5F5F7] border border-black/[0.06] z-10" />
            <div className="absolute -top-3 -right-3.5 w-6 h-6 rounded-full bg-[#F5F5F7] border border-black/[0.06] z-10" />
          </div>

          {/* Stay Timeline: 4 Apple Key Metric Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06] border-b border-black/[0.06] bg-[#FAFAFC]">
            {/* Check-In */}
            <div className="p-5 sm:p-6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider block">
                Check-In
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#1D1D1F] block">
                {formatFullDateWithDay(booking.checkIn)}
              </span>
              <span className="text-xs text-[#86868B] font-normal block">
                From {settings.checkInTime || "12:00 PM"}
              </span>
            </div>

            {/* Check-Out */}
            <div className="p-5 sm:p-6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider block">
                Check-Out
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#1D1D1F] block">
                {formatFullDateWithDay(booking.checkOut)}
              </span>
              <span className="text-xs text-[#86868B] font-normal block">
                Until {settings.checkOutTime || "11:00 AM"}
              </span>
            </div>

            {/* Stay Duration */}
            <div className="p-5 sm:p-6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider block">
                Stay Details
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#1D1D1F] block">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
              <span className="text-xs text-[#86868B] font-normal block">
                {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Kids` : ""}
              </span>
            </div>

            {/* Total Charged */}
            <div className="p-5 sm:p-6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider block">
                Total Amount
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#1D1D1F] block">
                {formatPrice(booking.totalPrice || booking.grandTotal || 0)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#248A3D]">
                <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                {isPaidOnline ? "Paid Online" : "Pay at Check-In"}
              </span>
            </div>
          </div>

          {/* Pass Body Content */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Room Showcase Module */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              <div className="md:col-span-5 relative min-h-[190px] rounded-2xl overflow-hidden bg-neutral-100 border border-black/[0.06]">
                <Image
                  src={roomImage}
                  alt={booking.room?.name || "Room"}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80 block">
                    Reserved Category
                  </span>
                  <h3 className="text-base font-semibold text-white tracking-tight leading-snug">
                    {booking.room?.name || "Confirmed Suite"}
                  </h3>
                </div>
              </div>

              {/* Room Specifications & Amenities */}
              <div className="md:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                      Physical Unit Allocation
                    </span>
                    <span className="text-[11px] font-medium text-[#1D1D1F] bg-white px-2.5 py-0.5 rounded-full border border-black/[0.06] shadow-sm">
                      Assigned on Arrival
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Your room category is guaranteed and locked. Room keys and physical unit number will be handed over upon arrival at reception.
                  </p>
                </div>

                {/* Amenity Badges */}
                {booking.room?.amenities && booking.room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {booking.room.amenities.slice(0, 5).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white text-[#424245] border border-black/[0.06] text-[11px] font-normal shadow-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Guest Profile & Express Check-In QR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Primary Guest Folio */}
              <div className="md:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                    Primary Guest Folio
                  </span>
                  <span className="text-xs text-[#86868B]">
                    Folio #{booking.id}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-semibold text-[#1D1D1F]">
                      {booking.guest?.name || "Guest"}
                    </h4>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      {[booking.guest?.email, booking.guest?.phone].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  {booking.guest?.specialRequests && (
                    <div className="p-3 rounded-xl bg-white border border-black/[0.06] text-xs text-[#6E6E73]">
                      <span className="font-semibold text-[#1D1D1F] block text-[11px] uppercase tracking-wider mb-0.5">
                        Special Requests
                      </span>
                      <p className="italic">"{booking.guest.specialRequests}"</p>
                    </div>
                  )}

                  {booking.transactionId && (
                    <div className="text-[11px] text-[#86868B] flex items-center justify-between pt-1">
                      <span>Transaction Reference:</span>
                      <span className="font-mono text-[#1D1D1F]">{booking.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimalist QR Code Card */}
              <div className="md:col-span-4 p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                  Express Check-In QR
                </span>

                <div className="p-3 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-[#1D1D1F]"
                    viewBox="0 0 120 120"
                    fill="currentColor"
                  >
                    <rect x="10" y="10" width="30" height="30" rx="6" fill="#1D1D1F" />
                    <rect x="16" y="16" width="18" height="18" rx="3" fill="#FFFFFF" />
                    <rect x="20" y="20" width="10" height="10" rx="2" fill="#1D1D1F" />

                    <rect x="80" y="10" width="30" height="30" rx="6" fill="#1D1D1F" />
                    <rect x="86" y="16" width="18" height="18" rx="3" fill="#FFFFFF" />
                    <rect x="90" y="20" width="10" height="10" rx="2" fill="#1D1D1F" />

                    <rect x="10" y="80" width="30" height="30" rx="6" fill="#1D1D1F" />
                    <rect x="16" y="86" width="18" height="18" rx="3" fill="#FFFFFF" />
                    <rect x="20" y="90" width="10" height="10" rx="2" fill="#1D1D1F" />

                    <rect x="48" y="14" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="58" y="14" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="68" y="14" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="48" y="24" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="68" y="24" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="48" y="34" width="6" height="6" rx="1.5" fill="#1D1D1F" />

                    <rect x="14" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="24" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="34" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="14" y="58" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="34" y="58" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="14" y="68" width="6" height="6" rx="1.5" fill="#1D1D1F" />

                    <rect x="80" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="90" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="100" y="48" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="90" y="58" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="80" y="68" width="6" height="6" rx="1.5" fill="#1D1D1F" />

                    <rect x="48" y="80" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="58" y="80" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="68" y="80" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="58" y="90" width="6" height="6" rx="1.5" fill="#1D1D1F" />
                    <rect x="48" y="100" width="6" height="6" rx="1.5" fill="#1D1D1F" />

                    <rect x="48" y="48" width="24" height="24" rx="6" fill="#1D1D1F" />
                    <circle cx="60" cy="60" r="4.5" fill="#FFFFFF" />
                  </svg>
                </div>

                <p className="text-[11px] text-[#86868B] leading-tight">
                  Scan at front desk terminal for instant key handover
                </p>
              </div>
            </div>

            {/* Apple Store / Receipt Style Breakdown */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-3">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                  Receipt & Tax Summary
                </span>
                <span className="text-[11px] text-[#86868B]">
                  GST @ 12% Included
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Base rate */}
                <div className="flex justify-between items-center text-[#6E6E73]">
                  <span>
                    {booking.room?.name || "Room"} ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                  <span className="font-mono text-[#1D1D1F]">
                    {formatPrice(
                      booking.baseAmount ||
                        booking.basePrice ||
                        Math.round((booking.totalPrice || 0) / 1.12)
                    )}
                  </span>
                </div>

                {/* Promo discount */}
                {Boolean(booking.discountAmount || booking.discount) && (
                  <div className="flex justify-between items-center text-[#248A3D]">
                    <span>
                      Privilege Discount {booking.discountCode ? `(${booking.discountCode})` : ""}
                    </span>
                    <span className="font-mono font-medium">
                      -{formatPrice(booking.discountAmount || booking.discount || 0)}
                    </span>
                  </div>
                )}

                {/* GST */}
                <div className="flex justify-between items-center text-[#6E6E73]">
                  <span>Statutory Taxes (CGST 6% + SGST 6%)</span>
                  <span className="font-mono text-[#1D1D1F]">
                    +{formatPrice(
                      booking.taxAmount ||
                        booking.taxes ||
                        Math.round((booking.totalPrice || 0) - (booking.totalPrice || 0) / 1.12)
                    )}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-2.5 border-t border-black/[0.06]">
                  <span className="text-sm font-semibold text-[#1D1D1F]">
                    Total Charged
                  </span>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#1D1D1F] block">
                      {formatPrice(booking.totalPrice || booking.grandTotal || 0)}
                    </span>
                    <span className="text-[10px] text-[#86868B] block mt-0.5">
                      via {booking.paymentMethod || (isPaidOnline ? "Razorpay Online" : "Pay at Hotel")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Pass Footer Actions */}
          <div className="p-6 sm:p-8 bg-white border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold tracking-tight transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Voucher</span>
              </button>

              <button
                onClick={handleDownloadICS}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-xs font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Save to Calendar</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/my-bookings">
                <button className="px-4 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-xs font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer">
                  My Bookings
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-xs font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer">
                  Home
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 3. APPLE BENTO MODULES (4 ARRIVAL ESSENTIALS) */}
        <div className="space-y-4 print:hidden">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868B] block">
            Arrival Essentials
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[#1D1D1F]">Check-In Policy</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Check-in is from <strong>12:00 PM</strong>. Please carry a valid Government Photo ID (Aadhaar, Passport, DL) for all adult guests.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                <Utensils className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[#1D1D1F]">Kwality Dining</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                24/7 in-room dining and multi-cuisine restaurant available. Dial 0 from your room phone.
              </p>
              <Link
                href="/restaurant"
                className="inline-flex items-center text-xs font-medium text-[#0071E3] hover:underline pt-0.5"
              >
                <span>View Menu</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                <Wifi className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[#1D1D1F]">Complimentary Wi-Fi</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Connect to <strong>Reliance_Guest</strong> anywhere on property with high-speed internet.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-[#1D1D1F]">24/7 Concierge</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Assistance anytime at <strong>{settings.primaryPhone}</strong> or directly via WhatsApp.
              </p>
              <a
                href={whatsappDeskUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-medium text-[#248A3D] hover:underline pt-0.5"
              >
                <span>Chat on WhatsApp</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 4. OFFICIAL PRINT FOLIO (Visible only when user prints or saves PDF) */}
        <div className="hidden print:block pt-8 border-t border-gray-300 text-xs text-gray-700 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-bold text-gray-900 text-sm">Hotel Reliance - Front Desk & Reservations</p>
              <p>{settings.fullAddress}</p>
              <p>Hotline: {settings.primaryPhone} • Email: {settings.primaryEmail}</p>
            </div>
            <div className="text-right">
              <div className="w-40 border-b border-gray-400 mb-1" />
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Authorized Front Desk Seal</p>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 text-center">
            This confirmation voucher is electronically generated and acts as valid advance reservation proof for entry and check-in at Hotel Reliance.
          </p>
        </div>

      </Container>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="w-10 h-10 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-[#86868B] tracking-wider uppercase">
              Loading Confirmation...
            </p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
