import { NextResponse } from "next/server";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      settings: adminStore.hotelSettings,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
