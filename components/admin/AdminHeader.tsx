"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Plus,
  ExternalLink,
  Calendar,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";

export function AdminHeader({
  setMobileOpen,
  onOpenQuickBooking,
}: {
  setMobileOpen: (open: boolean) => void;
  onOpenQuickBooking?: () => void;
}) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: Mon, 7 Sept 2026
      const dayName = now.toLocaleDateString("en-IN", { weekday: "short" });
      const dayNum = now.getDate();
      const monthName = now.toLocaleDateString("en-IN", { month: "short" });
      const year = now.getFullYear();
      setCurrentDate(`${dayName}, ${dayNum} ${monthName} ${year}`);

      // Format: 09:25:48 pm
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).toLowerCase()
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#EAE2D5] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Live Date/Time Clock */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-[#111E31] rounded-lg bg-[#F8F5F0] border border-[#EAE2D5] hover:bg-[#EFE9DF] transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Date and Time Display */}
        <div className="flex items-center space-x-3 text-xs text-[#2D2A26]">
          <div className="flex items-center space-x-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#9E712E]" />
            <span className="font-semibold text-[#111E31]">{currentDate || "Mon, 7 Sept 2026"}</span>
          </div>

          <span className="text-[#D0C7B7]">|</span>

          <div className="flex items-center space-x-1.5 font-medium">
            <Clock className="w-4 h-4 text-[#9E712E]" />
            <span className="font-mono text-[#2D2A26] font-medium">
              {currentTime || "09:25:48 pm"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick CTA, View Website, Notifications & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* + NEW RESERVATION CTA */}
        {onOpenQuickBooking && (
          <button
            onClick={onOpenQuickBooking}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#9E712E] hover:bg-[#8A6124] active:scale-95 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Reservation</span>
          </button>
        )}

        {/* View Website Button */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#F8F5F0] text-[#111E31] text-xs font-semibold border border-[#D8CFBF] hover:border-[#9E712E] transition-all shadow-xs group"
          title="Open customer website in a new tab"
        >
          <span>View Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#9E712E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Notifications Icon with Badge "3" */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-[#111E31] hover:bg-[#F8F5F0] transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-[#2D2A26]" />
            <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-[#9E712E] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#EAE2D5] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-[#EAE2D5] flex items-center justify-between bg-[#FAF7F2]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#9E712E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111E31]">
                    Operational Notifications
                  </span>
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-[#6B6255] hover:text-[#111E31] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[#EAE2D5]/60 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#FAF7F2] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111E31]">VIP Arrival Today</span>
                    <span className="text-[10px] text-[#8C8275]">10m ago</span>
                  </div>
                  <p className="text-[11px] text-[#6B6255] mt-1">Suite 401: Mr. Roy check-in scheduled for 2:00 PM</p>
                </div>
                <div className="p-3 hover:bg-[#FAF7F2] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111E31]">Banquet Booking Confirmed</span>
                    <span className="text-[10px] text-[#8C8275]">1h ago</span>
                  </div>
                  <p className="text-[11px] text-[#6B6255] mt-1">Royal Ballroom: Wedding reception for 250 guests on 15 Oct</p>
                </div>
                <div className="p-3 hover:bg-[#FAF7F2] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111E31]">Housekeeping Update</span>
                    <span className="text-[10px] text-[#8C8275]">2h ago</span>
                  </div>
                  <p className="text-[11px] text-[#6B6255] mt-1">12 Executive Rooms inspected and ready for check-in</p>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F2] text-center border-t border-[#EAE2D5]">
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-[#9E712E] hover:text-[#7A541E] font-semibold tracking-wider uppercase"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2.5 pl-2 py-1 pr-1 rounded-lg hover:bg-[#F8F5F0] transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#8C6527] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
              VR
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-[#111E31] leading-tight">
                Vikramaditya Roy
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[#8C6527] font-semibold">
                General Manager
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C8275]" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EAE2D5] rounded-xl shadow-xl py-1.5 z-50 text-xs text-[#2D2A26] animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/admin/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-4 py-2 hover:bg-[#F8F5F0] text-[#111E31]"
              >
                Profile Settings
              </Link>
              <Link
                href="/admin/security"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-4 py-2 hover:bg-[#F8F5F0] text-[#111E31]"
              >
                Security & Audit
              </Link>
              <div className="border-t border-[#EAE2D5] my-1" />
              <button
                onClick={async () => {
                  setUserDropdownOpen(false);
                  await fetch("/api/admin/auth/logout", { method: "POST" });
                  window.location.href = "/admin/login";
                }}
                className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
