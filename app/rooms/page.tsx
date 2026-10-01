import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { RoomGrid } from "@/components/rooms/RoomGrid";
import { HomeCTA } from "@/components/home/HomeCTA";

export const metadata: Metadata = {
  title: "Luxury Rooms & Suites — Tariffs, Amenities & Online Booking",
  description:
    "Explore our Single Occupancy, Double Occupancy, and Family Rooms in Bokaro Steel City starting from ₹2,499/night. Enjoy comfortable beds, high-speed Wi-Fi, AC climate control, and 24/7 room service.",
  keywords: ["Rooms in Bokaro", "Hotel Reliance Rooms", "Bokaro Hotel Booking", "Single Occupancy Bokaro", "Double Occupancy Bokaro", "Family Room Bokaro"],
  alternates: { canonical: "https://www.hotelreliance.com/rooms" },
  openGraph: {
    title: "Luxury Rooms & Accommodations | Hotel Reliance Bokaro",
    description: "Explore Single, Double, and Family Room accommodations in Bokaro Steel City.",
    url: "https://www.hotelreliance.com/rooms",
    type: "website",
    images: [{ url: "/images/rooms/deluxe/main.jpg", width: 1200, height: 800, alt: "Hotel Reliance Rooms" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Rooms & Accommodations | Hotel Reliance Bokaro",
    description: "Single, Double, and Family Room accommodations in Bokaro Steel City.",
    images: ["/images/rooms/deluxe/main.jpg"],
  },
};

export default function RoomsPage() {
  return (
    <>
      <PageHero
        label="Accommodations"
        title="Rooms"
        titleAccent="& Suites."
        subtitle="Step into curated sanctuaries of comfort — plush bedding, bespoke executive desks, and heartfelt 24/7 hospitality."
        image="/images/hotel/image copy 3.png"
        imageAlt="Hotel Reliance Rooms & Suites"
      />

      {/* Grid listing */}
      <section className="bg-[#FAFAF8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <RoomGrid />
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
