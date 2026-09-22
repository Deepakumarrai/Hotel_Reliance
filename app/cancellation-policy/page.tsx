import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, RefreshCcw, AlertTriangle, CheckCircle2, ShieldCheck, Mail, Phone, CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hotelData } from "@/data/hotel";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Hotel Reliance Bokaro",
  description: "Official cancellation terms, refund timelines, and modification policies for room and banquet bookings at Hotel Reliance Bokaro.",
};

export default function CancellationPolicyPage() {
  const lastUpdated = "September 2026";

  return (
    <>
      {/* Hero Header */}
      <section className="bg-dark text-white py-20 border-b border-border-custom">
        <Container className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            GUEST POLICIES & TERMS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal">
            Cancellation & Refund Policy
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs text-white/70 pt-2 font-light">
            Last Updated: {lastUpdated} • Hotel Reliance, Bokaro Steel City
          </p>
        </Container>
      </section>

      {/* Policy Details */}
      <section className="py-20 bg-cream">
        <Container className="max-w-4xl">
          <div className="bg-white border border-border-custom p-8 sm:p-12 shadow-sm space-y-10 text-xs sm:text-sm text-muted font-light leading-relaxed">
            
            {/* Overview & Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 border-b border-border-custom">
              <div className="p-4 bg-cream/60 border border-border-custom text-center space-y-2">
                <Clock className="w-6 h-6 text-gold mx-auto" />
                <h3 className="font-serif text-dark font-medium text-sm">Free Cancellation</h3>
                <p className="text-xs text-muted">Up to 24 hours prior to 12:00 PM check-in date.</p>
              </div>
              <div className="p-4 bg-cream/60 border border-border-custom text-center space-y-2">
                <RefreshCcw className="w-6 h-6 text-gold mx-auto" />
                <h3 className="font-serif text-dark font-medium text-sm">Fast Refund</h3>
                <p className="text-xs text-muted">Credited within 5–7 business days to original method.</p>
              </div>
              <div className="p-4 bg-cream/60 border border-border-custom text-center space-y-2">
                <CalendarCheck className="w-6 h-6 text-gold mx-auto" />
                <h3 className="font-serif text-dark font-medium text-sm">Easy Reschedule</h3>
                <p className="text-xs text-muted">Subject to room availability and seasonal tariff.</p>
              </div>
            </div>

            {/* Section 1: Standard Room Reservations */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <Clock className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                1. Standard Room Reservations (Individual Guests)
              </h2>
              <p>
                We understand that travel itineraries may adjust unexpectedly. For standard online and direct room reservations (Single Occupancy, Double Occupancy, and Family Room):
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>
                  <strong>Cancellation 24+ Hours Before Check-in:</strong> 100% refund of any advance booking deposit paid online, minus standard payment gateway transaction fees (if applicable).
                </li>
                <li>
                  <strong>Cancellation within 24 Hours of Check-in:</strong> Retains 1 night room tariff as cancellation fee; remainder of multi-day bookings refunded in full.
                </li>
                <li>
                  <strong>Same-Day Cancellations / No-Show:</strong> In the event that a guest does not arrive on the scheduled check-in date without prior written notice, the first night&apos;s accommodation charges will be retained and subsequent dates will be released.
                </li>
              </ul>
            </div>

            {/* Section 2: Check-in & Check-out Standards */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <CalendarCheck className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                2. Check-in and Check-out Timings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div className="bg-cream/40 p-3.5 border border-border-custom">
                  <p className="text-xs uppercase text-gold font-bold tracking-wider">Standard Check-In</p>
                  <p className="text-lg font-serif text-dark mt-1">12:00 PM IST</p>
                  <p className="text-xs text-muted mt-1">Early check-in subject to room availability.</p>
                </div>
                <div className="bg-cream/40 p-3.5 border border-border-custom">
                  <p className="text-xs uppercase text-gold font-bold tracking-wider">Standard Check-Out</p>
                  <p className="text-lg font-serif text-dark mt-1">11:00 AM IST</p>
                  <p className="text-xs text-muted mt-1">Late check-out available on request with front desk.</p>
                </div>
              </div>
              <p>
                Government-issued photo identification (Aadhaar Card, Passport, Voter ID, or Driving License) is strictly mandatory for all adult guests checking into the hotel.
              </p>
            </div>

            {/* Section 3: Banquet & Wedding Events */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <AlertTriangle className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                3. Banquet, Marriage Hall & Group Bookings
              </h2>
              <p>
                Due to advance hall preparation, catering logistics, and inventory allocation, the following terms govern our Banquet Hall and Marriage packages (e.g. ₹2,25,000/- wedding package):
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li><strong>30+ Days Prior to Event:</strong> 80% refund of advance deposit.</li>
                <li><strong>15 to 30 Days Prior to Event:</strong> 50% refund of advance deposit.</li>
                <li><strong>Less than 15 Days Prior to Event:</strong> Advance deposit is non-refundable due to inventory commitment.</li>
                <li><strong>Date Rescheduling:</strong> Subject to hall availability and administrative management approval.</li>
              </ul>
            </div>

            {/* Section 4: Refund Processing */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <RefreshCcw className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                4. Refund Processing Timelines & Modes
              </h2>
              <p>
                All eligible refund claims are processed automatically through our secure banking partner / payment gateway:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>Refunds are returned strictly to the <strong>original source account / card / UPI ID</strong> used during payment initiation.</li>
                <li>Processing cycle: <strong>5 to 7 working banking days</strong> from the date of approved cancellation.</li>
                <li>For cash or direct front-desk settlements, refunds are issued via bank transfer upon invoice verification.</li>
              </ul>
            </div>

            {/* Section 5: Modifications & Early Check-Out */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <ShieldCheck className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                5. Reservation Modifications & Early Departure
              </h2>
              <p>
                Guests desiring to modify dates or check out early must notify the front desk:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>Date changes are subject to room category availability and applicable rate differences.</li>
                <li>Early checkout during peak festive or marriage dates may incur retention for the subsequent night if requested without prior 24-hour notice.</li>
              </ul>
            </div>

            {/* Support Contact Box */}
            <div className="p-6 bg-cream border border-border-custom space-y-3 mt-8">
              <h3 className="text-lg font-serif text-dark font-medium flex items-center">
                <CheckCircle2 className="w-5 h-5 text-gold mr-2" />
                Need Assistance with a Cancellation or Refund?
              </h3>
              <p>
                For immediate assistance with existing reservations, please contact our Front Desk manager with your Booking ID:
              </p>
              <div className="flex flex-wrap gap-6 pt-2 text-dark font-medium">
                <a href={`tel:${hotelData.phones[0].replace(/[^0-9+]/g, '')}`} className="flex items-center hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 text-gold mr-2" />
                  {hotelData.phones[0]}
                </a>
                <a href={`mailto:${hotelData.emails[0]}`} className="flex items-center hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold mr-2" />
                  {hotelData.emails[0]}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-border-custom flex flex-wrap gap-4 text-xs">
              <Link href="/privacy-policy" className="text-gold hover:underline">
                View Privacy Policy →
              </Link>
              <Link href="/terms-and-conditions" className="text-gold hover:underline">
                View Terms & Conditions →
              </Link>
              <Link href="/contact" className="text-gold hover:underline">
                Contact Front Desk →
              </Link>
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}
