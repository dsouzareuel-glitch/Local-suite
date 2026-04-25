import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. Protect Dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Check Subscription Status
    const { data: business } = await supabase
      .from("businesses")
      .select("subscription_status, trial_ends_at")
      .eq("owner_id", session.user.id)
      .single();

    const isTrialing = business?.trial_ends_at && new Date(business.trial_ends_at) > new Date();
    const isActive = business?.subscription_status === "active";

    // If not active and trial expired, redirect to billing
    if (!isActive && !isTrialing && !req.nextUrl.pathname.startsWith("/dashboard/billing")) {
      return NextResponse.redirect(new URL("/dashboard/billing?reason=subscription_required", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
