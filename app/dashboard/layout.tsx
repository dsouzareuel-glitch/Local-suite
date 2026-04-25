"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Calendar, Scissors,
  Star, Settings, ChevronRight, Zap, Bell, Menu, X
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare, badge: 3 },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/services", label: "Services", icon: Scissors },
  { href: "/dashboard/reviews", label: "Review Replies", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[--brand-gold]/10 flex items-center justify-center flex-shrink-0 border border-[--brand-gold]/20">
            <MessageSquare className="w-5 h-5 text-[--brand-gold]" />
          </div>
          <div>
            <div className="font-bold text-base font-display text-[--brand-gold]">LocalSuite</div>
            <div className="text-[10px] text-[--muted] uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="live-dot w-1.5 h-1.5" />
              Bot Active
            </div>
          </div>
        </Link>
      </div>

      {/* Business selector */}
      <div className="mx-4 mt-4 mb-2">
        <button className="w-full bg-[--surface-3] rounded-xl px-3 py-2.5 flex items-center justify-between text-left border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[--brand-gold]/10 flex items-center justify-center text-base border border-[--brand-gold]/20">✂️</div>
            <div>
              <div className="text-sm font-semibold text-[--foreground]">Glam Studios</div>
              <div className="text-[10px] text-[--brand-gold] font-bold uppercase tracking-wider">Premium Plan</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[--muted]" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              className={active ? "nav-item-active" : "nav-item"}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[--brand-gold]" : "text-[--muted]"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && !active && (
                <span className="text-[10px] bg-[--brand-gold]/20 text-[--brand-gold] rounded-full w-5 h-5 flex items-center justify-center font-bold border border-[--brand-gold]/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="p-4">
        <Link href="/dashboard/billing" className="block rounded-2xl p-4 border border-[--brand-gold]/20 text-sm" style={{ background: "rgba(212,175,55,0.05)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[--brand-gold]" />
            <span className="font-semibold text-[--brand-gold]">Professional Plan</span>
          </div>
          <p className="text-[10px] text-[--muted] leading-relaxed">Active until May 20, 2026. Custom scripts & Calendar sync enabled.</p>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 flex-shrink-0 overflow-y-auto" style={{ background: "rgba(0,0,0,0.3)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col border-r border-white/5" style={{ background: "hsl(222, 47%, 8%)" }}>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0 glass">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm font-semibold text-[--foreground] font-display tracking-wide">
              {NAV.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors border border-white/5">
              <Bell className="w-4 h-4 text-[--muted]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[--brand-gold] rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[--brand-gold]/10 border border-[--brand-gold]/20 flex items-center justify-center text-[--brand-gold] text-xs font-bold">RJ</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
