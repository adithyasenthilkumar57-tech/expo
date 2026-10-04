"use client";
import { useState, useMemo } from "react";
import { formatDateTime, formatDate, getAppointmentStatusConfig } from "@/lib/utils";
import { Avatar, EmptyState } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/lib/toast";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  Calendar, Plus, Video, MapPin, Clock, Bot, ArrowLeft,
  CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight,
  AlertTriangle, Search, X, LayoutGrid, List, ExternalLink, Trash2
} from "lucide-react";

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Tab = "all" | AppointmentStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PENDING", label: "Pending" },
  { key: "NO_SHOW", label: "No Shows" },
  { key: "CANCELLED", label: "Cancelled" },
];

function getApptDate(a: Appointment): string {
  return a.scheduledAt || a.startTime || a.createdAt;
}

function getApptTitle(a: Appointment): string {
  return a.serviceType || a.title || "Consultation";
}

function getApptDuration(a: Appointment): number {
  if (a.duration) return a.duration;
  if (a.startTime && a.endTime) {
    const diff = Math.round((new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 60000);
    if (!isNaN(diff) && diff > 0) return diff;
  }
  return 30;
}

function getApptLocation(a: Appointment): { isVirtual: boolean; text: string; url?: string } {
  if (a.meetingUrl) {
    return { isVirtual: true, text: "Virtual Meeting", url: a.meetingUrl };
  }
  if (a.locationType === "VIRTUAL") {
    return { isVirtual: true, text: "Virtual Meeting" };
  }
  if (a.location) {
    return { isVirtual: false, text: a.location };
  }
  return { isVirtual: true, text: "Virtual / Google Meet" };
}

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, business } = useAppStore();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selected = appointments.find((a) => a.id === selectedId) || null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter((a) => {
      const matchTab = tab === "all" || a.status === tab;
      const title = getApptTitle(a).toLowerCase();
      const name = a.clientName.toLowerCase();
      const matchSearch = !q || name.includes(q) || title.includes(q);
      return matchTab && matchSearch;
    });
  }, [appointments, tab, search]);

  const counts: Record<Tab, number> = {
    all: appointments.length,
    CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED").length,
    PENDING: appointments.filter((a) => a.status === "PENDING").length,
    NO_SHOW: appointments.filter((a) => a.status === "NO_SHOW").length,
    CANCELLED: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const handleAddAppointment = (data: {
    clientName: string;
    clientEmail: string;
    title: string;
    datetime: string;
    duration: number;
  }) => {
    const start = new Date(data.datetime);
    const end = new Date(start.getTime() + data.duration * 60000);
    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      businessId: business?.id || "biz-001",
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      title: data.title,
      status: "CONFIRMED",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      meetingUrl: "https://meet.google.com/new-session",
      reminderSent: true,
      createdAt: new Date().toISOString(),
      duration: data.duration,
      locationType: "VIRTUAL",
    };
    addAppointment(newAppt);
    setShowCreate(false);
    toast.success(`Appointment booked with ${data.clientName}`);
  };

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    updateAppointment(id, { status: newStatus });
  };

  if (selected) {
    return (
      <AppointmentDetail
        appt={selected}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={(st) => handleUpdateStatus(selected.id, st)}
        onDelete={() => {
          deleteAppointment(selected.id);
          setSelectedId(null);
          toast.info("Appointment deleted");
        }}
      />
    );
  }

  return (
    <div className="page-content flex flex-col gap-8">
      {/* Header */}
      <div className="page-header pb-6 border-b border-white/8">
        <div>
          <h1 className="page-title text-2xl lg:text-3xl font-bold tracking-tight">
            <Calendar className="w-6 h-6 text-blue-400" aria-hidden="true" />
            Appointments & Schedule
          </h1>
          <p className="page-subtitle text-slate-400 text-sm mt-1.5">
            Manage client bookings, calendar schedules, and AI-automated reminders in real time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/8" role="group" aria-label="View mode">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                view === "list" ? "bg-white/12 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
              aria-pressed={view === "list"}
            >
              <List className="w-4 h-4" aria-hidden="true" />
              List View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                view === "calendar" ? "bg-white/12 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
              aria-pressed={view === "calendar"}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              Calendar
            </button>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreate(true)}
            id="new-appointment-btn"
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Appointment status filter"
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                tab === key
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {label}
              <span className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                tab === key ? "bg-blue-500/25 text-blue-200" : "bg-white/8 text-slate-400"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        {appointments.length > 0 && (
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search client or service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftElement={<Search className="w-4 h-4 text-slate-400" />}
              rightElement={
                search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
              id="search-appointments"
            />
          </div>
        )}
      </div>

      {view === "calendar" ? (
        <CalendarView
          appointments={appointments}
          onSelectAppointment={(a) => setSelectedId(a.id)}
        />
      ) : (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-7 h-7" />}
              title="No appointments scheduled"
              description={
                search
                  ? "No bookings match your current search query or filter."
                  : "Bookings scheduled directly by clients or created manually will appear here."
              }
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowCreate(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Schedule First Booking
                </Button>
              }
            />
          ) : (
            <div className="space-y-3.5">
              {filtered.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appt={appt}
                  onClick={() => setSelectedId(appt.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateAppointmentModal
          onClose={() => setShowCreate(false)}
          onAdd={handleAddAppointment}
        />
      )}
    </div>
  );
}

/* ─── Create Appointment Modal ───────────────────────────────────────── */
function CreateAppointmentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (d: { clientName: string; clientEmail: string; title: string; datetime: string; duration: number }) => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [duration, setDuration] = useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !datetime) {
      toast.error("Please fill in all required booking fields");
      return;
    }
    onAdd({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      title: title.trim() || "Strategy Consultation",
      datetime,
      duration: parseInt(duration, 10) || 30,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="create-appt-modal-title">
      <div className="glass-card w-full max-w-xl p-8 sm:p-10 rounded-2xl animate-scaleIn border border-white/12 shadow-2xl">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/8">
          <div>
            <h2 id="create-appt-modal-title" className="text-xl font-bold text-white tracking-tight">Schedule New Appointment</h2>
            <p className="text-xs text-slate-400 mt-1">Add a new consultation or client booking to the calendar</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/8 transition-colors" aria-label="Close dialog">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Client Name" placeholder="e.g., Sarah Mitchell" value={clientName} onChange={(e) => setClientName(e.target.value)} required id="appt-client-name" />
          <Input label="Client Email" type="email" placeholder="sarah@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required id="appt-client-email" />
          <Input label="Service / Title" placeholder="e.g., Discovery Strategy Session" value={title} onChange={(e) => setTitle(e.target.value)} required id="appt-title" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Date & Time" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required id="appt-datetime" />
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">Duration</label>
              <select
                className="input-field text-sm h-11"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                id="appt-duration"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-white/8">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="md" type="submit">Schedule Booking</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Appointment Row ────────────────────────────────────────────────── */
function AppointmentRow({ appt, onClick }: { appt: Appointment; onClick: () => void }) {
  const s = getAppointmentStatusConfig(appt.status);
  const title = getApptTitle(appt);
  const dateStr = getApptDate(appt);
  const duration = getApptDuration(appt);
  const loc = getApptLocation(appt);

  return (
    <button
      className="glass-card w-full p-6 sm:p-7 rounded-2xl hover:border-white/16 hover:-translate-y-0.5 transition-all text-left group cursor-pointer border border-white/8 shadow-sm block"
      onClick={onClick}
      aria-label={`View appointment: ${appt.clientName}, ${title}`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar name={appt.clientName} size="lg" />
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-100 group-hover:text-white transition-colors truncate">{appt.clientName}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`badge ${s.className} px-3 py-1 text-xs font-semibold`}>{s.label}</span>
          {appt.status === "NO_SHOW" && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              Follow-up needed
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/6 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
          <span>{formatDateTime(dateStr)}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          {loc.isVirtual ? (
            <Video className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
          ) : (
            <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
          )}
          <span>{loc.text}</span>
        </div>
        {appt.reminderSent && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
            <Bot className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            AI Reminder Active
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Calendar View ──────────────────────────────────────────────────── */
function CalendarView({
  appointments,
  onSelectAppointment,
}: {
  appointments: Appointment[];
  onSelectAppointment: (a: Appointment) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const apptsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      const dateStr = getApptDate(a);
      const d = new Date(dateStr);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString();
        map[key] = [...(map[key] || []), a];
      }
    });
    return map;
  }, [appointments, year, month]);

  return (
    <div className="glass-card p-6 lg:p-8 rounded-2xl border border-white/8">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/8">
        <h2 className="text-xl font-bold text-white tracking-tight" aria-live="polite">
          {MONTHS_FULL[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors border border-white/6"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              setMonth(today.getMonth());
              setYear(today.getFullYear());
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-colors border border-white/6"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors border border-white/6"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-3 gap-2" role="row">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 py-1.5" role="columnheader">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3" role="grid" aria-label={`Calendar for ${MONTHS_FULL[month]} ${year}`}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[90px] sm:min-h-[110px] rounded-xl bg-transparent" role="gridcell" aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const dayAppts = apptsByDay[day.toString()] || [];
          return (
            <div
              key={day}
              className={`min-h-[90px] sm:min-h-[110px] rounded-xl p-2.5 sm:p-3 transition-all border flex flex-col justify-between ${
                isToday
                  ? "bg-blue-500/12 border-blue-500/35 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-white/[0.015] border-white/6 hover:bg-white/[0.04] hover:border-white/12"
              }`}
              role="gridcell"
              aria-label={`${MONTHS_FULL[month]} ${day}${isToday ? ", today" : ""}${
                dayAppts.length > 0 ? `, ${dayAppts.length} appointment${dayAppts.length !== 1 ? "s" : ""}` : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isToday ? "text-blue-400" : "text-slate-400"}`}>
                  {day}
                </span>
                {dayAppts.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                )}
              </div>
              <div className="space-y-1 mt-2">
                {dayAppts.slice(0, 2).map((a) => {
                  const title = getApptTitle(a);
                  return (
                    <button
                      key={a.id}
                      onClick={() => onSelectAppointment(a)}
                      className={`w-full px-2 py-1 rounded-md text-[10px] font-semibold truncate text-left transition-opacity hover:opacity-85 cursor-pointer block border ${
                        a.status === "CONFIRMED"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                          : a.status === "PENDING"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/25"
                          : a.status === "NO_SHOW"
                          ? "bg-red-500/15 text-red-300 border-red-500/25"
                          : "bg-slate-500/15 text-slate-300 border-slate-500/25"
                      }`}
                      aria-label={`${a.clientName} - ${title}`}
                    >
                      {a.clientName.split(" ")[0]}
                    </button>
                  );
                })}
                {dayAppts.length > 2 && (
                  <p className="text-[10px] font-medium text-slate-400 px-1">+{dayAppts.length - 2} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Appointment Detail ─────────────────────────────────────────────── */
function AppointmentDetail({
  appt,
  onBack,
  onUpdateStatus,
  onDelete,
}: {
  appt: Appointment;
  onBack: () => void;
  onUpdateStatus: (s: AppointmentStatus) => void;
  onDelete: () => void;
}) {
  const s = getAppointmentStatusConfig(appt.status);
  const title = getApptTitle(appt);
  const dateStr = getApptDate(appt);
  const duration = getApptDuration(appt);
  const loc = getApptLocation(appt);
  const notes = appt.notes || appt.description;

  const handleConfirm = () => {
    onUpdateStatus("CONFIRMED");
    toast.success(`Appointment with ${appt.clientName} confirmed`);
  };

  const handleCancel = () => {
    onUpdateStatus("CANCELLED");
    toast.info(`Appointment with ${appt.clientName} cancelled`);
  };

  const handleReschedule = () => {
    onUpdateStatus("PENDING");
    toast.info(`Reschedule request initiated for ${appt.clientName}`);
  };

  const handleReengage = () => {
    toast.info(`AI automated outreach sent to ${appt.clientName} to reschedule`);
  };

  return (
    <div className="page-content max-w-3xl space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        Back to Appointments
      </button>

      <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/8 shadow-lg">
        {/* Top */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 mb-8 border-b border-white/8">
          <div className="flex items-center gap-5">
            <Avatar name={appt.clientName} size="xl" />
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{appt.clientName}</h2>
              <p className="text-sm text-slate-400 mt-1">{title}</p>
              <span className={`badge ${s.className} mt-3 px-3 py-1 text-xs font-semibold`}>{s.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {appt.status === "NO_SHOW" && (
              <Button variant="primary" size="md" leftIcon={<Bot className="w-4 h-4" />} onClick={handleReengage}>
                AI Re-engage
              </Button>
            )}
            {appt.status === "PENDING" && (
              <Button variant="success" size="md" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={handleConfirm}>
                Confirm
              </Button>
            )}
            {["PENDING", "CONFIRMED"].includes(appt.status) && (
              <Button variant="ghost" size="md" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleReschedule}>
                Reschedule
              </Button>
            )}
            {appt.status !== "CANCELLED" && (
              <Button variant="danger" size="md" leftIcon={<XCircle className="w-4 h-4" />} onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button variant="ghost" size="md" leftIcon={<Trash2 className="w-4 h-4" />} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Date & Time</p>
              <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" aria-hidden="true" />
                {formatDateTime(dateStr)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Duration</p>
              <p className="text-sm font-semibold text-slate-100">{duration} minutes</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Location</p>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                {loc.isVirtual ? (
                  <Video className="w-4 h-4 text-blue-400" aria-hidden="true" />
                ) : (
                  <MapPin className="w-4 h-4 text-slate-400" aria-hidden="true" />
                )}
                {loc.url ? (
                  <a
                    href={loc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1.5"
                  >
                    {loc.text} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span>{loc.text}</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Management</p>
              <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                {appt.reminderSent ? (
                  <>
                    <Bot className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    <span className="text-blue-400">AI Managed (Automated Reminders)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    Direct Booking
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes & Objectives</p>
            <p className="text-sm text-slate-300 bg-white/[0.025] rounded-xl p-5 border border-white/6 leading-relaxed">
              {notes}
            </p>
          </div>
        )}

        {/* No-show alert */}
        {appt.status === "NO_SHOW" && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-amber-300 mb-1">No-Show Detected</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The AI agent will automatically reach out with tailored reschedule slots within 24 hours.
                  You can also trigger manual outreach using the button above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
