import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { placesData } from "@/data/places";

export function PlacesPreview() {
  // Show first 2 places on homepage
  const previewPlaces = placesData.slice(0, 2);

  return (
    <section className="py-20 bg-cream border-t border-border-custom">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            title="Explore Bokaro Steel City"
            subtitle="LOCAL ATTRACTIONS"
            align="left"
            className="mb-0"
          />
          <Link href="/places">
            <Button variant="outline" size="md">
              View All Places
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {previewPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white border border-border-custom overflow-hidden shadow-md flex flex-col sm:flex-row group"
            >
              {/* Thumbnail image */}
              <div className="relative w-full sm:w-2/5 h-48 sm:h-auto min-h-[180px] bg-dark flex-shrink-0">
                <div className="absolute inset-0 image-zoom-hover">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text info block */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    {place.category}
                  </span>
                  <h3 className="text-xl font-normal font-serif text-dark group-hover:text-primary transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-light line-clamp-3">
                    {place.description}
                  </p>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted/80 pt-2 border-t border-border-custom">
                  {place.distance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
