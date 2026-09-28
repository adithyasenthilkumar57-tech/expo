// Core type definitions for OpsAgent

export type LeadStatus = "HOT" | "WARM" | "COLD";
export type InvoiceStatus = "DRAFT" | "SENT" | "VIEWED" | "OVERDUE" | "PAID";
export type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "NO_SHOW";
export type MessageSender = "AI" | "USER" | "CUSTOMER";
export type PlanType = "FREE" | "PRO" | "BUSINESS";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  industry: string;
  website?: string;
  phone?: string;
  email: string;
  logo?: string;
  plan: PlanType;
  timezone: string;
  aiPersonaName: string;
  aiPersonaGreeting: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: string;
  budget?: number;
  need?: string;
  timeline?: string;
  lastContact: string;
  createdAt: string;
  conversationId?: string;
  score: number; // 0-100
  tags: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  agentAction?: string; // e.g., "Qualified as HOT lead", "Created invoice"
}

export interface Conversation {
  id: string;
  businessId: string;
  leadId?: string;
  leadName: string;
  leadEmail: string;
  messages: Message[];
  lastMessage: string;
  lastMessageAt: string;
  status: "ACTIVE" | "RESOLVED" | "PENDING";
  aiHandled: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  businessId: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  number: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  sentAt?: string;
  viewedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  followUpCount: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Appointment {
  id: string;
  businessId: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  title: string;
  description?: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  location?: string;
  meetingUrl?: string;
  reminderSent: boolean;
  createdAt: string;
}

export interface KnowledgeBaseEntry {
  id: string;
  businessId: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  businessId: string;
  type: "LEAD" | "INVOICE" | "APPOINTMENT" | "AI_ACTION" | "SYSTEM";
  title: string;
  body: string;
  isRead: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  relatedId?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  leadsThisWeek: number;
  leadsLastWeek: number;
  hotLeads: number;
  avgResponseTime: string;
  revenuePending: number;
  revenueCollected: number;
  appointmentsToday: number;
  overdueInvoices: number;
}

export interface PriorityItem {
  id: string;
  type: "LEAD" | "INVOICE" | "APPOINTMENT";
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  actionLabel: string;
  relatedId: string;
  urgency: "NOW" | "TODAY" | "SOON";
}
