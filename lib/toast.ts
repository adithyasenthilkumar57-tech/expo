"use client";
import { create } from "zustand";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const toast = {
  success: (message: string, title?: string) =>
    useToastStore.getState().addToast({ message, title, type: "success" }),
  error: (message: string, title?: string) =>
    useToastStore.getState().addToast({ message, title, type: "error" }),
  info: (message: string, title?: string) =>
    useToastStore.getState().addToast({ message, title, type: "info" }),
  warning: (message: string, title?: string) =>
    useToastStore.getState().addToast({ message, title, type: "warning" }),
};
