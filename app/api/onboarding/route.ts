import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { INDUSTRY_PRESETS } from "@/lib/presets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, businessType, phone, city, address, ownerId } = body;

    if (!businessName || !businessType || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = createServiceClient();
    const preset = INDUSTRY_PRESETS[businessType as keyof typeof INDUSTRY_PRESETS] ?? INDUSTRY_PRESETS.other;

    // Create business
    const { data: business, error: bizError } = await db
      .from("businesses")
      .insert({
        owner_id: ownerId,
        name: businessName,
        type: businessType,
        phone,
        city,
        address,
        plan: "basic",
        is_live: false,
        settings: {
          tone: preset.tone,
          language: "hinglish",
          auto_confirm: true,
          send_reminders: true,
          reminder_hours_before: 16,
          missed_call_reply: true,
        },
      })
      .select()
      .single();

    if (bizError || !business) {
      throw new Error(bizError?.message ?? "Failed to create business");
    }

    // Auto-create services from preset
    const serviceRows = preset.services.map((s, i) => ({
      business_id: business.id,
      name: s.name,
      price: s.price,
      duration_min: s.duration_min,
      description: s.description ?? "",
      sort_order: i,
      is_active: true,
    }));

    await db.from("services").insert(serviceRows);

    return NextResponse.json({
      success: true,
      business,
      servicesCreated: serviceRows.length,
      message: `${businessName} is ready! ${serviceRows.length} services pre-loaded.`,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
