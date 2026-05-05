import { createServiceClient } from "./supabase";

async function checkDatabase() {
  console.log("📊 --- DATABASE DIAGNOSTIC ---");
  const supabase = createServiceClient();
  
  // 1. Check Businesses
  const { data: businesses } = await supabase.from("businesses").select("id, name, phone_number_id");
  console.log("🏢 Businesses found:", businesses?.length || 0);
  businesses?.forEach(b => console.log(`   - [${b.id}] ${b.name} (Phone ID: ${b.phone_number_id})`));

  // 2. Check Sessions
  const { data: sessions } = await supabase.from("whatsapp_sessions").select("*");
  console.log("💬 WhatsApp Sessions found:", sessions?.length || 0);
  sessions?.forEach(s => console.log(`   - Session for ${s.customer_phone} (Business: ${s.business_id})`));
}

checkDatabase();
