"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Calendar, Clock, MapPin, Phone, Mail, CheckCircle2, AlertCircle, Ban, Download } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getBookingById, cancelBookingRecord } from "@/lib/booking/mockBookings";
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
    const data = getBookingById(bookingId);
    setBooking(data || null);
  }, [bookingId]);

  if (booking === undefined) {
    return (
      <div className="py-24 bg-cream min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (booking === null) {
    return (
      <div className="py-24 bg-cream min-h-screen">
        <Container className="max-w-md text-center space-y-6">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-dark">Reservation Not Found</h1>
            <p className="text-xs text-muted">
              We could not find any active or past booking matching reference <strong>{bookingId}</strong>.
            </p>
          </div>
          <Link href="/my-bookings">
            <Button variant="primary" size="sm">
              Back to My Bookings
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      const res = cancelBookingRecord(booking.id);
      if (res.success) {
        setBooking({ ...booking, status: "cancelled" });
        setFeedback("Your reservation has been cancelled.");
      }
    }
  };

  return (
    <div className="py-12 bg-cream min-h-screen">
      <Container className="max-w-4xl space-y-8">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/my-bookings"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-muted hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Bookings
          </Link>

          <div className="flex items-center space-x-3 print:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="text-xs uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Voucher
            </Button>
          </div>
        </div>

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

        {/* Official Hotel Reliance Reservation Voucher */}
        <div className="bg-white border border-border-custom shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Header Banner */}
          <div className="bg-primary text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gold">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-gold block">
                OFFICIAL RESERVATION VOUCHER
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                Hotel Reliance
              </h1>
              <p className="text-xs text-cream/70 font-light">
                Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City - 827001
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/10 p-3 sm:p-4 rounded-sm border border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                Booking Reference
              </span>
              <span className="text-xl font-serif font-bold text-white tracking-wider block">
                {booking.id}
              </span>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm ${
                  booking.status === "confirmed"
                    ? "bg-emerald-500 text-white"
                    : booking.status === "completed"
                    ? "bg-slate-300 text-slate-900"
                    : "bg-red-500 text-white"
                }`}
              >
                Status: {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Stay Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-cream/50 p-6 border border-border-custom">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                  Check-In
                </span>
                <span className="text-base font-serif font-bold text-dark block">
                  {booking.checkIn}
                </span>
                <span className="text-xs text-muted flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gold" />
                  From 12:00 PM
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                  Check-Out
                </span>
                <span className="text-base font-serif font-bold text-dark block">
                  {booking.checkOut}
                </span>
                <span className="text-xs text-muted flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gold" />
                  Until 11:00 AM
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                  Occupancy
                </span>
                <span className="text-base font-serif font-bold text-dark block">
                  {booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Child` : ""}
                </span>
                <span className="text-xs text-muted">{booking.room.bedType}</span>
              </div>
            </div>

            {/* Room & Guest Details Split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Room overview */}
              <div className="md:col-span-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gold border-b border-border-custom pb-2">
                  Accommodations Details
                </h3>

                <div className="flex space-x-4">
                  <div className="w-24 h-24 relative flex-shrink-0 border border-border-custom">
                    <Image
                      src={booking.room.images[0] || "/images/rooms/deluxe/main.jpg"}
                      alt={booking.room.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif font-normal text-dark">
                      {booking.room.name}
                    </h4>
                    <p className="text-xs text-muted line-clamp-2">{booking.room.description}</p>
                    <span className="text-[11px] text-gold font-medium block">
                      Room Size: {booking.room.size || "280 sq. ft."}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h5 className="text-[10px] uppercase font-bold text-muted mb-2">Key Amenities Included:</h5>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-dark">
                    {booking.room.amenities.slice(0, 6).map((am, i) => (
                      <span key={i} className="flex items-center text-[11px] text-muted">
                        • {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Guest & Billing overview */}
              <div className="md:col-span-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gold border-b border-border-custom pb-2">
                  Primary Guest & Billing
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-custom/50">
                    <span className="text-muted">Primary Guest Name:</span>
                    <span className="font-semibold text-dark">{booking.guest.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-custom/50">
                    <span className="text-muted">Contact Email:</span>
                    <span className="font-semibold text-dark">{booking.guest.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-custom/50">
                    <span className="text-muted">Phone Number:</span>
                    <span className="font-semibold text-dark">{booking.guest.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-custom/50">
                    <span className="text-muted">Payment Type:</span>
                    <span className="font-semibold text-dark">{booking.paymentMethod || "Pay at Check-In"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-custom/50">
                    <span className="text-muted">Rate Estimate:</span>
                    <span className="font-bold text-gold">{booking.estimatedTotal || "Price on Request"}</span>
                  </div>

                  {booking.guest.specialRequests && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                        Special Requests:
                      </span>
                      <p className="p-2 bg-cream border border-border-custom text-[11px] text-muted italic">
                        "{booking.guest.specialRequests}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotel Policies and Contact Note */}
            <div className="border-t border-border-custom pt-6 space-y-4 text-xs text-muted font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cream/30 p-4 border border-border-custom">
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-dark tracking-wider">Hotel Location & Concierge</h4>
                  <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" /> Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City</p>
                  <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" /> +91 92629 97777 / +91 92628 27777</p>
                  <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" /> reservation@hotelreliance.com</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-dark tracking-wider">Check-in Instructions</h4>
                  <p>• Government photo ID proof is mandatory for all staying adult guests at check-in.</p>
                  <p>• Early check-in & late check-out subject to room availability upon request.</p>
                </div>
              </div>
            </div>

            {/* Actions for active bookings */}
            {booking.status === "confirmed" && (
              <div className="flex items-center justify-between pt-4 border-t border-border-custom print:hidden">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-red-600 hover:text-red-800 uppercase font-bold tracking-wider cursor-pointer"
                >
                  Cancel This Reservation
                </button>

                <Link href="/contact">
                  <Button variant="outline" size="sm" className="text-xs uppercase tracking-wider">
                    Contact Hotel Concierge
                  </Button>
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
