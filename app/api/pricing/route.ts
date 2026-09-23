import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/pricing", { method: "GET" });
    const prices = res.data?.prices;
    if (prices && typeof prices === "object" && Object.keys(prices).length > 0) {
      return NextResponse.json({ success: true, prices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    // Backend returned empty pricing — return error so frontend knows to use cache
    return NextResponse.json({ success: false, error: "No pricing data available from backend" }, { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch pricing" }, { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
