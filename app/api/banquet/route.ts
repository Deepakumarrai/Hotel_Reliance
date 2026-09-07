import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

const defaultVenues = [
  {
    id: "banquet-hall",
    name: "AC Banquet Hall",
    description: "Our premium air-conditioned indoor banquet hall offers an elegant layout suitable for wedding ceremonies, ring exchanges, birthday celebrations, and corporate dinners.",
    capacity: "Up to 350 Guests",
    size: "4,200 sq. ft.",
    image: "/images/banquet/hall-main.jpg",
    amenities: [
      "AC Climate Control",
      "Integrated Audio-Visual Setup",
      "Configurable Stage Lighting",
      "In-House Buffet Catering Area",
      "Dedicated Groom & Bride Makeup Rooms"
    ]
  },
  {
    id: "meeting-room",
    name: "Executive Meeting Rooms",
    description: "Configured for professional business conventions. Features high-speed connectivity, boards, and digital projection facilities for boardroom discussions.",
    capacity: "Up to 30 Guests",
    size: "800 sq. ft.",
    image: "/images/gallery/hotel-lobby.jpg",
    amenities: [
      "Digital Projection & LED Screens",
      "High-Speed Wi-Fi",
      "Ergonomic Business Seating",
      "Coffee & Snack Caterings",
      "Whiteboards & Flipcharts"
    ]
  },
  {
    id: "outdoor-lawn",
    name: "Celebration Lawn",
    description: "An expansive open-air manicured garden lawn designed for massive social gatherings, reception parties, exhibitions, and late-evening dinner gatherings under the stars.",
    capacity: "Up to 600 Guests",
    size: "12,000 sq. ft.",
    image: "/images/banquet/lawn-main.jpg",
    amenities: [
      "Beautiful Green Landscaping",
      "Custom Grand Stage Setups",
      "Outdoor Barbeque & Bar Counters",
      "Silent Power Generator Backup",
      "Security Monitored Entry Gates"
    ]
  }
];

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/banquet", { method: "GET" });
    if (res.data?.venues && Array.isArray(res.data.venues) && res.data.venues.length > 0) {
      return NextResponse.json({
        status: "success",
        venues: res.data.venues
      });
    }

    return NextResponse.json({
      status: "success",
      venues: defaultVenues
    });
  } catch {
    return NextResponse.json({
      status: "success",
      venues: defaultVenues
    });
  }
}
