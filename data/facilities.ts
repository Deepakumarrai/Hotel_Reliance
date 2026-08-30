import { Facility } from "@/types/facility";

export const facilitiesData: Facility[] = [
  {
    id: "wifi",
    name: "High-Speed Wi-Fi",
    description: "Complimentary high-speed wireless internet access across all rooms and public spaces.",
    iconName: "Wifi",
    featured: true
  },
  {
    id: "restaurant",
    name: "Kwality Restaurant",
    description: "In-house restaurant offering premium multi-cuisine dining options.",
    iconName: "Utensils",
    featured: true
  },
  {
    id: "banquet",
    name: "Banquet Spaces",
    description: "Spacious and elegant spaces for social events, celebrations, and weddings.",
    iconName: "Sparkles",
    featured: true
  },
  {
    id: "meeting",
    name: "Meeting Rooms",
    description: "Dedicated professional boardroom facilities for corporate discussions.",
    iconName: "Briefcase",
    featured: true
  },
  {
    id: "parking",
    name: "Free Secure Parking",
    description: "Large, monitored on-site parking spaces for guest vehicles.",
    iconName: "Car",
    featured: false
  },
  {
    id: "service",
    name: "24/7 Room Service",
    description: "In-room dining served straight to your door at any time of day or night.",
    iconName: "Clock",
    featured: false
  }
];
