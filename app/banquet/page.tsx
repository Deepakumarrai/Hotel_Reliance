import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkles, Calendar, Heart, Award, ArrowRight, Users, Maximize2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Venue } from "@/components/banquet/VenueCard";
import { DynamicVenuesList } from "@/components/banquet/DynamicVenuesList";
import { BanquetEnquiry } from "@/components/banquet/BanquetEnquiry";
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
  alternates: { canonical: "https://www.hotelreliance.com/banquet" },
  openGraph: {
    title: "AC Banquet Halls & Wedding Lawns | Hotel Reliance Bokaro",
    description: "Host magnificent weddings, engagement ceremonies, and business summits at Hotel Reliance, Bokaro Steel City.",
    url: "https://www.hotelreliance.com/banquet",
    type: "website",
    images: [{ url: "/images/banquet/image.png", width: 1200, height: 800, alt: "Grand AC Banquet Hall at Hotel Reliance Bokaro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AC Banquet Halls & Wedding Lawns | Hotel Reliance Bokaro",
    description: "Weddings, receptions, and corporate conferences in Bokaro Steel City.",
    images: ["/images/banquet/image.png"],
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
    amenities: ["AC Climate Control", "Integrated Audio-Visual Setup", "Configurable Stage Lighting", "In-House Buffet Catering Area", "Dedicated Groom & Bride Makeup Rooms"],
  },
  {
    id: "meeting-room",
    name: "Executive Meeting Rooms",
    description: "Configured for professional business conventions. Features high-speed connectivity, boards, and digital projection facilities for boardroom discussions.",
    capacity: "Up to 30 Guests",
    size: "800 sq. ft.",
    image: "/images/gallery/hotel-lobby.jpg",
    amenities: ["Digital Projection & LED Screens", "High-Speed Wi-Fi", "Ergonomic Business Seating", "Coffee & Snack Caterings", "Whiteboards & Flipcharts"],
  },
  {
    id: "outdoor-lawn",
    name: "Celebration Lawn",
    description: "An expansive open-air manicured garden lawn designed for massive social gatherings, reception parties, and late-evening dinner gatherings under the stars.",
    capacity: "Up to 600 Guests",
    size: "12,000 sq. ft.",
    image: "/images/banquet/lawn-main.jpg",
    amenities: ["Beautiful Green Landscaping", "Custom Grand Stage Setups", "Outdoor Barbeque & Bar Counters", "Silent Power Generator Backup", "Security Monitored Entry Gates"],
  },
];

const eventTypes = [
  {
    icon: <Heart className="w-5 h-5 text-[#BA8B32]" />,
    title: "Weddings & Socials",
    desc: "From engagements and mehendi to grand receptions. Our team coordinates every detail so you can enjoy your special milestones.",
  },
  {
    icon: <Award className="w-5 h-5 text-[#BA8B32]" />,
    title: "Corporate Conferences",
    desc: "Boardroom meetings, product lunches, seminars, or annual dinners. We offer professional planning support and catering.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-[#BA8B32]" />,
    title: "Birthdays & Anniversaries",
    desc: "Host warm intimate celebrations or active kids parties. Our custom menus fit all social themes and occasions.",
  },
];

const weddingInclusions = [
  { n: "01", title: "Grand Venue Booking", desc: "Full day & night booking of AC Banquet Hall (350+ guests) or lush Outdoor Celebration Lawn." },
  { n: "02", title: "Royal Kwality Buffet", desc: "Multi-cuisine spread with live tandoor starters, gourmet main courses, dum biryani, and royal desserts." },
  { n: "03", title: "Stage & Mandap Decor", desc: "Grand floral stage, ornamental wedding mandap, red carpet entryway, and elegant LED lighting." },
  { n: "04", title: "DJ Sound & Audio Visuals", desc: "Concert-grade DJ sound, dynamic floor lighting, cordless mics, and celebration music console." },
  { n: "05", title: "Bridal Room Suite", desc: "Complimentary 1-Night luxury stay in our Bridal Suite for the couple, with dedicated dressing area." },
  { n: "06", title: "Hospitality & Power Backup", desc: "Dedicated event captain, trained service stewards, valet parking, and 100% DG generator backup." },
];

export default function BanquetPage() {
  const venueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Hotel Reliance Banquets & Event Lawns",
    parentOrganization: { "@type": "Hotel", name: "Hotel Reliance", url: "https://www.hotelreliance.com" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }} />

      <PageHero
        label="Events & Celebrations"
        title="Banquets"
        titleAccent="& Events."
        subtitle="From magnificent wedding celebrations to executive corporate conferences — Hotel Reliance crafts timeless gatherings with bespoke hospitality."
        image="/images/banquet/image.png"
        imageAlt="Hotel Reliance Banquets & Event Celebrations"
      />

      {/* Venues Grid */}
      <section className="bg-[#FAFAF8] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 pb-8 border-b border-stone-100">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
                Grand Spaces
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
                Our signature{" "}
                <em className="italic text-[#BA8B32]">event venues.</em>
              </h2>
            </div>
            <p className="text-sm text-stone-500 max-w-sm leading-[1.8] font-sans font-light md:text-right">
              Versatile indoor halls, boardrooms, and expansive celebration lawns equipped with modern AV setups and personalized catering.
            </p>
          </div>

          <DynamicVenuesList initialVenues={venuesList} />
        </div>
      </section>

      {/* Events we host */}
      <section className="bg-[#111E31] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(186,139,50,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12 sm:mb-14">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
              Celebration Guides
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-[-0.02em]">
              Events we{" "}
              <em className="italic text-[#D8B875]">host.</em>
            </h2>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 no-scrollbar">
            {eventTypes.map((event, i) => (
              <div key={i} className="w-[82vw] max-w-[310px] flex-shrink-0 snap-center bg-white/[0.04] border border-white/8 rounded-2xl p-6 text-center space-y-3.5">
                <div className="w-11 h-11 bg-[#BA8B32]/15 border border-[#BA8B32]/25 flex items-center justify-center mx-auto rounded-xl">{event.icon}</div>
                <h3 className="text-base font-serif font-light text-white">{event.title}</h3>
                <p className="text-[12px] text-white/45 font-sans font-light leading-relaxed">{event.desc}</p>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {eventTypes.map((event, i) => (
              <div key={i} className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 hover:border-[#BA8B32]/30 rounded-2xl sm:rounded-3xl p-7 text-center space-y-4 transition-all duration-300">
                <div className="w-12 h-12 bg-[#BA8B32]/15 border border-[#BA8B32]/25 flex items-center justify-center mx-auto rounded-xl group-hover:bg-[#BA8B32]/25 transition-colors duration-300">{event.icon}</div>
                <h3 className="text-lg font-serif font-light text-white group-hover:text-[#D8B875] transition-colors duration-300">{event.title}</h3>
                <div className="w-5 h-px bg-[#BA8B32]/40 mx-auto" />
                <p className="text-[12px] text-white/45 font-sans font-light leading-relaxed">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Package */}
      <section id="marriage-package" className="bg-[#080C14] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(186,139,50,0.1) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#BA8B32]/15 border border-[#BA8B32]/30 text-[#D8B875] text-[10px] font-sans font-semibold uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3" />
              <span>Official Wedding Ceremony Tariff</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[-0.02em]">
              Grand Royal{" "}
              <em className="italic text-[#D8B875]">Marriage Package.</em>
            </h2>
            <p className="text-sm text-white/45 font-sans font-light max-w-xl mx-auto leading-[1.8]">
              An all-inclusive, masterfully curated wedding experience with AC palace banquet halls, grand floral decor, live gourmet catering, and seamless hospitality.
            </p>
          </div>

          {/* Pricing card */}
          <div className="bg-white/[0.04] border border-[#BA8B32]/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] relative">
            {/* Ribbon */}
            <div className="absolute top-0 right-0 bg-[#BA8B32] text-white text-[9px] font-semibold uppercase tracking-[0.2em] px-5 py-1.5 rounded-bl-xl">
              Complete Package
            </div>

            {/* Price banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 pb-6 border-b border-white/8">
              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#BA8B32] block mb-1">
                  All-Inclusive Wedding Booking
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight">₹2,25,000</span>
                  <span className="text-sm font-sans text-white/50">/ Net Fixed Tariff</span>
                </div>
                <p className="text-[12px] text-white/35 font-sans mt-1">Covers full day & night festivities — Hall + Catering + Decor + Sound</p>
              </div>
              <a href="#enquiry-form">
                <button className="flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[12px] font-semibold tracking-[0.1em] uppercase shadow-[0_4px_14px_rgba(186,139,50,0.35)] hover:shadow-[0_6px_20px_rgba(186,139,50,0.45)] transition-all duration-300 cursor-pointer whitespace-nowrap">
                  <span>Reserve This Date</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>

            {/* Inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8">
              {weddingInclusions.map((item) => (
                <div key={item.n} className="flex items-start space-x-3.5 p-4 bg-white/[0.04] border border-white/6 rounded-xl hover:border-[#BA8B32]/25 transition-colors duration-300">
                  <span className="w-7 h-7 rounded-full bg-[#BA8B32]/15 border border-[#BA8B32]/25 text-[#D8B875] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {item.n}
                  </span>
                  <div>
                    <h4 className="text-[12px] font-semibold text-white tracking-tight mb-1">{item.title}</h4>
                    <p className="text-[11px] text-white/40 font-sans font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="bg-[#FAFAF8] py-16 sm:py-24 border-t border-stone-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <BanquetEnquiry />
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
