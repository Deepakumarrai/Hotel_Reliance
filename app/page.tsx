import React from "react";
import { Hero } from "@/components/home/Hero";
import { HotelIntroduction } from "@/components/home/HotelIntroduction";
import { HotelVideoSection } from "@/components/home/HotelVideoSection";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { AboutStorySection } from "@/components/home/AboutStorySection";
import { HotelStats } from "@/components/home/HotelStats";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { RestaurantPreview } from "@/components/home/RestaurantPreview";
import { EventsAndConferences } from "@/components/home/EventsAndConferences";
import { PlacesPreview } from "@/components/home/PlacesPreview";
import { ContactHighlightSection } from "@/components/home/ContactHighlightSection";

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Hotel Introduction / Opening Content */}
      <HotelIntroduction />

      {/* 3. Hotel Video */}
      <HotelVideoSection />

      {/* 4. ROOM BOOKING / ROOMS (Immediately after Video as requested) */}
      <FeaturedRooms />

      {/* 5. About Hotel Reliance */}
      <AboutStorySection />

      {/* 6. Overview (42 Rooms) */}
      <HotelStats />

      {/* 7. Facilities / Services */}
      <FacilitiesSection />

      {/* 8. Restaurant / Dining */}
      <RestaurantPreview />

      {/* 9. Banquet / Marriage (Marriage Cost ₹2,25,000/-) */}
      <EventsAndConferences />

      {/* 10. Places / Location */}
      <PlacesPreview />

      {/* 11. Contact (Address Highlight) */}
      <ContactHighlightSection />
    </>
  );
}

