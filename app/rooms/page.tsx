import React from "react";
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
      {/* Mini Hero Banner */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/rooms/executive/main.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            ACCOMMODATIONS
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Our Rooms & Suites
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Grid listing */}
      <section className="py-20 bg-cream">
        <Container>
          <SectionHeading
            title="Choose Your Premium Space"
            subtitle="TAILORED LODGING"
            className="mb-12"
          />
          <RoomGrid rooms={roomsData} />
        </Container>
      </section>

      <HomeCTA />
    </>
  );
}
