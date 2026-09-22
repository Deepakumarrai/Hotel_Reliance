"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";
import { FadeUp } from "@/components/animation/FadeUp";

export function ContactHighlightSection() {
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent("Hotel Reliance, Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand 827001")}`;

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#FAF7F2] text-[#2B2320] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        <FadeUp className="space-y-10">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E1D7]">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#B38E5D] block">
                  GET IN TOUCH & VISIT US
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.08em] sm:tracking-[0.12em] text-[#2B2320] uppercase leading-tight mt-1">
                  Contact & Location
                </h2>
              </div>
            </div>

            <p className="text-[15px] sm:text-[17px] font-serif italic text-[#4A3E37] max-w-lg leading-relaxed text-left md:text-right font-normal">
              Conveniently located in Co-Operative Colony, Bokaro Steel City. Reach out for room bookings, dining reservations, and banquet consultations.
            </p>
          </div>

          {/* Prominently Highlighted Address & Contact Master Card (Requirement 12) */}
          <div className="border-2 border-[#C5A880] bg-white shadow-2xl rounded-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Prominently Highlighted Property Address */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#BA8B32]/15 text-[#8C6418] text-[10px] uppercase font-bold tracking-widest rounded-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#BA8B32]" />
                    <span>Prime Bokaro Steel City Location</span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-serif text-[#2B2320] leading-snug">
                    Hotel Reliance Property Address
                  </h3>

                  {/* Large Readable Address Typography (Requirement 12) */}
                  <div className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#E8DFD2] rounded-xs space-y-2">
                    <p className="text-base sm:text-xl md:text-2xl font-serif font-bold text-[#2B2320] leading-snug">
                      Plot No: NIHP-1, West Side of Co-Operative Colony
                    </p>
                    <p className="text-sm sm:text-base font-sans text-[#5C4F46] font-medium">
                      Bokaro Steel City, Jharkhand — 827001, India
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#2B2320] hover:bg-[#BA8B32] text-white text-xs font-sans uppercase tracking-widest font-bold transition-all shadow-md rounded-xs touch-press cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-[#D8B875]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>

                  <Link href="/contact" className="inline-flex items-center justify-center">
                    <Button variant="outline" size="md" className="w-full sm:w-auto uppercase text-xs tracking-wider border-[#C5A880] text-[#2B2320] hover:bg-[#C5A880] hover:text-white">
                      View Full Contact Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Direct Phones & Front Desk Hours */}
              <div className="lg:col-span-5 bg-[#0F0D0C] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C5A880] font-bold block mb-2">
                      DIRECT HELPLINE
                    </span>
                    <h4 className="text-lg font-serif text-white mb-3">
                      24/7 Front Desk & Reservations
                    </h4>
                    <div className="space-y-2 text-sm sm:text-base font-sans">
                      {hotelData.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="flex items-center space-x-3 text-white/95 hover:text-[#D8B875] transition-colors font-medium"
                        >
                          <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C5A880] font-bold block">
                      EMAIL INQUIRIES
                    </span>
                    <a
                      href={`mailto:${hotelData.emails[0]}`}
                      className="flex items-center space-x-3 text-sm text-[#E5DFD7] hover:text-[#D8B875] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                      <span>{hotelData.emails[0]}</span>
                    </a>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C5A880] font-bold block">
                      CHECK-IN / CHECK-OUT
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-white/80 font-sans">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Check-In: 12:00 PM • Check-Out: 11:00 AM</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-white/60 font-light border-t border-white/10 pt-4">
                  Complimentary on-site guest parking & 24/7 surveillance available.
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
