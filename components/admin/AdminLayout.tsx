"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { ToastProvider } from "./ToastContext";
import { QuickBookingModal } from "./QuickBookingModal";
import { Loader2 } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F8F5F0] text-[#111E31] font-sans selection:bg-[#9E712E] selection:text-white">
        {/* Left Fixed Sidebar */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8F5F0] relative">
          <AdminHeader
            setMobileOpen={setMobileOpen}
            onOpenQuickBooking={() => setQuickBookingOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto relative">
            {isNavigating && (
              <div className="absolute inset-0 z-40 bg-[#F8F5F0]/85 backdrop-blur-xs flex flex-col items-center justify-center p-8 transition-opacity duration-200 pointer-events-none">
                <div className="flex flex-col items-center space-y-3 bg-white p-6 rounded-2xl border border-[#E8DFD2] shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] shadow-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-[#B8893E]" />
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-xs uppercase font-serif tracking-[0.2em] font-bold text-[#B8893E] block">
                      Loading Page Data...
                    </span>
                    <span className="text-[11px] text-[#6B6255] font-normal block">
                      Fetching live database records
                    </span>
                  </div>
                </div>
              </div>
            )}
            {children}
          </main>
        </div>

        {/* Quick Booking Modal */}
        {quickBookingOpen && (
          <QuickBookingModal onClose={() => setQuickBookingOpen(false)} />
        )}
      </div>
    </ToastProvider>
  );
}
