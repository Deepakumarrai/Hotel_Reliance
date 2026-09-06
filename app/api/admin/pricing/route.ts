import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await forwardToBackend("/admin/pricing", { method: "GET" });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    // Check if batch update
    if (body.allPrices && typeof body.allPrices === "object") {
      for (const [roomSlug, prices] of Object.entries(body.allPrices as Record<string, any>)) {
        await forwardToBackend("/admin/pricing", {
          method: "PUT",
          body: JSON.stringify({ roomSlug, prices })
        });
      }
      const refreshed = await forwardToBackend("/admin/pricing", { method: "GET" });
      return NextResponse.json(refreshed.data, { status: refreshed.status });
    }

    const res = await forwardToBackend("/admin/pricing", {
      method: "PUT",
      body: JSON.stringify({
        roomSlug: body.roomType,
        prices: {
          base: body.base,
          weekend: body.weekend,
          peak: body.peak,
          extraAdult: body.extraAdult,
          extraBed: body.extraBed
        }
      })
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
