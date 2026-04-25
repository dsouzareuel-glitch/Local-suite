import { createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const payload = JSON.parse(body);
  const supabase = createServiceClient();

  switch (payload.event) {
    case "payment_link.paid": {
      const paymentLink = payload.payload.payment_link.entity;
      const businessId = paymentLink.notes?.businessId;

      if (businessId) {
        await supabase
          .from("businesses")
          .update({
            subscription_status: "active",
            is_live: true,
            // Store Razorpay IDs if needed
          })
          .eq("id", businessId);
      }
      break;
    }
    case "payment_link.expired":
    case "payment_link.cancelled": {
      const paymentLink = payload.payload.payment_link.entity;
      const businessId = paymentLink.notes?.businessId;
      if (businessId) {
        await supabase
          .from("businesses")
          .update({ subscription_status: "inactive", is_live: false })
          .eq("id", businessId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
