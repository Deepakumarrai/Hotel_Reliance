import { Offer } from "@/types";

export const offersData: Offer[] = [
  {
    id: "offer-early-bird",
    title: "Early Bird Offer",
    description: "Book your room at least 7 days in advance and enjoy a 15% discount on all room bookings.",
    discountCode: "RELIANCE15",
    discountValue: "15% OFF",
    expiryDate: "Dec 31, 2026",
    image: "/images/offers/early-bird.jpg",
    featured: true
  },
  {
    id: "offer-weekend",
    title: "Weekend Getaway Special",
    description: "Plan your weekend in Bokaro Steel City and get complimentary breakfast, late check-out, and premium room upgrade.",
    discountCode: "WEEKENDSPL",
    discountValue: "Free Breakfast + Upgrade",
    expiryDate: "Dec 31, 2026",
    image: "/images/offers/weekend.jpg",
    featured: true
  }
];
