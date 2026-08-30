"use client";

import React from "react";
import Image from "next/image";
import { Users, Expand, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface Venue {
  id: string;
  name: string;
  description: string;
  capacity: string; // e.g. "Up to 300 guests"
  size: string; // e.g. "4,000 sq. ft."
  image: string;
  amenities: string[];
}

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const handleScrollToEnquiry = () => {
    const formElement = document.getElementById("enquiry-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border border-border-custom shadow-md grid grid-cols-1 lg:grid-cols-12 overflow-hidden group">
      {/* Venue Thumbnail Image */}
      <div className="relative h-64 lg:h-auto min-h-[250px] lg:col-span-5 bg-dark">
        <div className="absolute inset-0 image-zoom-hover">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            sizes="(max-w-1024px) 100vw, 40vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Venue Info text */}
      <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-normal font-serif text-dark group-hover:text-primary transition-colors">
              {venue.name}
            </h3>
            <p className="text-xs text-muted leading-relaxed font-light">
              {venue.description}
            </p>
          </div>

          {/* Key specs */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted uppercase tracking-wider">
            <span className="flex items-center px-3 py-1 bg-cream border border-border-custom">
              <Users className="w-4 h-4 mr-2 text-gold" />
              {venue.capacity}
            </span>
            <span className="flex items-center px-3 py-1 bg-cream border border-border-custom">
              <Expand className="w-4 h-4 mr-2 text-gold" />
              {venue.size}
            </span>
          </div>

          {/* Venue Specific Amenities list */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-muted font-bold block mb-2">
              Venue Features
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted font-light">
              {venue.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-gold flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleScrollToEnquiry} variant="primary" size="md">
            Enquire For Venue
          </Button>
        </div>
      </div>
    </div>
  );
}

