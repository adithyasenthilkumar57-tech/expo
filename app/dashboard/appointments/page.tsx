"use client";
import { useState } from "react";
import { mockAppointments } from "@/lib/mock-data";
import { formatDateTime, formatDate, getAppointmentStatusConfig, formatRelativeTime } from "@/lib/utils";
import { Avatar, EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import {
  Calendar, Plus, Video, MapPin, Clock, Bell, ArrowLeft,
  CheckCircle, XCircle, RotateCcw, Bot, Mail, Phone,
  ChevronLeft, ChevronRight, AlertTriangle
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [tab, setTab] = useState<"all" | AppointmentStatus>("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = tab === "all" ? mockAppointments : mockAppointments.filter(a => a.status === tab);

  const statusCounts: Record<string, number> = {
    all: mockAppointments.length,
    CONFIRMED: mockAppointments.filter(a => a.status === "CONFIRMED").length,
    PENDING: mockAppointments.filter(a => a.status === "PENDING").length,
    NO_SHOW: mockAppointments.filter(a => a.status === "NO_SHOW").length,
    CANCELLED: mockAppointments.filter(a => a.status === "CANCELLED").length,
  };

  if (selected) return <AppointmentDetail appt={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Appointments
          </h1>
          <p className="text-sm text-slate-500">Manage bookings and automated reminders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/8">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${view === "list" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${view === "calendar" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Calendar
            </button>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowCreate(true)}>
            New Booking
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {(["all", "CONFIRMED", "PENDING", "NO_SHOW", "CANCELLED"] as const).map((t) => {
          const labels: Record<string, string> = { all: "All", CONFIRMED: "Confirmed", PENDING: "Pending", NO_SHOW: "No Shows", CANCELLED: "Cancelled" };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
            >
              {labels[t]}
              {statusCounts[t] > 0 && <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">{statusCounts[t]}</span>}
            </button>
          );
        })}
      </div>

      {view === "calendar" ? (
        <MiniCalendar appointments={mockAppointments} onSelect={setSelected} />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Today's appointments */}
          {filtered.filter(a => {
            const d = new Date(a.startTime);
            const today = new Date();
            return d.toDateString() === today.toDateString();
          }).length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Today</p>
              <div className="flex flex-col gap-2">
                {filtered.filter(a => new Date(a.startTime).toDateString() === new Date().toDateString()).map(a => (
                  <AppointmentCard key={a.id} appt={a} onClick={() => setSelected(a)} />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">All Appointments</p>
            <div className="flex flex-col gap-2">
              {filtered.map(a => (
                <AppointmentCard key={a.id} appt={a} onClick={() => setSelected(a)} />
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <EmptyState
              icon={<Calendar className="w-6 h-6" />}
              title="No appointments"
              description="Create a new booking or wait for clients to schedule."
              action={<Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>New Booking</Button>}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appt, onClick }: { appt: Appointment; onClick: () => void }) {
  const statusCfg = getAppointmentStatusConfig(appt.status);
  const isToday = new Date(appt.startTime).toDateString() === new Date().toDateString();
  const isPast = new Date(appt.startTime) < new Date();

  return (
    <div
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer group flex items-center gap-4 ${appt.status === "NO_SHOW" ? "!border-red-500/20 !bg-red-500/5" : ""}`}
    >
      {/* Time column */}
      <div className="flex flex-col items-center min-w-[60px] text-center">
        <p className="text-xs text-slate-500">{formatDate(appt.startTime, { month: "short", day: "numeric" })}</p>
        <p className="text-sm font-bold text-slate-200">{new Date(appt.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
      </div>

      <div className="w-[1px] h-12 bg-white/10" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-100 group-hover:text-white">{appt.title}</p>
          <span className={`badge ${statusCfg.className} text-[10px]`}>{statusCfg.label}</span>
          {isToday && !isPast && <span className="badge badge-info text-[10px]">Today</span>}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Avatar name={appt.clientName} size="sm" />{appt.clientName}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.round((new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000)} min
          </span>
          {appt.meetingUrl && <span className="flex items-center gap-1 text-blue-400"><Video className="w-3 h-3" />Video call</span>}
          {appt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{appt.location}</span>}
        </div>
      </div>

      {/* Reminder status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`flex items-center gap-1 text-xs ${appt.reminderSent ? "text-emerald-400" : "text-slate-600"}`}>
          <Bell className="w-3.5 h-3.5" />
          {appt.reminderSent ? "Reminded" : "No reminder"}
        </div>
        {appt.status === "NO_SHOW" && (
          <Button variant="ghost" size="sm" leftIcon={<Bot className="w-3 h-3" />}>Re-engage</Button>
        )}
      </div>
    </div>
  );
}

function AppointmentDetail({ appt, onBack }: { appt: Appointment; onBack: () => void }) {
  const statusCfg = getAppointmentStatusConfig(appt.status);

  return (
    <div className="p-6 lg:p-8 max-w-[700px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </button>

      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{appt.title}</h2>
            <span className={`badge ${statusCfg.className}`}>{statusCfg.label}</span>
          </div>
          <div className="flex gap-2">
            {appt.status === "CONFIRMED" && (
              <Button variant="ghost" size="sm" leftIcon={<Bell className="w-3.5 h-3.5" />}>Send Reminder</Button>
            )}
            {appt.status === "NO_SHOW" && (
              <Button variant="primary" size="sm" leftIcon={<Bot className="w-3.5 h-3.5" />}>AI Re-engage</Button>
            )}
            {appt.status === "PENDING" && (
              <Button variant="success" size="sm" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>Confirm</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card !rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Date & Time</p>
            <p className="text-sm font-semibold text-slate-200">{formatDateTime(appt.startTime)}</p>
            <p className="text-xs text-slate-500 mt-1">to {new Date(appt.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
          </div>
          <div className="glass-card !rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Client</p>
            <div className="flex items-center gap-2">
              <Avatar name={appt.clientName} size="sm" />
              <div>
                <p className="text-sm font-semibold text-slate-200">{appt.clientName}</p>
                <p className="text-xs text-slate-500">{appt.clientEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {appt.meetingUrl && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Video className="w-4 h-4" />
                Video meeting link
              </div>
              <a href={appt.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-blue-200 underline">Open Link</a>
            </div>
          </div>
        )}

        {appt.description && (
          <div className="mb-6 p-3 rounded-xl bg-white/3 border border-white/8">
            <p className="text-xs text-slate-500 mb-1 font-semibold">Notes</p>
            <p className="text-sm text-slate-300">{appt.description}</p>
          </div>
        )}

        {/* Reminder status */}
        <div className={`p-3 rounded-xl border ${appt.reminderSent ? "bg-emerald-500/8 border-emerald-500/20" : "bg-amber-500/8 border-amber-500/20"}`}>
          <div className="flex items-center gap-2 text-xs">
            {appt.reminderSent ? (
              <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Reminder sent automatically by AI</span></>
            ) : (
              <><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400">No reminder sent yet — AI will remind 24h before</span></>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="ghost" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} className="flex-1">Reschedule</Button>
          <Button variant="danger" leftIcon={<XCircle className="w-3.5 h-3.5" />} className="flex-1">Cancel Appointment</Button>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ appointments, onSelect }: { appointments: Appointment[]; onSelect: (a: Appointment) => void }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const apptDays = new Set(
    appointments.map(a => {
      const d = new Date(a.startTime);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) return d.getDate();
      return null;
    }).filter(Boolean)
  );

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-white">{MONTHS[currentMonth]} {currentYear}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="calendar-day text-[10px] font-semibold text-slate-600 cursor-default">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const hasAppt = apptDays.has(day);
          const dayAppts = appointments.filter(a => {
            const d = new Date(a.startTime);
            return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          });
          return (
            <div
              key={day}
              className={`calendar-day flex flex-col items-center gap-0.5 cursor-pointer ${isToday ? "today" : ""} ${hasAppt ? "text-blue-300" : "text-slate-400"}`}
              onClick={() => dayAppts[0] && onSelect(dayAppts[0])}
            >
              {day}
              {hasAppt && <div className="w-1 h-1 rounded-full bg-blue-400" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">This Month</p>
        {appointments.filter(a => {
          const d = new Date(a.startTime);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).slice(0, 3).map(a => {
          const statusCfg = getAppointmentStatusConfig(a.status);
          return (
            <div key={a.id} onClick={() => onSelect(a)} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-white/4 rounded-lg px-2 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                {new Date(a.startTime).getDate()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">{a.title}</p>
                <p className="text-[10px] text-slate-500">{a.clientName}</p>
              </div>
              <span className={`badge ${statusCfg.className} text-[9px]`}>{statusCfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
