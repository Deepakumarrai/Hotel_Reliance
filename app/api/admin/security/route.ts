import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession, getSecurityStats } from "@/lib/admin/auth";
import { forwardToBackend } from "@/lib/admin/backendClient";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = getSecurityStats();

  try {
    const res = await forwardToBackend("/admin/security", { method: "GET" });
    return NextResponse.json({
      stats,
      auditLogs: res.data.auditLogs || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
