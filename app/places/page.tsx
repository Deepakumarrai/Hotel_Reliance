import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Info, Compass } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { placesData } from "@/data/places";
import { PlaceCard } from "@/components/places/PlaceCard";
import { HomeCTA } from "@/components/home/HomeCTA";

export const metadata: Metadata = {
  title: "Bokaro Steel City Travel Guide — Top Attractions & Sightseeing",
  description:
    "Explore the top tourist attractions, parks, temples, and industrial marvels in Bokaro Steel City near Hotel Reliance. Visit Jagannath Temple, City Park, Bokaro Steel Plant, and Garga Dam.",
  keywords: [
    "Places to visit in Bokaro",
    "Bokaro Tourist Places",
    "Bokaro Steel Plant Tour",
    "Jagannath Temple Bokaro",
    "City Park Bokaro",
    "Bokaro Sightseeing Guide",
  ],
  alternates: {
    canonical: "https://www.hotelreliance.com/places",
  },
  openGraph: {
    title: "Bokaro Steel City Travel Guide | Hotel Reliance",
    description:
      "Explore tourist spots, parks, and industrial sites in Bokaro Steel City near Hotel Reliance.",
    url: "https://www.hotelreliance.com/places",
    type: "website",
    images: [
      {
        url: "/images/places/city-park.jpg",
        width: 1200,
        height: 800,
        alt: "Bokaro Steel City Attractions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bokaro Steel City Travel Guide | Hotel Reliance",
    description: "Discover parks, temples, and steel plant tours in Bokaro.",
    images: ["/images/places/city-park.jpg"],
  },
};

export default function PlacesPage() {
  return (
    <>
      <PageHero
        label="Bokaro Travel Guide"
        title="Local Attractions"
        titleAccent="& Sightseeing."
        subtitle="Iconic industrial heritage, tranquil lakeside parks, spiritual sanctums, and wildlife safari habitats — all within reach from Hotel Reliance."
        image="/images/places/city-park.png"
        imageAlt="Bokaro City Park & Attractions"
        height="md"
      />

      {/* Intro info box */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-[#BA8B32]/10 border border-[#BA8B32]/20 text-[#BA8B32] rounded-2xl mb-1">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
            Convenient location in <em className="italic text-[#BA8B32]">Bokaro Steel City.</em>
          </h2>
          <p className="text-[13px] sm:text-sm text-stone-500 leading-[1.8] font-sans font-light">
            Hotel Reliance is situated in the peaceful, green sector of Co-Operative Colony in Bokaro Steel City — offering short commute distances to major corporate factories, local gardens, lakes, and transport hubs.
          </p>
        </div>
      </section>

      {/* Attractions grid */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-100 mb-12">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
                Local Sightseeing
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Sights near our{" "}
                <em className="italic text-[#BA8B32]">hotel.</em>
              </h2>
            </div>
            <p className="text-[13px] sm:text-sm text-stone-500 font-sans font-light max-w-sm leading-[1.8] md:text-right">
              Temples, botanical gardens, and scenic dams all within a short drive from Hotel Reliance.
            </p>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4">
              {placesData.map((place) => (
                <div key={place.id} className="w-[84vw] max-w-[330px] flex-shrink-0 snap-center h-full">
                  <PlaceCard place={place} layout="vertical" />
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">Swipe Attractions →</span>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesData.map((place) => (
              <div key={place.id} className="h-full">
                <PlaceCard place={place} layout="vertical" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel tips */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="bg-[#FAFAF8] rounded-2xl sm:rounded-3xl border border-stone-100 p-7 sm:p-10 space-y-5 shadow-sm">
            <h3 className="text-lg sm:text-xl font-serif font-light text-[#111E31] flex items-center border-b border-stone-100 pb-4">
              <Info className="w-5 h-5 text-[#BA8B32] mr-3 flex-shrink-0" />
              Guest Traveler Information &amp; Commute Guide
            </h3>
            <div className="space-y-4 text-[13px] sm:text-sm text-stone-500 font-sans font-light leading-[1.8]">
              <p>
                <strong className="font-semibold text-[#111E31]">Local Cabs & Auto Rickshaws:</strong> Local transport is easily accessible directly outside the hotel gates in Co-Operative Colony. Our front desk concierge is happy to assist in coordinating day hire taxi cabs for plant visits or sightseeing tours.
              </p>
              <p>
                <strong className="font-semibold text-[#111E31]">Railway Station:</strong> Bokaro Steel City Railway Station (BKSC) is situated roughly 10-12 km from the hotel, with frequent connections to Ranchi, Patna, Kolkata, and Delhi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
