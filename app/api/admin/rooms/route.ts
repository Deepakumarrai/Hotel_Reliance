import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    rooms: adminStore.rooms,
    total: adminStore.rooms.length,
    counts: {
      available: adminStore.rooms.filter((r) => r.status === "AVAILABLE").length,
      occupied: adminStore.rooms.filter((r) => r.status === "OCCUPIED").length,
      reserved: adminStore.rooms.filter((r) => r.status === "RESERVED").length,
      cleaning: adminStore.rooms.filter((r) => r.status === "CLEANING").length,
      maintenance: adminStore.rooms.filter((r) => r.status === "MAINTENANCE").length,
    },
  });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { roomNumber, status, notes } = await request.json();
    const room = adminStore.rooms.find((r) => r.roomNumber === roomNumber);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const prevStatus = room.status;
    room.status = status;
    if (notes !== undefined) room.notes = notes;

    // Clear guest info if marked available or cleaning
    if (status === "AVAILABLE" || status === "CLEANING") {
      room.assignedGuest = undefined;
      room.currentBookingId = undefined;
    }

    adminStore.addAuditLog(session.username, "UPDATE_ROOM_STATUS", "Room", roomNumber, status, prevStatus);

    return NextResponse.json({ success: true, room });
  } catch {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}
