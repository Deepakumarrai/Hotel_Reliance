import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const res = await forwardToBackend(`/admin/pricing/seasonal/${id}`, { method: "DELETE" });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
