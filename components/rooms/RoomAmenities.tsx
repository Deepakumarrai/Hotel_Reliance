import React from "react";
import { Check } from "lucide-react";

interface RoomAmenitiesProps {
  amenities: string[];
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-serif font-normal text-[#2B2320] border-b border-[#E8DFD2] pb-2">
        In-Room Comforts & Amenities
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-[13.5px] sm:text-sm text-[#2B2320] font-medium">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="p-1 bg-[#FAF8F5] border border-[#BA8B32]/40 rounded-full text-[#BA8B32]">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-wide">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
