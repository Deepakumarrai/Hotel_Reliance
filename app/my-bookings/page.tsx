"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, ArrowRight, Eye, XCircle, CheckCircle2, Clock, Ban, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getUserBookings, cancelBookingRecord } from "@/lib/booking/mockBookings";
import { Booking } from "@/types/booking";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function MyBookingsContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">("upcoming");
  const [bookings, setBookings] = useState<{ upcoming: Booking[]; previous: Booking[] }>({
    upcoming: [],
    previous: []
  });

  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshBookings = () => {
    if (user) {
      const data = getUserBookings(user.email);
      setBookings(data);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, [user]);

  const handleCancelBooking = (bookingId: string) => {
    const res = cancelBookingRecord(bookingId);
    if (res.success) {
      setFeedback(`Reservation ${bookingId} has been successfully cancelled.`);
      setCancelModalId(null);
      refreshBookings();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const currentList = activeTab === "upcoming" ? bookings.upcoming : bookings.previous;

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            <Ban className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="py-12 bg-cream min-h-screen">
      <Container className="max-w-5xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold block">
              GUEST RESERVATIONS
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-dark font-normal">
              My Bookings
            </h1>
            <p className="text-xs text-muted mt-1 font-light">
              Review and manage your current and previous reservations at Hotel Reliance.
            </p>
          </div>

          <Link href="/rooms">
            <Button variant="primary" size="sm" className="uppercase text-xs tracking-wider">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Book Another Room
            </Button>
          </Link>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </motion.div>
        )}

        {/* Segmented Navigation Tabs */}
        <div className="flex border-b border-border-custom bg-white p-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 sm:flex-initial sm:px-8 py-3 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-primary text-gold shadow-sm"
                : "text-muted hover:text-dark"
            }`}
          >
            Upcoming Reservations ({bookings.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`flex-1 sm:flex-initial sm:px-8 py-3 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "previous"
                ? "bg-primary text-gold shadow-sm"
                : "text-muted hover:text-dark"
            }`}
          >
            Previous Bookings ({bookings.previous.length})
          </button>
        </div>

        {/* Bookings List */}
        {currentList.length > 0 ? (
          <div className="space-y-6">
            {currentList.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border-custom shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 hover:border-gold/60 transition-all"
              >
                {/* Room Thumbnail */}
                <div className="md:col-span-4 relative min-h-[180px] md:min-h-[220px]">
                  <Image
                    src={booking.room.images[0] || "/images/rooms/deluxe/main.jpg"}
                    alt={booking.room.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Booking Information */}
                <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-custom pb-3">
                      <div>
                        <span className="text-[10px] text-muted uppercase font-bold tracking-widest block">
                          Booking ID: <strong className="text-dark">{booking.id}</strong>
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif text-dark mt-0.5">
                          {booking.room.name}
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted uppercase font-bold block">Rate Estimate</span>
                        <span className="text-sm font-serif font-bold text-gold">
                          {booking.estimatedTotal || "Price on Request"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold block">Check-In</span>
                        <span className="font-semibold text-dark">{booking.checkIn}</span>
                        <span className="text-[10px] text-muted block">From 12:00 PM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold block">Check-Out</span>
                        <span className="font-semibold text-dark">{booking.checkOut}</span>
                        <span className="text-[10px] text-muted block">Until 11:00 AM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold block">Guests</span>
                        <span className="font-semibold text-dark">
                          {booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Ch` : ""}
                        </span>
                        <span className="text-[10px] text-muted block">{booking.room.bedType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold block">Guest Name</span>
                        <span className="font-semibold text-dark truncate block">{booking.guest.name}</span>
                        <span className="text-[10px] text-muted truncate block">{booking.guest.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border-custom">
                    <div className="text-[11px] text-muted">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </div>

                    <div className="flex items-center space-x-3">
                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => setCancelModalId(booking.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <Link href={`/my-bookings/${booking.id}`}>
                        <Button variant="primary" size="sm" className="text-xs uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-border-custom p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-cream border border-gold/40 text-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Calendar className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-serif text-dark font-normal">
                {activeTab === "upcoming" ? "No Upcoming Reservations" : "No Previous Bookings"}
              </h2>
              <p className="text-xs text-muted leading-relaxed font-light">
                {activeTab === "upcoming"
                  ? "You don't have any active reservations scheduled. Explore our 45+ premier suites in Bokaro Steel City and plan your stay."
                  : "You have not completed any past stays at Hotel Reliance yet."}
              </p>
            </div>

            <div className="pt-2">
              <Link href="/rooms">
                <Button variant="primary" size="md" className="uppercase text-xs tracking-widest font-bold">
                  Explore Rooms & Suites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <AnimatePresence>
          {cancelModalId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-border-custom p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-dark font-normal">
                    Cancel Reservation?
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Are you sure you want to cancel booking <strong className="text-dark">{cancelModalId}</strong>?
                    Free cancellation is allowed prior to 24 hours before check-in.
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Button
                    variant="secondary"
                    fullWidth
                    size="sm"
                    onClick={() => setCancelModalId(null)}
                    className="text-xs uppercase tracking-wider"
                  >
                    Keep Booking
                  </Button>
                  <button
                    onClick={() => handleCancelBooking(cancelModalId)}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Confirm Cancellation
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
