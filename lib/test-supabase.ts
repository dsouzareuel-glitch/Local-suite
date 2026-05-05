import { createServiceClient } from "./supabase";

async function testConnection() {
  console.log("🔍 Checking Supabase connection...");
  try {
    const supabase = createServiceClient();
    
    // Test fetch
    const { data, error } = await supabase.from("businesses").select("name").limit(1);
    
    if (error) {
      console.error("❌ Supabase Connection Failed:", error.message);
    } else {
      console.log("✅ Supabase Connection: ACTIVE");
      console.log("📊 Found Business in DB:", data?.[0]?.name || "None");
    }
  } catch (e: any) {
    console.error("❌ Runtime Error:", e.message);
  }
}

testConnection();
