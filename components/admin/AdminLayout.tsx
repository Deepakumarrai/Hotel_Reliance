"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { ToastProvider } from "./ToastContext";
import { QuickBookingModal } from "./QuickBookingModal";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#070D17] text-[#E9DFD2] font-sans selection:bg-[#9E712E] selection:text-white">
        {/* Sidebar */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            setMobileOpen={setMobileOpen}
            onOpenQuickBooking={() => setQuickBookingOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
