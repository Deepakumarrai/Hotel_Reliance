import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RoomCard } from "@/components/rooms/RoomCard";
import { roomsData } from "@/data/rooms";

export function FeaturedRooms() {
  // Filter for featured rooms
  const featuredRooms = roomsData.filter((room) => room.featured);

  return (
    <section className="py-20 bg-cream border-t border-border-custom">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            title="Luxurious Rooms & Suites"
            subtitle="OUR ACCOMMODATIONS"
            align="left"
            className="mb-0"
          />
          <Link href="/rooms" className="self-start md:self-auto">
            <Button variant="outline" size="md">
              View All Rooms
            </Button>
          </Link>
        </div>

        {/* Featured Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div key={room.id} className="animate-fade-in">
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
