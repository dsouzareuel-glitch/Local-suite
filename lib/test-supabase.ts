import { createServiceClient } from "./supabase";

async function testConnection() {
  const supabase = createServiceClient();
  console.log("🔍 Checking Supabase connection...");
  
  const { data, error } = await supabase.from("businesses").select("count");
  
  if (error) {
    console.error("❌ Supabase Error:", error.message);
  } else {
    console.log("✅ Supabase Connection: ACTIVE");
    console.log("📊 Businesses count:", data);
  }
}

testConnection();
