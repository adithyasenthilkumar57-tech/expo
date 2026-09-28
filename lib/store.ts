"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Business } from "./types";
import { mockBusiness } from "./mock-data";

interface AuthState {
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBusiness: (data: Partial<Business>) => void;
}

const mockUser: User = {
  id: "user-001",
  email: "owner@apexconsulting.com",
  name: "Alex Mercer",
  avatar: undefined,
  role: "OWNER",
  createdAt: "2025-01-15T08:00:00Z",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: mockUser,
      business: mockBusiness,
      isAuthenticated: true,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1000));

        // Accept any email/password for demo; in prod this would call /api/v1/auth/login
        if (email && password.length >= 6) {
          set({
            user: { ...mockUser, email },
            business: mockBusiness,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, business: null, isAuthenticated: false });
      },

      updateBusiness: (data) => {
        set((state) => ({
          business: state.business ? { ...state.business, ...data } : null,
        }));
      },
    }),
    {
      name: "opsagent-auth",
      partialize: (state) => ({
        user: state.user,
        business: state.business,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
