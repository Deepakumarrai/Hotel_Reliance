import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { roomsData } from "@/data/rooms";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { RoomAmenities } from "@/components/rooms/RoomAmenities";
import { RoomInfo } from "@/components/rooms/RoomInfo";
import { RoomPrice } from "@/components/rooms/RoomPrice";
import { RoomBookingCTA } from "@/components/rooms/RoomBookingCTA";
import { VRViewerPlaceholder } from "@/components/rooms/VRViewerPlaceholder";

interface RoomPageProps {
  params: Promise<{ roomSlug: string }>;
}

export function generateStaticParams() {
  return roomsData.map((room) => ({
    roomSlug: room.slug,
  }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomSlug } = await params;
  const room = roomsData.find((r) => r.slug === roomSlug);
  if (!room) {
    return { title: "Room Not Found | Hotel Reliance" };
  }
  return {
    title: `${room.name} | Hotel Reliance`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: RoomPageProps) {
  const { roomSlug } = await params;
  const room = roomsData.find((r) => r.slug === roomSlug);

  if (!room) {
    notFound();
  }

  // Filter for related rooms (other than current room)
  const relatedRooms = roomsData.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <>
      {/* Breadcrumb / Top Bar */}
      <section className="bg-dark/5 border-b border-border-custom py-4">
        <Container className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-muted uppercase">
          <Link href="/rooms" className="hover:text-primary transition-colors flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Rooms
          </Link>
          <span>/</span>
          <span className="text-dark font-extrabold">{room.name}</span>
        </Container>
      </section>

      {/* Main Content Sections */}
      <section className="py-12 sm:py-16 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Main details */}
            <div className="lg:col-span-8 space-y-10">
              <RoomGallery images={room.images} roomName={room.name} />
              <RoomInfo room={room} />
              <VRViewerPlaceholder roomName={room.name} />
              <RoomAmenities amenities={room.amenities} />
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-[90px] space-y-6">
                <RoomPrice price={room.price} />
                <RoomBookingCTA roomId={room.id} roomSlug={room.slug} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Rooms */}
      {relatedRooms.length > 0 && (
        <section className="py-16 bg-white border-t border-border-custom">
          <Container>
            <SectionHeading
              title="Alternative Accommodations"
              subtitle="RELATED SUITES"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedRooms.map((relRoom) => (
                <div key={relRoom.id} className="animate-fade-in">
                  <RoomCard room={relRoom} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
