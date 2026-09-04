import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("hr_admin_session")?.value;
  const session = validateAdminSession(sessionToken);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      name: session.name,
      role: session.role,
    },
  });
}
