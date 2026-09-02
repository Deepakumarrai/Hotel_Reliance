import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck, AlertTriangle, ShieldCheck, Scale, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hotelData } from "@/data/hotel";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hotel Reliance Bokaro",
  description: "Read the official Terms and Conditions governing reservations, payments, cancellations, and guest stay at Hotel Reliance, Bokaro Steel City.",
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "September 2026";

  return (
    <>
      {/* Terms Hero */}
      <section className="bg-dark text-white py-20 border-b border-border-custom">
        <Container className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            LEGAL AGREEMENT
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal">
            Terms & Conditions
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs text-white/70 pt-2 font-light">
            Effective as of {lastUpdated} • Hotel Reliance, Bokaro Steel City
          </p>
        </Container>
      </section>

      {/* Terms Content Body */}
      <section className="py-20 bg-cream">
        <Container className="max-w-4xl">
          <div className="bg-white border border-border-custom p-8 sm:p-12 shadow-sm space-y-10 text-xs sm:text-sm text-muted font-light leading-relaxed">
            {/* 1. Agreement Overview */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <FileCheck className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing this website, registering an account, making a room reservation, dining at Kwality Restaurant, or contracting our banquet facilities, you agree to be bound by these Terms and Conditions and all applicable hotel rules.
              </p>
              <p>
                If you do not agree with any part of these terms, please contact our front office desk prior to confirming your stay or booking.
              </p>
            </div>

            {/* 2. Room Reservations & Booking Intent */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                2. Reservations & Confirmation
              </h2>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>A booking is officially confirmed upon issuance of a unique Reservation Reference Number (e.g., HR-XXXXXX).</li>
                <li>Rooms are allocated based on category booked (Deluxe, Executive, Premium, Family). Specific floor, room number, or bedding orientation requests are subject to operational availability upon check-in.</li>
                <li>Rates quoted on the website are in Indian Rupees (INR) per room per night for the specified number of adult occupants.</li>
              </ul>
            </div>

            {/* 3. Taxes & Billing */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                3. Tariffs, Taxes & Payment Terms
              </h2>
              <p>
                Applicable statutory Goods and Services Tax (GST) will be levied on room tariffs and restaurant dining as per prevailing Government of India rates.
              </p>
              <p>
                Direct bookings via our website do not require immediate upfront online payment. Payment may be settled at the front desk upon check-in via Cash, UPI, Credit/Debit cards, or approved corporate bank transfers.
              </p>
            </div>

            {/* 4. Cancellation & No-Show */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                4. Cancellation, Rescheduling & No-Show Policy
              </h2>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>Standard individual bookings can be cancelled free of charge up to 24 hours prior to 12:00 PM on the scheduled arrival date.</li>
                <li>Cancellations within 24 hours of arrival or failing to show up on the check-in date without notice (No-Show) will incur a charge equal to the first night&apos;s tariff.</li>
                <li>Promotional, festive, or wedding banquet packages may have custom non-refundable cancellation terms specified on the booking agreement.</li>
              </ul>
            </div>

            {/* 5. Check-in & Right of Admission */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <ShieldCheck className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                5. Check-In & Right of Admission
              </h2>
              <p>
                Check-in time is 12:00 PM and check-out is 11:00 AM.
              </p>
              <p>
                Every adult occupant must produce original government-issued photo identification (Aadhaar, Passport, Voter ID, Driving License) upon check-in. The management reserves the legitimate right to refuse admission to individuals who fail to present legal identification or who violate hotel house policies.
              </p>
            </div>

            {/* 6. Guest Conduct & Property Damages */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <AlertTriangle className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                6. Guest Conduct & Property Liability
              </h2>
              <p>
                Guests are responsible for maintaining reasonable care of room amenities, electronics, and furnishings. Any intentional damage, missing inventory, or extraordinary cleaning required due to room smoking will be assessed and billed directly to the guest folio.
              </p>
            </div>

            {/* 7. Governing Law */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <Scale className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                7. Jurisdiction & Applicable Law
              </h2>
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any legal disputes or claims arising out of services provided by Hotel Reliance shall be subject exclusively to the competent courts of Bokaro / Jharkhand jurisdiction.
              </p>
            </div>

            {/* Inquiries */}
            <div className="pt-6 border-t border-border-custom bg-cream/50 p-6 space-y-2">
              <h3 className="text-base font-serif text-dark font-medium">
                Inquiries Regarding Terms
              </h3>
              <p className="text-xs">
                For corporate contract agreements, bulk bookings, or queries regarding these terms, please contact:
              </p>
              <div className="space-y-1 text-xs text-dark pt-1">
                <p><strong>Front Office & Reservations Management</strong></p>
                <p>Hotel Reliance, Plot No. 11, Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001</p>
                <p>Email: {hotelData.emails[0]} | Phone: {hotelData.phones[0]}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
