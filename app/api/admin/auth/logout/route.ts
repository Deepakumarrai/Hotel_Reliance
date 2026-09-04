import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeAdminSession, validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("hr_admin_session")?.value;

  if (sessionToken) {
    const session = validateAdminSession(sessionToken);
    if (session) {
      adminStore.addAuditLog(session.username, "ADMIN_LOGOUT", "Auth", session.role, "Session terminated");
    }
    revokeAdminSession(sessionToken);
  }

  const response = NextResponse.json({ success: true, message: "Signed out successfully" });
  response.cookies.delete("hr_admin_session");
  return response;
}
