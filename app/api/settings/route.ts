import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/settings", { method: "GET" });
    return NextResponse.json(
      {
        success: true,
        settings: res.data.hotelSettings,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
