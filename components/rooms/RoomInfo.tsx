import React from "react";
import { Users, Bed, Wifi, Eye, Sparkles } from "lucide-react";
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

      <p className="text-[14.5px] sm:text-base text-[#3D332D] leading-[1.75] font-normal whitespace-pre-line">
        {room.longDescription || room.description}
      </p>

      {/* Meta Specs Grid (No Room Size / Sq Ft) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white border border-[#E8DFD2] p-6 shadow-xs">
        <div className="flex flex-col items-center text-center">
          <Users className="w-5 h-5 text-[#BA8B32] mb-2" />
          <span className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold">
            Capacity
          </span>
          <span className="text-[13px] font-bold text-[#2B2320] mt-1">
            Max {room.occupancy} {room.occupancy === 1 ? "Guest" : "Guests"}
          </span>
        </div>

        <div className="flex flex-col items-center text-center border-l border-[#E8DFD2]">
          <Bed className="w-5 h-5 text-[#BA8B32] mb-2" />
          <span className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold">
            Bed Type
          </span>
          <span className="text-[13px] font-bold text-[#2B2320] mt-1">
            {room.bedType}
          </span>
        </div>

        <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-[#E8DFD2] pt-4 md:pt-0 col-span-2 md:col-span-1">
          <Eye className="w-5 h-5 text-[#BA8B32] mb-2" />
          <span className="text-[10px] uppercase tracking-widest text-[#7A6B61] font-bold">
            Room View
          </span>
          <span className="text-[13px] font-bold text-[#2B2320] mt-1">
            {room.view || "City View"}
          </span>
        </div>
      </div>
    </div>
  );
}

