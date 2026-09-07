import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/admin/backendClient";
import { staffData } from "@/data/staff";

export async function GET() {
  try {
    const res = await forwardToBackend("/admin/staff", { method: "GET" });
    if (res.data?.staff && Array.isArray(res.data.staff) && res.data.staff.length > 0) {
      return NextResponse.json({
        status: "success",
        staff: res.data.staff
      });
    }

    return NextResponse.json({
      status: "success",
      staff: staffData
    });
  } catch (error) {
    return NextResponse.json({
      status: "success",
      staff: staffData
    });
  }
}
