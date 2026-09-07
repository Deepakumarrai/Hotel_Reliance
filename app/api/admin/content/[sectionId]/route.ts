import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sectionId } = await params;
    const res = await forwardToBackend(`/admin/content/${sectionId}`, { method: "GET" });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sectionId } = await params;
    const body = await request.json();
    const res = await forwardToBackend(`/admin/content/${sectionId}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
