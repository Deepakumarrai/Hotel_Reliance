import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/settings", { method: "GET" });
    return NextResponse.json({
      success: true,
      settings: res.data.hotelSettings
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const res = await forwardToBackend("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(body)
    });
    return NextResponse.json({
      success: true,
      message: "Hotel settings updated successfully across website",
      settings: res.data.hotelSettings
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
