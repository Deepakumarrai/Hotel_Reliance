import React from "react";
import {
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath,
  Phone,
  Shield,
  Sparkles,
  Bed,
  Check,
  Droplets,
  Layers,
  SunMedium,
  UtensilsCrossed,
} from "lucide-react";

interface RoomAmenitiesProps {
  amenities: string[];
}

function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("internet")) {
    return Wifi;
  }
  if (lower.includes("ac") || lower.includes("air") || lower.includes("climate")) {
    return Wind;
  }
  if (lower.includes("tv") || lower.includes("screen") || lower.includes("led")) {
    return Tv;
  }
  if (lower.includes("tea") || lower.includes("coffee") || lower.includes("kettle") || lower.includes("drink")) {
    return Coffee;
  }
  if (lower.includes("bath") || lower.includes("shower") || lower.includes("toiletr") || lower.includes("towel")) {
    return Bath;
  }
  if (lower.includes("water") || lower.includes("mineral") || lower.includes("bottle")) {
    return Droplets;
  }
  if (lower.includes("phone") || lower.includes("intercom") || lower.includes("call")) {
    return Phone;
  }
  if (lower.includes("safe") || lower.includes("lock") || lower.includes("security")) {
    return Shield;
  }
  if (lower.includes("bed") || lower.includes("linen") || lower.includes("pillow")) {
    return Bed;
  }
  if (lower.includes("room service") || lower.includes("dining") || lower.includes("food")) {
    return UtensilsCrossed;
  }
  if (lower.includes("light") || lower.includes("ambient")) {
    return SunMedium;
  }
  if (lower.includes("clean") || lower.includes("housekeep")) {
    return Layers;
  }
  return Sparkles;
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, index) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-3.5 bg-[#FAF8F5] border border-[#E8DFD2] rounded-xl hover:border-[#BA8B32]/40 hover:bg-white transition-all duration-200 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E8DFD2] group-hover:border-[#BA8B32]/40 group-hover:bg-[#FAF5EC] flex items-center justify-center text-[#BA8B32] flex-shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#2B2320] leading-snug">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
