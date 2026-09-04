import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    prices: adminStore.roomPrices,
  });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { roomType, base, weekend, peak, extraAdult, extraBed } = await request.json();
    if (!adminStore.roomPrices[roomType]) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    const oldPrice = JSON.stringify(adminStore.roomPrices[roomType]);
    adminStore.roomPrices[roomType] = {
      base: Number(base),
      weekend: Number(weekend),
      peak: Number(peak),
      extraAdult: Number(extraAdult),
      extraBed: Number(extraBed),
    };

    adminStore.addAuditLog(
      session.username,
      "UPDATE_PRICING",
      "Pricing",
      roomType,
      JSON.stringify(adminStore.roomPrices[roomType]),
      oldPrice
    );

    return NextResponse.json({ success: true, prices: adminStore.roomPrices });
  } catch {
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}
