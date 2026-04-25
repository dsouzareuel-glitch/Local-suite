"use client";
import { useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Slot {
  time: string;
  label: string;
  available: boolean;
}

export function BookingCalendar({ businessId }: { businessId: string }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings/slots?businessId=${businessId}&date=${format(selectedDate, "yyyy-MM-dd")}`);
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (e) {
        console.error("Failed to fetch slots:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate, businessId]);

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[--brand-gold]" />
          Live Availability
        </h2>
        <div className="text-xs text-[--muted]">Syncs with Google Calendar</div>
      </div>

      {/* Date Picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {next7Days.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-200 ${
              isSameDay(date, selectedDate)
                ? "bg-[--brand-gold]/10 border-[--brand-gold] text-[--brand-gold]"
                : "bg-white/5 border-white/5 text-[--muted] hover:bg-white/10"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">{format(date, "EEE")}</span>
            <span className="text-xl font-bold">{format(date, "d")}</span>
          </button>
        ))}
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl shimmer" />
          ))
        ) : slots.length > 0 ? (
          slots.map((slot) => (
            <div
              key={slot.time}
              className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                slot.available
                  ? "bg-white/5 border-white/5 text-[--foreground]"
                  : "bg-red-500/5 border-red-500/10 text-[--muted] opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3 h-3 ${slot.available ? "text-[--brand-gold]" : "text-red-500/50"}`} />
                <span className={slot.available ? "" : "line-through"}>{slot.label}</span>
              </div>
              {slot.available ? (
                <CheckCircle2 className="w-3 h-3 text-[--wa-green]" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500/50" />
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-[--muted] text-sm">
            No slots available or business is closed.
          </div>
        )}
      </div>
    </div>
  );
}
