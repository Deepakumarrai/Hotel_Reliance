import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";

const officialPrices = {
  single: { base: 2310, baseNetPrice: 2200, gstRate: 5, gstAmount: 110, weekend: 2310, peak: 2310, extraAdult: 0, extraBed: 300 },
  double: { base: 2625, baseNetPrice: 2500, gstRate: 5, gstAmount: 125, weekend: 2625, peak: 2625, extraAdult: 0, extraBed: 300 },
  triple: { base: 3360, baseNetPrice: 3200, gstRate: 5, gstAmount: 160, weekend: 3360, peak: 3360, extraAdult: 0, extraBed: 300 },
  family: { base: 3360, baseNetPrice: 3200, gstRate: 5, gstAmount: 160, weekend: 3360, peak: 3360, extraAdult: 0, extraBed: 300 },
};

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/pricing", { method: "GET" });
    const prices = res.data?.prices;
    if (prices && (prices.single?.base === 2310 || prices.single?.baseNetPrice === 2200)) {
      return NextResponse.json({ success: true, prices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    return NextResponse.json({ success: true, prices: officialPrices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (err: any) {
    return NextResponse.json({ success: true, prices: officialPrices }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}


