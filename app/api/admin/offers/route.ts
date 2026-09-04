import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    coupons: adminStore.coupons,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType || "PERCENTAGE",
      discountValue: Number(data.discountValue),
      minBookingAmount: Number(data.minBookingAmount) || 0,
      maxDiscount: Number(data.maxDiscount) || 1000,
      startDate: data.startDate,
      endDate: data.endDate,
      usageLimit: Number(data.usageLimit) || 100,
      usedCount: 0,
      isActive: true,
    };

    adminStore.coupons.push(newCoupon);
    adminStore.addAuditLog(session.username, "CREATE_COUPON", "Coupon", newCoupon.code, `${newCoupon.discountValue}% / ₹${newCoupon.discountValue}`);

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
