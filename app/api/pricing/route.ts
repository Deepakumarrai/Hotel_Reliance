import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

const officialPrices = {
  single: { base: 2403.32, weekend: 2403.32, peak: 2403.32, extraAdult: 0, extraBed: 300 },
  double: { base: 2731.05, weekend: 2731.05, peak: 2731.05, extraAdult: 0, extraBed: 300 },
  triple: { base: 3495.74, weekend: 3495.74, peak: 3495.74, extraAdult: 0, extraBed: 300 },
};

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/pricing", { method: "GET" });
    const prices = res.data?.prices;
    if (prices && (prices.single?.base === 2403.32 || prices.deluxe?.base === 2403.32)) {
      return NextResponse.json({ success: true, prices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    return NextResponse.json({ success: true, prices: officialPrices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: true, prices: officialPrices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}

