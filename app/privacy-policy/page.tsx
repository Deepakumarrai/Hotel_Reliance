import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hotelData } from "@/data/hotel";

export const metadata: Metadata = {
  title: "Privacy Policy | Hotel Reliance Bokaro",
  description: "Learn how Hotel Reliance collects, protects, and handles guest data, booking details, and account credentials.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 2026";

  return (
    <>
      {/* Privacy Policy Hero */}
      <section className="bg-dark text-white py-20 border-b border-border-custom">
        <Container className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            LEGAL & COMPLIANCE
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal">
            Privacy Policy
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs text-white/70 pt-2 font-light">
            Last Updated: {lastUpdated} • Hotel Reliance, Bokaro Steel City
          </p>
        </Container>
      </section>

      {/* Policy Content Body */}
      <section className="py-20 bg-cream">
        <Container className="max-w-4xl">
          <div className="bg-white border border-border-custom p-8 sm:p-12 shadow-sm space-y-10 text-xs sm:text-sm text-muted font-light leading-relaxed">
            {/* Introduction */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <Shield className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                1. Commitment to Guest Privacy
              </h2>
              <p>
                Hotel Reliance (&quot;we,&quot; &quot;our,&quot; or &quot;the Hotel&quot;), situated in Co-Operative Colony, Bokaro Steel City, Jharkhand, is firmly committed to safeguarding the personal privacy and data security of our guests, visitors, and website users.
              </p>
              <p>
                This Privacy Policy outlines the categories of personal data we collect, how it is stored and processed, and your rights concerning your personal information when utilizing our website, booking lodging, dining at Kwality Restaurant, or reserving banquet facilities.
              </p>
            </div>

            {/* Information Collected */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <FileText className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                2. Information We Collect
              </h2>
              <p>
                When you make a reservation, register an account, or contact our front desk, we may collect the following details:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li><strong>Personal Identity:</strong> Full name, nationality, and government ID document numbers required by Indian law during check-in.</li>
                <li><strong>Contact Details:</strong> Email address, mobile/telephone number, and residential/business billing address.</li>
                <li><strong>Booking Information:</strong> Check-in/check-out dates, suite preferences, occupancy count, special culinary/dietary requests.</li>
                <li><strong>Account Credentials:</strong> Password hash, account preferences, and Google OAuth profile identifiers (name & email) when you authenticate via Google.</li>
                <li><strong>Transaction Records:</strong> Reservation IDs, payment status, settlement method, and itemized billing summaries.</li>
              </ul>
            </div>

            {/* Purpose of Data Processing */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <Eye className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                3. How We Use Your Information
              </h2>
              <p>Your personal data is used solely for genuine hospitality operations, including:</p>
              <ul className="space-y-2 list-disc list-inside pl-2 text-dark/85">
                <li>Confirming, managing, and fulfilling your room, restaurant, and banquet reservations.</li>
                <li>Issuing reservation vouchers, receipts, and SMS/email booking confirmations.</li>
                <li>Complying with statutory police registration and government guest record laws (Form C for foreign nationals).</li>
                <li>Providing customer support, answering inquiries, and facilitating special in-room requests.</li>
                <li>Improving our digital website experience and securing user accounts against unauthorized access.</li>
              </ul>
            </div>

            {/* Data Sharing & Disclosure */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal flex items-center">
                <Lock className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                4. Data Protection & Non-Disclosure
              </h2>
              <p>
                <strong>We do NOT sell, rent, trade, or monetize your personal information to any third-party marketing companies.</strong>
              </p>
              <p>
                Your information is only disclosed to authorized hotel staff, licensed payment gateway processors (when online billing is activated), or law enforcement authorities when strictly required under applicable Indian statutes.
              </p>
            </div>

            {/* Security */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                5. Security of Your Data
              </h2>
              <p>
                We implement industry-standard administrative, physical, and technical safeguards (including HTTPS SSL/TLS encryption and restricted administrative access) to protect your personal details against unauthorized access, loss, or alteration.
              </p>
            </div>

            {/* Cookies */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                6. Cookies & Browser Storage
              </h2>
              <p>
                Our website utilizes local storage and essential session cookies to remember your authenticated login status, preserve your selected booking dates, and provide seamless navigation across room categories.
              </p>
            </div>

            {/* User Rights */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-dark font-normal">
                7. Your Rights & Data Requests
              </h2>
              <p>
                You have the right to inspect, update, or request the deletion of your online registered account profile at any time by visiting your <Link href="/profile" className="text-primary font-semibold underline">Profile Dashboard</Link> or by contacting our front office desk.
              </p>
            </div>

            {/* Contact Details */}
            <div className="pt-6 border-t border-border-custom bg-cream/50 p-6 space-y-2">
              <h3 className="text-base font-serif text-dark font-medium">
                Privacy Officer Contact
              </h3>
              <p className="text-xs">
                For questions regarding this policy or your personal data, please contact:
              </p>
              <div className="space-y-1 text-xs text-dark pt-1">
                <p><strong>Hotel Reliance Management</strong></p>
                <p>Plot No. 11, Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001</p>
                <p>Email: <a href={`mailto:${hotelData.emails[0]}`} className="text-primary underline">{hotelData.emails[0]}</a></p>
                <p>Phone: {hotelData.phones[0]}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
