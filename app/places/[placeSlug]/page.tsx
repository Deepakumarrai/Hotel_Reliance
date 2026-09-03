import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Compass, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Phone,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { placesData } from "@/data/places";
import { PlaceCard } from "@/components/places/PlaceCard";

interface PlacePageProps {
  params: Promise<{ placeSlug: string }>;
}

export async function generateStaticParams() {
  return placesData.map((place) => ({
    placeSlug: place.slug,
  }));
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { placeSlug } = await params;
  const place = placesData.find((p) => p.slug === placeSlug);

  if (!place) {
    return {
      title: "Attraction Not Found | Hotel Reliance",
    };
  }

  const pageUrl = `https://www.hotelreliance.com/places/${place.slug}`;

  return {
    title: `${place.name} — History, Timings & Visitor Guide`,
    description: `Complete travel guide to ${place.name} in Bokaro Steel City. Established ${place.establishedYear}. Visiting timings, entry fee, location, and tips. Stay at Hotel Reliance ${place.distance}.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${place.name} | Bokaro Travel Guide`,
      description: place.description,
      url: pageUrl,
      type: "article",
      images: [
        {
          url: place.image,
          width: 1200,
          height: 800,
          alt: `${place.name} in Bokaro Steel City`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${place.name} | Bokaro Travel Guide`,
      description: place.description,
      images: [place.image],
    },
  };
}

export default async function PlaceDetailPage({ params }: PlacePageProps) {
  const { placeSlug } = await params;
  const place = placesData.find((p) => p.slug === placeSlug);

  if (!place) {
    notFound();
  }

  // Other attractions to explore
  const otherPlaces = placesData.filter((p) => p.slug !== placeSlug);

  // Schema.org TouristAttraction Structured Data
  const attractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.description,
    url: `https://www.hotelreliance.com/places/${place.slug}`,
    image: `https://www.hotelreliance.com${place.image}`,
    touristType: place.category,
    publicAccess: true,
    isAccessibleForFree: place.entryFee ? place.entryFee.toLowerCase().includes("free") : true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }}
      />
      {/* Hero Banner with Heritage Styling */}
      <section
        className="relative bg-dark text-white py-24 sm:py-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('${place.image}')`,
        }}
      >
        <Container className="relative z-10 space-y-4 text-center max-w-4xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#C5A880]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/places" className="hover:text-white transition-colors">Local Attractions</Link>
            <span>/</span>
            <span className="text-white">{place.name}</span>
          </div>

          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D8B875] font-bold border border-[#D8B875]/30 bg-black/40 px-3 py-1">
            {place.category} Landmark
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.06em] uppercase">
            {place.name}
          </h1>

          <div className="w-16 h-[2px] bg-[#C5A880] mx-auto" />

          {place.tagline && (
            <p className="text-sm sm:text-base text-white/90 font-serif font-light max-w-2xl mx-auto leading-relaxed italic">
              &ldquo;{place.tagline}&rdquo;
            </p>
          )}
        </Container>
      </section>

      {/* Main Content Layout */}
      <section className="py-20 bg-[#FAF8F5] text-[#2B2320]">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Historical Narrative & Highlights (Span 8) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Primary Photo Showcase with Hover / Dual View */}
              <div className="bg-white border border-[#E8E1D7] p-3 shadow-md">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(max-w-1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                  {place.hoverLabel && (
                    <div className="absolute bottom-3 right-3 bg-dark/80 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#D8B875] border border-white/10">
                      {place.hoverLabel}
                    </div>
                  )}
                </div>
              </div>

              {/* History & Origin Section */}
              <div className="bg-white border border-[#E8E1D7] p-8 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center space-x-4 border-b border-[#E8E1D7] pb-4">
                  <div className="w-10 h-[1.5px] bg-[#C5A880] flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.12em] uppercase text-[#2B2320]">
                    History & Heritage
                  </h2>
                </div>

                <div className="space-y-4 text-sm sm:text-base font-serif font-light text-[#4A3E37] leading-relaxed">
                  {place.history && place.history.length > 0 ? (
                    place.history.map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{place.description}</p>
                  )}
                </div>
              </div>

              {/* Key Highlights */}
              {place.highlights && place.highlights.length > 0 && (
                <div className="bg-white border border-[#E8E1D7] p-8 sm:p-10 shadow-sm space-y-6">
                  <div className="flex items-center space-x-4 border-b border-[#E8E1D7] pb-4">
                    <div className="w-10 h-[1.5px] bg-[#C5A880] flex-shrink-0" />
                    <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.12em] uppercase text-[#2B2320]">
                      Key Highlights & Experiences
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {place.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="bg-[#FAF8F5] border border-[#E8E1D7] p-6 space-y-2.5 transition-all hover:border-[#C5A880]"
                      >
                        <div className="flex items-center space-x-2 text-[#9E712E]">
                          <Sparkles className="w-4 h-4 text-[#C5A880]" />
                          <h3 className="font-serif text-base text-dark font-medium">
                            {highlight.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5C4F46] font-light leading-relaxed">
                          {highlight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visitor Tips & Concierge Recommendations */}
              {place.visitorTips && place.visitorTips.length > 0 && (
                <div className="bg-white border border-[#E8E1D7] p-8 sm:p-10 shadow-sm space-y-6">
                  <div className="flex items-center space-x-4 border-b border-[#E8E1D7] pb-4">
                    <div className="w-10 h-[1.5px] bg-[#C5A880] flex-shrink-0" />
                    <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.12em] uppercase text-[#2B2320]">
                      Hotel Reliance Visitor Tips
                    </h2>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-[#4A3E37]">
                    {place.visitorTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-[#BA8B32] flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-light">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Quick Facts & Concierge Booking Card (Span 4) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Facts Card */}
              <div className="bg-white border border-[#E8E1D7] p-7 shadow-md space-y-6 sticky top-28">
                <div className="border-b border-[#E8E1D7] pb-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#BA8B32] uppercase font-bold block">
                    Essential Information
                  </span>
                  <h3 className="text-xl font-serif text-dark mt-1">
                    Quick Landmark Facts
                  </h3>
                </div>

                <div className="space-y-5 text-xs sm:text-sm">
                  {/* Established Year */}
                  {place.establishedYear && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                        Established / Inception
                      </span>
                      <p className="font-serif text-[#2B2320] leading-snug">
                        {place.establishedYear}
                      </p>
                    </div>
                  )}

                  {/* Founder / Initiator */}
                  {place.founder && (
                    <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                        Founder / Built By
                      </span>
                      <p className="font-serif text-[#2B2320] leading-snug">
                        {place.founder}
                      </p>
                    </div>
                  )}

                  {/* Distance from Hotel */}
                  <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                      Proximity to Hotel
                    </span>
                    <p className="font-serif text-[#BA8B32] font-bold">
                      {place.distance}
                    </p>
                  </div>

                  {/* Timings */}
                  {place.timings && (
                    <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                        Visiting Hours
                      </span>
                      <p className="font-serif text-[#2B2320] leading-snug">
                        {place.timings}
                      </p>
                    </div>
                  )}

                  {/* Entry Fee */}
                  {place.entryFee && (
                    <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                        <Tag className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                        Entry Ticket / Access
                      </span>
                      <p className="font-serif text-[#2B2320] leading-snug">
                        {place.entryFee}
                      </p>
                    </div>
                  )}

                  {/* Best Time */}
                  {place.bestTime && (
                    <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block flex items-center">
                        <Compass className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
                        Best Season to Visit
                      </span>
                      <p className="font-serif text-[#2B2320] leading-snug">
                        {place.bestTime}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  {place.address && (
                    <div className="space-y-1 pt-3 border-t border-[#E8E1D7]/70">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C847C] font-bold block">
                        Location Address
                      </span>
                      <p className="font-serif text-[#5C4F46] leading-snug text-xs">
                        {place.address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Chauffeur & Stay Assistance Box */}
                <div className="pt-6 border-t border-[#E8E1D7] space-y-3 bg-[#FAF8F5] -mx-7 -mb-7 p-7">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA8B32] block">
                    Visiting Bokaro?
                  </span>
                  <h4 className="text-base font-serif text-dark font-medium">
                    Stay with Luxury at Hotel Reliance
                  </h4>
                  <p className="text-xs text-[#5C4F46] font-light leading-relaxed">
                    Our front desk coordinates round-the-clock chauffeur cabs and custom itinerary planning for guests.
                  </p>
                  <Link href="/booking" className="block pt-2">
                    <button className="w-full bg-[#BA8B32] hover:bg-[#A67B22] text-white font-bold text-xs tracking-[0.18em] uppercase py-3 rounded-sm shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer border border-[#BA8B32]">
                      BOOK A STAY
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Other Attractions Section */}
          <div className="mt-24 pt-16 border-t border-[#E8E1D7]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-[1.5px] bg-[#C5A880] flex-shrink-0" />
                <h2 className="text-2xl sm:text-4xl font-serif tracking-[0.12em] uppercase text-[#2B2320]">
                  Explore Other Attractions
                </h2>
              </div>
              <Link
                href="/places"
                className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#BA8B32] hover:text-[#2B2320] transition-colors border-b border-[#C5A880] pb-1 w-fit"
              >
                View All Bokaro Places »
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPlaces.slice(0, 3).map((other) => (
                <Link
                  key={other.id}
                  href={`/places/${other.slug}`}
                  className="group flex flex-col items-center transition-all duration-300 block"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1E1815] shadow-md">
                    <Image
                      src={other.image}
                      alt={other.name}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover object-center w-full h-full transition-all duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#D8B875] border border-white/10">
                      {other.category}
                    </div>
                  </div>

                  <div className="relative z-20 -mt-8 sm:-mt-10 w-[88%] bg-white border border-[#E8E1D7] shadow-xl p-5 text-left group-hover:border-[#C5A880] group-hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-serif text-xs sm:text-sm tracking-[0.14em] uppercase text-[#2B2320] font-normal group-hover:text-[#BA8B32] transition-colors line-clamp-1">
                      {other.name}
                    </h3>
                    <div className="flex items-center text-[10px] uppercase tracking-[0.2em] font-serif font-bold text-[#BA8B32] pt-2 group-hover:translate-x-1 transition-transform">
                      <span>EXPLORE HISTORY & GUIDE</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
