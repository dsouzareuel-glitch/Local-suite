import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    // In a real app, we'd get the business ID from the session.
    // For now, we update the universal test business we just created.
    const TEST_BIZ_ID = "00000000-0000-0000-0000-000000000000";

    const { error } = await supabase
      .from("businesses")
      .update({
        name: body.businessName,
        phone: body.phone,
        city: body.city,
        address: body.address,
        whatsapp_token: body.wa_token,
        phone_number_id: body.phone_number_id,
        openai_key: body.openai_key,
      })
      .eq("id", TEST_BIZ_ID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
