import { getAvailableSlots } from "@/lib/booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");
  const date = searchParams.get("date");

  if (!businessId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(businessId, date);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Failed to fetch slots:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
