import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Info, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
      {/* Luxury Hero Banner matching Offers, Rooms, Banquets & Restaurant */}
      <section className="relative w-full aspect-[16/8.5] sm:aspect-[21/9.5] min-h-[440px] max-h-[750px] bg-black overflow-hidden flex items-end">
        {/* Full-Bleed Background Photograph without Compression or Quality Loss */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/places/city-park.png"
            alt="Bokaro City Park & Attractions"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          {/* Subtle Top and Deep Bottom Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />
        </div>

        {/* Hero Bottom Content matching Shared Reference Typography */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Local Attractions
                <span className="block">& Sightseeing</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              Iconic industrial heritage, tranquil lakeside parks, spiritual sanctums, and wildlife safari habitats are all within reach from Hotel Reliance.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro info box */}
      <section className="py-12 bg-white border-b border-[#E8E1D7]">
        <Container className="max-w-3xl text-center space-y-4">
          <div className="inline-flex p-3 bg-[#FAF8F5] border border-[#E8E1D7] text-[#BA8B32] rounded-full mb-1 shadow-sm">
            <Compass className="w-5 h-5 text-[#BA8B32]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2B2320]">
            Convenient Location in Bokaro Steel City
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed font-light">
            Hotel Reliance is situated in the peaceful, green sector of Co-Operative Colony in Bokaro Steel City. This central placement offers travelers short commute distances to major corporate factories, local gardens, lakes, and transport hubs.
          </p>
        </Container>
      </section>

      {/* Attractions Grid list */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D7] mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#B38E5D] block">
                LOCAL SIGHTSEEING
              </span>
              <h2 className="text-xl sm:text-3xl font-serif text-[#2B2320] mt-0.5">
                Sights Near Our Hotel
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-serif text-[#7A6B61] max-w-md">
              Explore revered temples, peaceful botanical gardens, and scenic dams all located within a short drive from Hotel Reliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placesData.map((place) => (
              <div key={place.id} className="h-full">
                <PlaceCard place={place} layout="vertical" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Local Travel Tips */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E8E1D7]">
        <Container className="max-w-4xl px-4 sm:px-6">
          <div className="border border-[#E8E1D7] p-8 sm:p-10 bg-[#FAF8F5] space-y-6 shadow-sm">
            <h3 className="text-xl font-serif text-[#2B2320] border-b border-[#E8E1D7] pb-3 flex items-center">
              <Info className="w-5 h-5 text-[#BA8B32] mr-3 flex-shrink-0" />
              Guest Traveler Information & Commute Guide
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-[#5C4F46] font-light leading-relaxed">
              <p>
                <strong className="text-[#2B2320]">Local Cabs & Auto Rickshaws:</strong> Local transport is easily accessible directly outside the hotel gates in Co-Operative Colony. Our front desk concierge is happy to assist in coordinating day hire taxi cabs for plant visits or sightseeing tours.
              </p>
              <p>
                <strong className="text-[#2B2320]">Railway Station:</strong> Bokaro Steel City Railway Station (BKSC) is situated roughly 10-12 km from the hotel, with frequent connections to Ranchi, Patna, Kolkata, and Delhi.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <HomeCTA />
    </>
  );
}
