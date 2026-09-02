import { Offer } from "@/types";

export const offersData: Offer[] = [
  {
    id: "offer-weekend",
    title: "Weekend Leisure Staycation",
    description: "Recharge over the weekend in Bokaro with complimentary buffet breakfast, late check-out till 2 PM, and a complimentary suite upgrade (subject to availability).",
    discountCode: "WEEKENDSPL",
    discountValue: "Free Breakfast + Upgrade",
    expiryDate: "Dec 31, 2026",
    image: "/images/offers/image-copy.png",
    featured: true,
    category: "Staycation",
    inclusions: [
      "Lavish Buffet Breakfast for two at Kwality Restaurant",
      "Complimentary Late Check-out up to 2:00 PM",
      "Complimentary High-Speed Wi-Fi & Welcome Drinks",
      "15% Discount on In-Room Dining"
    ],
    terms: "Valid for Friday to Sunday check-ins. Direct website bookings only."
  },
  {
    id: "offer-early-bird",
    title: "Advance Purchase Early Bird",
    description: "Plan your trip to Bokaro Steel City at least 7 days ahead and enjoy special savings on Executive and Premium suites.",
    discountCode: "RELIANCE15",
    discountValue: "15% Special Tariff",
    expiryDate: "Dec 31, 2026",
    image: "/images/offers/early-bird.jpg",
    featured: true,
    category: "Staycation",
    inclusions: [
      "15% Discount on base room tariff",
      "Complimentary daily bottled water & tea/coffee setup",
      "Free high-speed Wi-Fi and workstation access"
    ],
    terms: "Requires booking minimum 7 days prior to check-in. Non-refundable promotional rate."
  },
  {
    id: "offer-corporate",
    title: "Corporate Long-Stay Privilege",
    description: "Tailored for SAIL executives, engineering consultants, and business visitors with extended stays of 4 nights or more in Bokaro.",
    discountCode: "CORPSTAY",
    discountValue: "Special Corporate Tariff",
    expiryDate: "Ongoing 2026",
    image: "/images/rooms/executive/main.jpg",
    featured: true,
    category: "Corporate",
    inclusions: [
      "Complimentary daily laundry (2 pieces/day)",
      "Daily Chef's Breakfast & Evening Tea Setup",
      "Dedicated high-speed ergonomic workstation",
      "Priority meeting room booking privileges"
    ],
    terms: "Applicable on stays of 4 nights or longer. Valid corporate ID required at check-in."
  },
  {
    id: "offer-family",
    title: "Family Holiday Celebration",
    description: "Spacious multi-bed Family Suites with child-friendly meal plans and discounted local sightseeing cab arrangements.",
    discountCode: "FAMILYFUN",
    discountValue: "Kids Stay Complimentary",
    expiryDate: "Dec 31, 2026",
    image: "/images/rooms/family/main.jpg",
    featured: false,
    category: "Staycation",
    inclusions: [
      "Complimentary stay for up to 2 children under 6 years",
      "Family dining platter at Kwality Restaurant",
      "Front desk concierge assistance for City Park & Zoo visits"
    ],
    terms: "Valid on Family Room bookings. Subject to room availability."
  },
  {
    id: "offer-wedding",
    title: "Grand Wedding & Banquet Package",
    description: "Host memorable wedding celebrations across our grand AC Banquet Hall and Outdoor Celebration Lawn with bespoke catering.",
    discountCode: "WEDDING2026",
    discountValue: "Complimentary Bridal Suite",
    expiryDate: "Dec 31, 2026",
    image: "/images/banquet/hall-main.jpg",
    featured: true,
    category: "Wedding & Banquet",
    inclusions: [
      "Complimentary 1-Night stay in Premium Suite for Bride/Groom",
      "Dedicated banquet event manager & audio/visual coordinator",
      "Custom multi-cuisine buffet menu consultation by Executive Chef",
      "Special room tariff discounts for wedding guests"
    ],
    terms: "Applicable on full-day banquet hall or celebration lawn bookings with minimum 100 guests."
  },
  {
    id: "offer-dining",
    title: "Kwality Restaurant Dining Delight",
    description: "Savor exquisite North Indian, Tandoori, and Chinese gourmet culinary creations with family dinner discounts.",
    discountCode: "KWALITY10",
    discountValue: "10% Off Dinner Buffet",
    expiryDate: "Dec 31, 2026",
    image: "/images/restaurant/dining-area.jpg",
    featured: false,
    category: "Dining",
    inclusions: [
      "10% discount on total food bill (above ₹1,500)",
      "Complimentary Chef's dessert of the day",
      "Reserved prime table seating with prior call"
    ],
    terms: "Valid on dine-in at Kwality Restaurant Monday through Thursday."
  }
];
