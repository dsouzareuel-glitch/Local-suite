"use client";
import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare, Zap, Star, TrendingUp, Clock, Shield,
  ChevronRight, Bot, Calendar, Users, BarChart3, Phone,
  CheckCircle, ArrowRight, Sparkles, IndianRupee
} from "lucide-react";

const PRICING_TIERS = [
  {
    name: "Basic",
    price: "₹1,499",
    period: "/month",
    anchor: "Less than a part-time sweeper",
    hook: "Phone uthana band karo",
    features: ["WhatsApp AI Receptionist", "Price queries answered", "Basic lead capture", "5 services", "Email support"],
    cta: "Start Free Trial",
    popular: false,
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
  },
  {
    name: "Standard",
    price: "₹2,999",
    period: "/month",
    anchor: "1 day's salon revenue",
    hook: "Khaali time automatic bhar do",
    features: ["Everything in Basic", "Appointment booking flow", "Automated reminders", "25 services", "Lead analytics", "WhatsApp support"],
    cta: "Start Free Trial",
    popular: true,
    color: "from-green-500/20 to-emerald-600/10",
    border: "border-green-500/40",
  },
  {
    name: "Premium",
    price: "₹5,999",
    period: "/month",
    anchor: "Only for those scaling",
    hook: "Jaise bologe waise message karega",
    features: ["Everything in Standard", "Custom AI scripts", "Google Review reply generator", "Unlimited services", "Multi-location", "Priority WhatsApp support", "Missed call → WhatsApp trigger"],
    cta: "Start Free Trial",
    popular: false,
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Intent Detection",
    desc: "Message classify hota hai — Price, Booking, ya Support. 1 second mein correct reply.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Calendar,
    title: "Auto Booking",
    desc: "Customer WhatsApp karta hai → Bot date poochta hai → Appointment confirm. Zero effort.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Phone,
    title: "Missed Call Rescue",
    desc: "Call utha nahi? Bot turant WhatsApp karta hai. Every missed call = a recovered lead.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Star,
    title: "Review Reply AI",
    desc: "Google reviews ke liye AI-generated replies. Paste karo, copy karo, post karo.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    desc: "Real-time leads, bookings, revenue — sab ek jagah. Analytics without the analysis.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Zap,
    title: "30-Second Setup",
    desc: "Name daalo, type choose karo, WhatsApp number dalo. Done. Bot live ho jaata hai.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

const DEMO_MESSAGES = [
  { from: "customer", text: "Facial price batao", delay: 0 },
  { from: "bot", text: "✨ Glam Studios Prices:\n• Facial (Cleanup) — ₹500 (45 min)\n• Facial (Glow) — ₹800 (60 min)\n\nBooking ke liye reply: BOOK 📅", delay: 1000 },
  { from: "customer", text: "Book", delay: 2500 },
  { from: "bot", text: "Perfect! 📅 Kab aana chahte ho?\n\nToday ya Tomorrow? 🙏", delay: 3500 },
  { from: "customer", text: "tomorrow 4pm", delay: 5000 },
  { from: "bot", text: "✅ Appointment Confirmed!\n\n💆 Facial (Glow)\n📅 Tomorrow at 4:00 PM\n📍 Shop 5, Hill Road, Bandra\n\nMilte hain! 😊", delay: 6000 },
];

function AnimatedChat() {
  const [visible, setVisible] = useState(1);

  useState(() => {
    DEMO_MESSAGES.forEach((msg, i) => {
      setTimeout(() => setVisible(i + 1), msg.delay + 500);
    });
  });

  return (
    <div className="flex flex-col gap-2 p-4 h-full overflow-hidden">
      {DEMO_MESSAGES.slice(0, visible).map((msg, i) => (
        <div
          key={i}
          className={`${msg.from === "customer" ? "wa-bubble-in" : "wa-bubble-out"} animate-slide-in`}
          style={{ whiteSpace: "pre-line" }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg wa-gradient flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">LocalSuite</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">Dashboard</Link>
            <Link href="/onboarding" className="btn-primary text-sm py-2 px-4">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[200px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8 animate-slide-in">
              <div className="badge-green w-fit">
                <span className="live-dot" />
                ₹2,000/month receptionist is live
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Aapka WhatsApp{" "}
                <span className="gradient-text">AI Receptionist</span>
                <br />jab aap soyenge tab bhi kaam karega
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                Salon, clinic, gym — jo bhi ho, yeh bot price queries answer karta hai,
                appointments book karta hai, aur leads capture karta hai. <strong className="text-white">24/7. Automatically.</strong>
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/onboarding" className="btn-primary text-base py-3 px-8">
                  30-Second Setup
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/demo" className="btn-secondary text-base py-3 px-8">
                  Live Demo
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>3-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Live chat demo */}
            <div className="relative animate-fade-in" id="demo">
              <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* WhatsApp header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10" style={{ background: "rgba(37,211,102,0.08)" }}>
                  <div className="w-10 h-10 rounded-full wa-gradient flex items-center justify-center text-white font-bold">G</div>
                  <div>
                    <div className="font-semibold text-sm">Glam Studios 💈</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <span className="live-dot w-1.5 h-1.5" />
                      AI active
                    </div>
                  </div>
                  <div className="ml-auto badge-green text-xs">LIVE</div>
                </div>
                <div className="h-80 overflow-y-auto">
                  <AnimatedChat />
                </div>
                {/* Input bar */}
                <div className="flex items-center gap-3 p-3 border-t border-white/10 bg-white/2">
                  <div className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-500">Message...</div>
                  <div className="w-9 h-9 rounded-full wa-gradient flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              {/* Floating appointment badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-3 border border-white/10 shadow-xl animate-slide-in" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-xs font-semibold text-green-400">New Booking!</div>
                    <div className="text-xs text-gray-400">Tomorrow 4pm • Facial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg messages answered/day", value: "47", icon: MessageSquare },
              { label: "Leads captured automatically", value: "93%", icon: Users },
              { label: "Setup time", value: "30 sec", icon: Zap },
              { label: "Cost per day", value: "₹50", icon: IndianRupee },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <stat.icon className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-green w-fit mx-auto mb-4">Features</div>
            <h2 className="text-4xl font-bold">Sab kuch automatic</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Aap apna kaam karo. Bot sab baaki handle kar lega.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card glass-hover group">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-green w-fit mx-auto mb-4">Pricing</div>
            <h2 className="text-4xl font-bold">Simple, fair pricing</h2>
            <p className="text-gray-400 mt-3">3-din free trial. Koi hidden charges nahi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border bg-gradient-to-b ${tier.color} ${tier.border} relative flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-green text-xs py-1 px-3 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-sm text-gray-400 mb-1">{tier.name}</div>
                  <div className="text-4xl font-bold">{tier.price}<span className="text-base font-normal text-gray-400">{tier.period}</span></div>
                  <div className="text-xs text-gray-500 mt-1">{tier.anchor}</div>
                  <div className="mt-3 text-sm font-medium text-gray-200">"{tier.hook}"</div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className={tier.popular ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
                >
                  {tier.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Doubts? Hum samajhte hain.</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "\"Mere paas staff hai already.\"",
                a: "Bilkul! Lekin staff kya karta hai? Call attend karta hai ya customer ke baal dho raha hai? Jab woh dho raha hota hai, phone bajta hai aur customer kho jaata hai. Yeh system ₹50/day mein 24/7 phone uthata hai.",
              },
              {
                q: "\"Bahut mehnga hai.\"",
                a: "Sir, ek haircut ₹400 ka hai. Agar yeh system mahine mein sirf 4 missed calls ko booking mein badal de, toh aapka paisa vasool. Baaki sab profit free hai. 3 din free try karo — no card needed.",
              },
              {
                q: "\"Mujhe technology samajh nahi aata.\"",
                a: "Exactly kyon yeh banaya hai! 30 seconds mein setup. Koi coding nahi, koi training nahi. Bas name daalo aur number — bot live ho jaata hai. Humara support WhatsApp pe hi hai.",
              },
            ].map((item) => (
              <div key={item.q} className="card glass-hover">
                <div className="font-semibold text-white mb-2">{item.q}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card border border-green-500/20" style={{ background: "rgba(37,211,102,0.05)" }}>
            <div className="text-4xl mb-4">💈</div>
            <h2 className="text-3xl font-bold mb-3">Ready to stop missing calls?</h2>
            <p className="text-gray-400 mb-8">30 seconds. No credit card. 3-day free trial.</p>
            <Link href="/onboarding" className="btn-primary text-lg py-4 px-12 inline-flex">
              Ab shuru karo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded wa-gradient flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-gray-300">LocalSuite</span>
        </div>
        <p>© 2024 LocalSuite. Made with ❤️ for Indian businesses.</p>
      </footer>
    </div>
  );
}
