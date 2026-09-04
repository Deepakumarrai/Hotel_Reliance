import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession, getSecurityStats } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = getSecurityStats();

  return NextResponse.json({
    stats,
    auditLogs: adminStore.auditLogs,
  });
}
