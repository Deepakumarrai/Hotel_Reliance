import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    bookings: adminStore.bookings,
    total: adminStore.bookings.length,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const newId = `HR-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = {
      id: newId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      roomType: data.roomType || "deluxe",
      roomNumber: data.roomNumber,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      nights: Number(data.nights) || 1,
      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,
      baseAmount: Number(data.baseAmount) || 2499,
      taxAmount: Number(data.taxAmount) || 299.88,
      discountAmount: Number(data.discountAmount) || 0,
      totalAmount: Number(data.totalAmount) || 2798.88,
      paidAmount: Number(data.paidAmount) || 0,
      paymentStatus: data.paymentStatus || "PENDING",
      bookingStatus: data.bookingStatus || "CONFIRMED",
      paymentMethod: data.paymentMethod || "PAY_AT_HOTEL",
      specialRequests: data.specialRequests,
      createdAt: new Date().toISOString(),
    };

    adminStore.bookings.unshift(newBooking);

    // If a physical room was assigned, update room status
    if (newBooking.roomNumber) {
      const room = adminStore.rooms.find((r) => r.roomNumber === newBooking.roomNumber);
      if (room) {
        room.status = "RESERVED";
        room.assignedGuest = newBooking.guestName;
        room.currentBookingId = newBooking.id;
      }
    }

    adminStore.addAuditLog(session.username, "CREATE_BOOKING", "Booking", newId, `Created booking for ${newBooking.guestName}`);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const { id, action, roomNumber, reason, refundAmount } = data;

    const booking = adminStore.bookings.find((b) => b.id === id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const prevStatus = booking.bookingStatus;

    if (action === "CHECK_IN") {
      booking.bookingStatus = "CHECKED_IN";
      if (roomNumber) {
        booking.roomNumber = roomNumber;
        const room = adminStore.rooms.find((r) => r.roomNumber === roomNumber);
        if (room) {
          room.status = "OCCUPIED";
          room.assignedGuest = booking.guestName;
          room.currentBookingId = booking.id;
        }
      }
      adminStore.addAuditLog(session.username, "CHECK_IN_GUEST", "Booking", id, `Assigned Room ${roomNumber || booking.roomNumber}`, prevStatus);
    } else if (action === "CHECK_OUT") {
      booking.bookingStatus = "CHECKED_OUT";
      if (booking.roomNumber) {
        const room = adminStore.rooms.find((r) => r.roomNumber === booking.roomNumber);
        if (room) {
          room.status = "CLEANING"; // Ready for housekeeping!
          room.assignedGuest = undefined;
          room.currentBookingId = undefined;
        }
      }
      adminStore.addAuditLog(session.username, "CHECK_OUT_GUEST", "Booking", id, "Completed check-out, room set to CLEANING", prevStatus);
    } else if (action === "CANCEL") {
      booking.bookingStatus = "CANCELLED";
      booking.cancellationReason = reason || "Guest requested cancellation";
      if (refundAmount) {
        booking.refundAmount = Number(refundAmount);
        booking.paymentStatus = "REFUNDED";
      }
      if (booking.roomNumber) {
        const room = adminStore.rooms.find((r) => r.roomNumber === booking.roomNumber);
        if (room) {
          room.status = "AVAILABLE";
          room.assignedGuest = undefined;
          room.currentBookingId = undefined;
        }
      }
      adminStore.addAuditLog(session.username, "CANCEL_BOOKING", "Booking", id, `Cancelled: ${reason}`, prevStatus);
    }

    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
