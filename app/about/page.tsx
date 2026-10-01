import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { HomeCTA } from "@/components/home/HomeCTA";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { hotelData } from "@/data/hotel";
import { DynamicStaffSection } from "@/components/about/DynamicStaffSection";
import { ExperienceRelianceTour } from "@/components/about/ExperienceRelianceTour";

export const metadata: Metadata = {
  title: "About Us — Luxury Hospitality Philosophy & Leadership Team",
  description:
    "Discover the story, leadership team, and hospitality philosophy of Hotel Reliance in Bokaro Steel City. Meet our General Manager, Executive Chef, and Guest Relations team.",
  keywords: [
    "About Hotel Reliance",
    "Hotel Reliance Story",
    "Hotels in Bokaro Steel City",
    "Hospitality Standards Bokaro",
  ],
  alternates: { canonical: "https://www.hotelreliance.com/about" },
  openGraph: {
    title: "About Hotel Reliance | Luxury Hospitality in Bokaro Steel City",
    description: "A premier hospitality destination in Bokaro Steel City, blending traditional Indian warmth with modern corporate comfort.",
    url: "https://www.hotelreliance.com/about",
    type: "website",
    images: [{ url: "/images/gallery/hotel-ext.jpg", width: 1200, height: 800, alt: "Hotel Reliance Bokaro Facade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Hotel Reliance | Luxury Hospitality in Bokaro Steel City",
    description: "Discover our heritage, hospitality standards, and team.",
    images: ["/images/gallery/hotel-ext.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our Story"
        title="About Hotel"
        titleAccent="Reliance."
        subtitle="A premier hospitality destination in Bokaro Steel City, blending traditional Indian warmth with refined corporate comfort."
        image="/images/hotel/image copy 2.png"
        imageAlt="About Hotel Reliance Bokaro"
      />

      {/* Story Section */}
      <section className="bg-[#FAFAF8] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Text */}
            <div className="space-y-6">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32]">
                Established Hospitality
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
                Our story &amp;{" "}
                <em className="italic text-[#BA8B32]">philosophy.</em>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-stone-500 font-sans font-light leading-[1.8]">
                <p>{hotelData.description}</p>
                <p>
                  For years, Hotel Reliance has set a benchmark for business travel lodging and grand events hosting in Bokaro Steel City. From our welcoming reception lobby to signature multi-cuisine recipes at{" "}
                  <strong className="font-semibold text-[#111E31]">Kwality Restaurant</strong>, every step is tailored for comfort.
                </p>
              </div>
              <div className="border-l-2 border-[#BA8B32]/40 pl-5 py-1">
                <p className="font-serif italic text-base text-[#4A3E37] leading-relaxed font-light">
                  &ldquo;We strive to offer professionals and families a home away from home — seamless lodging, dining, and celebrating.&rdquo;
                </p>
              </div>
              <Link href="/rooms">
                <button className="mt-2 flex items-center space-x-2 px-6 py-3 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[12px] font-semibold tracking-[0.1em] uppercase shadow-[0_4px_14px_rgba(186,139,50,0.35)] transition-all duration-300 cursor-pointer">
                  <span>Explore Our Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_30px_80px_rgba(17,30,49,0.12)]">
                <Image
                  src="/images/gallery/hotel-ext.jpg"
                  alt="Hotel Reliance Facade"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-[#111E31] text-white rounded-2xl px-5 sm:px-7 py-4 sm:py-5 shadow-2xl">
                <p className="text-3xl sm:text-4xl font-serif font-bold text-[#D8B875]">24/7</p>
                <p className="text-[10px] uppercase tracking-widest text-white/60 mt-0.5">Guest Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Reliance: Virtual Tour & Hospitality Standards */}
      <ExperienceRelianceTour />

      {/* Staff Section */}
      <DynamicStaffSection />

      <GalleryPreview />
      <TestimonialsSection />
      <HomeCTA />
    </>
  );
}
