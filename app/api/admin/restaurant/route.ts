import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    menuItems: adminStore.menuItems,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const newItem = {
      id: `dish-${Date.now()}`,
      name: data.name,
      category: data.category || "Main Course",
      description: data.description,
      price: Number(data.price),
      image: data.image || "/images/restaurant/murgh-malai-tikka.png",
      isVeg: Boolean(data.isVeg),
      isAvailable: data.isAvailable !== false,
      isFeatured: Boolean(data.isFeatured),
    };

    adminStore.menuItems.push(newItem);
    adminStore.addAuditLog(session.username, "ADD_MENU_ITEM", "Restaurant", newItem.id, newItem.name);

    return NextResponse.json({ success: true, item: newItem });
  } catch {
    return NextResponse.json({ error: "Failed to add menu item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, isAvailable, isFeatured, price, name } = await request.json();
    const item = adminStore.menuItems.find((m) => m.id === id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    if (isAvailable !== undefined) item.isAvailable = isAvailable;
    if (isFeatured !== undefined) item.isFeatured = isFeatured;
    if (price !== undefined) item.price = Number(price);
    if (name !== undefined) item.name = name;

    adminStore.addAuditLog(session.username, "UPDATE_MENU_ITEM", "Restaurant", id, `Updated ${item.name}`);

    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}
