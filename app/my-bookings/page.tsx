"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, ArrowRight, Eye, XCircle, CheckCircle2, Clock, Ban, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { api, getStoredBookings } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function formatBookingObject(b: any, user: any): Booking {
  return {
    id: b.id,
    bookingId: b.bookingId || b.id,
    roomId: b.room?.id || b.roomId || "deluxe-room",
    roomSlug: b.room?.slug || b.roomType || "deluxe",
    roomName: b.room?.name || `${(b.roomType || "deluxe").toUpperCase()} Room`,
    roomImage: b.room?.images?.[0] || "/images/rooms/deluxe.png",
    room: b.room || {
      id: b.room?.id || b.roomId || "deluxe-room",
      name: b.room?.name || `${(b.roomType || "deluxe").toUpperCase()} Room`,
      slug: b.room?.slug || b.roomType || "deluxe",
      type: b.roomType || "deluxe",
      price: b.baseAmount || b.totalAmount || 2499,
      description: "Luxury hotel accommodation with modern amenities.",
      shortDescription: "Luxury stay at Hotel Reliance.",
      capacity: { adults: b.adults || 2, children: b.children || 0, maxTotal: 4 },
      amenities: ["Free High-Speed Wi-Fi", "Air Conditioning", "HD TV", "Room Service"],
      features: ["City View", "King Bed", "Ensuite Bathroom"],
      images: [b.room?.images?.[0] || "/images/rooms/deluxe.png"],
      heroImage: b.room?.images?.[0] || "/images/rooms/deluxe.png",
      bedType: "King Bed",
      view: "City View",
      rating: 4.8,
      reviewCount: 120,
      isFeatured: false,
      inventory: 10,
    },
    checkIn: b.checkInDate || b.checkIn,
    checkOut: b.checkOutDate || b.checkOut,
    adults: b.adults || 2,
    children: b.children || 0,
    nights: b.nights || 1,
    basePrice: b.baseAmount || b.totalAmount,
    discount: b.discountAmount || 0,
    taxes: b.taxAmount || 0,
    totalPrice: b.totalAmount || b.totalPrice,
    estimatedTotal:
      b.estimatedTotal ||
      (b.totalAmount ? `₹${Number(b.totalAmount).toLocaleString("en-IN")}` : undefined),
    status: (b.bookingStatus?.toLowerCase() || b.status?.toLowerCase() || "confirmed") as any,
    paymentStatus: (b.paymentStatus?.toLowerCase() || "paid") as any,
    paymentMethod: b.paymentMethod || "online",
    roomNumber: b.roomNumber,
    guest: {
      name: b.guestName || b.guest?.name || user?.name || "Valued Guest",
      email: b.guestEmail || b.guest?.email || user?.email || "",
      phone: b.guestPhone || b.guest?.phone || user?.phone || "",
      specialRequests: b.specialRequests || b.guest?.specialRequests,
    },
    createdAt: b.createdAt || new Date().toISOString(),
  };
}

function formatBookingsList(rawList: any[], user: any): { upcoming: Booking[]; previous: Booking[] } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: Booking[] = [];
  const previous: Booking[] = [];

  rawList.forEach((b: any) => {
    if (!b || (!b.id && !b.bookingId)) return;
    const checkOutRaw = b.checkOutDate || b.checkOut;
    const checkOut = checkOutRaw ? new Date(checkOutRaw) : new Date();
    checkOut.setHours(23, 59, 59, 999);

    const formatted = formatBookingObject(b, user);
    const isCancelled = formatted.status === "cancelled";
    const isCompleted = formatted.status === "completed";

    if (checkOut >= today && !isCancelled && !isCompleted) {
      upcoming.push(formatted);
    } else {
      previous.push(formatted);
    }
  });

  return { upcoming, previous };
}

function getLocalAndSessionBookings(currentUser?: any): any[] {
  if (typeof window === "undefined") return [];
  const stored = getStoredBookings();
  const sessionRaw = sessionStorage.getItem("confirmedBooking");
  let sessionBooking: any = null;
  if (sessionRaw) {
    try {
      sessionBooking = JSON.parse(sessionRaw);
    } catch {}
  }

  const combined: any[] = [];
  if (sessionBooking && sessionBooking.id) {
    const matchesUser =
      !currentUser ||
      !sessionBooking.guest?.email ||
      sessionBooking.guest.email.toLowerCase() === currentUser.email?.toLowerCase() ||
      sessionBooking.userId === currentUser.id;
    if (matchesUser) {
      combined.push(sessionBooking);
    }
  }

  for (const sb of stored) {
    if (!sb || !sb.id) continue;
    const matchesUser =
      !currentUser ||
      !sb.guest?.email ||
      sb.guest.email.toLowerCase() === currentUser.email?.toLowerCase() ||
      sb.userId === currentUser.id;
    if (matchesUser && !combined.some((b) => b.id === sb.id || b.bookingId === sb.id)) {
      combined.push(sb);
    }
  }

  return combined;
}

function MyBookingsContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">("upcoming");

  // Synchronous instant initialization from local cache (0ms latency, no flash of empty state)
  const [bookings, setBookings] = useState<{ upcoming: Booking[]; previous: Booking[] }>(() => {
    if (typeof window === "undefined") return { upcoming: [], previous: [] };
    const local = getLocalAndSessionBookings(null);
    return formatBookingsList(local, null);
  });

  // Only show loading if there are zero cached bookings locally
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const local = getLocalAndSessionBookings(null);
    return local.length === 0;
  });

  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshBookings = async (overrideUser?: any) => {
    const activeUser = overrideUser || user;

    // Step 1: Immediately sync any cached bookings synchronously
    const cachedList = getLocalAndSessionBookings(activeUser);
    if (cachedList.length > 0) {
      const cached = formatBookingsList(cachedList, activeUser);
      setBookings(cached);
      setIsLoading(false);
    }

    // Step 2: Fetch fresh data from backend
    try {
      const res = await api.bookings.getMyBookings();
      let rawList: any[] = [];
      if (res && res.status === "success" && Array.isArray(res.bookings)) {
        rawList = res.bookings;
      }

      const combined: any[] = [...rawList];
      const freshLocal = getLocalAndSessionBookings(activeUser);
      for (const item of freshLocal) {
        if (!combined.some((b) => b.id === item.id || b.bookingId === item.id)) {
          combined.push(item);
        }
      }

      const formatted = formatBookingsList(combined, activeUser);
      setBookings(formatted);
    } catch (err) {
      console.error("Failed to fetch fresh bookings from server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBookings(user);
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await api.bookings.cancel(bookingId);
      if (res.status === "success") {
        setFeedback(`Reservation ${bookingId} has been successfully cancelled.`);
        setCancelModalId(null);
        refreshBookings(user);
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err: any) {
      setFeedback(err.message || "Failed to cancel booking");
    }
  };

  const currentList = activeTab === "upcoming" ? bookings.upcoming : bookings.previous;

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider bg-emerald-500/90 backdrop-blur-md text-white rounded-full shadow-sm">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider bg-amber-500/90 backdrop-blur-md text-white rounded-full shadow-sm">
            <Clock className="w-3 h-3 mr-1.5" /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider bg-stone-700/90 backdrop-blur-md text-white rounded-full shadow-sm">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider bg-red-600/90 backdrop-blur-md text-white rounded-full shadow-sm">
            <Ban className="w-3 h-3 mr-1.5" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5] min-h-screen">
      <Container className="max-w-5xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.3em] text-[#BA8B32] block">
              GUEST RESERVATIONS
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#111E31] mt-1 tracking-[-0.01em]">
              My Bookings
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-sans">
              Review and manage your reservations, stay details, and hospitality preferences.
            </p>
          </div>

          <Link href="/rooms">
            <button className="min-h-[42px] px-5 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(17,30,49,0.18)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.25)] flex items-center transition-all cursor-pointer active:scale-[0.98]">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Book Another Room
            </button>
          </Link>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-sans flex items-center shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
            <span>{feedback}</span>
          </motion.div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div className="flex items-center space-x-2 bg-stone-200/50 p-1 rounded-full text-xs font-sans">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 sm:px-7 py-2 rounded-full font-medium transition-all cursor-pointer text-xs ${
                activeTab === "upcoming"
                  ? "bg-white text-[#111E31] shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-semibold"
                  : "text-stone-500 hover:text-[#111E31]"
              }`}
            >
              Upcoming ({bookings.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-5 sm:px-7 py-2 rounded-full font-medium transition-all cursor-pointer text-xs ${
                activeTab === "previous"
                  ? "bg-white text-[#111E31] shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-semibold"
                  : "text-stone-500 hover:text-[#111E31]"
              }`}
            >
              Past Stays ({bookings.previous.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          /* Elegant skeleton cards while fetching for the first time */
          <div className="space-y-6">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-100 shadow-[0_4px_30px_rgba(17,30,49,0.04)] overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-pulse"
              >
                <div className="md:col-span-4 min-h-[220px] bg-stone-100" />
                <div className="md:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-stone-200 rounded-full" />
                        <div className="h-6 w-52 bg-stone-200 rounded-lg" />
                      </div>
                      <div className="h-7 w-24 bg-stone-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <div className="h-10 bg-stone-100 rounded-xl" />
                      <div className="h-10 bg-stone-100 rounded-xl" />
                      <div className="h-10 bg-stone-100 rounded-xl" />
                      <div className="h-10 bg-stone-100 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <div className="h-10 w-36 bg-stone-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentList.length > 0 ? (
          <div className="space-y-6">
            {currentList.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-stone-100 shadow-[0_4px_30px_rgba(17,30,49,0.06)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.1)] transition-all overflow-hidden grid grid-cols-1 md:grid-cols-12"
              >
                {/* Room Thumbnail */}
                <div className="md:col-span-4 relative min-h-[200px] md:min-h-full">
                  <Image
                    src={booking.room.images[0] || "/images/rooms/deluxe/main.jpg"}
                    alt={booking.room.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Booking Information */}
                <div className="md:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[10px] text-stone-400 font-sans uppercase font-semibold tracking-wider block">
                          Booking ID: <strong className="text-[#111E31] font-mono">{booking.id}</strong>
                        </span>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1">
                          <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111E31]">
                            {booking.room.name}
                          </h2>
                          {booking.roomNumber ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-[#BA8B32]/10 text-[#BA8B32] border border-[#BA8B32]/25 rounded-full text-[11px] font-semibold font-sans">
                              Room #{booking.roomNumber}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-stone-100 text-stone-600 rounded-full text-[10px] font-medium font-sans">
                              Room Allotted at Check-In
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-sans uppercase font-medium block">Total Tariff</span>
                        <span className="text-base sm:text-lg font-serif font-light text-[#111E31]">
                          {booking.estimatedTotal || "Price on Request"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-sans">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Check-In</span>
                        <span className="font-semibold text-[#111E31] mt-0.5 block">{booking.checkIn}</span>
                        <span className="text-[10px] text-stone-400 block">From 12:00 PM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Check-Out</span>
                        <span className="font-semibold text-[#111E31] mt-0.5 block">{booking.checkOut}</span>
                        <span className="text-[10px] text-stone-400 block">Until 11:00 AM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Stay Duration</span>
                        <span className="font-semibold text-[#111E31] mt-0.5 block">
                          {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Guests</span>
                        <span className="font-semibold text-[#111E31] mt-0.5 block">
                          {booking.adults} Adults {booking.children > 0 && `, ${booking.children} Kids`}
                        </span>
                      </div>
                    </div>

                    {booking.guest?.specialRequests && (
                      <div className="mt-4 p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-xs font-sans text-stone-600">
                        <span className="font-semibold text-[#111E31] block text-[11px] mb-0.5">Special Requests:</span>
                        <p className="italic">{booking.guest.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center space-x-2 text-xs font-sans text-stone-500">
                      <span className="capitalize">Payment: <strong>{booking.paymentMethod}</strong> ({booking.paymentStatus})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <button
                          onClick={() => setCancelModalId(booking.id)}
                          className="flex-1 sm:flex-initial px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer text-center justify-center"
                        >
                          Cancel Stay
                        </button>
                      )}

                      <Link href={`/my-bookings/${booking.id}`} className="flex-1 sm:flex-initial">
                        <button className="w-full sm:w-auto px-5 py-2 bg-[#BA8B32] hover:bg-[#a37929] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95">
                          <Eye className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                          <span>View Details & Voucher</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State — only shown when loading is complete and no reservations exist */
          <div className="bg-white rounded-3xl border border-stone-100 p-12 sm:p-16 text-center space-y-6 shadow-[0_4px_30px_rgba(17,30,49,0.04)]">
            <div className="w-16 h-16 bg-stone-50 border border-stone-200 text-[#BA8B32] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-serif font-light text-[#111E31]">
                {activeTab === "upcoming" ? "No Upcoming Reservations" : "No Previous Bookings"}
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                {activeTab === "upcoming"
                  ? "You don't have any active reservations scheduled. Explore our curated rooms and suites in Bokaro Steel City to plan your stay."
                  : "You have not completed any past stays at Hotel Reliance yet."}
              </p>
            </div>

            <div className="pt-2">
              <Link href="/rooms">
                <button className="min-h-[46px] px-7 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.3)] transition-all cursor-pointer inline-flex items-center active:scale-[0.98]">
                  Explore Rooms & Suites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <AnimatePresence>
          {cancelModalId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1524]/65 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 max-w-md w-full shadow-[0_30px_90px_rgba(17,30,49,0.28)] space-y-5 text-center font-sans"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                  <AlertCircle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-light text-[#111E31]">
                    Cancel Reservation?
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Are you sure you want to cancel booking <strong className="text-[#111E31] font-mono">{cancelModalId}</strong>?
                    Free cancellation is allowed up to 24 hours prior to check-in.
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => setCancelModalId(null)}
                    className="flex-1 min-h-[42px] px-5 border border-stone-200 bg-white hover:bg-stone-50 text-[#111E31] text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => handleCancelBooking(cancelModalId)}
                    className="flex-1 min-h-[42px] px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <AuthGuard
      title="Guest Bookings Access"
      description="Please sign in to view your upcoming reservations, stay history, and booking vouchers."
    >
      <MyBookingsContent />
    </AuthGuard>
  );
}
