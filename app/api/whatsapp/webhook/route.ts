import { NextRequest, NextResponse } from "next/server";
import { handleWhatsAppMessage } from "@/lib/bot";

// ─── GET: Meta Webhook Verification ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ─── POST: Incoming WhatsApp Messages ────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log("🚨 SIREN: WEBHOOK HIT! Incoming WhatsApp payload...");
  try {
    const body = await req.json();
    console.log("📦 Payload detected for Phone ID:", body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id);
    
    // Delegate to the bot state machine
    await handleWhatsAppMessage(body);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
