import { Room } from "@/types/room";

export const roomsData: Room[] = [
  {
    id: "single-room",
    slug: "single",
    name: "Single Room",
    description: "Comfortable, well-appointed room with modern amenities, designed for solo corporate or leisure travelers.",
    longDescription: "Our Single Room offers a relaxing and cozy environment with premium bedding, a work desk, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service. Perfect for solo executives and visitors in Bokaro Steel City.",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg"
    ],
    amenities: [
      "Queen / Single Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Flat Screen TV",
      "Tea/Coffee Maker",
      "Mini Fridge",
      "24/7 Room Service",
      "Electronic Safe",
      "Complimentary Bottled Water"
    ],
    occupancy: 1,
    bedType: "Single / Queen Bed",
    price: 2403.32,
    featured: true,
    size: "240 sq. ft.",
    view: "City View"
  },
  {
    id: "double-room",
    slug: "double",
    name: "Double Room",
    description: "Spacious layout with a plush king bed and executive amenities for couples and business professionals.",
    longDescription: "The Double Room is thoughtfully designed with modern elegance. Featuring a comfortable king-size bed, executive work desk, smart TV, fast Wi-Fi, and premium bathroom amenities, it provides the ideal balance of luxury and comfort.",
    images: [
      "/images/rooms/executive/main.jpg",
      "/images/rooms/executive/room.jpg"
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
      "24/7 Room Service"
    ],
    occupancy: 2,
    bedType: "King Bed",
    price: 2731.05,
    featured: true,
    size: "320 sq. ft.",
    view: "Co-operative Colony View"
  },
  {
    id: "triple-room",
    slug: "triple",
    name: "Triple Room",
    description: "Generous multi-bed accommodation with upscale decor and lounge seating for families and groups.",
    longDescription: "Our Triple Room offers expansive comfort for up to three guests, featuring plush bedding arrangements, a sitting lounge, panoramic window views, and full hospitality amenities for a memorable stay in Bokaro.",
    images: [
      "/images/rooms/premium/main.jpg",
      "/images/rooms/premium/room.jpg"
    ],
    amenities: [
      "King + Single Bed",
      "High-Speed Wi-Fi",
      "Climate Control",
      "55-inch Smart TV",
      "In-room Lounge Seating",
      "Premium Tea/Coffee Setup",
      "Mini Fridge",
      "24/7 Room Service"
    ],
    occupancy: 3,
    bedType: "King + Single Bed",
    price: 3495.74,
    featured: true,
    size: "420 sq. ft.",
    view: "Panoramic Greenery View"
  },
  // Compatibility entries for existing bookmarks / legacy links
  {
    id: "deluxe-room",
    slug: "deluxe",
    name: "Single Room (Deluxe)",
    description: "Comfortable, well-appointed room with modern amenities, designed for solo corporate or leisure travelers.",
    longDescription: "Our Single Room offers a relaxing and cozy environment with premium bedding, a work desk, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service.",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg"
    ],
    amenities: [
      "Queen / Single Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Flat Screen TV",
      "Tea/Coffee Maker",
      "Mini Fridge",
      "24/7 Room Service"
    ],
    occupancy: 1,
    bedType: "Single / Queen Bed",
    price: 2403.32,
    featured: false,
    size: "240 sq. ft.",
    view: "City View"
  },
  {
    id: "executive-room",
    slug: "executive",
    name: "Double Room (Executive)",
    description: "Spacious layout with a plush king bed and executive amenities for couples and business professionals.",
    longDescription: "The Double Room is thoughtfully designed with modern elegance and complete luxury amenities.",
    images: [
      "/images/rooms/executive/main.jpg",
      "/images/rooms/executive/room.jpg"
    ],
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Smart LED TV",
      "Executive Work Desk",
      "24/7 Room Service"
    ],
    occupancy: 2,
    bedType: "King Bed",
    price: 2731.05,
    featured: false,
    size: "320 sq. ft.",
    view: "Co-operative Colony View"
  },
  {
    id: "premium-room",
    slug: "premium",
    name: "Triple Room (Premium)",
    description: "Generous multi-bed accommodation with upscale decor and lounge seating for families and groups.",
    longDescription: "Our Triple Room offers expansive comfort for up to three guests with full hospitality amenities.",
    images: [
      "/images/rooms/premium/main.jpg",
      "/images/rooms/premium/room.jpg"
    ],
    amenities: [
      "King + Single Bed",
      "High-Speed Wi-Fi",
      "Climate Control",
      "55-inch Smart TV",
      "24/7 Room Service"
    ],
    occupancy: 3,
    bedType: "King + Single Bed",
    price: 3495.74,
    featured: false,
    size: "420 sq. ft.",
    view: "Panoramic Greenery View"
  },
  {
    id: "family-room",
    slug: "family",
    name: "Triple Room (Family)",
    description: "Generous multi-bed layout ideal for families and larger groups traveling together.",
    longDescription: "Our Family Triple Room provides a warm, homely environment for a memorable stay.",
    images: [
      "/images/rooms/family/main.jpg",
      "/images/rooms/family/room.jpg"
    ],
    amenities: [
      "King + Single Bed",
      "High-Speed Wi-Fi",
      "Dual Air Conditioning",
      "Flat Screen TV",
      "24/7 Room Service"
    ],
    occupancy: 3,
    bedType: "King + Single Bed",
    price: 3495.74,
    featured: false,
    size: "420 sq. ft.",
    view: "City & Colony View"
  }
];
