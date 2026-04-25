import OpenAI from "openai";
import type { IntentType } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_build_key" });

// ─── Intent Detection ─────────────────────────────────────────────────────────
export async function detectIntent(message: string): Promise<IntentType> {
  // Fast keyword matching first (saves API cost)
  const lower = message.toLowerCase();
  if (/price|kitna|rate|charge|cost|paisa|rs|rupee|fees|kitne ka/.test(lower)) return "pricing";
  if (/book|appointment|slot|schedule|time|kab|aana|milna|reserve/.test(lower)) return "booking";
  if (/where|address|location|kahan|direction|map|reach/.test(lower)) return "location";
  if (/review|rating|feedback|experience|star/.test(lower)) return "review";

  // Fall back to OpenAI for ambiguous messages
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 10,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `Classify this WhatsApp message into exactly one word: PRICING, BOOKING, LOCATION, SUPPORT, or UNKNOWN.
Examples:
- "Facial price batao" → PRICING
- "Book karna hai" → BOOKING 
- "Kitna time lagega" → BOOKING
- "Kahan ho aap" → LOCATION
- "Help needed" → SUPPORT
- "Ok thanks" → UNKNOWN`,
      },
      { role: "user", content: message },
    ],
  });

  const result = completion.choices[0].message.content?.trim().toUpperCase();
  const map: Record<string, IntentType> = {
    PRICING: "pricing",
    BOOKING: "booking",
    LOCATION: "location",
    SUPPORT: "support",
    REVIEW: "review",
    UNKNOWN: "unknown",
  };
  return map[result ?? ""] ?? "unknown";
}

// ─── Google Review Reply Generator ───────────────────────────────────────────
export async function generateReviewReply(params: {
  businessName: string;
  businessType: string;
  city: string;
  reviewText: string;
  rating: number;
  tone: string;
  phone: string;
}): Promise<string> {
  const isPositive = params.rating >= 4;
  const toneInstructions: Record<string, string> = {
    professional: "Be formal and professional. Use proper English.",
    friendly_hinglish: "Be warm and casual. You may use light Hinglish (e.g. 'Ji, thank you so much!', 'Zaroor aana again!').",
    energetic: "Be enthusiastic and high energy. Use exclamation marks wisely.",
    premium: "Be refined, eloquent, and premium. Short, confident, classy.",
  };

  const systemPrompt = `You are the owner of ${params.businessName}, a ${params.businessType} in ${params.city}.
Tone: ${toneInstructions[params.tone] ?? toneInstructions.professional}

RULES:
- ${isPositive ? "Thank them specifically for any service mentioned. Make them feel valued." : "Apologize without admitting fault. Offer to make it right via WhatsApp " + params.phone + "."}
- Keep the reply under 200 characters.
- Do NOT sound robotic or templated.
- Do NOT use hashtags or emojis unless tone is friendly_hinglish.
- Start with the customer's sentiment, not a greeting.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 100,
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Reply to this ${params.rating}-star review: "${params.reviewText}"` },
    ],
  });

  return completion.choices[0].message.content?.trim() ?? "Thank you for your feedback!";
}

// ─── Booking Flow Prompts ─────────────────────────────────────────────────────
export async function generateBookingResponse(params: {
  step: "ask_service" | "ask_datetime" | "confirm";
  businessName: string;
  services: Array<{ name: string; price: number; duration_min: number }>;
  customerMessage: string;
  tone: string;
  context?: Record<string, string>;
}): Promise<string> {
  const serviceList = params.services
    .map((s) => `${s.name} (₹${s.price}, ${s.duration_min} min)`)
    .join(", ");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 150,
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `You are a WhatsApp receptionist for ${params.businessName}.
Services: ${serviceList}
Current booking step: ${params.step}
Context: ${JSON.stringify(params.context ?? {})}
Tone: ${params.tone}
Be concise. Under 150 chars. Speak naturally, not robotic.`,
      },
      { role: "user", content: params.customerMessage },
    ],
  });

  return completion.choices[0].message.content?.trim() ?? "";
}
