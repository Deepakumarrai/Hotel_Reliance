import React from "react";
import { Users, Bed, Maximize2, Compass, Sparkles, ShieldCheck, Clock, Wifi } from "lucide-react";
import { Room } from "@/types/room";

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  const specs = [
    {
      icon: Users,
      label: "Occupancy",
      value: `Max ${room.occupancy} Guests`,
      sub: "Ideal for business or leisure",
    },
    {
      icon: Bed,
      label: "Bedding",
      value: room.bedType || "King Bed",
      sub: "Luxury orthopedic comfort",
    },
    {
      icon: Maximize2,
      label: "Room Size",
      value: room.size || "300 sq. ft.",
      sub: "Spacious living area",
    },
    {
      icon: Compass,
      label: "Outlook",
      value: room.view || "City View",
      sub: "Soundproofed windows",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Card Luxury Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {specs.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-[#FAF8F5] border border-[#E8DFD2] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 hover:border-[#BA8B32]/50 hover:shadow-sm group"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFD2] group-hover:border-[#BA8B32]/40 group-hover:bg-[#FAF5EC] flex items-center justify-center text-[#BA8B32] mb-3 transition-colors shadow-2xs">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#2B2320] mt-1 line-clamp-1">
                {item.value}
              </span>
              <span className="text-[10px] text-stone-400 font-light mt-0.5 hidden sm:block">
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Key Inclusions Highlights Pills */}
      <div className="bg-white border border-[#E8DFD2] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#BA8B32]" />
          <span className="font-medium text-[#2B2320]">All-Inclusive Stay:</span>
          <span>High-Speed Wi-Fi 6</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Independent Silent AC</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#BA8B32]" />
          <span>24/7 Room Service & Housekeeping</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Complimentary Bottled Water</span>
        </div>
      </div>
    </div>
  );
}
