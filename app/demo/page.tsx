"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, Users, BarChart3, Send, ArrowRight, Sparkles, CheckCircle2, Share2, Copy, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

type Message = { dir: "in" | "out"; text: string; ts: string };
type Appointment = { name: string; service: string; time: string; status: string };

const FLOWS: Record<string, { trigger: RegExp; reply: string; action?: string }[]> = {
  default: [
    {
      trigger: /price|prices|kitna|rate|charge|cost|paisa|rs|rupee|fees|kitne ka|kitni|bata/i,
      reply: "✨ *Glam Studios Price List:*\n\n• *Haircut* — ₹200 (30 min)\n• *Beard Trim* — ₹80 (15 min)\n• *Facial (Cleanup)* — ₹500 (45 min)\n• *Facial (Glow)* — ₹800 (60 min)\n• *Hair Colour* — ₹800 (90 min)\n\n📅 Booking ke liye reply: *BOOK*\n📍 Shop 5, Hill Road, Bandra",
    },
    {
      trigger: /book|apt|appointment|slot|schedule|time|kab|aana|milna|reserve/i,
      reply: "Perfect! 📅 Kab aana chahte ho?\n\nToday ya Tomorrow?\n\nOr koi specific date batao 🙏",
      action: "booking_start",
    },
    {
      trigger: /tomorrow|kal|aaj|today|monday|tuesday|4pm|3pm|11am|morning|evening/i,
      reply: "Sure! Aur kaunsi service chahiye?\n\n1️⃣ Haircut (₹200)\n2️⃣ Beard Trim (₹80)\n3️⃣ Facial Cleanup (₹500)\n4️⃣ Facial Glow (₹800)",
      action: "booking_service",
    },
    {
      trigger: /1|haircut|baal|hair cut/i,
      reply: "✅ *Appointment Confirmed!*\n\n💈 Service: Haircut\n📅 Tomorrow at 4:00 PM\n📍 Shop 5, Hill Road, Bandra West\n\nHum aapka wait karenge! Agar change hoga toh yahan message karo. 🙏",
      action: "booking_done",
    },
    {
      trigger: /2|beard|darhi/i,
      reply: "✅ *Appointment Confirmed!*\n\n✂️ Service: Beard Trim\n📅 Tomorrow at 4:00 PM\n📍 Shop 5, Hill Road, Bandra West\n\nSee you tomorrow! 😊",
      action: "booking_done",
    },
    {
      trigger: /3|4|facial|face|glow|cleanup/i,
      reply: "✅ *Appointment Confirmed!*\n\n💆 Service: Facial\n📅 Tomorrow at 4:00 PM\n📍 Shop 5, Hill Road, Bandra West\n\nRelax karo — kal milte hain! 😊",
      action: "booking_done",
    },
    {
      trigger: /where|address|location|kahan|direction|map|reach/i,
      reply: "📍 *Glam Studios*\nShop 5, Hill Road, Bandra West, Mumbai 400050\n\n🗺 Google Maps: maps.google.com/?q=Glam+Studios+Bandra\n\n🕘 Timings: Mon-Sat 9AM-6PM",
    },
    {
      trigger: /hi|hello|helo|hey|namaste|namasté|jai hind/i,
      reply: "Hi! 👋 Main Glam Studios ka virtual receptionist hoon.\n\nAaj kaise help kar sakta hoon?\n\n1️⃣ Prices\n2️⃣ Appointment Book\n3️⃣ Address\n4️⃣ Other",
    },
  ],
};

function getReply(text: string): { reply: string; action?: string } {
  for (const flow of FLOWS.default) {
    if (flow.trigger.test(text)) return { reply: flow.reply, action: flow.action };
  }
  return { reply: "Haan ji! 😊 Aap prices, appointment, ya address ke baare mein puchh sakte hain. Kya chahiye aapko?" };
}

function now() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { dir: "out", text: "Hi! 👋 Main Glam Studios ka virtual receptionist hoon. Aaj kaise help kar sakta hoon?\n\n1️⃣ Prices\n2️⃣ Appointment Book\n3️⃣ Address", ts: "10:00 AM" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState(3);
  const [conversations, setConversations] = useState(1);
  const [copied, setCopied] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");

    // Add customer message
    const inMsg: Message = { dir: "in", text: msg, ts: now() };
    setMessages((m) => [...m, inMsg]);
    setLeads((l) => l + 1);

    // Show typing indicator
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);

    // Get bot reply
    const { reply, action } = getReply(msg);
    const outMsg: Message = { dir: "out", text: reply, ts: now() };
    setMessages((m) => [...m, outMsg]);

    // Handle side effects
    if (action === "booking_done") {
      setAppointments((a) => [
        { name: "Customer", service: "Service", time: "Tomorrow 4:00 PM", status: "confirmed" },
        ...a,
      ]);
      setConversations((c) => c + 1);
      
      // Fire confetti celebration on successful booking!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#3B82F6', '#8B5CF6']
      });
    }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const QUICK_MSGS = ["Facial price batao", "Book karna hai", "Kahan ho aap?", "Hi"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between glass">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg wa-gradient flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">LocalSuite</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="badge-green text-sm py-1.5 px-4">
            <Sparkles className="w-3 h-3" />
            Live Sales Demo
          </div>
          <button id="share-demo" onClick={shareLink} className="btn-secondary py-2 px-3 text-sm">
            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        {/* Demo banner */}
        <div className="text-center py-4 px-6 border-b border-white/5" style={{ background: "rgba(6, 182, 212, 0.04)" }}>
          <p className="text-sm text-gray-400">
            <span className="text-[#06B6D4] font-semibold">Sales Demo Mode</span> — Type any message below to see the AI bot respond in real-time. Show this to your client on their phone! 📱
          </p>
        </div>

        <div className="flex-1 grid lg:grid-cols-5 gap-0">
          {/* Left: WhatsApp Chat */}
          <div className="lg:col-span-3 flex flex-col border-r border-white/5">
            {/* WA Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5" style={{ background: "rgba(6, 182, 212, 0.06)" }}>
              <div className="w-10 h-10 rounded-full wa-gradient flex items-center justify-center text-white font-bold text-sm">G</div>
              <div>
                <div className="font-semibold text-sm">Glam Studios 💈</div>
                <div className="text-xs text-[#06B6D4] flex items-center gap-1.5">
                  <span className="live-dot w-1.5 h-1.5" />
                  AI Receptionist Active — Online 24/7
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ background: "rgba(0,0,0,0.2)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.dir === "in" ? "justify-end" : "justify-start"} animate-slide-in`}>
                  <div>
                    <div className={msg.dir === "out" ? "wa-bubble-in" : "wa-bubble-out"} style={{ whiteSpace: "pre-line" }}>
                      {msg.text}
                    </div>
                    <div className={`text-xs text-gray-600 mt-0.5 ${msg.dir === "in" ? "text-right" : ""}`}>{msg.ts}</div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start animate-slide-in">
                  <div className="wa-bubble-in flex items-center gap-1 py-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {QUICK_MSGS.map((m) => (
                <button key={m} onClick={() => send(m)} className="flex-shrink-0 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 text-gray-300 transition-colors border border-white/10">
                  {m}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input
                id="demo-chat-input"
                className="input-field flex-1 py-2 text-sm"
                placeholder='Type as a customer (e.g. "facial price?")...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button id="demo-send" onClick={() => send()} className="btn-primary py-2 px-4">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Dashboard live view */}
          <div className="lg:col-span-2 flex flex-col p-4 gap-4 overflow-y-auto">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Owner's Dashboard — Live View</div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Total Messages", value: messages.length, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Conversations", value: conversations, icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
                  { label: "Bookings", value: appointments.length, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { label: "Response Rate", value: "100%", icon: BarChart3, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>
                      <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                    </div>
                    <div className="text-xl font-bold mt-2">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Live feed */}
              <div className="card mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="live-dot" />
                  <span className="text-xs font-semibold text-gray-400">Live Conversation</span>
                </div>
                <div className="space-y-1.5">
                  {messages.slice(-4).map((msg, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`flex-shrink-0 rounded px-1.5 py-0.5 font-medium ${msg.dir === "in" ? "bg-blue-500/20 text-blue-400" : "bg-[#06B6D4]/20 text-[#06B6D4]"}`}>
                        {msg.dir === "in" ? "Customer" : "Bot"}
                      </span>
                      <span className="text-gray-400 truncate">{msg.text.split("\n")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments */}
              <div className="card">
                <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Appointments Booked
                </div>
                {appointments.length === 0 ? (
                  <div className="text-xs text-gray-600 text-center py-4">
                    Book a slot in the chat to see it appear here! ✨
                  </div>
                ) : (
                  <div className="space-y-2">
                    {appointments.map((apt, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 animate-slide-in">
                        <CheckCircle2 className="w-4 h-4 text-[#06B6D4] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold">{apt.service}</div>
                          <div className="text-xs text-gray-400">{apt.time}</div>
                        </div>
                        <span className="badge-blue text-xs">{apt.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="card border border-[#06B6D4]/30 mt-auto" style={{ background: "rgba(6, 182, 212, 0.05)" }}>
              <div className="text-sm font-semibold mb-2">Impressed? 😊</div>
              <p className="text-xs text-gray-400 mb-3">Yahi system aapke salon mein bhi lag sakta hai. ₹50/day. 30 seconds setup.</p>
              <Link href="/onboarding" className="btn-primary w-full justify-center py-2.5 text-sm">
                Ab shuru karo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
