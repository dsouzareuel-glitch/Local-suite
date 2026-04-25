import { NextRequest, NextResponse } from "next/server";
import { generateReviewReply } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, businessType, city, reviewText, rating, tone, phone } = body;

    if (!reviewText || !businessName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reply = await generateReviewReply({
      businessName,
      businessType: businessType ?? "business",
      city: city ?? "India",
      reviewText,
      rating: rating ?? 5,
      tone: tone ?? "friendly_hinglish",
      phone: phone ?? "",
    });

    return NextResponse.json({ reply, charCount: reply.length });
  } catch (error) {
    console.error("Review reply error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
