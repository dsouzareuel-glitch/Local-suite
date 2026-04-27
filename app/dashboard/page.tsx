"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Calendar, TrendingUp, Users, Phone,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Sparkles
} from "lucide-react";

const MOCK_STATS = [
  { label: "Active Leads", value: "12", change: "+3 today", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Bookings This Week", value: "28", change: "+5 vs last week", icon: Calendar, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Revenue (Est.)", value: "₹14,200", change: "this week", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Missed Calls Rescued", value: "7", change: "this month", icon: Phone, color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

const RECENT_CONVERSATIONS = [
  { name: "Rahul S.", preview: "Tell me the facial price", intent: "pricing", time: "2m ago", status: "active", initials: "RS" },
  { name: "Priya M.", preview: "I want to book a haircut", intent: "booking", time: "8m ago", status: "booked", initials: "PM" },
  { name: "Amit K.", preview: "What time do you open?", intent: "support", time: "15m ago", status: "active", initials: "AK" },
  { name: "Neha T.", preview: "Is beard trim available?", intent: "pricing", time: "31m ago", status: "active", initials: "NT" },
  { name: "Karan D.", preview: "Is my appointment confirmed?", intent: "booking", time: "1h ago", status: "booked", initials: "KD" },
];

const TODAY_APPOINTMENTS = [
  { name: "Priya Singh", service: "Facial (Glow)", time: "10:00 AM", status: "confirmed" },
  { name: "Rahul Kumar", service: "Haircut + Beard", time: "11:30 AM", status: "confirmed" },
  { name: "Ananya Joshi", service: "Hair Colour", time: "2:00 PM", status: "confirmed" },
  { name: "Vikram Patel", service: "Cleanup Facial", time: "4:00 PM", status: "confirmed" },
];

const INTENT_BADGE: Record<string, string> = {
  pricing: "badge-yellow",
  booking: "badge-green",
  support: "badge-blue",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"conversations" | "appointments">("conversations");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 border border-[--brand-gold]/20 flex items-center justify-between" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.04) 100%)" }}>
        <div>
          <h1 className="text-2xl font-bold font-display">Good evening, Reuel! 👋</h1>
          <p className="text-sm text-[--muted] mt-1">
            LocalSuite has handled <strong className="text-[--foreground]">47 interactions</strong> today. Your calendar is in sync.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[--brand-gold]/10 border border-[--brand-gold]/20 py-2 px-4 rounded-xl text-sm text-[--brand-gold]">
            <Sparkles className="w-4 h-4" />
            Premium Account
          </div>
          <div className="flex items-center gap-2 bg-[--wa-green]/10 border border-[--wa-green]/20 py-2 px-4 rounded-xl text-sm text-[--wa-green]">
            <span className="live-dot" />
            Bot Active
          </div>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="glass rounded-2xl p-4 flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[--brand-gold]/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[--brand-gold]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[--foreground]">Google Calendar Connected</div>
            <div className="text-xs text-[--muted]">Last synced: 2 minutes ago</div>
          </div>
        </div>
        <button className="text-xs font-medium text-[--brand-gold] hover:underline">Sync Now</button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className="stat-card glass-hover">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[--foreground]">{stat.value}</div>
              <div className="text-xs text-[--muted]">{stat.label}</div>
              <div className="text-xs text-[--brand-gold] mt-1">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: conversations + appointments */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Live Feed */}
        <div className="lg:col-span-3 card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <h2 className="font-semibold">Live Feed</h2>
            </div>
            <Link href="/dashboard/conversations" className="text-sm text-[--brand-gold] hover:text-[--brand-gold-light] flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5">
            {(["conversations", "appointments"] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "conversations" && (
            <div className="space-y-2">
              {RECENT_CONVERSATIONS.map((conv, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl glass-hover cursor-pointer animate-slide-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-9 h-9 rounded-full wa-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {conv.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{conv.name}</span>
                      <span className={INTENT_BADGE[conv.intent] ?? "badge-blue"}>{conv.intent}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{conv.preview}</div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">{conv.time}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-2">
              {TODAY_APPOINTMENTS.map((apt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass-hover animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex flex-col items-center w-14 flex-shrink-0 text-center">
                    <Clock className="w-3 h-3 text-[--muted] mb-0.5" />
                    <span className="text-xs font-semibold text-[--brand-gold]">{apt.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{apt.name}</div>
                    <div className="text-xs text-gray-400">{apt.service}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[--brand-gold] flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bot performance */}
          <div className="card space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Bot Performance
            </h2>
            {[
              { label: "Response Rate", value: 96, color: "bg-green-400" },
              { label: "Booking Conversion", value: 38, color: "bg-blue-400" },
              { label: "Lead Capture", value: 84, color: "bg-purple-400" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{m.label}</span>
                  <span className="font-semibold">{m.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.color} transition-all duration-1000`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card space-y-3">
            <h2 className="font-semibold">Quick Actions</h2>
            <Link href="/dashboard/reviews" className="flex items-center gap-3 p-3 rounded-xl glass-hover group">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                ⭐
              </div>
              <div className="flex-1 text-sm">Generate Review Reply</div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
            </Link>
            <Link href="/dashboard/services" className="flex items-center gap-3 p-3 rounded-xl glass-hover group">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                ✏️
              </div>
              <div className="flex-1 text-sm">Update Service Prices</div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
            </Link>
            <Link href="/demo" className="flex items-center gap-3 p-3 rounded-xl glass-hover group">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                🎯
              </div>
              <div className="flex-1 text-sm">Share Sales Demo</div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors" />
            </Link>
          </div>

          {/* Missed call alert */}
          <div className="card border border-[--brand-gold]/20" style={{ background: "rgba(212,175,55,0.05)" }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[--brand-gold] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[--brand-gold]">2 Missed Calls</div>
                <div className="text-xs text-[--muted] mt-0.5">Bot has sent follow-up messages on WhatsApp.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
