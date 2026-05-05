const APP_URL = "http://127.0.0.1:3000";

async function simulateChat() {
  console.log("🚀 Starting WhatsApp Bot Simulation...");

  // 1. Automatically fetch your real saved Phone ID
  console.log("🔍 Fetching your saved Phone ID from settings...");
  const settingsRes = await fetch(`${APP_URL}/api/business/settings/get`);
  const settings = await settingsRes.json();
  const phoneId = settings.phone_number_id || "123456789012345";

  console.log(`📡 Using Phone ID: ${phoneId}`);

  // 2. Build the mock payload
  const mockPayload = {
    entry: [{
      changes: [{
        value: {
          metadata: { phone_number_id: phoneId },
          messages: [{
            from: "919000000000",
            id: "wamid." + Math.random().toString(36).substring(7),
            timestamp: Math.floor(Date.now() / 1000).toString(),
            text: { body: "Hi, I want to book an appointment" },
            type: "text"
          }],
          contacts: [{ profile: { name: "John Doe" } }]
        }
      }]
    }]
  };

  console.log("📨 Sending 'Hi' to bot...");
  const res = await fetch(`${APP_URL}/api/whatsapp/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockPayload)
  });

  if (res.ok) {
    console.log("✅ Bot Received message!");
    console.log("👉 ACTION: Check your 'whatsapp_sessions' table in Supabase. You should see John Doe!");
  } else {
    const err = await res.text();
    console.error("❌ Simulation Failed:", err);
  }
}

simulateChat();
