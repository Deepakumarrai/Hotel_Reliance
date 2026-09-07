import { NextRequest, NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const res = await forwardToBackend("/rooms/check-availability", {
      method: "POST",
      body: JSON.stringify(body)
    });

    return NextResponse.json(res.data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `/rooms/check-availability${queryString ? `?${queryString}` : ""}`;

    const res = await forwardToBackend(endpoint, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(searchParams.entries()))
    });

    return NextResponse.json(res.data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
