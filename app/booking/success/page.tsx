"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Calendar, MapPin, Phone, Mail, Printer, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Booking } from "@/types/booking";
import { HOTEL_INFO } from "@/lib/constants";
import { useHotelSettings } from "@/hooks/useHotelSettings";

export default function BookingSuccessPage() {
  const settings = useHotelSettings();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Read confirmed booking from sessionStorage
    const raw = sessionStorage.getItem("confirmedBooking");
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch (err) {
        console.error("Failed to parse booking from sessionStorage", err);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-16 bg-cream min-h-screen">
      <Container className="max-w-3xl space-y-8">
        {/* Success Header Animation */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 bg-primary text-gold rounded-full flex items-center justify-center mx-auto border-2 border-gold shadow-xl"
          >
            <Check className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-1.5"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold block">
              RESERVATION CONFIRMED
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-dark font-normal">
              Booking Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-muted font-light max-w-md mx-auto leading-relaxed">
              Your stay at Hotel Reliance has been successfully booked. A confirmation voucher has been generated for your reservation.
            </p>
          </motion.div>
        </div>

        {/* Confirmation Voucher Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white border border-border-custom shadow-xl overflow-hidden print:border-none print:shadow-none"
        >
          {/* Voucher Header */}
          <div className="bg-primary text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gold">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-gold block">
                Official Booking Receipt
              </span>
              <h2 className="text-2xl font-serif text-white font-normal">
                Hotel Reliance, Bokaro
              </h2>
              <p className="text-[11px] text-cream/70 font-light mt-0.5">
                West Side of Co-Operative Colony, Bokaro Steel City - 827001
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/10 p-3 sm:p-4 rounded-sm border border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                Booking ID
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-white tracking-wider block">
                {booking?.id || "HR-928412"}
              </span>
              <span className="inline-block px-2 py-0.5 bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-wider mt-1 rounded-sm">
                Status: Confirmed
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs">
            {/* Stay Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-cream/50 border border-border-custom">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block">Check-In</span>
                <span className="font-semibold text-dark text-sm block mt-0.5">
                  {booking?.checkIn || "Upcoming"}
                </span>
                <span className="text-[10px] text-muted">From {settings.checkInTime}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block">Check-Out</span>
                <span className="font-semibold text-dark text-sm block mt-0.5">
                  {booking?.checkOut || "Upcoming"}
                </span>
                <span className="text-[10px] text-muted">Until {settings.checkOutTime}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block">Guests</span>
                <span className="font-semibold text-dark text-sm block mt-0.5">
                  {booking ? `${booking.adults} Adults ${booking.children > 0 ? `, ${booking.children} Ch` : ""}` : "2 Adults"}
                </span>
                <span className="text-[10px] text-muted">{booking?.room?.bedType || "King Bed"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block">Estimated Total</span>
                <span className="font-serif font-bold text-gold text-sm block mt-0.5">
                  {booking?.estimatedTotal || "Price on Request"}
                </span>
                <span className="text-[10px] text-muted">Pay at Check-In</span>
              </div>
            </div>

            {/* Room & Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-border-custom pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gold">
                  Room Information
                </h3>
                <h4 className="text-base font-serif font-semibold text-dark">
                  {booking?.room?.name || "Deluxe Suite"}
                </h4>
                <p className="text-muted leading-relaxed font-light">
                  {booking?.room?.description || "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay."}
                </p>
                <span className="text-[11px] text-gold font-medium block">
                  Room Size: {booking?.room?.size || "280 sq. ft."}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gold">
                  Primary Guest Contact
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold text-dark">{booking?.guest?.name || "Valued Guest"}</p>
                  <p className="text-muted">{booking?.guest?.email || "guest@example.com"}</p>
                  <p className="text-muted">{booking?.guest?.phone || "+91 92629 97777"}</p>
                </div>
                {booking?.guest?.specialRequests && (
                  <p className="p-2 bg-cream border border-border-custom text-[11px] text-muted italic">
                    Special requests: "{booking.guest.specialRequests}"
                  </p>
                )}
              </div>
            </div>

            {/* Hotel Location & Assistance */}
            <div className="p-4 bg-cream/40 border border-border-custom space-y-2 font-light">
              <h4 className="text-[10px] uppercase font-bold text-dark tracking-wider">
                Hotel Address & Direct Desk
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
                <p className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                  {HOTEL_INFO.address.fullAddress}
                </p>
                <p className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                  {HOTEL_INFO.phones[0].display} / {HOTEL_INFO.phones[1].display}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-cream/80 border-t border-border-custom flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="text-xs uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save Voucher
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/my-bookings">
                <Button variant="primary" size="sm" className="text-xs uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  View My Bookings
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" size="sm" className="text-xs uppercase tracking-wider">
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
