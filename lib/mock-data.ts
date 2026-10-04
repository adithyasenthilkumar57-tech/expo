import type {
  Lead, Invoice, Appointment, Conversation,
  KnowledgeBaseEntry, Notification, DashboardMetrics, PriorityItem, Business
} from "./types";

// ─── REAL BUSINESS DEFAULTS (NO DUMMY DATA) ──────────────────────────────────
export const defaultBusiness: Business = {
  id: "biz-001",
  name: "My Operations",
  industry: "Services",
  website: "",
  phone: "",
  email: "admin@mybusiness.com",
  plan: "PRO",
  timezone: "America/New_York",
  aiPersonaName: "Alex (AI)",
  aiPersonaGreeting: "Hi! Welcome. How can I help you today?",
  createdAt: new Date().toISOString(),
};

export const mockBusiness = defaultBusiness;

// ─── EMPTY PRODUCTION DATASETS (NO DUMMY DATA) ────────────────────────────────
export const mockLeads: Lead[] = [];

export const mockConversations: Conversation[] = [];

export const mockInvoices: Invoice[] = [];

export const mockAppointments: Appointment[] = [];

export const mockKnowledgeBase: KnowledgeBaseEntry[] = [];

export const mockNotifications: Notification[] = [];

export const mockDashboardMetrics: DashboardMetrics = {
  leadsThisWeek: 0,
  leadsLastWeek: 0,
  hotLeads: 0,
  avgResponseTime: "—",
  revenuePending: 0,
  revenueCollected: 0,
  appointmentsToday: 0,
  overdueInvoices: 0,
};

export const mockPriorityItems: PriorityItem[] = [];

export const weeklyLeadsData = [
  { day: "Mon", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Tue", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Wed", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Thu", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Fri", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Sat", leads: 0, hot: 0, warm: 0, cold: 0 },
  { day: "Sun", leads: 0, hot: 0, warm: 0, cold: 0 },
];

export const revenueData = [
  { month: "Jan", collected: 0, pending: 0 },
  { month: "Feb", collected: 0, pending: 0 },
  { month: "Mar", collected: 0, pending: 0 },
  { month: "Apr", collected: 0, pending: 0 },
  { month: "May", collected: 0, pending: 0 },
  { month: "Jun", collected: 0, pending: 0 },
];

export const leadSourceData: { name: string; value: number; color: string }[] = [];
