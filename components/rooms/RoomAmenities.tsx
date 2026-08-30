import React from "react";
import { Check } from "lucide-react";

interface RoomAmenitiesProps {
  amenities: string[];
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-serif font-normal text-dark border-b border-border-custom pb-2">
        In-Room Comforts
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm text-muted font-light">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="p-0.5 bg-gold/10 border border-gold/20 rounded-full text-gold">
              <Check className="w-3 h-3" />
            </span>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
