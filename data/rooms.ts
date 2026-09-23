import { Room } from "@/types/room";

export const roomsData: Room[] = [
  {
    id: "deluxe-room",
    slug: "deluxe",
    name: "Deluxe Room",
    description: "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay in Bokaro.",
    longDescription: "Our Deluxe Rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, a fully equipped workstation, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service.",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg",
      "/images/rooms/deluxe/1.png",
      "/images/rooms/deluxe/2.png",
      "/images/rooms/deluxe/3.png",
      "/images/rooms/deluxe/4.png"
    ],
    amenities: [
      "King Size Bed",
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
    occupancy: 2,
    bedType: "King Bed",
    price: 2499,
    featured: true,
    size: "280 sq. ft.",
    view: "City View"
  },
  {
    id: "executive-room",
    slug: "executive",
    name: "Executive Room",
    description: "Spacious layout with enhanced services and executive desk for premium business guests.",
    longDescription: "The Executive Room is meticulously designed for business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, smart TV, and 24/7 room service.",
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
    id: "premium-suite",
    slug: "premium",
    name: "Premium Suite",
    description: "Lavish living room, separate master bedroom, panoramic city views, and dedicated concierge.",
    longDescription: "Our Premium Suite delivers uncompromised grandeur with an expansive master bedroom, separate lounge, soaking bathtub, walk-in closet, and sweeping vistas of the Bokaro skyline.",
    images: [
      "/images/rooms/premium/main.jpg",
      "/images/rooms/premium/room.jpg",
      "/images/rooms/premium/1.png",
      "/images/rooms/premium/2.png",
      "/images/rooms/premium/3.png"
    ],
    amenities: [
      "Master King Bed + Sofa Bed",
      "Separate Living Room",
      "Bathtub & Rain Shower",
      "Espresso Machine",
      "High-Speed 5G Wi-Fi",
      "55-inch 4K Smart TV",
      "Complimentary Buffet Breakfast",
      "Evening Cocktail Hour",
      "Express Check-In / Check-Out"
    ],
    occupancy: 3,
    bedType: "King Bed + Sofa Bed",
    price: 4999,
    featured: true,
    size: "500 sq. ft.",
    view: "Panoramic Greenery View"
  },
  {
    id: "family-suite",
    slug: "family",
    name: "Family Suite",
    description: "Interconnected bedrooms, dining space, and kid-friendly amenities designed for families visiting Bokaro.",
    longDescription: "Crafted specifically for families, this multi-room sanctuary provides two full master suites, dining space, children's welcome packs, and generous storage for effortless extended stays.",
    images: [
      "/images/rooms/family/main.jpg",
      "/images/rooms/family/room.jpg",
      "/images/rooms/family/1.png",
      "/images/rooms/family/2.png"
    ],
    amenities: [
      "Two King Master Bedrooms",
      "Dining Table & Lounge",
      "Two Ensuite Bathrooms",
      "Microwave & Refrigerator",
      "High-Speed Wi-Fi",
      "Two Smart LED TVs",
      "Kids Activity Kits",
      "24/7 Butler Support"
    ],
    occupancy: 4,
    bedType: "2 King Beds",
    price: 5999,
    featured: true,
    size: "650 sq. ft.",
    view: "Garden & City View"
  }
];

/**
 * Backwards compatibility helper to resolve legacy slugs (single, double, triple)
 * to modern official room categories (deluxe, executive, premium, family).
 */
export function resolveRoomSlug(slugOrId?: string): string {
  if (!slugOrId) return "deluxe";
  const s = slugOrId.toLowerCase().trim();
  if (s === "single" || s === "single-room") return "deluxe";
  if (s === "double" || s === "double-room") return "executive";
  if (s === "triple" || s === "triple-room") return "premium";
  return s;
}
