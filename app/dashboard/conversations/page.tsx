"use client";
import { useState } from "react";
import { Search, Filter, MessageSquare, Phone, Clock } from "lucide-react";

const ALL_CONVERSATIONS = [
  { name: "Rahul Sharma", wa: "+91 98765 00001", preview: "Facial price batao", intent: "pricing", status: "active", time: "2m ago", initials: "RS", messages: 3 },
  { name: "Priya Mehta", wa: "+91 98765 00002", preview: "Book karna hai haircut", intent: "booking", status: "booked", time: "8m ago", initials: "PM", messages: 7 },
  { name: "Amit Kumar", wa: "+91 98765 00003", preview: "Kitne baje open ho?", intent: "support", status: "active", time: "15m ago", initials: "AK", messages: 2 },
  { name: "Neha Tiwari", wa: "+91 98765 00004", preview: "Beard trim available hai?", intent: "pricing", status: "active", time: "31m ago", initials: "NT", messages: 4 },
  { name: "Karan Desai", wa: "+91 98765 00005", preview: "Appointment confirm hua?", intent: "booking", status: "booked", time: "1h ago", initials: "KD", messages: 6 },
  { name: "Sunita Rao", wa: "+91 98765 00006", preview: "Hair colour kitne ka?", intent: "pricing", status: "active", time: "2h ago", initials: "SR", messages: 3 },
  { name: "Rohan Patel", wa: "+91 98765 00007", preview: "Cancel karna hai slot", intent: "booking", status: "lost", time: "3h ago", initials: "RP", messages: 5 },
];

const BOARD_COLS = [
  { key: "active", label: "New Leads", color: "border-blue-500/40 bg-blue-500/5" },
  { key: "booked", label: "Booked", color: "border-green-500/40 bg-green-500/5" },
  { key: "completed", label: "Completed", color: "border-purple-500/40 bg-purple-500/5" },
  { key: "lost", label: "Lost", color: "border-red-500/40 bg-red-500/5" },
];

const INTENT_BADGE: Record<string, string> = {
  pricing: "badge-yellow",
  booking: "badge-green",
  support: "badge-blue",
  unknown: "badge-blue",
};

const MOCK_MESSAGES = [
  { dir: "in", text: "Facial price batao", time: "10:03 AM" },
  { dir: "out", text: "✨ Glam Studios Price List:\n\n• Facial (Cleanup) — ₹500 (45 min)\n• Facial (Glow) — ₹800 (60 min)\n\nBooking ke liye reply: BOOK 📅", time: "10:03 AM" },
  { dir: "in", text: "Glow wala ₹800 hai?", time: "10:04 AM" },
  { dir: "out", text: "Haan ji! ₹800 mein full Glow Facial milता hai — 60 minute ka. Aaj ya kal slot available hai! 😊", time: "10:04 AM" },
];

export default function ConversationsPage() {
  const [view, setView] = useState<"list" | "board">("list");
  const [selected, setSelected] = useState<typeof ALL_CONVERSATIONS[0] | null>(ALL_CONVERSATIONS[0]);
  const [search, setSearch] = useState("");

  const filtered = ALL_CONVERSATIONS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conversations</h1>
          <p className="text-sm text-gray-400">All WhatsApp leads in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="view-list"
            onClick={() => setView("list")}
            className={`btn-secondary py-2 px-3 text-xs ${view === "list" ? "border-green-500/30 text-green-400" : ""}`}
          >
            List
          </button>
          <button
            id="view-board"
            onClick={() => setView("board")}
            className={`btn-secondary py-2 px-3 text-xs ${view === "board" ? "border-green-500/30 text-green-400" : ""}`}
          >
            Kanban
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Left: list */}
          <div className="w-80 flex flex-col gap-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="search-conversations"
                placeholder="Search..."
                className="input-field pl-9 py-2 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filtered.map((conv) => (
                <button
                  key={conv.wa}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 ${
                    selected?.wa === conv.wa ? "bg-white/8 border border-green-500/20" : "glass-hover"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full wa-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {conv.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{conv.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                      </div>
                      <div className="text-xs text-gray-400 truncate">{conv.preview}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={INTENT_BADGE[conv.intent] ?? "badge-blue"}>{conv.intent}</span>
                        <span className="text-xs text-gray-600">{conv.messages} msgs</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: chat view */}
          <div className="flex-1 card flex flex-col">
            {selected ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
                  <div className="w-10 h-10 rounded-full wa-gradient flex items-center justify-center text-white text-sm font-bold">
                    {selected.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{selected.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {selected.wa}
                      <span className={INTENT_BADGE[selected.intent] ?? "badge-blue"}>{selected.intent}</span>
                    </div>
                  </div>
                  <button className="btn-secondary py-1.5 px-3 text-xs">Mark Booked</button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-4">
                  {MOCK_MESSAGES.map((msg, i) => (
                    <div key={i} className={`flex ${msg.dir === "out" ? "justify-end" : "justify-start"}`}>
                      <div className={msg.dir === "out" ? "wa-bubble-out" : "wa-bubble-in"} style={{ whiteSpace: "pre-line" }}>
                        {msg.text}
                        <div className={`text-xs mt-1 ${msg.dir === "out" ? "text-white/60" : "text-gray-500"}`}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply input */}
                <div className="border-t border-white/5 pt-3 flex gap-2">
                  <input className="input-field flex-1 py-2 text-sm" placeholder="Type a reply manually..." />
                  <button className="btn-primary py-2 px-4 text-sm">Send</button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Kanban board */
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
          {BOARD_COLS.map((col) => {
            const convs = ALL_CONVERSATIONS.filter((c) => c.status === col.key);
            return (
              <div key={col.key} className={`flex-shrink-0 w-72 rounded-2xl border p-3 ${col.color}`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-sm font-semibold">{col.label}</div>
                  <div className="badge-blue text-xs">{convs.length}</div>
                </div>
                <div className="space-y-2 overflow-y-auto max-h-full">
                  {convs.map((conv) => (
                    <div key={conv.wa} className="card glass-hover cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full wa-gradient flex items-center justify-center text-white text-xs font-bold">
                          {conv.initials}
                        </div>
                        <div className="text-sm font-medium">{conv.name}</div>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{conv.preview}</div>
                      <div className="flex items-center justify-between">
                        <span className={INTENT_BADGE[conv.intent] ?? "badge-blue"}>{conv.intent}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{conv.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {convs.length === 0 && (
                    <div className="text-center text-xs text-gray-600 py-6">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
