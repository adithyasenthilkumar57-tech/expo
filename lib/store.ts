"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Business,
  Lead,
  Invoice,
  Appointment,
  Conversation,
  KnowledgeBaseEntry,
  Notification,
  Message,
} from "./types";
import { defaultBusiness } from "./mock-data";

interface AppState {
  // Auth state
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateBusiness: (data: Partial<Business>) => void;

  // Real operational datasets
  leads: Lead[];
  conversations: Conversation[];
  invoices: Invoice[];
  appointments: Appointment[];
  knowledgeBase: KnowledgeBaseEntry[];
  notifications: Notification[];

  // Lead actions
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Message / Conversation actions
  sendMessage: (leadId: string, content: string, sender?: "USER" | "AI" | "CUSTOMER") => void;

  // Invoice actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Appointment actions
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Knowledge base actions
  addKnowledge: (entry: KnowledgeBaseEntry) => void;
  updateKnowledge: (id: string, updates: Partial<KnowledgeBaseEntry>) => void;
  deleteKnowledge: (id: string) => void;

  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearReadNotifications: () => void;

  // Reset data utility
  clearAllData: () => void;
}

const defaultUser: User = {
  id: "user-001",
  email: "admin@mybusiness.com",
  name: "Operations Admin",
  role: "OWNER",
  createdAt: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      business: defaultBusiness,
      isAuthenticated: true,
      isLoading: false,

      // Initial clean empty datasets
      leads: [],
      conversations: [],
      invoices: [],
      appointments: [],
      knowledgeBase: [],
      notifications: [],

      login: async (email: string, password?: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 600));
        set({
          user: {
            id: `user-${Date.now()}`,
            email,
            name: email.split("@")[0].replace(".", " "),
            role: "OWNER",
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateBusiness: (data) => {
        set((state) => ({
          business: state.business ? { ...state.business, ...data } : { ...defaultBusiness, ...data },
        }));
      },

      // Lead operations
      addLead: (lead) => {
        set((state) => ({ leads: [lead, ...state.leads] }));
      },
      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },
      deleteLead: (id) => {
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
      },

      // Conversation operations
      sendMessage: (leadId, content, sender = "USER") => {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          conversationId: `conv-${leadId}`,
          sender,
          senderName: sender === "USER" ? get().user?.name || "Admin" : sender === "AI" ? "OpsAgent AI" : "Lead",
          content,
          createdAt: new Date().toISOString(),
          isRead: true,
        };

        set((state) => {
          const exists = state.conversations.find((c) => c.leadId === leadId);
          if (exists) {
            return {
              conversations: state.conversations.map((c) =>
                c.leadId === leadId
                  ? {
                      ...c,
                      messages: [...c.messages, newMsg],
                      lastMessage: content,
                      lastMessageAt: newMsg.createdAt,
                    }
                  : c
              ),
            };
          } else {
            const lead = state.leads.find((l) => l.id === leadId);
            const newConv: Conversation = {
              id: `conv-${leadId}`,
              businessId: state.business?.id || "biz-001",
              leadId,
              leadName: lead?.name || "Lead",
              leadEmail: lead?.email || "",
              messages: [newMsg],
              lastMessage: content,
              lastMessageAt: newMsg.createdAt,
              status: "ACTIVE",
              aiHandled: true,
              createdAt: new Date().toISOString(),
            };
            return { conversations: [newConv, ...state.conversations] };
          }
        });
      },

      // Invoice operations
      addInvoice: (invoice) => {
        set((state) => ({ invoices: [invoice, ...state.invoices] }));
      },
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
        }));
      },
      deleteInvoice: (id) => {
        set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) }));
      },

      // Appointment operations
      addAppointment: (appointment) => {
        set((state) => ({ appointments: [appointment, ...state.appointments] }));
      },
      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },
      deleteAppointment: (id) => {
        set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) }));
      },

      // Knowledge base operations
      addKnowledge: (entry) => {
        set((state) => ({ knowledgeBase: [entry, ...state.knowledgeBase] }));
      },
      updateKnowledge: (id, updates) => {
        set((state) => ({
          knowledgeBase: state.knowledgeBase.map((k) => (k.id === id ? { ...k, ...updates } : k)),
        }));
      },
      deleteKnowledge: (id) => {
        set((state) => ({ knowledgeBase: state.knowledgeBase.filter((k) => k.id !== id) }));
      },

      // Notification operations
      addNotification: (notification) => {
        set((state) => ({ notifications: [notification, ...state.notifications] }));
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },
      clearReadNotifications: () => {
        set((state) => ({
          notifications: state.notifications.filter((n) => !n.isRead),
        }));
      },

      // Clear all data
      clearAllData: () => {
        set({
          leads: [],
          conversations: [],
          invoices: [],
          appointments: [],
          knowledgeBase: [],
          notifications: [],
        });
      },
    }),
    {
      name: "opsagent-app-store",
      partialize: (state) => ({
        user: state.user,
        business: state.business,
        isAuthenticated: state.isAuthenticated,
        leads: state.leads,
        conversations: state.conversations,
        invoices: state.invoices,
        appointments: state.appointments,
        knowledgeBase: state.knowledgeBase,
        notifications: state.notifications,
      }),
    }
  )
);

// Backward-compatible alias
export const useAuthStore = useAppStore;
