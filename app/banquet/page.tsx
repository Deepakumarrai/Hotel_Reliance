import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkles, Calendar, Heart, Award, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VenueCard, Venue } from "@/components/banquet/VenueCard";
import { DynamicVenuesList } from "@/components/banquet/DynamicVenuesList";
import { BanquetCostEstimator } from "@/components/banquet/BanquetCostEstimator";
import { BanquetEnquiry } from "@/components/banquet/BanquetEnquiry";
import { Banquet3DPlaceholder } from "@/components/banquet/Banquet3DPlaceholder";
import { HomeCTA } from "@/components/home/HomeCTA";

export const metadata: Metadata = {
  title: "AC Banquet Halls & Wedding Lawns — Corporate Events & Grand Celebrations",
  description:
    "Host magnificent weddings, corporate conferences, and celebrations at Hotel Reliance, Bokaro Steel City. Featuring an air-conditioned 350+ guest banquet hall, executive boardrooms, and outdoor celebration lawns.",
  keywords: [
    "Banquet Hall in Bokaro",
    "Wedding Venue Bokaro",
    "Conference Hall Bokaro Steel City",
    "Marriage Hall Bokaro",
    "Corporate Meeting Rooms Bokaro",
    "Hotel Reliance Banquet",
  ],
  alternates: {
    canonical: "https://www.hotelreliance.com/banquet",
  },
  openGraph: {
    title: "AC Banquet Halls & Wedding Lawns | Hotel Reliance Bokaro",
    description:
      "Host magnificent weddings, engagement ceremonies, and business summits at Hotel Reliance, Bokaro Steel City.",
    url: "https://www.hotelreliance.com/banquet",
    type: "website",
    images: [
      {
        url: "/images/banquet/hall-main.jpg",
        width: 1200,
        height: 800,
        alt: "Grand AC Banquet Hall at Hotel Reliance Bokaro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AC Banquet Halls & Wedding Lawns | Hotel Reliance Bokaro",
    description: "Weddings, receptions, and corporate conferences in Bokaro Steel City.",
    images: ["/images/banquet/hall-main.jpg"],
  },
};

const venuesList: Venue[] = [
  {
    id: "banquet-hall",
    name: "AC Banquet Hall",
    description: "Our premium air-conditioned indoor banquet hall offers an elegant layout suitable for wedding ceremonies, ring exchanges, birthday celebrations, and corporate dinners.",
    capacity: "Up to 350 Guests",
    size: "4,200 sq. ft.",
    image: "/images/banquet/hall-main.jpg",
    amenities: [
      "AC Climate Control",
      "Integrated Audio-Visual Setup",
      "Configurable Stage Lighting",
      "In-House Buffet Catering Area",
      "Dedicated Groom & Bride Makeup Rooms"
    ]
  },
  {
    id: "meeting-room",
    name: "Executive Meeting Rooms",
    description: "Configured for professional business conventions. Features high-speed connectivity, boards, and digital projection facilities for boardroom discussions.",
    capacity: "Up to 30 Guests",
    size: "800 sq. ft.",
    image: "/images/gallery/hotel-lobby.jpg", // Lobby is elegant placeholder
    amenities: [
      "Digital Projection & LED Screens",
      "High-Speed Wi-Fi",
      "Ergonomic Business Seating",
      "Coffee & Snack Caterings",
      "Whiteboards & Flipcharts"
    ]
  },
  {
    id: "outdoor-lawn",
    name: "Celebration Lawn",
    description: "An expansive open-air manicured garden lawn designed for massive social gatherings, reception parties, exhibitions, and late-evening dinner gatherings under the stars.",
    capacity: "Up to 600 Guests",
    size: "12,000 sq. ft.",
    image: "/images/banquet/lawn-main.jpg",
    amenities: [
      "Beautiful Green Landscaping",
      "Custom Grand Stage Setups",
      "Outdoor Barbeque & Bar Counters",
      "Silent Power Generator Backup",
      "Security Monitored Entry Gates"
    ]
  }
];

const eventTypes = [
  {
    icon: <Heart className="w-6 h-6 text-gold" />,
    title: "Weddings & Socials",
    desc: "From engagements and mehendi to grand receptions. Our team coordinates details to let you enjoy your special milestones."
  },
  {
    icon: <Award className="w-6 h-6 text-gold" />,
    title: "Corporate Conferences",
    desc: "Boardroom meetings, product lunches, seminars, or annual dinners. We offer professional planning support and caters."
  },
  {
    icon: <Calendar className="w-6 h-6 text-gold" />,
    title: "Birthdays & Anniversaries",
    desc: "Host warm intimate celebrations or active kids parties. Our custom menus fit all social themes."
  }
];

export default function BanquetPage() {
  const venueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Hotel Reliance Banquets & Event Lawns",
    parentOrganization: {
      "@type": "Hotel",
      name: "Hotel Reliance",
      url: "https://www.hotelreliance.com",
    },
    url: "https://www.hotelreliance.com/banquet",
    maximumAttendeeCapacity: 350,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No: NIHP-1, West Side of Co-Operative Colony",
      addressLocality: "Bokaro Steel City",
      addressRegion: "Jharkhand",
      postalCode: "827001",
      addressCountry: "IN",
    },
    image: "https://www.hotelreliance.com/images/banquet/hall-main.jpg",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }}
      />
      {/* Luxury Hero Banner matching Offers & Rooms Header */}
      <section className="relative w-full aspect-[16/8.5] sm:aspect-[21/9.5] min-h-[440px] max-h-[750px] bg-black overflow-hidden flex items-end">
        {/* Full-Bleed Background Banquet Photograph without Cropping */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banquet/image.png"
            alt="Hotel Reliance Banquets & Event Celebrations"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
          {/* Subtle Top and Deep Bottom Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />
        </div>

        {/* Hero Bottom Content matching Offers & Rooms Header */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Banquets
                <span className="block">& Events</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              From magnificent wedding celebrations and grand receptions to executive corporate conferences, Hotel Reliance crafts timeless gatherings with bespoke hospitality.
            </p>
          </div>
        </Container>
      </section>

      {/* Venues Grid Section */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6 space-y-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D7]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#B38E5D] block">
                GRAND SPACES
              </span>
              <h2 className="text-xl sm:text-3xl font-serif text-[#2B2320] mt-0.5">
                Our Signature Event Venues
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-serif text-[#7A6B61] max-w-md">
              Versatile indoor halls, boardrooms, and expansive celebration lawns equipped with modern AV setups and personalized catering.
            </p>
          </div>
          
          <DynamicVenuesList initialVenues={venuesList} />

          {/* Interactive Layout Visualizer */}
          <div className="pt-6">
            <Banquet3DPlaceholder />
          </div>
        </Container>
      </section>

      {/* Event niches */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E8E1D7]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#BA8B32] block mb-1">
              CELEBRATION GUIDES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.08em] uppercase text-[#2B2320]">
              Events We Host
            </h2>
            <div className="w-12 h-[1.5px] bg-[#C5A880] mx-auto mt-3" />
          </div>

          {/* Mobile Horizontal Swipeable Editorial Cards */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 no-scrollbar">
              {eventTypes.map((event, index) => (
                <div
                  key={index}
                  className="w-[82vw] max-w-[310px] flex-shrink-0 snap-center bg-[#FAF8F5] border border-[#E8E1D7] p-6 text-center space-y-3.5 shadow-sm rounded-sm touch-card-press"
                >
                  <div className="w-12 h-12 bg-white border border-[#E8E1D7] flex items-center justify-center mx-auto rounded-full shadow-sm text-[#BA8B32]">
                    {event.icon}
                  </div>
                  <h3 className="text-base font-serif font-normal text-[#2B2320] uppercase tracking-wide">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[#5C4F46] leading-relaxed font-light line-clamp-3">
                    {event.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center pt-1 text-[#BA8B32]">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#7A6B61]">Swipe Event Types →</span>
            </div>
          </div>

          {/* Tablet & Desktop 3-Column Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 pt-2">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="bg-[#FAF8F5] border border-[#E8E1D7] p-8 text-center space-y-4 hover:border-[#BA8B32] hover:shadow-lg transition-all duration-300 rounded-sm"
              >
                <div className="w-12 h-12 bg-white border border-[#E8E1D7] flex items-center justify-center mx-auto rounded-full shadow-sm text-[#BA8B32]">
                  {event.icon}
                </div>
                <h3 className="text-lg font-serif font-normal text-[#2B2320] uppercase tracking-wide">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5C4F46] leading-relaxed font-light">
                  {event.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Grand Marriage Package Section — ₹2,25,000/- */}
      <section id="marriage-package" className="py-16 sm:py-24 bg-gradient-to-b from-[#181412] to-[#0D0B0A] text-white relative overflow-hidden border-t border-[#332A24]">
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B38E5D]/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3 mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#D8B875] text-[11px] font-mono uppercase tracking-[0.25em]">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B875]" />
                <span>OFFICIAL WEDDING CEREMONY TARIFF</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.08em] uppercase text-white font-normal">
                Grand Royal Marriage Package
              </h2>
              <div className="w-16 h-[2px] bg-[#C5A880] mx-auto mt-3" />
              <p className="text-xs sm:text-sm font-serif italic text-white/80 max-w-2xl mx-auto leading-relaxed pt-1">
                An all-inclusive, masterfully curated wedding experience with air-conditioned palace banquet halls, grand floral decor, live gourmet catering, and seamless hospitality.
              </p>
            </div>

            {/* Main Package Pricing & Inclusions Card */}
            <div className="bg-[#1C1715]/90 border-2 border-[#C5A880]/60 rounded-2xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-md">
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#C5A880] to-[#9E712E] text-black font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] px-6 py-2 rounded-bl-xl shadow-md">
                COMPLETE WEDDING PACKAGE
              </div>

              {/* Price Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#382E28]">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#C5A880] block">
                    All-Inclusive Wedding Booking
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
                      ₹2,25,000
                    </span>
                    <span className="text-sm sm:text-base font-serif text-[#C5A880] font-normal">
                      /- Net Fixed Tariff
                    </span>
                  </div>
                  <p className="text-xs text-white/70 font-light">
                    Covers full day & night wedding festivities (AC Banquet Hall / Outdoor Lawn + Catering + Decor + Sound)
                  </p>
                </div>

                <a
                  href="#enquiry-form"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#C5A880] hover:bg-[#D8B875] text-[#111111] font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto"
                >
                  <span>Reserve This Wedding Date</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* 6 Key Inclusions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      1
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      Grand Venue Booking
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Full day & night booking of AC Banquet Hall (350+ guests capacity) or lush green Outdoor Celebration Lawn.
                  </p>
                </div>

                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      2
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      Royal Kwality Buffet
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Lavish multi-cuisine spread with welcome drinks, live tandoor starters, gourmet main courses, dum biryani, and royal desserts.
                  </p>
                </div>

                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      3
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      Stage & Mandap Decor
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Grand floral stage decoration, ornamental wedding mandap, red carpet entryway, and elegant LED lighting setup.
                  </p>
                </div>

                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      4
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      DJ Sound & Audio Visuals
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Professional concert-grade DJ sound setup, dynamic floor lighting, cordless mics, and celebration music console.
                  </p>
                </div>

                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      5
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      Bridal Room Suite
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Complimentary 1-Night luxury stay in our Bridal Suite for the couple, along with dedicated dressing area for preparation.
                  </p>
                </div>

                <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2.5 text-[#D8B875]">
                    <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 flex items-center justify-center flex-shrink-0 text-[#D8B875] font-bold text-xs">
                      6
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide">
                      Hospitality & Power Backup
                    </h4>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-light pl-9">
                    Dedicated event captain, trained service stewards, valet guest parking, and uninterrupted 100% DG generator backup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Banquet Cost Estimator */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E8E1D7]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <BanquetCostEstimator />
        </Container>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E1D7] scroll-mt-20">
        <Container className="max-w-7xl px-4 sm:px-6">
          <BanquetEnquiry />
        </Container>
      </section>

      <HomeCTA />
    </>
  );
}
