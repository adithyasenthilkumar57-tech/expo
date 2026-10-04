"use client";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
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
      <div className="flex items-center justify-center h-screen bg-[var(--bg-base)]">
        <div className="mesh-bg" aria-hidden="true" />
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)] relative">
      <div className="mesh-bg" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex relative z-10 h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto relative z-10 min-w-0"
        id="main-content"
        tabIndex={-1}
      >
        {/* Skip navigation link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        <div className="min-h-full pb-28 lg:pb-16">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
