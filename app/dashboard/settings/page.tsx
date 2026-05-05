"use client";
import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, ExternalLink, CheckCircle, Calendar, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    city: "",
    address: "",
    tone: "friendly_hinglish",
    language: "hinglish",
    auto_confirm: true,
    send_reminders: true,
    reminder_hours: "16",
    missed_call_reply: true,
    wa_token: "",
    phone_number_id: "",
    openai_key: "",
  });

  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch current settings on load
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/business/settings/get");
        if (res.ok) {
          const data = await res.json();
          // Sanitize data: convert nulls to empty strings to prevent React crash
          const sanitizedData = {
            businessName: data.businessName || "",
            phone: data.phone || "",
            city: data.city || "",
            address: data.address || "",
            wa_token: data.wa_token || "",
            phone_number_id: data.phone_number_id || "",
            openai_key: data.openai_key || "",
            tone: data.tone || "friendly_hinglish",
          };
          setForm(prev => ({ ...prev, ...sanitizedData }));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/business/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      toast.success("Settings synced to Supabase! 💎");
      setTimeout(() => setSaved(false), 2000);
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[--brand-gold] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-[--brand-gold]">Settings</h1>
        <p className="text-sm text-[--muted]">Manage your business profile, bot behavior, and integrations.</p>
      </div>

      {/* Business Details */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-white">Business Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Business Name</label>
            <input id="setting-name" className="input-field" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
            <input id="setting-phone" className="input-field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">City</label>
            <input id="setting-city" className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Address</label>
            <textarea className="input-field resize-none text-white" rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Calendar */}
        <div className="card space-y-4 border border-[--brand-gold]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[--brand-gold]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[--brand-gold]" />
            </div>
            <h2 className="font-semibold text-[--foreground]">Calendar Sync</h2>
          </div>
          <p className="text-xs text-[--muted]">Connect your Google Calendar to prevent double-bookings automatically.</p>
          <a href="/api/auth/google/connect" className="btn-primary w-full py-2 text-xs">
            <ExternalLink className="w-3 h-3" />
            Connect Google Calendar
          </a>
        </div>

        {/* Stripe Billing */}
        <div className="card space-y-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="font-semibold text-[--foreground]">Billing & Plan</h2>
          </div>
          <p className="text-xs text-[--muted]">Your current plan: <span className="text-blue-400 font-bold uppercase">Professional</span></p>
          <button className="btn-secondary w-full py-2 text-xs">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Bot Behavior */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[--brand-gold]" />
          <h2 className="font-semibold text-white">Bot Behavior</h2>
        </div>
        <div>
          <label className="block text-xs text-[--muted] mb-1.5 text-white">Reply Tone</label>
          <select id="setting-tone" className="input-field text-white" value={form.tone} onChange={(e) => update("tone", e.target.value)}>
            <option value="friendly_hinglish">Friendly Hinglish (Recommended)</option>
            <option value="professional">Professional English</option>
            <option value="energetic">Energetic (Gyms)</option>
            <option value="premium">Premium (Luxury)</option>
          </select>
        </div>
        <div className="space-y-3">
          {[
            { key: "auto_confirm", label: "Auto-confirm bookings", desc: "Bot automatically confirms without manual approval" },
            { key: "send_reminders", label: "Send appointment reminders", desc: "WhatsApp reminder sent 16 hours before" },
            { key: "missed_call_reply", label: "Missed call → WhatsApp", desc: "Auto-message on missed calls" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-[--foreground]">{item.label}</div>
                <div className="text-xs text-[--muted]">{item.desc}</div>
              </div>
              <button
                id={`toggle-${item.key}`}
                onClick={() => update(item.key, !form[item.key as keyof typeof form])}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${form[item.key as keyof typeof form] ? "bg-[--brand-gold]" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${form[item.key as keyof typeof form] ? "left-6" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="card space-y-4 border border-[--brand-gold]/20" style={{ background: "rgba(212,175,55,0.04)" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[--foreground]">WhatsApp Infrastructure Setup</h2>
          <button onClick={() => setShowKeys(!showKeys)} className="text-xs text-gray-400 flex items-center gap-1">
            {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showKeys ? "Hide" : "Show"}
          </button>
        </div>

        <div className="rounded-xl p-3 border border-blue-500/20 text-xs bg-blue-500/5 space-y-1">
          <div className="font-semibold text-blue-400">Webhook Setup Guide:</div>
          <div className="text-gray-400">1. Go to <a href="https://developers.facebook.com" target="_blank" className="text-blue-400 underline">Meta Developer Portal</a></div>
          <div className="text-gray-400">2. WhatsApp → Configuration → Webhook URL:</div>
          <div className="font-mono text-xs bg-white/5 rounded p-2 text-green-400 break-all">{typeof window !== "undefined" ? window.location.origin : "https://your-app.vercel.app"}/api/whatsapp/webhook</div>
          <div className="text-gray-400">3. Verify Token: <span className="font-mono text-green-400">localsuite-verify-secret-2024</span></div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Meta WhatsApp Token</label>
            <input
              id="setting-wa-token"
              className="input-field font-mono text-sm text-white"
              type={showKeys ? "text" : "password"}
              placeholder="EAAxxxxxx..."
              value={form.wa_token}
              onChange={(e) => update("wa_token", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">WhatsApp Phone Number ID</label>
            <input
              id="setting-phone-id"
              className="input-field font-mono text-sm text-white"
              type={showKeys ? "text" : "password"}
              placeholder="123456789012345"
              value={form.phone_number_id}
              onChange={(e) => update("phone_number_id", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">OpenAI API Key</label>
            <input
              id="setting-openai"
              className="input-field font-mono text-sm text-white"
              type={showKeys ? "text" : "password"}
              placeholder="sk-proj-..."
              value={form.openai_key}
              onChange={(e) => update("openai_key", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button id="save-settings" onClick={save} disabled={saving} className="btn-primary py-2.5 px-6">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        <button className="btn-secondary py-2.5 px-6">Cancel</button>
      </div>
    </div>
  );
}

