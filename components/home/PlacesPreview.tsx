import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { placesData } from "@/data/places";
import { PlaceCard } from "@/components/places/PlaceCard";

export function PlacesPreview() {
  // Show first 2 places on homepage (Bokaro Steel Plant with interactive Day/Night hover & City Park with sunrise lake view)
  const previewPlaces = placesData.slice(0, 2);

  return (
    <section className="relative py-24 bg-cream border-t border-border-custom overflow-hidden">
      {/* Subtle Ambient City Park Background watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <Image
          src="/images/places/city-park.jpg"
          alt="Bokaro City Park Ambient Background"
          fill
          className="object-cover"
        />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            title="Explore Bokaro Steel City"
            subtitle="LOCAL ATTRACTIONS"
            align="left"
            className="mb-0"
          />
          <Link href="/places">
            <Button variant="outline" size="md" className="uppercase text-xs tracking-wider">
              View All Places
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {previewPlaces.map((place) => (
            <div key={place.id} className="h-full">
              <PlaceCard place={place} layout="horizontal" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
