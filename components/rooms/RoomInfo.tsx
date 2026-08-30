import React from "react";
import { Users, Bed, Expand, Eye } from "lucide-react";
import { Room } from "@/types";

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif text-dark leading-tight">
          {room.name}
        </h1>
        <div className="w-12 h-[2px] bg-gold" />
      </div>

      <p className="text-sm text-muted leading-relaxed font-light whitespace-pre-line">
        {room.longDescription || room.description}
      </p>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-border-custom p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Users className="w-5 h-5 text-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
            Capacity
          </span>
          <span className="text-xs font-semibold text-dark mt-1">
            Max {room.occupancy} Guests
          </span>
        </div>

        <div className="flex flex-col items-center text-center border-l sm:border-l border-border-custom">
          <Bed className="w-5 h-5 text-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
            Bed Type
          </span>
          <span className="text-xs font-semibold text-dark mt-1">
            {room.bedType}
          </span>
        </div>

        <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-border-custom pt-4 md:pt-0">
          <Expand className="w-5 h-5 text-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
            Room Size
          </span>
          <span className="text-xs font-semibold text-dark mt-1">
            {room.size || "Standard"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center border-t md:border-t-0 border-l border-border-custom pt-4 md:pt-0">
          <Eye className="w-5 h-5 text-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
            Room View
          </span>
          <span className="text-xs font-semibold text-dark mt-1">
            {room.view || "City View"}
          </span>
        </div>
      </div>
    </div>
  );
}
