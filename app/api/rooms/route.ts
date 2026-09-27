import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export const officialCategories = [
  {
    id: "deluxe-room",
    slug: "deluxe",
    name: "Deluxe Room",
    badge: "DELUXE",
    price: 2599,
    image: "/images/rooms/deluxe/1.png",
    images: [
      "/images/rooms/deluxe/1.png",
      "/images/rooms/deluxe/2.png",
      "/images/rooms/deluxe/3.png",
      "/images/rooms/deluxe/4.png",
    ],
    description: "Elegant comfort with modern amenities, designed for a relaxing business or leisure stay in Bokaro.",
    longDescription: "Our Deluxe Rooms offer a perfect blend of space, comfort, and luxury. Designed with modern aesthetics, these rooms feature premium bedding, high-speed Wi-Fi, air conditioning, and 24/7 in-room dining service.",
    maxGuests: "2 Adults",
    occupancy: 2,
    bedding: "King Bed",
    bedType: "King Bed",
    roomArea: "280 sq. ft.",
    size: "280 sq. ft.",
    view: "City View",
    amenitiesCount: 6,
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Flat Screen TV",
      "Tea/Coffee Maker",
      "Mini Fridge",
    ],
    moreAmenitiesCount: 4,
  },
  {
    id: "executive-room",
    slug: "executive",
    name: "Executive Room",
    badge: "EXECUTIVE",
    price: 3499,
    image: "/images/rooms/executive/1.png",
    images: [
      "/images/rooms/executive/1.png",
      "/images/rooms/executive/2.png",
      "/images/rooms/executive/3.png",
      "/images/rooms/executive/4.png",
    ],
    description: "Spacious layout with enhanced services and executive desk for premium business guests.",
    longDescription: "The Executive Room is meticulously designed for business executives who demand extra comfort and utility. Featuring a dedicated seating area, a large executive desk, premier toiletries, smart LED TV, and 24/7 room service.",
    maxGuests: "2 Adults",
    occupancy: 2,
    bedding: "King Bed",
    bedType: "King Bed",
    roomArea: "350 sq. ft.",
    size: "350 sq. ft.",
    view: "Co-operative Colony View",
    amenitiesCount: 6,
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Smart LED TV",
      "Executive Work Desk",
      "Tea/Coffee Maker",
    ],
    moreAmenitiesCount: 4,
  },
  {
    id: "premium-room",
    slug: "premium",
    name: "Premium Room",
    badge: "PREMIUM",
    price: 4999,
    image: "/images/rooms/premium/1.png",
    images: [
      "/images/rooms/premium/1.png",
      "/images/rooms/premium/2.png",
      "/images/rooms/premium/3.png",
    ],
    description: "Luxurious ambiance with premium facilities, perfect for an elevated hospitality experience.",
    longDescription: "Our Premium Room delivers uncompromised grandeur with an expansive master bedroom, separate lounge, soaking bathtub, walk-in closet, and sweeping vistas of the Bokaro skyline.",
    maxGuests: "2 Adults",
    occupancy: 2,
    bedding: "King Bed",
    bedType: "King Bed",
    roomArea: "420 sq. ft.",
    size: "420 sq. ft.",
    view: "Panoramic Greenery View",
    amenitiesCount: 6,
    amenities: [
      "King Size Bed",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Premium Toiletries",
      "Mini Bar",
    ],
    moreAmenitiesCount: 0,
  },
  {
    id: "family-room",
    slug: "family",
    name: "Family Room",
    badge: "FAMILY",
    price: 5999,
    image: "/images/rooms/family/1.png",
    images: [
      "/images/rooms/family/1.png",
      "/images/rooms/family/2.png",
    ],
    description: "Spacious and comfortable stay option for families with modern amenities and extra space.",
    longDescription: "Crafted specifically for families, this multi-room sanctuary provides two full master suites, dining space, children's welcome packs, and generous storage for effortless extended stays.",
    maxGuests: "4 Adults",
    occupancy: 4,
    bedding: "2 King Beds",
    bedType: "2 King Beds",
    roomArea: "500 sq. ft.",
    size: "500 sq. ft.",
    view: "Garden & City View",
    amenitiesCount: 6,
    amenities: [
      "2 King Size Beds",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "2 Smart TVs",
      "Sofa Seating",
      "Dining Space",
    ],
    moreAmenitiesCount: 0,
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
