import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/content/room_categories", { method: "GET" });
    const categories = res.data?.content?.categories || [];
    return NextResponse.json({ success: true, data: categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
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
