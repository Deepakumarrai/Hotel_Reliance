import { NextResponse } from "next/server";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: adminStore.hotelSettings,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const previousSettings = { ...adminStore.hotelSettings };

    adminStore.hotelSettings = {
      ...adminStore.hotelSettings,
      hotelName: body.hotelName || adminStore.hotelSettings.hotelName,
      tagline: body.tagline || adminStore.hotelSettings.tagline,
      description: body.description || adminStore.hotelSettings.description,
      phones: Array.isArray(body.phones) && body.phones.length > 0 ? body.phones : [body.phone1, body.phone2].filter(Boolean),
      emails: Array.isArray(body.emails) && body.emails.length > 0 ? body.emails : [body.email].filter(Boolean),
      whatsappNumber: body.whatsappNumber || adminStore.hotelSettings.whatsappNumber,
      address: {
        ...adminStore.hotelSettings.address,
        fullAddress: body.address || body.fullAddress || adminStore.hotelSettings.address.fullAddress,
      },
      checkInTime: body.checkInTime || adminStore.hotelSettings.checkInTime,
      checkOutTime: body.checkOutTime || adminStore.hotelSettings.checkOutTime,
      cancellationWindowHours: typeof body.cancellationWindowHours === "number" ? body.cancellationWindowHours : adminStore.hotelSettings.cancellationWindowHours,
      freeCancellationAllowed: typeof body.freeCancellationAllowed === "boolean" ? body.freeCancellationAllowed : adminStore.hotelSettings.freeCancellationAllowed,
      updatedAt: new Date().toISOString(),
    };

    adminStore.addAuditLog(
      "SUPER_ADMIN",
      "UPDATE_HOTEL_SETTINGS",
      "HotelSettings",
      "master",
      JSON.stringify(adminStore.hotelSettings),
      JSON.stringify(previousSettings)
    );

    return NextResponse.json({
      success: true,
      message: "Hotel settings updated successfully across website",
      settings: adminStore.hotelSettings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update hotel settings" },
      { status: 500 }
    );
  }
}
