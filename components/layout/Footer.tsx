"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Minus, 
  Check,
  ArrowRight
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hotelData } from "@/data/hotel";
import { useHotelSettings } from "@/hooks/useHotelSettings";

export function Footer() {
  const pathname = usePathname();
  const hotelSettings = useHotelSettings();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);

  // Do not render guest footer on admin panel routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#0F0D0C] text-[#EFEBE6] pt-16 pb-12 border-t border-[#26201C] select-none">
      <Container className="max-w-7xl">
        {/* Top Heritage Brand Title matching IHCL Logo Position */}
        <div className="mb-14">
          <Link href="/" className="inline-block group">
            <span className="text-3xl sm:text-5xl font-serif tracking-[0.22em] text-white uppercase font-normal group-hover:text-[#D8B875] transition-colors">
              {hotelSettings.hotelName}
            </span>
          </Link>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-14 border-b border-[#26201C]">
          {/* Left Column: Brand & Direct Contact (Span 7) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Newsletter Subscription */}
            <div>
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block mb-4">
                Subscribe For Latest Updates
              </span>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 max-w-md">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent border-b-2 border-[#3D332C] text-sm text-white placeholder:text-[#888078] pb-2.5 focus:outline-none focus:border-[#D8B875] font-sans transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C5A880] hover:bg-[#D8B875] text-[#111111] font-bold text-xs tracking-[0.18em] uppercase px-8 py-3 transition-all duration-300 flex items-center justify-center cursor-pointer flex-shrink-0 shadow-md hover:shadow-lg"
                >
                  {subscribed ? (
                    <span className="flex items-center text-emerald-950 font-bold">
                      <Check className="w-4 h-4 mr-1.5" />
                      Subscribed
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>

            {/* Bookings & Reservations Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block">
                  For Bookings Contact
                </span>
                <div className="flex flex-col space-y-1.5 text-sm sm:text-base font-sans text-white/95">
                  {hotelSettings.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="hover:text-[#D8B875] transition-colors font-medium"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block opacity-0 hidden sm:block">
                  Email
                </span>
                <a
                  href={`mailto:${hotelSettings.primaryEmail}`}
                  className="text-xs sm:text-sm font-sans text-[#E5DFD7] hover:text-[#D8B875] transition-colors block break-all pt-0 sm:pt-6 font-medium"
                >
                  {hotelSettings.primaryEmail}
                </a>
              </div>
            </div>

            {/* Customer Support */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block">
                Customer Support
              </span>
              <a
                href={`mailto:${hotelSettings.primaryEmail}`}
                className="text-sm font-sans text-[#E5DFD7] hover:text-[#D8B875] transition-colors block font-medium"
              >
                {hotelSettings.primaryEmail}
              </a>
            </div>
          </div>

          {/* Middle Columns: Quick Links (Span 5) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Quick Links Column 1 */}
            <div>
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block mb-4">
                Quick Links
              </span>
              <ul className="space-y-3.5 text-sm sm:text-[15px] font-serif text-[#DFD7CF]">
                <li>
                  <Link href="/rooms" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Hotels & Suites
                  </Link>
                </li>
                <li>
                  <Link href="/restaurant" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Kwality Dining
                  </Link>
                </li>
                <li>
                  <Link href="/banquet" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Banquets & Lawns
                  </Link>
                </li>
                <li>
                  <Link href="/banquet#weddings" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Timeless Weddings
                  </Link>
                </li>
                <li>
                  <Link href="/banquet#meetings" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Event Venues
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Photo Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/policies" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Hotel Policies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div>
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block mb-4 opacity-0 hidden sm:block">
                More Information
              </span>
              <ul className="space-y-3.5 text-sm sm:text-[15px] font-serif text-[#DFD7CF]">
                <li>
                  <Link href="/about" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    About Hotel Reliance
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Special Offers & Packages
                  </Link>
                </li>
                <li>
                  <Link href="/places" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Local Attractions
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#D8B875] transition-all hover:translate-x-1 duration-200 inline-block font-normal">
                    Contact Front Desk
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Connect With Us (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold block mb-4">
              Connect With Us
            </span>
            <div className="flex items-center space-x-4 text-white">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D8B875] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D8B875] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D8B875] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D8B875] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D8B875] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Collapsible Destinations / Local Bokaro Attractions Row */}
        <div className="border-b border-[#2A231F] py-5">
          <button
            onClick={() => setDestinationsOpen(!destinationsOpen)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <span className="text-xs sm:text-[13px] font-mono tracking-[0.2em] text-[#C5A880] uppercase font-bold group-hover:text-white transition-colors">
              Destinations & Bokaro Landmarks
            </span>
            <div className="text-[#C5A880] group-hover:text-white transition-colors">
              {destinationsOpen ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
          </button>

          {destinationsOpen && (
            <div className="pt-4 pb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm font-serif text-[#DFD7CF]">
              <Link href="/places" className="hover:text-[#D8B875] transition-colors">
                Bokaro Steel Plant (SAIL)
              </Link>
              <Link href="/places" className="hover:text-[#D8B875] transition-colors">
                City Park & Lake
              </Link>
              <Link href="/places" className="hover:text-[#D8B875] transition-colors">
                Jagannath Temple Bokaro
              </Link>
              <Link href="/places" className="hover:text-[#D8B875] transition-colors">
                Garga Dam Reservoir
              </Link>
              <Link href="/places" className="hover:text-[#D8B875] transition-colors">
                Biological Park & Zoo
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Bar: Hotel Reliance Bokaro Hospitality & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#9E958C] gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-serif tracking-[0.05em] text-[#DFD7CF]">
              © {currentYear} {hotelSettings.hotelName}. All rights reserved.
            </p>
            <p className="text-[12px] text-[#8C847C]">
              {hotelSettings.fullAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono uppercase tracking-wider text-[#B0A79E]">
            <Link href="/policies" className="hover:text-[#D8B875] transition-colors">
              Policies
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-[#D8B875] transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-[#D8B875] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
