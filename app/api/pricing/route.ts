import { NextResponse } from "next/server";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      prices: adminStore.roomPrices,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
