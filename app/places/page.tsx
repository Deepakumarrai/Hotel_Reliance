import React from "react";
import type { Metadata } from "next";
import { Info, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { placesData } from "@/data/places";
import { PlaceCard } from "@/components/places/PlaceCard";

export const metadata: Metadata = {
  title: "Places Near Hotel Reliance | Local Attractions Bokaro",
  description: "Explore tourist spots and industrial sites in Bokaro Steel City near Hotel Reliance. Visit City Park, Jagannath Temple, and Bokaro Steel Plant.",
};

export default function PlacesPage() {
  return (
    <>
      {/* Places Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/places/city-park.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            DISCOVER BOKARO
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Local Attractions
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Intro info box */}
      <section className="py-12 bg-white border-b border-border-custom">
        <Container className="max-w-3xl text-center space-y-4">
          <div className="inline-flex p-3 bg-cream border border-border-custom text-gold rounded-full mb-2">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif text-dark">
            Convenient Location in Jharkhand
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
            Hotel Reliance is situated in the green sector of Co-Operative Colony in Bokaro Steel City. This central placement offers travelers short commute distances to major corporate factories, local gardens, lakes, and transport hubs.
          </p>
        </Container>
      </section>

      {/* Attractions Grid list */}
      <section className="py-20 bg-cream">
        <Container>
          <SectionHeading
            title="Sights Near Our Hotel"
            subtitle="SIGHTSEEING"
            className="mb-12"
          />

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
      <section className="py-20 bg-white border-t border-border-custom">
        <Container className="max-w-3xl">
          <div className="border border-border-custom p-8 bg-cream space-y-6">
            <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2 flex items-center">
              <Info className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
              Traveler Information
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-muted font-light leading-relaxed">
              <p>
                <strong>Local Cabs & Auto Rickshaws:</strong> Local transport is easily accessible directly outside the hotel gates in Co-Operative Colony. Our reception desk is happy to assist in coordinating day hire taxi cabs for plant visits or sightseeing tours.
              </p>
              <p>
                <strong>Railway Station:</strong> Bokaro Steel City Railway Station (BKSC) is situated roughly 10-12 km from the hotel, with frequent connections to Ranchi, Patna, Kolkata, and Delhi.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
