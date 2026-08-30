import { Room } from "@/types/room";

export const roomsData: Room[] = [
  {
    id: "deluxe-room",
    slug: "deluxe",
    name: "Deluxe Room",
    description: "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay.",
    longDescription: "Our Deluxe Rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, a fully equipped workstation, high-speed Wi-Fi, and a well-appointed bathroom. It's an ideal choice for corporate travelers and couples looking for a cozy retreat in Bokaro.",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg"
    ],
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Flat Screen TV",
      "Tea/Coffee Maker",
      "Mini Fridge",
      "24/7 Room Service",
      "Electronic Safe",
      "Complimentary Bottled Water"
    ],
    occupancy: 2,
    bedType: "King Bed",
    price: null, // Price on request
    featured: true,
    size: "280 sq. ft.",
    view: "City View"
  },
  {
    id: "executive-room",
    slug: "executive",
    name: "Executive Room",
    description: "Spacious layout with enhanced services and luxury amenities for premium guests.",
    longDescription: "The Executive Room is meticulously designed for business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, and high-speed connectivity, it ensures a seamless blend of work and relaxation during your stay.",
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
      "24/7 Room Service",
      "Complimentary Breakfast"
    ],
    occupancy: 2,
    bedType: "King Bed",
    price: null, // Price on request
    featured: true,
    size: "350 sq. ft.",
    view: "Co-operative Colony View"
  },
  {
    id: "premium-room",
    slug: "premium",
    name: "Premium Room",
    description: "An upscale sanctuary offering luxury decor, panoramic views, and personalized service.",
    longDescription: "Our Premium Rooms represent the pinnacle of sophistication and luxury at Hotel Reliance. Adorned with plush furnishings, art pieces, a private lounge space, and expansive windows offering stunning views of the green colony, these rooms cater to guests seeking an indulgent lodging experience.",
    images: [
      "/images/rooms/premium/main.jpg",
      "/images/rooms/premium/room.jpg"
    ],
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Climate Control",
      "55-inch Smart TV",
      "In-room Lounge Sofa",
      "Premium Tea/Coffee Setup",
      "Minibar",
      "Luxury Bathroom with Bathtub",
      "24/7 Room Service",
      "Welcome Drinks on Arrival"
    ],
    occupancy: 2,
    bedType: "Super King Bed",
    price: null, // Price on request
    featured: true,
    size: "420 sq. ft.",
    view: "Panoramic Greenery View"
  },
  {
    id: "family-room",
    slug: "family",
    name: "Family Room",
    description: "Generous multi-bed layout ideal for families and groups traveling together.",
    longDescription: "Our Family Rooms are tailored to accommodate families or close groups traveling together without compromising on personal space. Featuring two double beds, a spacious dining table, and a children's play area, it provides a warm, homely environment for a memorable stay.",
    images: [
      "/images/rooms/family/main.jpg",
      "/images/rooms/family/room.jpg"
    ],
    amenities: [
      "Two Double Beds",
      "High-Speed Wi-Fi",
      "Dual Air Conditioning",
      "Flat Screen TV",
      "In-room Dining Table",
      "Tea/Coffee Station",
      "Mini Fridge",
      "Spacious Wardrobes",
      "24/7 Room Service",
      "Extra Bed Available (Upon Request)"
    ],
    occupancy: 4,
    bedType: "Two Double Beds",
    price: null, // Price on request
    featured: false,
    size: "500 sq. ft.",
    view: "City & Colony View"
  }
];
