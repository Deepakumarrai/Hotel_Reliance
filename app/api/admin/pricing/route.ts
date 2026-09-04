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
    const body = await request.json();

    // Check if batch update
    if (body.allPrices && typeof body.allPrices === "object") {
      const oldPrices = JSON.stringify(adminStore.roomPrices);
      for (const [key, val] of Object.entries(body.allPrices as Record<string, any>)) {
        if (adminStore.roomPrices[key]) {
          adminStore.roomPrices[key] = {
            base: Number(val.base) || adminStore.roomPrices[key].base,
            weekend: Number(val.weekend) || adminStore.roomPrices[key].weekend,
            peak: Number(val.peak) || adminStore.roomPrices[key].peak,
            extraAdult: Number(val.extraAdult) || adminStore.roomPrices[key].extraAdult,
            extraBed: Number(val.extraBed) || adminStore.roomPrices[key].extraBed,
          };
        }
      }

      adminStore.addAuditLog(
        session.username,
        "UPDATE_ALL_PRICING",
        "Pricing",
        "ALL",
        JSON.stringify(adminStore.roomPrices),
        oldPrices
      );

      return NextResponse.json({ success: true, prices: adminStore.roomPrices });
    }

    const { roomType, base, weekend, peak, extraAdult, extraBed } = body;
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

