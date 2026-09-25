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
  CheckCheck,
  Radio,
} from "lucide-react";
import { useAdminWebSocket } from "./AdminWebSocketContext";

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Recent";
  }
}

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

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    connectionStatus,
  } = useAdminWebSocket();

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
    <header className="sticky top-0 z-20 bg-white border-b border-[#EAE2D5] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xs pt-[calc(0.625rem+env(safe-area-inset-top))]">
      {/* Left: Mobile Toggle & Live Date/Time Clock or Brand */}
      <div className="flex items-center space-x-2.5 sm:space-x-5">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#111E31] rounded-xl bg-[#F8F5F0] border border-[#EAE2D5] hover:bg-[#EFE9DF] active:scale-95 transition-all cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Name */}
        <div className="lg:hidden flex flex-col justify-center">
          <span className="font-serif tracking-[0.14em] text-[13px] font-bold text-[#111E31] uppercase">
            HOTEL RELIANCE
          </span>
          <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#9E712E] font-semibold">
            CONTROL CENTER
          </span>
        </div>

        {/* Desktop Live Date and Time Display */}
        <div className="hidden lg:flex items-center space-x-3 text-xs text-[#2D2A26]">
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
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* + NEW RESERVATION CTA */}
        {onOpenQuickBooking && (
          <button
            onClick={onOpenQuickBooking}
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#9E712E] hover:bg-[#8A6124] active:scale-95 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs transition-all cursor-pointer"
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
          className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F8F5F0] text-[#111E31] text-xs font-semibold border border-[#D8CFBF] hover:border-[#9E712E] transition-all shadow-xs group"
          title="Open customer website in a new tab"
        >
          <span>View Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#9E712E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Live WebSocket Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold border transition-all ${
          connectionStatus === 'connected'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : connectionStatus === 'connecting'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }">
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-emerald-500 animate-pulse"
                : connectionStatus === "connecting"
                ? "bg-amber-500 animate-ping"
                : "bg-rose-500"
            }`}
          />
          <span className="tracking-wide">
            {connectionStatus === "connected"
              ? "Live Sync"
              : connectionStatus === "connecting"
              ? "Connecting..."
              : "Offline"}
          </span>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#111E31] hover:bg-[#F8F5F0] active:scale-95 transition-all cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-[#2D2A26]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9E712E] text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white border border-[#EAE2D5] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-[#EAE2D5] flex items-center justify-between bg-[#FAF7F2]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#9E712E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111E31]">
                    Live Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#9E712E] text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#9E712E] hover:text-[#7A541E] font-semibold flex items-center space-x-1 cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read all</span>
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-[#6B6255] hover:text-[#111E31] rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-[#EAE2D5]/60 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8C8275]">
                    No notifications yet. Live reservations will pop up here.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                      }}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-[#FAF7F2] ${
                        !notif.read ? "bg-[#FAF5EE]/70" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#9E712E] flex-shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-[#111E31] truncate">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C8275] whitespace-nowrap">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B6255] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.bookingId && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#9E712E] font-medium">
                            #{notif.bookingId}
                          </span>
                          <Link
                            href={`/admin/bookings?search=${notif.bookingId}`}
                            onClick={() => {
                              markAsRead(notif.id);
                              setNotifOpen(false);
                            }}
                            className="text-[10px] font-bold text-[#9E712E] hover:underline"
                          >
                            View Booking →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-[#FAF7F2] text-center border-t border-[#EAE2D5] flex items-center justify-between px-4">
                <span className="text-[10px] text-[#8C8275]">
                  Status: {connectionStatus === "connected" ? "● Connected" : "Connecting..."}
                </span>
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-[#9E712E] hover:text-[#7A541E] font-bold tracking-wider uppercase"
                >
                  Configure Templates →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 pl-1.5 py-1.5 pr-1.5 min-h-[44px] rounded-xl hover:bg-[#F8F5F0] active:scale-95 transition-all cursor-pointer text-left"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#8C6527] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs flex-shrink-0">
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
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#EAE2D5] rounded-2xl shadow-2xl py-2 z-50 text-xs text-[#2D2A26] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-[#EAE2D5] md:hidden">
                <div className="font-bold text-[#111E31]">Vikramaditya Roy</div>
                <div className="text-[10px] text-[#9E712E] font-semibold">General Manager</div>
              </div>
              <Link
                href="/admin/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-4 py-2.5 hover:bg-[#F8F5F0] text-[#111E31] font-medium"
              >
                Profile Settings
              </Link>
              <Link
                href="/admin/security"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-4 py-2.5 hover:bg-[#F8F5F0] text-[#111E31] font-medium"
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
                className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
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
