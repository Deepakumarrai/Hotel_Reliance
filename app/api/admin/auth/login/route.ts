import { NextResponse } from "next/server";
import { verifyAdminCredentials, getClientIp } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const result = verifyAdminCredentials(username, password, clientIp);

    if (!result.success || !result.session) {
      adminStore.addAuditLog(
        "GUEST_IP",
        "FAILED_LOGIN_ATTEMPT",
        "Auth",
        clientIp,
        `Attempt with user: ${username.substring(0, 5)}***`
      );

      return NextResponse.json(
        { success: false, message: result.error || "Invalid username or password." },
        { status: 401 }
      );
    }

    // Success: Log audit event
    adminStore.addAuditLog(
      result.session.username,
      "ADMIN_LOGIN_SUCCESS",
      "Auth",
      result.session.role,
      `Session issued for IP: ${clientIp}`
    );

    // Create response with secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        name: result.session.name,
        role: result.session.role,
        username: result.session.username,
      },
    });

    const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 24 hours

    response.cookies.set("hr_admin_session", result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}
