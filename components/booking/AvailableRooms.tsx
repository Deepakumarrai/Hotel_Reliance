import React from "react";
import Image from "next/image";
import { Check, Users, Bed, Expand, AlertCircle } from "lucide-react";
import { Room } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface AvailableRoomsProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
  errors?: Record<string, string>;
}

export function AvailableRooms({
  rooms,
  selectedRoomId,
  onSelect,
  errors
}: AvailableRoomsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
          Select Your Accommodation
        </h3>
        {errors?.selectedRoomId && (
          <div className="flex items-center space-x-2 text-xs text-primary font-bold bg-primary/5 p-3 border border-primary/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.selectedRoomId}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const displayPrice = room.price ? `${formatPrice(room.price)}` : "Price on request";

          return (
            <div
              key={room.id}
              onClick={() => onSelect(room.id)}
              className={cn(
                "bg-white border cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-sm relative group select-none",
                isSelected
                  ? "border-gold ring-2 ring-gold/25"
                  : "border-border-custom hover:border-gold/50"
              )}
            >
              {/* Selected corner banner */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge variant="gold" className="bg-gold text-white border-gold flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Selected</span>
                  </Badge>
                </div>
              )}

              {/* Room Image */}
              <div className="relative h-48 w-full overflow-hidden bg-dark">
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  sizes="(max-w-768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Room Info */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-serif font-normal text-dark">
                    {room.name}
                  </h4>
                  <p className="text-[10px] text-muted line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 border-y border-border-custom py-2 text-[10px] text-muted uppercase tracking-wider font-semibold">
                  <span className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-gold" />
                    Max {room.occupancy}
                  </span>
                  <span className="flex items-center">
                    <Bed className="w-3.5 h-3.5 mr-1 text-gold" />
                    {room.bedType.split(" ")[0]}
                  </span>
                  <span className="flex items-center">
                    <Expand className="w-3.5 h-3.5 mr-1 text-gold" />
                    {room.size}
                  </span>
                </div>

                {/* Select button row */}
                <div className="flex items-end justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-muted font-bold block">
                      Starting from
                    </span>
                    <span className="text-sm font-bold text-primary block mt-0.5">
                      {displayPrice} <span className="text-[10px] font-normal text-muted">/ night</span>
                    </span>
                    <span className="text-[8px] text-muted/70">+ taxes</span>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer",
                      isSelected
                        ? "bg-gold border-gold text-white"
                        : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                    )}
                  >
                    {isSelected ? "Selected" : "Select Room"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
