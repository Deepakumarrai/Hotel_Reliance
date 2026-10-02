import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Bed,
  Wifi,
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PhoneCall,
  Sparkle,
} from "lucide-react";
import { roomsData } from "@/data/rooms";
import { Room } from "@/types/room";
import { forwardToBackend } from "@/lib/admin/backendClient";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { RoomAmenities } from "@/components/rooms/RoomAmenities";
import { RoomInfo } from "@/components/rooms/RoomInfo";
import { RoomPrice } from "@/components/rooms/RoomPrice";
import { RoomBookingCTA } from "@/components/rooms/RoomBookingCTA";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RoomPageProps {
  params: Promise<{ roomSlug: string }>;
}

async function getLiveRooms(): Promise<Room[]> {
  try {
    const res = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    const categories = res.data?.content?.categories;
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.map((cat: any) => {
        const slug = cat.slug || cat.id?.replace(/-room$/, "").replace(/-suite$/, "") || "deluxe";
        const images = Array.isArray(cat.images) && cat.images.length > 0
          ? cat.images
          : (cat.image ? [cat.image] : [`/images/rooms/${slug}/main.jpg`, `/images/rooms/${slug}/1.png`]);
        const occupancy = typeof cat.occupancy === "number" ? cat.occupancy : (parseInt(cat.maxGuests) || 2);
        const bedType = cat.bedType || cat.bedding || "King Bed";
        const size = cat.size || cat.roomArea || "300 sq. ft.";
        const price = typeof cat.price === "number"
          ? cat.price
          : typeof cat.pricePerNight === "number"
          ? cat.pricePerNight
          : Number(cat.price) || Number(cat.pricePerNight) || null;

        return {
          id: cat.id || `${slug}-room`,
          slug: slug,
          name: cat.name,
          description: cat.description || cat.shortDesc || "",
          longDescription: cat.longDescription || cat.description || "",
          images: images,
          amenities: Array.isArray(cat.amenities) ? cat.amenities : [],
          occupancy: occupancy,
          bedType: bedType,
          price: price,
          featured: true,
          size: size,
          view: cat.view || "City View",
        };
      });
    }
  } catch {}
  return roomsData;
}

export async function generateStaticParams() {
  const defaultSlugs = [
    { roomSlug: "deluxe" },
    { roomSlug: "executive" },
    { roomSlug: "premium" },
    { roomSlug: "family" },
    { roomSlug: "single" },
    { roomSlug: "double" },
    { roomSlug: "triple" },
  ];
  try {
    const liveRooms = await getLiveRooms();
    const liveSlugs = liveRooms.map((r) => ({ roomSlug: r.slug }));
    const allSlugs = [
      ...liveSlugs,
      ...defaultSlugs.filter((d) => !liveSlugs.some((l) => l.roomSlug === d.roomSlug)),
    ];
    return allSlugs;
  } catch {
    return defaultSlugs;
  }
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomSlug } = await params;
  const normalized = roomSlug.toLowerCase().trim();
  const canonical =
    normalized === "deluxe" || normalized === "deluxe-room" || normalized === "single-room" || normalized === "single-occupancy" ? "single" :
    normalized === "executive" || normalized === "executive-room" || normalized === "double-room" || normalized === "double-occupancy" ? "double" :
    normalized === "triple" || normalized === "triple-room" || normalized === "premium" || normalized === "premium-suite" || normalized === "family-suite" ? "family" :
    normalized;

  const allRooms = await getLiveRooms();
  const room = allRooms.find((r) => r.slug.toLowerCase() === normalized || r.id.toLowerCase() === normalized) ||
               allRooms.find((r) => r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`) ||
               roomsData.find((r) => r.slug.toLowerCase() === normalized || r.id.toLowerCase() === normalized) ||
               roomsData.find((r) => r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`);
  if (!room) {
    return { title: "Room Not Found | Hotel Reliance" };
  }

  const pageUrl = `https://www.hotelreliance.com/rooms/${room.slug}`;
  const mainImage = room.images && room.images[0] ? room.images[0] : "/images/hero/hero-bg.jpg";
  const priceDisplay = room.price && room.price > 0 ? `${formatPrice(room.price)}/night` : "Competitive Luxury Tariffs";

  return {
    title: `${room.name} — Luxury Stay & Tariff | Hotel Reliance Bokaro`,
    description: `${room.description} Book ${room.name} at Hotel Reliance Bokaro at ${priceDisplay}. Includes comfortable bedding, high-speed Wi-Fi, AC, and room service.`,
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
  const normalized = roomSlug.toLowerCase().trim();
  const canonical =
    normalized === "deluxe" || normalized === "deluxe-room" || normalized === "single-room" || normalized === "single-occupancy" ? "single" :
    normalized === "executive" || normalized === "executive-room" || normalized === "double-room" || normalized === "double-occupancy" ? "double" :
    normalized === "triple" || normalized === "triple-room" || normalized === "premium" || normalized === "premium-suite" || normalized === "family-suite" ? "family" :
    normalized;

  const allRooms = await getLiveRooms();
  const room = allRooms.find((r) => r.slug.toLowerCase() === normalized || r.id.toLowerCase() === normalized) ||
               allRooms.find((r) => r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`) ||
               roomsData.find((r) => r.slug.toLowerCase() === normalized || r.id.toLowerCase() === normalized) ||
               roomsData.find((r) => r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`);

  if (!room) {
    notFound();
  }

  // Filter for related rooms (other than current room)
  const relatedRooms = allRooms.filter((r) => r.id !== room.id && r.slug !== room.slug).slice(0, 3);

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

      {/* ── Top Clearance & Editorial Room Header ── */}
      <section className="pt-28 sm:pt-32 pb-8 bg-gradient-to-b from-[#F7F5F0] via-[#FAF8F5] to-[#FAFAF8] border-b border-[#E8DFD2]">
        <Container>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-4">
            <Link
              href="/rooms"
              className="hover:text-[#BA8B32] transition-colors flex items-center group"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
              <span>Rooms & Suites</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-[#2B2320] font-bold">{room.name}</span>
          </div>

          {/* Room Title & Quick Highlights Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#BA8B32]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#BA8B32] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#BA8B32]" />
                <span>Hotel Reliance • Signature Suite Collection</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2B2320] font-normal tracking-tight">
                {room.name}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                {room.description}
              </p>

              {/* Quick Feature Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-700">
                <div className="inline-flex items-center space-x-1.5 bg-white border border-[#E8DFD2] px-3 py-1 rounded-full shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-[#BA8B32]" />
                  <span>Max {room.occupancy} Guests</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-white border border-[#E8DFD2] px-3 py-1 rounded-full shadow-2xs">
                  <Bed className="w-3.5 h-3.5 text-[#BA8B32]" />
                  <span>{room.bedType}</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-white border border-[#E8DFD2] px-3 py-1 rounded-full shadow-2xs">
                  <Wifi className="w-3.5 h-3.5 text-[#BA8B32]" />
                  <span>Free Wi-Fi</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-white border border-[#E8DFD2] px-3 py-1 rounded-full shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-[#BA8B32]" />
                  <span>{room.view || "City View"}</span>
                </div>
              </div>
            </div>

            {/* Quick Price Badge for Desktop */}
            <div className="hidden lg:flex flex-col items-end text-right space-y-1 bg-white border border-[#E8DFD2] p-4 rounded-2xl shadow-2xs min-w-[240px]">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                Direct Booking Tariff
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-serif font-bold text-[#2B2320]">
                  {room.price ? formatPrice(room.price) : "On Request"}
                </span>
                <span className="text-xs text-stone-500 font-sans">/ night</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> All Taxes Included
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Main Showcase Section ── */}
      <section className="py-10 lg:py-14 bg-[#FAFAF8]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ── Left 7 Columns: Photo Gallery, Specs, About, Comforts, 360 Tour, Policies ── */}
            <div className="lg:col-span-7 space-y-8">
              {/* Photo Gallery with Lightbox */}
              <RoomGallery images={room.images} roomName={room.name} />

              {/* 4-Card Luxury Specs Grid & Inclusions */}
              <RoomInfo room={room} />

              {/* The Suite Experience / Long Description */}
              <div className="bg-white border border-[#E8DFD2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,20,20,0.04)] space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#BA8B32] font-bold block">
                    The Suite Experience
                  </span>
                  <h2 className="text-2xl font-serif font-normal text-[#2B2320]">
                    About the {room.name}
                  </h2>
                </div>

                <p className="text-stone-700 leading-relaxed font-light text-sm sm:text-base whitespace-pre-line">
                  {room.longDescription || room.description}
                </p>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E8DFD2]">
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2]/80 space-y-1">
                    <span className="text-xs font-bold text-[#2B2320] block">
                      Supreme Rest
                    </span>
                    <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                      Orthopedic mattress with high-thread count Egyptian cotton linens.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2]/80 space-y-1">
                    <span className="text-xs font-bold text-[#2B2320] block">
                      Acoustic Comfort
                    </span>
                    <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                      Sound-insulating double glazed glass for a peaceful sleep sanctuary.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2]/80 space-y-1">
                    <span className="text-xs font-bold text-[#2B2320] block">
                      24/7 Hospitality
                    </span>
                    <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                      Dedicated room dining, daily sanitization, and concierge on call.
                    </p>
                  </div>
                </div>
              </div>

              {/* In-Room Comforts & Amenities */}
              <div className="bg-white border border-[#E8DFD2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,20,20,0.04)] space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#BA8B32] font-bold block">
                    Curated Comforts
                  </span>
                  <h3 className="text-2xl font-serif font-normal text-[#2B2320]">
                    In-Room Comforts & Amenities
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    Every element thoughtfully arranged for business travelers and vacationing families.
                  </p>
                </div>

                <RoomAmenities amenities={room.amenities} />
              </div>

              {/* Hotel Policies & Stay Information */}
              <div className="bg-white border border-[#E8DFD2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,20,20,0.04)] space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#BA8B32] font-bold block">
                    Guest Information
                  </span>
                  <h3 className="text-xl font-serif font-normal text-[#2B2320]">
                    Hotel & Stay Guidelines
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2] space-y-1">
                    <span className="font-bold text-[#2B2320] block">Check-In & Check-Out</span>
                    <p className="text-stone-600 font-light">
                      Check-in starts from <strong>12:00 PM</strong>. Standard check-out is by <strong>11:00 AM</strong>. Early check-in subject to room availability.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2] space-y-1">
                    <span className="font-bold text-[#2B2320] block">Flexible Cancellation</span>
                    <p className="text-stone-600 font-light">
                      Free cancellation up to <strong>24 hours</strong> before scheduled check-in time. Zero cancellation penalty for direct bookings.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2] space-y-1">
                    <span className="font-bold text-[#2B2320] block">Government Photo ID</span>
                    <p className="text-stone-600 font-light">
                      All adult guests must carry valid Government Photo ID (Aadhaar, Passport, Driving License, Voter ID) at check-in.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD2] space-y-1">
                    <span className="font-bold text-[#2B2320] block">Dining & Room Service</span>
                    <p className="text-stone-600 font-light">
                      Round-the-clock in-room dining service from in-house culinary chefs serving Indian, Chinese, and Continental menus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right 5 Columns: STICKY Non-Scrolling Luxury Reservation Widget ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
              <div className="bg-white border border-[#E8DFD2] rounded-3xl p-5 sm:p-6 shadow-[0_16px_48px_rgba(20,20,20,0.08)] space-y-4 relative overflow-hidden">
                {/* Decorative top gold gradient band */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#D8B875] via-[#BA8B32] to-[#8C641E] rounded-t-3xl -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4" />

                {/* Tariff Presentation */}
                <RoomPrice price={room.price} slug={room.slug} />

                {/* Interactive Booking CTA & Date Selector */}
                <RoomBookingCTA roomId={room.id} roomSlug={room.slug} price={room.price} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Related Rooms Recommendations ── */}
      {relatedRooms.length > 0 && (
        <section className="py-16 bg-white border-t border-[#E8DFD2]">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#BA8B32] font-bold block mb-1">
                  Discover More Accommodations
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#2B2320]">
                  Explore Other Rooms & Suites
                </h2>
              </div>
              <Link
                href="/rooms"
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#BA8B32] hover:text-[#2B2320] transition-colors"
              >
                <span>View All Accommodations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Mobile Sticky Bottom CTA Bar with Safe Area Support ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#E8DFD2] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(17,30,49,0.12)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
              All-Inclusive Rate
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-serif font-bold text-[#2B2320]">
                {room.price ? formatPrice(room.price) : "On Request"}
              </span>
              <span className="text-[10px] text-stone-500 lowercase">/ night</span>
            </div>
          </div>
          <Link href={`/booking?room=${room.slug}`}>
            <button
              type="button"
              className="min-h-[44px] px-6 uppercase tracking-widest font-sans font-bold text-xs bg-[#2B2320] hover:bg-[#BA8B32] text-white shadow-md rounded-xl touch-press active:scale-[0.98] border border-[#2B2320] cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
