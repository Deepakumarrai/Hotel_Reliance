import React from "react";
import { Hero } from "@/components/home/Hero";
import { HotelIntroduction } from "@/components/home/HotelIntroduction";
import { HotelStats } from "@/components/home/HotelStats";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { RestaurantPreview } from "@/components/home/RestaurantPreview";
import { EventsAndConferences } from "@/components/home/EventsAndConferences";
import { PlacesPreview } from "@/components/home/PlacesPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { OffersSection } from "@/components/home/OffersSection";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HotelIntroduction />
      <HotelStats />
      <FeaturedRooms />
      <FacilitiesSection />
      <RestaurantPreview />
      <EventsAndConferences />
      <PlacesPreview />
      <GalleryPreview />
      <OffersSection />
      <HomeCTA />
    </>
  );
}
