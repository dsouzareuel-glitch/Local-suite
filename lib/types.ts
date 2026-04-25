export type BusinessType = "salon" | "clinic" | "gym" | "other";
export type Tone = "friendly_hinglish" | "professional" | "energetic" | "premium";
export type PlanType = "basic" | "standard" | "premium";
export type IntentType = "pricing" | "booking" | "location" | "support" | "review" | "unknown";
export type ConversationStatus = "active" | "booked" | "lost" | "completed";
export type AppointmentStatus = "confirmed" | "cancelled" | "completed" | "no_show";

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: BusinessType;
  phone_number_id?: string;
  whatsapp_token?: string;
  phone?: string;
  city?: string;
  address?: string;
  working_hours?: Record<string, string>;
  settings?: BusinessSettings;
  plan: PlanType;
  is_live: boolean;
  trial_ends_at?: string;
  created_at: string;
}

export interface BusinessSettings {
  tone: Tone;
  language: string;
  auto_confirm: boolean;
  send_reminders: boolean;
  reminder_hours_before: number;
  missed_call_reply: boolean;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  price: number;
  duration_min: number;
  description?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface Conversation {
  id: string;
  business_id: string;
  customer_wa_id: string;
  customer_name?: string;
  customer_phone?: string;
  last_message?: string;
  intent?: IntentType;
  status: ConversationStatus;
  source: "whatsapp" | "missed_call" | "web";
  booking_step?: string;
  booking_context?: Record<string, unknown>;
  updated_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  business_id: string;
  direction: "inbound" | "outbound";
  content: string;
  wa_message_id?: string;
  is_ai_generated: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  conversation_id?: string;
  service_id?: string;
  service?: Service;
  customer_name: string;
  customer_wa_id: string;
  start_time: string;
  end_time?: string;
  status: AppointmentStatus;
  reminder_sent: boolean;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  totalConversations: number;
  activeLeads: number;
  bookingsToday: number;
  bookingsThisWeek: number;
  revenueThisWeek: number;
  responseRate: number;
  missedCallsRescued: number;
}
