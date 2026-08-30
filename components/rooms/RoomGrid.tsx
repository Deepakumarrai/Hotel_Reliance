"use client";

import React, { useState } from "react";
import { Room } from "@/types";
import { RoomCard } from "./RoomCard";
import { Button } from "@/components/ui/Button";

interface RoomGridProps {
  rooms: Room[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "couple" | "family">("all");

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "couple") return room.occupancy === 2;
    if (activeFilter === "family") return room.occupancy >= 4;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant={activeFilter === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveFilter("all")}
          className="rounded-full px-6"
        >
          Show All
        </Button>
        <Button
          variant={activeFilter === "couple" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveFilter("couple")}
          className="rounded-full px-6"
        >
          Couples (2 Guests)
        </Button>
        <Button
          variant={activeFilter === "family" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveFilter("family")}
          className="rounded-full px-6"
        >
          Families & Groups (4+ Guests)
        </Button>
      </div>

      {/* Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id} className="animate-fade-in">
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-border-custom max-w-md mx-auto">
          <p className="text-sm text-muted">No rooms match your filter. Please choose another option.</p>
        </div>
      )}
    </div>
  );
}
