"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Calendar, Users, Home, Printer, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Booking } from "@/types/booking";
import { formatDate, formatPrice } from "@/lib/utils";
import { hotelData } from "@/data/hotel";

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("confirmedBooking");
    if (stored) {
      try {
        setBooking(JSON.parse(stored));
      } catch (e) {
        console.error("Error reading stored booking", e);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="py-24 bg-cream min-h-[70vh] flex items-center justify-center">
        <Container className="text-center space-y-6 max-w-md">
          <h2 className="text-3xl font-serif text-primary">No Booking Found</h2>
          <p className="text-xs text-muted font-light leading-relaxed">
            We couldn't retrieve any active booking confirmation session. Please check your reservation details or book a room.
          </p>
          <div className="pt-2">
            <Link href="/booking">
              <Button variant="primary" size="sm">
                Book a Room
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <section className="py-16 bg-cream min-h-[80vh] print:bg-white print:py-4 select-none">
      <Container className="max-w-3xl">
        {/* Header receipt block */}
        <div className="bg-white border border-border-custom shadow-lg p-6 sm:p-10 space-y-8 print:border-none print:shadow-none animate-fade-in">
          {/* Success Banner */}
          <div className="text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-dark">
              Reservation Confirmed!
            </h1>
            <p className="text-xs text-muted leading-relaxed font-light max-w-sm mx-auto">
              Thank you for choosing Hotel Reliance. Your reservation is registered. A confirmation voucher has been simulated to your email.
            </p>
            <div className="bg-cream border border-border-custom px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary w-fit mx-auto mt-2">
              Booking Ref: {booking.id}
            </div>
          </div>

          <Divider />

          {/* Receipt Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
            {/* Column 1: Stay summary */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Stay Particulars</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Accommodation</span>
                  <span className="font-semibold text-dark">{booking.room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Check-In Date</span>
                  <span className="font-semibold text-dark">{formatDate(booking.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Check-Out Date</span>
                  <span className="font-semibold text-dark">{formatDate(booking.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Nights</span>
                  <span className="font-semibold text-dark">{nights} Nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Guests</span>
                  <span className="font-semibold text-dark">
                    {booking.adults} Adults
                    {booking.children > 0 && `, ${booking.children} Children`}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Guest Details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Guest Details</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Full Name</span>
                  <span className="font-semibold text-dark">{booking.guest.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Email Address</span>
                  <span className="font-semibold text-dark truncate max-w-[150px]">{booking.guest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Phone Number</span>
                  <span className="font-semibold text-dark">{booking.guest.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Pricing receipt totals */}
          <div className="bg-cream p-5 border border-border-custom flex items-center justify-between text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted block">
                Total Estimated Bill
              </span>
              <span className="text-2xl font-serif text-primary font-bold">
                {booking.totalPrice ? formatPrice(booking.totalPrice) : "Price on request"}
              </span>
            </div>
            <div className="text-right text-[10px] text-muted italic leading-relaxed max-w-[200px]">
              *Payable at the front lobby desk upon arrival. Taxes excluded.
            </div>
          </div>

          {/* Special notes */}
          {booking.guest.specialRequests && (
            <div className="space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-gold uppercase tracking-widest text-[10px]">Special Requests</h4>
              <p className="text-muted font-light leading-relaxed italic bg-cream/50 p-4 border border-border-custom border-dashed">
                "{booking.guest.specialRequests}"
              </p>
            </div>
          )}

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-border-custom gap-4 print:hidden">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>

            <div className="flex space-x-3">
              <Link href="/">
                <Button variant="secondary" size="sm">
                  Back to Home
                </Button>
              </Link>
              <Link href="/rooms">
                <Button variant="primary" size="sm">
                  Browse Suites
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
