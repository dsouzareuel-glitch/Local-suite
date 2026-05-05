import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const TEST_BIZ_ID = "00000000-0000-0000-0000-000000000000";

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", TEST_BIZ_ID)
      .single();

    if (error) throw error;

    return NextResponse.json({
      businessName: data.name,
      phone: data.phone,
      city: data.city,
      address: data.address,
      wa_token: data.whatsapp_token,
      phone_number_id: data.phone_number_id,
      openai_key: data.openai_key,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
