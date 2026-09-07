"use client";

import React, { useEffect, useState } from "react";
import { VenueCard, Venue } from "./VenueCard";

interface DynamicVenuesListProps {
  initialVenues: Venue[];
}

export function DynamicVenuesList({ initialVenues }: DynamicVenuesListProps) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);

  useEffect(() => {
    fetch("/api/banquet", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.venues && Array.isArray(d.venues) && d.venues.length > 0) {
          setVenues(
            d.venues.map((v: any) => ({
              id: v.id,
              name: v.name,
              description: v.description || "Bespoke event layout with high-capacity banquet accommodations.",
              capacity: typeof v.capacity === "number" ? `Up to ${v.capacity} Guests` : v.capacity || "350+ Guests",
              size: v.size || (v.capacity > 500 ? "12,000 sq. ft." : "4,200 sq. ft."),
              image: v.image || "/images/banquet/hall-main.jpg",
              amenities: v.amenities || [
                "AC Climate Control",
                "Integrated Audio-Visual Setup",
                "Configurable Stage Lighting",
                "In-House Buffet Catering Area"
              ]
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-12">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
