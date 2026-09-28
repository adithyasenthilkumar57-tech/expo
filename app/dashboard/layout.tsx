"use client";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { LoadingSpinner } from "@/components/ui/Card";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="mesh-bg" />
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0E1A] relative">
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex relative z-10">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
