import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    enquiries: adminStore.banquetEnquiries,
  });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = validateAdminSession(cookieStore.get("hr_admin_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, notes } = await request.json();
    const enquiry = adminStore.banquetEnquiries.find((e) => e.id === id);
    if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

    const prev = enquiry.status;
    if (status) enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;

    adminStore.addAuditLog(session.username, "UPDATE_BANQUET_ENQUIRY", "Banquet", id, status, prev);

    return NextResponse.json({ success: true, enquiry });
  } catch {
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
