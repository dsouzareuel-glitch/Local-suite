import { createServiceClient } from "@/lib/supabase";
import { getGoogleOAuth2Client } from "@/lib/calendar";
import { encryptToken } from "@/lib/encryption";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // Optional but recommended

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  try {
    const oauth2Client = getGoogleOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.refresh_token) {
      console.warn("No refresh token received. Ensure 'access_type: offline' and 'prompt: consent' are used.");
    }

    // We need to associate this with a user. 
    // In a real app, you'd use the Supabase session.
    // For this implementation, we assume the user is logged in via Supabase first.
    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }

    // Store the refresh token securely
    const updates: any = {};
    if (tokens.refresh_token) {
      updates.google_refresh_token = encryptToken(tokens.refresh_token);
    }
    
    const { error: dbError } = await supabase
      .from("businesses")
      .update(updates)
      .eq("owner_id", user.id);

    if (dbError) throw dbError;

    return NextResponse.redirect(new URL("/dashboard/settings?success=google_connected", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=sync_failed", request.url));
  }
}
