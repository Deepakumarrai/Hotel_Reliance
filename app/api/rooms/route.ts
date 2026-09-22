import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

const officialCategories = [
  {
    id: "single-occupancy",
    slug: "single",
    name: "Single Occupancy",
    badge: "SINGLE OCCUPANCY",
    price: 2310,
    basePrice: 2200,
    gstRate: 5,
    gstAmount: 110,
    image: "/images/rooms/single/1.png",
    description: "Comfortable, well-appointed room with modern amenities, designed for solo corporate or leisure travelers.",
    maxGuests: "1 Guest",
    bedding: "Single / Queen Bed",
    amenitiesCount: 9,
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
    moreAmenitiesCount: 3,
  },
  {
    id: "double-occupancy",
    slug: "double",
    name: "Double Occupancy",
    badge: "DOUBLE OCCUPANCY",
    price: 2625,
    basePrice: 2500,
    gstRate: 5,
    gstAmount: 125,
    image: "/images/rooms/double-room.png",
    description: "Spacious layout with a plush king bed and executive amenities for couples and business professionals.",
    maxGuests: "2 Guests",
    bedding: "King Bed",
    amenitiesCount: 9,
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
    moreAmenitiesCount: 3,
  },
  {
    id: "family-room",
    slug: "triple",
    name: "Family Room",
    badge: "FAMILY ROOM",
    price: 3360,
    basePrice: 3200,
    gstRate: 5,
    gstAmount: 160,
    image: "/images/rooms/triple/1.png",
    description: "Generous multi-bed accommodation with upscale decor and lounge seating for families and groups.",
    maxGuests: "3 Guests",
    bedding: "King + Single Bed",
    amenitiesCount: 8,
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
    moreAmenitiesCount: 2,
  },
];

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    const categories = res.data?.content?.categories;
    if (Array.isArray(categories) && categories.length > 0 && categories.some(c => c.slug === "single" || c.name === "Single Occupancy")) {
      return NextResponse.json({ success: true, data: categories });
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

    if (body.categories) {
      existing = body.categories;
    } else if (body.newCategory) {
      const newCat = body.newCategory;
      const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const created = {
        id: newCat.id || slug,
        slug: slug,
        name: newCat.name,
        badge: newCat.badge || slug.toUpperCase(),
        price: Number(newCat.price) || 2499,
        image: newCat.image || `/images/rooms/${slug}/main.jpg`,
        description: newCat.description || "",
        maxGuests: newCat.maxGuests || "2 Adults",
        bedding: newCat.bedding || "King Bed",
        roomArea: newCat.roomArea || "300 sq. ft.",
        amenitiesCount: (newCat.amenities || []).length,
        amenities: newCat.amenities || ["King Size Bed", "High-Speed Wi-Fi", "Air Conditioning"],
        moreAmenitiesCount: Math.max(0, (newCat.amenities?.length || 0) - 6),
      };
      existing = existing.filter((c) => c.id !== created.id && c.slug !== created.slug);
      existing.push(created);
    }

    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories: existing }),
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const categories = body.categories || [];
    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    });
    return NextResponse.json({ success: true, data: categories });
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

    existing = existing.filter((c) => c.id !== id && c.slug !== id);

    await forwardToBackend("/admin/content/room_categories", {
      method: "PUT",
      body: JSON.stringify({ categories: existing }),
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
