"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Check,
  Copy,
  ArrowUpRight,
  Navigation,
} from "lucide-react";
import { hotelData } from "@/data/hotel";
import { useHotelSettings } from "@/hooks/useHotelSettings";

const links = {
  explore: [
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Kwality Dining", href: "/restaurant" },
    { label: "Banquets & Events", href: "/banquet" },
    { label: "Weddings", href: "/banquet#lawn" },
    { label: "Photo Gallery", href: "/gallery" },
  ],
  info: [
    { label: "About Us", href: "/about" },
    { label: "Offers", href: "/offers" },
    { label: "Attractions", href: "/places" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Policies", href: "/policies" },
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms-and-conditions" },
    { label: "Cancellation", href: "/cancellation-policy" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1N5dD3DvRk/",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hotelreliancebokaro?igsh=MWI3bGpoODVnNHRvdA==",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@hotelreliancebokaro2683?si=1CpOpWNnGipC5R2A",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const hotelSettings = useHotelSettings();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => { setSubscribed(false); setEmail(""); }, 3000);
    }
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hotelSettings.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer className="bg-[#0C0A09] text-white/70 border-t border-white/6 select-none">
      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-12 sm:pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 border-b border-white/8">

          {/* Brand + contact column */}
          <div className="lg:col-span-4 space-y-7">
            {/* Wordmark */}
            <Link href="/" className="inline-block group">
              <span className="text-2xl sm:text-3xl font-serif tracking-[0.18em] text-white uppercase font-light group-hover:text-[#D8B875] transition-colors duration-300">
                {hotelSettings.hotelName}
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#BA8B32] font-sans font-semibold mt-0.5">
                Bokaro Steel City · Jharkhand
              </span>
            </Link>

            {/* Contact pills */}
            <div className="space-y-2.5">
              {hotelSettings.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center space-x-2.5 text-sm text-white/60 hover:text-[#D8B875] transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-full bg-white/6 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#BA8B32]/15 group-hover:border-[#BA8B32]/30 transition-all duration-200">
                    <Phone className="w-3 h-3" strokeWidth={1.8} />
                  </span>
                  <span className="font-sans text-[13px]">{phone}</span>
                </a>
              ))}
              <a
                href={`mailto:${hotelSettings.primaryEmail}`}
                className="flex items-center space-x-2.5 text-sm text-white/60 hover:text-[#D8B875] transition-colors duration-200 group"
              >
                <span className="w-7 h-7 rounded-full bg-white/6 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#BA8B32]/15 group-hover:border-[#BA8B32]/30 transition-all duration-200">
                  <Mail className="w-3 h-3" strokeWidth={1.8} />
                </span>
                <span className="font-sans text-[13px] truncate">{hotelSettings.primaryEmail}</span>
              </a>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA8B32] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BA8B32]" />
                  </span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#BA8B32]">
                    Location
                  </span>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center space-x-1 text-[10px] font-sans text-white/35 hover:text-white/70 transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <a
                href="https://maps.google.com/?q=Hotel+Reliance+Co-Operative+Colony+Bokaro+Steel+City+Jharkhand+827001"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start space-x-2 text-white/55 hover:text-white/90 transition-colors duration-200"
              >
                <MapPin className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                <span className="text-[12px] font-sans leading-relaxed">
                  {hotelSettings.fullAddress}
                </span>
                <ArrowUpRight className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center space-x-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/6 border border-white/8 flex items-center justify-center text-white/50 hover:text-[#D8B875] hover:bg-white/10 hover:border-[#BA8B32]/30 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#BA8B32] mb-4">
                Explore
              </p>
              <ul className="space-y-2.5">
                {links.explore.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] font-sans text-white/55 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#BA8B32] mb-4">
                Information
              </p>
              <ul className="space-y-2.5">
                {links.info.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] font-sans text-white/55 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#BA8B32] mb-4">
                Stay Updated
              </p>
              <p className="text-[12px] text-white/40 font-sans leading-relaxed mb-4">
                Get exclusive offers and hotel updates delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#BA8B32]/60 focus:bg-white/8 transition-all duration-200 font-sans"
                />
                <button
                  type="submit"
                  className="w-full bg-[#BA8B32] hover:bg-[#A67B22] text-white font-semibold text-[11px] uppercase tracking-[0.1em] py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-[0_4px_14px_rgba(186,139,50,0.3)] hover:shadow-[0_6px_20px_rgba(186,139,50,0.4)] flex items-center justify-center space-x-1.5"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-100">Subscribed!</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </form>
            </div>

            {/* Book CTA */}
            <Link href="/booking">
              <div className="group flex items-center justify-between bg-white/5 hover:bg-white/9 border border-white/8 hover:border-[#BA8B32]/30 rounded-xl px-4 py-3.5 transition-all duration-300 cursor-pointer">
                <div>
                  <p className="text-[11px] font-semibold text-white/80 font-sans">Reserve a Room</p>
                  <p className="text-[10px] text-white/35 font-sans mt-0.5">Check availability</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#BA8B32]/15 border border-[#BA8B32]/25 flex items-center justify-center group-hover:bg-[#BA8B32] group-hover:border-[#BA8B32] transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D8B875] group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <p className="text-[11px] font-sans text-white/25 text-center sm:text-left">
            © {currentYear} {hotelSettings.hotelName}. All rights reserved.
            {" · "}
            Designed by{" "}
            <a
              href="https://hypekimedia.myquro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#D8B875] transition-colors underline underline-offset-2"
            >
              Deepak Kumar Rai
            </a>
          </p>

          <div className="flex items-center gap-4">
            {links.legal.map((l, i) => (
              <React.Fragment key={l.href}>
                {i > 0 && <span className="text-white/15 text-[10px]">·</span>}
                <Link
                  href={l.href}
                  className="text-[11px] font-sans text-white/30 hover:text-white/70 transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
