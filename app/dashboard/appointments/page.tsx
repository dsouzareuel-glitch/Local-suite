"use client";
import { useState } from "react";
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, CheckCircle2, X, Phone } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const APPOINTMENTS = [
  { id: "1", name: "Priya Singh", service: "Facial (Glow)", time: "10:00 AM", duration: 60, status: "confirmed", phone: "+91 98765 00002", day: 16 },
  { id: "2", name: "Rahul Kumar", service: "Haircut + Beard", time: "11:30 AM", duration: 45, status: "confirmed", phone: "+91 98765 00003", day: 16 },
  { id: "3", name: "Ananya Joshi", service: "Hair Colour", time: "2:00 PM", duration: 90, status: "confirmed", phone: "+91 98765 00004", day: 16 },
  { id: "4", name: "Vikram Patel", service: "Cleanup Facial", time: "4:00 PM", duration: 45, status: "confirmed", phone: "+91 98765 00005", day: 16 },
  { id: "5", name: "Sara Ahmed", service: "Haircut", time: "10:30 AM", duration: 30, status: "confirmed", phone: "+91 98765 00006", day: 17 },
  { id: "6", name: "Meera Iyer", service: "Beard Trim", time: "3:00 PM", duration: 15, status: "cancelled", phone: "+91 98765 00007", day: 18 },
];

const STATUS_STYLE: Record<string, string> = {
  confirmed: "badge-green",
  cancelled: "badge-red",
  completed: "badge-blue",
  no_show: "badge-yellow",
};

export default function AppointmentsPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const selectedApts = APPOINTMENTS.filter((a) => a.day === selectedDay);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-gray-400">{APPOINTMENTS.filter((a) => a.status === "confirmed").length} confirmed this week</p>
        </div>
        <button id="add-appointment" className="btn-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" />
          Add Manual
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1 card space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-semibold text-sm">{MONTHS[currentMonth]} {currentYear}</div>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
            ))}
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasApts = APPOINTMENTS.some((a) => a.day === day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth();
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all gap-0.5 ${
                    isSelected ? "wa-gradient text-white" :
                    isToday ? "border border-green-500/40 text-green-400" :
                    "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  {day}
                  {hasApts && !isSelected && <div className="w-1 h-1 rounded-full bg-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Has bookings</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded wa-gradient" />Today</div>
          </div>
        </div>

        {/* Right: appointments list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <h2 className="font-semibold">
              {selectedDay === today.getDate() ? "Today" : `${MONTHS[currentMonth]} ${selectedDay}`} — {selectedApts.length} appointment{selectedApts.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {selectedApts.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Koi appointment nahi is din</p>
              <p className="text-xs mt-1 text-gray-600">Bot automatically book kar lega!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedApts.map((apt) => (
                <div key={apt.id} className={`card glass-hover flex items-center gap-4 ${apt.status === "cancelled" ? "opacity-60" : ""}`}>
                  <div className="flex flex-col items-center w-16 flex-shrink-0 text-center">
                    <Clock className="w-4 h-4 text-gray-500 mb-1" />
                    <div className="text-sm font-bold text-green-400">{apt.time}</div>
                    <div className="text-xs text-gray-500">{apt.duration}min</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-sm">{apt.name}</div>
                      <span className={STATUS_STYLE[apt.status] ?? "badge-blue"}>{apt.status}</span>
                    </div>
                    <div className="text-xs text-gray-400">{apt.service}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />{apt.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {apt.status === "confirmed" && (
                      <>
                        <button className="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors" title="Mark Complete">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Cancel">
                          <X className="w-4 h-4 text-gray-500 hover:text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
