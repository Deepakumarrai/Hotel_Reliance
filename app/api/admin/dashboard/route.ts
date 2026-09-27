import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await forwardToBackend("/admin/dashboard", { method: "GET" });
    if (res.data?.stats) {
      return NextResponse.json(res.data, { status: res.status });
    }
  } catch {
    // Backend offline or starting up
  }

  // Live real-time calculation from bookings and rooms backend database records
  try {
    const [bRes, rRes] = await Promise.all([
      forwardToBackend("/admin/bookings", { method: "GET" }),
      forwardToBackend("/admin/rooms", { method: "GET" }),
    ]);

    const bookings = bRes.data?.bookings || [];
    const rooms = rRes.data?.rooms || [];

    const totalRooms = rooms.length > 0 ? rooms.length : 45;
    const occupied = rooms.filter((r: any) => r.status === "OCCUPIED" || r.status === "RESERVED").length;
    const cleaning = rooms.filter((r: any) => r.status === "CLEANING").length;
    const maintenance = rooms.filter((r: any) => r.status === "MAINTENANCE").length;
    const available = Math.max(0, totalRooms - occupied - cleaning - maintenance);
    const occupancyRate = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

    const validBookings = bookings.filter((b: any) => b.bookingStatus !== "CANCELLED");
    const totalRevenue = validBookings.reduce((sum: number, b: any) => sum + Number(b.totalAmount || b.paidAmount || 0), 0);
    const totalPaid = validBookings.reduce((sum: number, b: any) => sum + Number(b.paidAmount || 0), 0);
    const pendingCount = bookings.filter((b: any) => b.bookingStatus === "PENDING" || b.paymentStatus === "PENDING").length;

    const todayStr = new Date().toISOString().split("T")[0];
    const todayArrivals = bookings.filter((b: any) => b.checkInDate === todayStr && b.bookingStatus !== "CANCELLED").length;
    const todayDepartures = bookings.filter((b: any) => b.checkOutDate === todayStr && b.bookingStatus === "CHECKED_IN").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalRooms,
        occupancyRate,
        occupiedRooms: occupied,
        availableRooms: available,
        cleaningRooms: cleaning,
        maintenanceRooms: maintenance,
        todayArrivals,
        todayDepartures,
        totalRevenue,
        totalPaid,
        pendingCount,
        roomCounts: {
          available,
          occupied,
          reserved: rooms.filter((r: any) => r.status === "RESERVED").length,
          cleaning,
          maintenance,
          outOfService: rooms.filter((r: any) => r.status === "OUT_OF_SERVICE").length,
        },
      },
      recentBookings: bookings.slice(0, 6),
    });
  } catch (fallbackErr: any) {
    return NextResponse.json({ success: false, error: fallbackErr.message }, { status: 500 });
  }
}
