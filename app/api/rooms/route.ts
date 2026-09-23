import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export const officialCategories = [
  {
    id: "deluxe-room",
    slug: "deluxe",
    name: "Deluxe Room",
    badge: "DELUXE",
    price: 2499,
    image: "/images/rooms/deluxe/main.jpg",
    images: [
      "/images/rooms/deluxe/main.jpg",
      "/images/rooms/deluxe/room.jpg",
      "/images/rooms/deluxe/1.png",
      "/images/rooms/deluxe/2.png",
      "/images/rooms/deluxe/3.png",
      "/images/rooms/deluxe/4.png",
    ],
    description: "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay in Bokaro.",
    longDescription: "Our Deluxe Rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, a fully equipped workstation, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service.",
    maxGuests: "2 Guests",
    occupancy: 2,
    bedding: "King Bed",
    bedType: "King Bed",
    roomArea: "280 sq. ft.",
    size: "280 sq. ft.",
    view: "City View",
    amenitiesCount: 10,
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
      "Complimentary Bottled Water",
    ],
    moreAmenitiesCount: 4,
  },
  {
    id: "executive-room",
    slug: "executive",
    name: "Executive Room",
    badge: "EXECUTIVE",
    price: 3499,
    image: "/images/rooms/executive/main.jpg",
    images: [
      "/images/rooms/executive/main.jpg",
      "/images/rooms/executive/room.jpg",
      "/images/rooms/executive/1.png",
      "/images/rooms/executive/2.png",
      "/images/rooms/executive/3.png",
      "/images/rooms/executive/4.png",
    ],
    description: "Spacious layout with enhanced services and executive desk for premium business guests.",
    longDescription: "The Executive Room is meticulously designed for business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, smart TV, and 24/7 room service.",
    maxGuests: "2 Guests",
    occupancy: 2,
    bedding: "King Bed",
    bedType: "King Bed",
    roomArea: "350 sq. ft.",
    size: "350 sq. ft.",
    view: "Co-operative Colony View",
    amenitiesCount: 10,
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
      "Complimentary Breakfast",
    ],
    moreAmenitiesCount: 4,
  },
  {
    id: "premium-suite",
    slug: "premium",
    name: "Premium Suite",
    badge: "PREMIUM",
    price: 4999,
    image: "/images/rooms/premium/main.jpg",
    images: [
      "/images/rooms/premium/main.jpg",
      "/images/rooms/premium/room.jpg",
      "/images/rooms/premium/1.png",
      "/images/rooms/premium/2.png",
      "/images/rooms/premium/3.png",
    ],
    description: "Lavish living room, separate master bedroom, panoramic city views, and dedicated concierge.",
    longDescription: "Our Premium Suite delivers uncompromised grandeur with an expansive master bedroom, separate lounge, soaking bathtub, walk-in closet, and sweeping vistas of the Bokaro skyline.",
    maxGuests: "3 Guests",
    occupancy: 3,
    bedding: "King Bed + Sofa Bed",
    bedType: "King Bed + Sofa Bed",
    roomArea: "500 sq. ft.",
    size: "500 sq. ft.",
    view: "Panoramic Greenery View",
    amenitiesCount: 9,
    amenities: [
      "Master King Bed + Sofa Bed",
      "Separate Living Room",
      "Bathtub & Rain Shower",
      "Espresso Machine",
      "High-Speed 5G Wi-Fi",
      "55-inch 4K Smart TV",
      "Complimentary Buffet Breakfast",
      "Evening Cocktail Hour",
      "Express Check-In / Check-Out",
    ],
    moreAmenitiesCount: 3,
  },
  {
    id: "family-suite",
    slug: "family",
    name: "Family Suite",
    badge: "FAMILY",
    price: 5999,
    image: "/images/rooms/family/main.jpg",
    images: [
      "/images/rooms/family/main.jpg",
      "/images/rooms/family/room.jpg",
      "/images/rooms/family/1.png",
      "/images/rooms/family/2.png",
    ],
    description: "Interconnected bedrooms, dining space, and kid-friendly amenities designed for families visiting Bokaro.",
    longDescription: "Crafted specifically for families, this multi-room sanctuary provides two full master suites, dining space, children's welcome packs, and generous storage for effortless extended stays.",
    maxGuests: "4 Guests",
    occupancy: 4,
    bedding: "2 King Beds",
    bedType: "2 King Beds",
    roomArea: "650 sq. ft.",
    size: "650 sq. ft.",
    view: "Garden & City View",
    amenitiesCount: 8,
    amenities: [
      "Two King Master Bedrooms",
      "Dining Table & Lounge",
      "Two Ensuite Bathrooms",
      "Microwave & Refrigerator",
      "High-Speed Wi-Fi",
      "Two Smart LED TVs",
      "Kids Activity Kits",
      "24/7 Butler Support",
    ],
    moreAmenitiesCount: 2,
  },
];

const CANONICAL_ORDER = ["deluxe", "executive", "premium", "family"];

function sortCategories(categories: any[]) {
  return [...categories].sort((a, b) => {
    const aSlug = (a.slug || a.id || "").toLowerCase().replace(/-room$/, "").replace(/-suite$/, "");
    const bSlug = (b.slug || b.id || "").toLowerCase().replace(/-room$/, "").replace(/-suite$/, "");
    const aIdx = CANONICAL_ORDER.indexOf(aSlug);
    const bIdx = CANONICAL_ORDER.indexOf(bSlug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });
}

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    const categories = res.data?.content?.categories;
    if (Array.isArray(categories) && categories.length > 0) {
      return NextResponse.json({ success: true, data: sortCategories(categories) });
    }
    return NextResponse.json({ success: true, data: officialCategories });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: officialCategories });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentRes = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    let existing: any[] = currentRes.data?.content?.categories || [];

    if (!Array.isArray(existing) || existing.length === 0) {
      existing = [...officialCategories];
    }

    if (body.categories && Array.isArray(body.categories)) {
      existing = body.categories;
    } else if (body.newCategory) {
      const newCat = body.newCategory;
      const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const images = Array.isArray(newCat.images) && newCat.images.length > 0
        ? newCat.images
        : (newCat.image ? [newCat.image] : [`/images/rooms/${slug}/main.jpg`]);
      const occupancy = Number(newCat.occupancy) || parseInt(newCat.maxGuests) || 2;
      const bedding = newCat.bedding || newCat.bedType || "King Bed";
      const roomArea = newCat.roomArea || newCat.size || "300 sq. ft.";

      const created = {
        id: newCat.id || `${slug}-room`,
        slug: slug,
        name: newCat.name,
        badge: newCat.badge || slug.toUpperCase(),
        price: Number(newCat.price) || 2499,
        image: images[0] || `/images/rooms/${slug}/main.jpg`,
        images: images,
        description: newCat.description || newCat.shortDesc || "",
        longDescription: newCat.longDescription || newCat.description || "",
        maxGuests: newCat.maxGuests || `${occupancy} Guests`,
        occupancy: occupancy,
        bedding: bedding,
        bedType: bedding,
        roomArea: roomArea,
        size: roomArea,
        view: newCat.view || "City View",
        amenitiesCount: (newCat.amenities || []).length,
        amenities: newCat.amenities || [
          "King Size Bed",
          "High-Speed Wi-Fi",
          "Air Conditioning",
        ],
        moreAmenitiesCount: Math.max(0, (newCat.amenities?.length || 0) - 6),
      };
      existing = existing.filter((c) => c.id !== created.id && c.slug !== created.slug);
      existing.push(created);
    }

    const sorted = sortCategories(existing);

    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories: sorted }),
    });

    return NextResponse.json({ success: true, data: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const categories = body.categories || [];
    const sorted = sortCategories(categories);
    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories: sorted }),
    });
    return NextResponse.json({ success: true, data: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const currentRes = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    let existing: any[] = currentRes.data?.content?.categories || [];

    if (!Array.isArray(existing) || existing.length === 0) {
      existing = [...officialCategories];
    }

    existing = existing.filter((c) => c.id !== id && c.slug !== id);
    const sorted = sortCategories(existing);

    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories: sorted }),
    });

    return NextResponse.json({ success: true, data: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
