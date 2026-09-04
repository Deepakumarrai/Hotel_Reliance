import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomGrid } from "@/components/rooms/RoomGrid";
import { roomsData } from "@/data/rooms";
import { HomeCTA } from "@/components/home/HomeCTA";


export const metadata: Metadata = {
  title: "Luxury Rooms & Suites — Tariffs, Amenities & Online Booking",
  description:
    "Explore our Deluxe, Executive, Premium, and Family Suites in Bokaro Steel City starting from ₹2,499/night. Enjoy King-size beds, high-speed Wi-Fi, AC climate control, and 24/7 room service.",
  keywords: [
    "Rooms in Bokaro",
    "Hotel Reliance Rooms",
    "Bokaro Hotel Booking",
    "Deluxe Room Bokaro",
    "Executive Suite Bokaro",
    "Family Suite Hotel Bokaro",
    "Hotel Room Tariff Bokaro",
  ],
  alternates: {
    canonical: "https://www.hotelreliance.com/rooms",
  },
  openGraph: {
    title: "Luxury Rooms & Suites | Hotel Reliance Bokaro",
    description:
      "Explore deluxe, executive, premium, and family guest rooms in Bokaro Steel City. Enjoy top amenities, elegant interiors, and quality room service.",
    url: "https://www.hotelreliance.com/rooms",
    type: "website",
    images: [
      {
        url: "/images/rooms/executive/main.jpg",
        width: 1200,
        height: 800,
        alt: "Hotel Reliance Rooms & Suites in Bokaro Steel City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Rooms & Suites | Hotel Reliance Bokaro",
    description: "Deluxe, Executive, and Premium suites in Bokaro Steel City.",
    images: ["/images/rooms/executive/main.jpg"],
  },
};

export default function RoomsPage() {
  return (
    <>
      {/* Luxury Hero Banner matching Offers & Promotions Header */}
      <section className="relative w-full aspect-[16/8.5] sm:aspect-[21/9.5] min-h-[440px] max-h-[750px] bg-black overflow-hidden flex items-end">
        {/* Full-Bleed Background Room Showcase Photograph */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/rooms/room-showcase.png"
            alt="Hotel Reliance Rooms & Suites"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
          {/* Subtle Top and Deep Bottom Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />
        </div>

        {/* Hero Bottom Content matching Offers & Promotions Header */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Rooms
                <span className="block">& Suites</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              Step into curated sanctuaries of comfort, bespoke executive desks, plush bedding, and heartfelt hospitality at Hotel Reliance.
            </p>
          </div>
        </Container>
      </section>

      {/* Grid listing section */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <RoomGrid rooms={roomsData} />
        </Container>
      </section>

      <HomeCTA />
    </>
  );
}

