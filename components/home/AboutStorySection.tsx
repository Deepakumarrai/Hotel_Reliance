"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Award, Users, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/animation/FadeUp";

export function AboutStorySection() {
  return (
    <section id="about-hotel" className="py-16 sm:py-24 bg-[#FAF7F2] text-[#2B2320] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        <FadeUp className="space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E1D7]">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#B38E5D] block">
                  OUR HERITAGE & VISION
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.08em] sm:tracking-[0.12em] text-[#2B2320] uppercase leading-tight mt-1">
                  About Hotel Reliance
                </h2>
              </div>
            </div>

            <p className="text-[15px] sm:text-[17px] font-serif italic text-[#4A3E37] max-w-lg leading-relaxed text-left md:text-right font-normal">
              A locally rooted hospitality landmark in Bokaro Steel City, committed to unmatched guest comfort, authentic cuisine, and memorable celebrations.
            </p>
          </div>

          {/* 2-Column Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Image Spread */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-[#C5A880] shadow-xl bg-[#1E1815]">
                <Image
                  src="/images/hotel/building-dusk.png"
                  alt="Hotel Reliance Property"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white border border-[#E8DFD2] p-4 shadow-xl hidden sm:block max-w-[220px]">
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#B38E5D] font-bold block">
                  INVENTORY
                </span>
                <p className="text-lg font-serif font-bold text-[#2B2320]">
                  42 Executive Rooms
                </p>
                <span className="text-[10px] text-[#7A6B61]">
                  Co-Operative Colony, Bokaro
                </span>
              </div>
            </div>

            {/* Right Story Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4 text-sm sm:text-base text-[#4F423A] font-light leading-relaxed">
                <p>
                  Built with passion and deep local roots, <strong className="font-semibold text-[#2B2320]">Hotel Reliance</strong> has been welcoming executives, families, and wedding guests to Bokaro Steel City with genuine warmth and prompt service.
                </p>
                <p>
                  With <strong className="font-semibold text-[#2B2320]">42 well-appointed guest rooms</strong>, our signature Kwality Multi-Cuisine Restaurant, air-conditioned banquet hall, and expansive celebration lawn, we offer complete comfort under one roof.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-white border border-[#E8DFD2] shadow-xs">
                  <HeartHandshake className="w-5 h-5 text-[#BA8B32] mb-1.5" />
                  <h4 className="font-serif text-xs font-bold uppercase text-[#2B2320]">Warm Care</h4>
                  <p className="text-[11px] text-[#7A6B61] mt-0.5 font-light">Dedicated 24/7 staff service</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E8DFD2] shadow-xs">
                  <Award className="w-5 h-5 text-[#BA8B32] mb-1.5" />
                  <h4 className="font-serif text-xs font-bold uppercase text-[#2B2320]">Best Value</h4>
                  <p className="text-[11px] text-[#7A6B61] mt-0.5 font-light">Transparent all-inclusive rates</p>
                </div>
                <div className="p-3.5 bg-white border border-[#E8DFD2] shadow-xs">
                  <Users className="w-5 h-5 text-[#BA8B32] mb-1.5" />
                  <h4 className="font-serif text-xs font-bold uppercase text-[#2B2320]">42 Rooms</h4>
                  <p className="text-[11px] text-[#7A6B61] mt-0.5 font-light">Comfortable guest living</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" size="md" className="uppercase text-xs tracking-wider border-[#C5A880] text-[#2B2320] hover:bg-[#C5A880] hover:text-white">
                    Learn More About Our Journey
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
