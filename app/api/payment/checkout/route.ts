import { getRazorpay } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { planId, businessId } = await req.json();
    
    const amounts: Record<string, number> = {
      starter: 49900, // ₹499.00 (in paise)
      professional: 149900, // ₹1,499.00
      enterprise: 499900, // ₹4,999.00
    };

    const amount = amounts[planId];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Get lazy-initialized Razorpay client
    const razorpay = getRazorpay();

    // Create a Razorpay Payment Link
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount,
      currency: "INR",
      accept_partial: false,
      description: `LocalSuite ${planId.toUpperCase()} Subscription`,
      customer: {
        name: business.name,
        email: business.owner_email || "test@example.com",
        contact: business.phone || "+919999999999",
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        businessId: business.id,
        planId: planId,
      },
      callback_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=payment_received`,
      callback_method: "get",
    });

    return NextResponse.json({ url: paymentLink.short_url });
  } catch (error) {
    console.error("Razorpay checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
