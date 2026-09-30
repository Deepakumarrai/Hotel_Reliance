import { Room } from "@/types/room";

export const roomsData: Room[] = [
  {
    id: "single-occupancy",
    slug: "single",
    name: "Single Occupancy",
    description: "Elegant comfort tailored for solo travelers and business guests with modern amenities in Bokaro.",
    longDescription: "Our Single Occupancy rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, a fully equipped workstation, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service.",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg",
      "/images/rooms/deluxe/1.png",
      "/images/rooms/deluxe/2.png",
      "/images/rooms/deluxe/3.png",
      "/images/rooms/deluxe/4.png"
    ],
    amenities: [
      "King / Queen Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Flat Screen TV",
      "Tea/Coffee Maker",
      "Mini Fridge",
      "24/7 Room Service",
      "Modern Bathroom",
      "Electronic Safe",
      "Complimentary Bottled Water"
    ],
    occupancy: 1,
    bedType: "King / Queen Bed",
    price: 2499,
    featured: true,
    size: "280 sq. ft.",
    view: "City View"
  },
  {
    id: "double-occupancy",
    slug: "double",
    name: "Double Occupancy",
    description: "Spacious layout with enhanced services and executive desk for couples and premium guests.",
    longDescription: "The Double Occupancy room is meticulously designed for couples and business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, smart TV, and 24/7 room service.",
    images: [
      "/images/rooms/executive/main.jpg",
      "/images/rooms/executive/room.jpg",
      "/images/rooms/executive/1.png",
      "/images/rooms/executive/2.png",
      "/images/rooms/executive/3.png",
      "/images/rooms/executive/4.png"
    ],
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Smart LED TV",
      "Executive Work Desk",
      "Tea/Coffee Maker",
      "Mini Fridge",
      "Luxury Toiletries",
      "24/7 Room Service",
      "Complimentary Breakfast"
    ],
    occupancy: 2,
    bedType: "King Bed",
    price: 3499,
    featured: true,
    size: "350 sq. ft.",
    view: "Co-operative Colony View"
  },
  {
    id: "family-room",
    slug: "family",
    name: "Family Room",
    description: "Spacious multi-bed setup and kid-friendly amenities designed for families visiting Bokaro.",
    longDescription: "Crafted specifically for families and groups, our Family Room provides comfortable multi-bed accommodation, dining space, modern entertainment, children's welcome packs, and generous storage for effortless extended stays.",
    images: [
      "/images/rooms/family/main.jpg",
      "/images/rooms/family/room.jpg",
      "/images/rooms/family/1.png",
      "/images/rooms/family/2.png",
      "/images/rooms/premium/1.png",
      "/images/rooms/premium/2.png",
      "/images/rooms/premium/3.png"
    ],
    amenities: [
      "Two King / Queen Beds",
      "Dining Table & Lounge Area",
      "Ensuite Luxury Bathroom",
      "High-Speed Wi-Fi",
      "55-inch 4K Smart TV",
      "Tea/Coffee Maker & Mini Fridge",
      "24/7 Room Service",
      "Complimentary Buffet Breakfast"
    ],
    occupancy: 4,
    bedType: "2 King Beds",
    price: 4999,
    featured: true,
    size: "550 sq. ft.",
    view: "Garden & City View"
  }
];

/**
 * Backwards compatibility helper to resolve legacy or alternative slugs
 * to canonical room categories (single, double, family).
 */
export function resolveRoomSlug(slugOrId?: string): string {
  if (!slugOrId) return "single";
  const s = slugOrId.toLowerCase().trim();
  if (s === "single" || s === "single-room" || s === "single-occupancy" || s === "deluxe" || s === "deluxe-room") return "single";
  if (s === "double" || s === "double-room" || s === "double-occupancy" || s === "executive" || s === "executive-room") return "double";
  if (s === "family" || s === "family-room" || s === "family-suite" || s === "triple" || s === "triple-room" || s === "premium" || s === "premium-room" || s === "premium-suite") return "family";
  return s;
}
