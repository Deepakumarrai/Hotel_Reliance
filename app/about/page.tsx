import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Heart, Play, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { HomeCTA } from "@/components/home/HomeCTA";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { hotelData } from "@/data/hotel";
import { staffData } from "@/data/staff";

export const metadata: Metadata = {
  title: "About Hotel Reliance | Our Story & Hospitality Team",
  description: "Discover the story, leadership team, and hospitality philosophy of Hotel Reliance in Bokaro Steel City.",
};

const hospitalityStandards = [
  {
    id: "guests-first",
    title: "Guests First",
    desc: "To deliver personalized care, anticipating lodging needs with a warm hospitality approach.",
    image: "/images/standards/guest-first-hq.png",
    icon: (
      <svg className="w-6 h-6 text-[#9D783E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <circle cx="12" cy="9.5" r="2" />
        <path d="M9.5 14c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2" />
      </svg>
    )
  },
  {
    id: "premium-quality",
    title: "Premium Quality",
    desc: "Maintaining strict standards of cleanliness, fresh ingredients, and responsive services.",
    image: "/images/standards/premium-quality-hq.png",
    icon: (
      <svg className="w-6 h-6 text-[#9D783E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M12 5.5l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z" fill="currentColor" stroke="none" />
        <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" />
      </svg>
    )
  },
  {
    id: "safety-security",
    title: "Safety & Security",
    desc: "Providing round-the-clock security surveillance, monitored parking, and secure room card access.",
    image: "/images/standards/safety-security-hq.png",
    icon: (
      <svg className="w-6 h-6 text-[#9D783E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
];

const videoStages = [
  { title: "Grand Facade & Entry", desc: "Co-Operative Colony main entrance and dedicated valet parking." },
  { title: "Warm Reception Lobby", desc: "Marble check-in counters and 24/7 guest concierge." },
  { title: "Suites & Accommodations", desc: "Deluxe, Executive, Premium, and Family suite walkthrough." },
  { title: "Kwality Restaurant", desc: "Multi-cuisine live buffet and fine dining atmosphere." },
  { title: "Banquets & Open Lawn", desc: "AC banquet hall and 300+ guest celebration lawn." }
];

export default function AboutPage() {
  return (
    <>
      {/* About Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/gallery/hotel-lobby.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            WHO WE ARE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            About Hotel Reliance
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed pt-2">
            A premier hospitality destination in Bokaro Steel City, blending traditional Indian warmth with modern corporate comfort.
          </p>
        </Container>
      </section>

      {/* Hotel Story Section */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                title="Our Story & Philosophy"
                subtitle="ESTABLISHED HOSPITALITY"
                align="left"
                className="mb-6"
              />
              <p className="text-sm text-muted leading-relaxed font-light">
                {hotelData.description}
              </p>
              <p className="text-sm text-muted leading-relaxed font-light">
                For years, Hotel Reliance has set a benchmark for business travel lodging and grand events hosting in Bokaro Steel City. We recognize that hospitality is in the details. From our welcoming reception lobby to our room cleanliness routines and signature multi-cuisine recipes at <strong>Kwality Restaurant</strong>, every operational step is tailored for comfort.
              </p>
              <p className="text-sm text-dark font-serif italic border-l-2 border-gold pl-4 py-1">
                &ldquo;We strive to offer corporate professionals and visiting families a home away from home, ensuring a seamless lodging, dining, and celebrating experience.&rdquo;
              </p>
            </div>

            {/* Side Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 border-2 border-gold/15 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
              <div className="image-zoom-hover border border-border-custom shadow-xl bg-dark">
                <Image
                  src="/images/gallery/hotel-ext.jpg"
                  alt="Hotel Reliance Facade"
                  width={500}
                  height={400}
                  className="w-full h-[340px] object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Cinematic Hotel Tour & Video Section */}
      <section className="py-20 bg-dark text-white border-t border-border-custom">
        <Container>
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
              EXPERIENCE RELIANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal">
              Cinematic Hotel Walkthrough
            </h2>
            <div className="w-12 h-[2px] bg-gold mx-auto" />
            <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-light">
              Take an immersive visual journey from our property exterior and welcoming reception to luxury guest suites, dining rooms, and celebration lawns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Video Player Display Card */}
            <div className="lg:col-span-7 relative h-80 sm:h-96 border border-white/15 overflow-hidden shadow-2xl bg-black rounded-sm">
              <video
                src="/videos/hero.mp4"
                controls
                playsInline
                className="w-full h-full object-cover"
                poster="/images/gallery/hotel-lobby.jpg"
              />
            </div>

            {/* Tour Highlights List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-serif text-gold">
                Tour Sequence Highlights
              </h3>
              <div className="space-y-3">
                {videoStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white/5 border border-white/10 flex items-start space-x-3 hover:border-gold/40 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-white/60 font-light mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* The People Behind Your Stay / Our Hospitality Team */}
      <section className="py-20 bg-white border-t border-border-custom">
        <Container>
          <SectionHeading
            title="The People Behind Your Stay"
            subtitle="OUR HOSPITALITY TEAM"
          />

          <p className="text-xs sm:text-sm text-muted text-center max-w-2xl mx-auto -mt-6 mb-12 font-light leading-relaxed">
            Meet the seasoned hoteliers, executive chefs, and guest relations managers dedicated to making your visit to Bokaro Steel City effortless and memorable.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffData.map((staff) => (
              <div
                key={staff.id}
                className="bg-cream border border-border-custom shadow-sm flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gold"
              >
                {/* Staff Portrait Image with Natural Uncropped Aspect Ratio */}
                <div className="relative aspect-[4/5] w-full bg-dark overflow-hidden">
                  <Image
                    src={staff.image}
                    alt={staff.name}
                    fill
                    unoptimized
                    quality={100}
                    sizes="(max-w-768px) 100vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {staff.experience && (
                    <div className="absolute bottom-3 left-3 z-10 bg-dark/85 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-gold border border-gold/30">
                      {staff.experience}
                    </div>
                  )}
                </div>

                {/* Staff Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gold block">
                      {staff.department}
                    </span>
                    <h3 className="text-lg font-serif text-dark font-medium mt-0.5">
                      {staff.name}
                    </h3>
                    <p className="text-xs text-primary font-semibold mb-2">
                      {staff.role}
                    </p>
                    <p className="text-xs text-muted leading-relaxed font-light line-clamp-3">
                      {staff.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Hospitality Standards - Exact Matching Design */}
      <section className="py-24 sm:py-28 bg-[#FAF7F2] border-t border-[#E8E1D7] relative overflow-hidden">
        {/* Subtle Ambient Watermark Motifs */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-gradient-to-br from-[#BA8B32]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-gradient-to-tl from-[#BA8B32]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <Container className="max-w-6xl relative z-10 px-4 sm:px-6">
          {/* Header matching exact layout and typography */}
          <div className="text-center space-y-3 mb-16 sm:mb-20">
            {/* Top Badge with Ornamental Line */}
            <div className="flex items-center justify-center space-x-3 text-[#9D783E]">
              <div className="w-12 sm:w-20 h-[1px] bg-[#C5A880]/60" />
              <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.28em]">
                CORE MOTTO
              </span>
              <div className="w-12 sm:w-20 h-[1px] bg-[#C5A880]/60" />
            </div>

            {/* Top Fleuron ornament */}
            <div className="flex items-center justify-center space-x-2 text-[#C5A880]/80 py-0.5">
              <div className="w-16 h-[0.75px] bg-[#C5A880]/40" />
              <svg className="w-4 h-4 fill-current text-[#BA8B32]" viewBox="0 0 24 24">
                <path d="M12 2C11.5 5 9.5 7 7 8C9.5 9 11.5 11 12 14C12.5 11 14.5 9 17 8C14.5 7 12.5 5 12 2Z" />
              </svg>
              <div className="w-16 h-[0.75px] bg-[#C5A880]/40" />
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-serif font-normal text-[#182333] tracking-tight">
              Our Hospitality Standards
            </h2>

            {/* Bottom Fleuron ornament */}
            <div className="flex items-center justify-center space-x-2 text-[#C5A880]/80 py-0.5">
              <div className="w-16 h-[0.75px] bg-[#C5A880]/40" />
              <svg className="w-4 h-4 fill-current text-[#BA8B32]" viewBox="0 0 24 24">
                <path d="M12 2C11.5 5 9.5 7 7 8C9.5 9 11.5 11 12 14C12.5 11 14.5 9 17 8C14.5 7 12.5 5 12 2Z" />
              </svg>
              <div className="w-16 h-[0.75px] bg-[#C5A880]/40" />
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] font-serif italic text-[#6B5E55] font-light pt-1">
              Guided by our values. Delivered with care.
            </p>
          </div>

          {/* 3 Standards Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {hospitalityStandards.map((item) => (
              <div
                key={item.id}
                className="bg-[#FDFBF7] border border-[#E8E1D7] border-b-[3.5px] border-b-[#BA8B32] shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top Image Box with Circular Floating Badge */}
                <div className="relative w-full aspect-[16/8.2] bg-[#181512]">
                  {/* Circular Badge Overlapping Top Center */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF7F2] border-2 border-[#D8C7B0] flex items-center justify-center shadow-md">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#BA8B32]/40 flex items-center justify-center bg-[#FAF7F2]">
                      {item.icon}
                    </div>
                  </div>

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    quality={100}
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Card Content */}
                <div className="px-6 sm:px-8 pt-7 pb-8 text-center flex-grow flex flex-col justify-between space-y-4 bg-[#FDFBF7]">
                  <div>
                    <h3 className="text-xl sm:text-[22px] font-serif text-[#182333] font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <div className="w-8 h-[1.5px] bg-[#BA8B32] mx-auto my-3" />
                    <p className="text-[13px] sm:text-[14px] text-[#6B5E55] leading-relaxed font-light max-w-[260px] mx-auto">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom 3 Dots */}
                  <div className="flex justify-center space-x-1.5 text-[#BA8B32] text-xs pt-4 font-bold tracking-widest">
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Moments of Elegance / Photo Gallery Section */}
      <GalleryPreview />

      {/* Guest Reviews & Testimonials Section */}
      <TestimonialsSection />

      <HomeCTA />
    </>
  );
}
