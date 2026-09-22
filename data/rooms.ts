import { Room } from "@/types/room";

export interface MapPlanAddon {
  id: string;
  name: string;
  basePrice: number;
  gstRate: number;
  gstAmount: number;
  price: number;
  description: string;
}

export const mapPlanAddon: MapPlanAddon = {
  id: "map-plan",
  name: "Map Plan",
  basePrice: 700,
  gstRate: 5,
  gstAmount: 35,
  price: 735,
  description: "Includes breakfast and dinner (MAP - Modified American Plan) during your stay."
};

export const eventPricing = {
  marriageCost: 225000,
  marriageCostFormatted: "₹2,25,000/-",
  marriageTitle: "Marriage / Grand Wedding Package",
  marriageDescription: "Complete venue access including AC Banquet Hall, Celebration Lawn, stage setup, and bridal dressing areas."
};

export const roomsData: Room[] = [
  {
    id: "single-occupancy",
    slug: "single",
    name: "Single Occupancy",
    description: "Comfortable, well-appointed room with modern amenities, designed for solo corporate or leisure travelers.",
    longDescription: "Our Single Occupancy room offers a relaxing and cozy environment with premium bedding, a work desk, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service. Perfect for solo executives and visitors in Bokaro Steel City.",
    images: [
      "/images/rooms/single/1.png",
      "/images/rooms/single/2.png",
      "/images/rooms/single/3.png",
      "/images/rooms/single/4.png",
      "/images/rooms/single/5.png",
      "/images/rooms/single/6.png"
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
    price: 2310,
    basePrice: 2200,
    gstRate: 5,
    gstAmount: 110,
    featured: true,
    view: "City View"
  },
  {
    id: "double-occupancy",
    slug: "double",
    name: "Double Occupancy",
    description: "Spacious layout with a plush king bed and executive amenities for couples and business professionals.",
    longDescription: "The Double Occupancy room is thoughtfully designed with modern elegance. Featuring a comfortable king-size bed, executive work desk, smart TV, fast Wi-Fi, and premium bathroom amenities, it provides the ideal balance of luxury and comfort.",
    images: [
      "/images/rooms/double/1.png",
      "/images/rooms/double/2.png",
      "/images/rooms/double/3.png",
      "/images/rooms/double/4.png",
      "/images/rooms/double/5.png",
      "/images/rooms/double/6.png"
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
    price: 2625,
    basePrice: 2500,
    gstRate: 5,
    gstAmount: 125,
    featured: true,
    view: "Co-operative Colony View"
  },
  {
    id: "family-room",
    slug: "triple",
    name: "Family Room",
    description: "Generous multi-bed accommodation with upscale decor and lounge seating for families and groups.",
    longDescription: "Our Family Room offers expansive comfort for families and groups, featuring plush bedding arrangements, a sitting lounge, panoramic window views, and full hospitality amenities for a memorable stay in Bokaro.",
    images: [
      "/images/rooms/triple/1.png",
      "/images/rooms/triple/2.png",
      "/images/rooms/triple/3.png",
      "/images/rooms/triple/4.png"
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
    price: 3360,
    basePrice: 3200,
    gstRate: 5,
    gstAmount: 160,
    featured: true,
    view: "Panoramic Greenery View"
  }
];

