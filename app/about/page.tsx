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

const coreValues = [
  {
    icon: <Heart className="w-8 h-8 text-gold" />,
    title: "Guests First",
    desc: "To deliver personalized care, anticipating lodging needs with a warm hospitality approach."
  },
  {
    icon: <Award className="w-8 h-8 text-gold" />,
    title: "Premium Quality",
    desc: "Maintaining strict standards of cleanliness, fresh ingredients, and responsive services."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-gold" />,
    title: "Safety & Security",
    desc: "Providing round-the-clock security surveillance, monitored parking, and secure room card access."
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

      {/* Hospitality Core Values */}
      <section className="py-20 bg-cream border-t border-border-custom">
        <Container>
          <SectionHeading
            title="Our Hospitality Standards"
            subtitle="CORE MOTTO"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white border border-border-custom p-8 text-center space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-cream border border-border-custom flex items-center justify-center mx-auto rounded-full shadow-inner">
                  {val.icon}
                </div>
                <h3 className="text-xl font-serif font-normal text-dark">
                  {val.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {val.desc}
                </p>
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
