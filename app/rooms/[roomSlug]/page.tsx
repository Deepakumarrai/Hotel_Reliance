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

  const pageUrl = `https://www.hotelreliance.com/rooms/${room.slug}`;
  const mainImage = room.images && room.images[0] ? room.images[0] : "/images/hero/hero-bg.jpg";

  return {
    title: `${room.name} — Luxury Stay & Tariff`,
    description: `${room.description} Book ${room.name} at Hotel Reliance Bokaro starting at ₹${room.price}/night. Includes king bedding, high-speed Wi-Fi, AC, and room service.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${room.name} | Hotel Reliance Bokaro`,
      description: room.description,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 800,
          alt: `${room.name} at Hotel Reliance, Bokaro Steel City`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${room.name} | Hotel Reliance Bokaro`,
      description: room.description,
      images: [mainImage],
    },
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

  // Schema.org HotelRoom Structured Data
  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.longDescription || room.description,
    url: `https://www.hotelreliance.com/rooms/${room.slug}`,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.occupancy,
      unitCode: "C62",
    },
    bed: {
      "@type": "BedDetails",
      typeOfBed: room.bedType,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.size,
    },
    offers: {
      "@type": "Offer",
      price: room.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      url: `https://www.hotelreliance.com/booking?room=${room.slug}`,
    },
    amenityFeature: room.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    image: room.images.map((img) => `https://www.hotelreliance.com${img}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomSchema) }}
      />

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

      {/* Main Room Showcase Section */}
      <section className="py-12 lg:py-16 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Cols: Image Gallery + Amenities + Long Description */}
            <div className="lg:col-span-7 space-y-10">
              <RoomGallery images={room.images} roomName={room.name} />

              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-dark border-b border-border-custom pb-3">
                  About the {room.name}
                </h2>
                <p className="text-muted leading-relaxed font-light text-sm sm:text-base">
                  {room.longDescription || room.description}
                </p>
              </div>

              {/* In-Room Amenities Checklist */}
              <div className="space-y-4 pt-4 border-t border-border-custom">
                <h3 className="text-xl font-serif font-semibold text-dark">
                  Room Amenities & Highlights
                </h3>
                <RoomAmenities amenities={room.amenities} />
              </div>

              {/* VR Tour Placeholder Feature */}
              <VRViewerPlaceholder roomName={room.name} />
            </div>

            {/* Right 5 Cols: Sticky Booking Card & Room Key Specs */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white border-2 border-gold/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 -mr-12 -mt-12 rounded-full pointer-events-none" />

                  <RoomPrice price={room.price} />

                  <div className="my-6 border-t border-border-custom" />

                  <RoomInfo room={room} />

                  <div className="mt-8">
                    <RoomBookingCTA roomId={room.id} roomSlug={room.slug} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Rooms Recommendations */}
      {relatedRooms.length > 0 && (
        <section className="py-16 bg-white border-t border-border-custom">
          <Container>
            <SectionHeading
              title="Explore Other Suites"
              subtitle="MORE ACCOMMODATIONS"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {relatedRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
