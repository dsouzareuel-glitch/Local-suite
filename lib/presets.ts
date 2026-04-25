// Re-export from packages/config for use inside the Next.js app
// This avoids cross-package import issues in the monorepo

export type BusinessType = "salon" | "clinic" | "gym" | "other";
export type Tone = "friendly_hinglish" | "professional" | "energetic" | "premium";

export interface ServicePreset {
  name: string;
  price: number;
  duration_min: number;
  description?: string;
}

export interface IndustryPreset {
  tone: Tone;
  services: ServicePreset[];
  greeting: string;
  priceTemplate: string;
  bookingTemplate: string;
  confirmTemplate: string;
  reminderTemplate: string;
  missedCallTemplate: string;
  faqs: Array<{ q: string; a: string }>;
}

export const INDUSTRY_PRESETS: Record<BusinessType, IndustryPreset> = {
  salon: {
    tone: "friendly_hinglish",
    services: [
      { name: "Haircut", price: 200, duration_min: 30, description: "Classic haircut + styling" },
      { name: "Beard Trim", price: 80, duration_min: 15, description: "Trim + shape + oil" },
      { name: "Facial (Cleanup)", price: 500, duration_min: 45, description: "Deep cleanse + moisturize" },
      { name: "Facial (Glow)", price: 800, duration_min: 60, description: "Premium glow treatment" },
      { name: "Hair Colour", price: 800, duration_min: 90, description: "Global colour + setting" },
    ],
    greeting: "Hi! 👋 Main {{business_name}} ka virtual receptionist hoon. Aaj mai aapki kaise help kar sakta hoon?",
    priceTemplate: "✨ *{{business_name}} Price List:*\n\n{{services_list}}\n\n📅 Booking ke liye reply karein: *BOOK*\n📍 Address: {{address}}",
    bookingTemplate: "Perfect! 📅 Kab aana chahte ho?\n\nToday ya Tomorrow?\n\nOr koi specific date batao 🙏",
    confirmTemplate: "✅ *Appointment Confirmed!*\n\n👤 Name: {{customer_name}}\n💈 Service: {{service_name}}\n🗓 Date: {{date}}\n⏰ Time: {{time}}\n📍 {{address}}\n\nHum aapka wait karenge! 🙏",
    reminderTemplate: "📌 *Reminder!*\n\nKal *{{time}}* baje aapka appointment hai *{{business_name}}* mein.\n💈 Service: {{service_name}}\n📍 {{address}}\n\nMilte hain! 😊",
    missedCallTemplate: "Namasté! 🙏 Aapka call miss ho gaya, maafi chahte hain!\n\n*{{business_name}}* se bol raha hoon.\n\nYahan reply karein — prices janiye, appointment lo! 🤖",
    faqs: [
      { q: "Kitne baje band hota hai?", a: "Hum {{hours}} tak open hain. Sunday ko closed rehte hain." },
      { q: "Walk-in milega?", a: "Haan, walk-in available hai! Lekin appointment pe wait kam hota hai 😊" },
    ],
  },
  clinic: {
    tone: "professional",
    services: [
      { name: "General Consultation", price: 300, duration_min: 20, description: "OPD consultation with doctor" },
      { name: "Follow-up Visit", price: 150, duration_min: 10, description: "Review previous treatment" },
      { name: "Blood Test", price: 500, duration_min: 15, description: "Basic blood panel + CBC" },
      { name: "Physiotherapy Session", price: 600, duration_min: 45, description: "1-on-1 physio session" },
    ],
    greeting: "Hello! 👋 You've reached {{business_name}}. How may I assist you today?",
    priceTemplate: "📋 *{{business_name}} Services & Fees:*\n\n{{services_list}}\n\n🏥 To book, reply with the service name.\n📍 {{address}}",
    bookingTemplate: "I'd be happy to schedule an appointment for you.\n\nPlease share:\n1️⃣ Preferred date\n2️⃣ Preferred time (Morning/Afternoon)\n3️⃣ Patient name",
    confirmTemplate: "✅ *Appointment Confirmed*\n\n👤 Patient: {{customer_name}}\n🏥 Service: {{service_name}}\n📅 {{date}} at {{time}}\n📍 {{address}}\n\nPlease arrive 10 minutes early.",
    reminderTemplate: "🏥 *Appointment Reminder*\n\nDear {{customer_name}}, your appointment at {{business_name}} is tomorrow at {{time}}.\n📍 {{address}}\n\nReply YES to confirm.",
    missedCallTemplate: "Hello! We noticed a missed call from your number.\n\nThis is {{business_name}}. You can book or ask about our services right here on WhatsApp! 🏥",
    faqs: [
      { q: "Is consultation available today?", a: "Yes, OPD is open until {{hours}}. Walk-ins welcome." },
    ],
  },
  gym: {
    tone: "energetic",
    services: [
      { name: "Free Trial (1 Day)", price: 0, duration_min: 120, description: "Experience the gym — completely free!" },
      { name: "Monthly Membership", price: 1200, duration_min: 0, description: "Unlimited gym access" },
      { name: "Quarterly Plan", price: 3000, duration_min: 0, description: "3 months — save ₹600!" },
      { name: "Personal Training", price: 800, duration_min: 60, description: "1-on-1 with certified trainer" },
    ],
    greeting: "💪 Hey! Welcome to {{business_name}}!\n\nReady to transform? 🔥 Main aapki kaise help kar sakta hoon?",
    priceTemplate: "🏋️ *{{business_name}} Membership Plans:*\n\n{{services_list}}\n\n🔥 *TODAY SPECIAL:* Free 1-Day Trial!\n\nJoin karna hai? Reply: *JOIN*",
    bookingTemplate: "Awesome! 💪 Aaj free trial ke liye aana chahte ho?\n\nKoi bhi time batao — slot pakka kar dete hain! 🔥",
    confirmTemplate: "🎉 *You're In!*\n\n💪 Name: {{customer_name}}\n🏋️ {{service_name}}\n📅 {{date}} at {{time}}\n📍 {{address}}\n\nComfortable clothes + water bottle lana! 🔥",
    reminderTemplate: "💪 *Gym Time!*\n\n{{customer_name}}, kal {{time}} baje aapka session hai!\n\nHydrated raho! 🔥",
    missedCallTemplate: "Yo! 💪 {{business_name}} se message aa raha hai!\n\nCall miss hua — sorry!\n\nYahan baat karo — membership, free trial sab yahan! 🔥",
    faqs: [
      { q: "Kya ladies ke liye alag section hai?", a: "Haan! Ladies-only section hai with full privacy. 💪" },
    ],
  },
  other: {
    tone: "friendly_hinglish",
    services: [{ name: "Consultation", price: 500, duration_min: 30, description: "" }],
    greeting: "Hi! 👋 {{business_name}} mein aapka swagat hai. Kaise help kar sakta hoon?",
    priceTemplate: "📋 *Our Services:*\n\n{{services_list}}\n\n📅 Book karne ke liye reply karein.",
    bookingTemplate: "Booking ke liye kab chahiye? Date aur time batayein 🙏",
    confirmTemplate: "✅ *Appointment Confirmed!*\n\n👤 {{customer_name}}\n📅 {{date}} at {{time}}\n📍 {{address}}",
    reminderTemplate: "📌 Reminder: Kal {{time}} baje aapka appointment hai {{business_name}} mein.",
    missedCallTemplate: "Namasté! Aapka call miss hua. {{business_name}} se message aa raha hai. Yahan baat karein! 🙏",
    faqs: [],
  },
};

export function getPreset(type: BusinessType): IndustryPreset {
  return INDUSTRY_PRESETS[type] ?? INDUSTRY_PRESETS.other;
}

export function formatPriceList(services: ServicePreset[]): string {
  return services
    .map((s) => `• *${s.name}* — ₹${s.price}${s.duration_min ? ` (${s.duration_min} min)` : ""}`)
    .join("\n");
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}
