"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  PlusCircle,
  ExternalLink,
  Calendar,
  Clock,
  X,
  Globe,
  Search
} from "lucide-react";
import { useToast } from "./ToastContext";

export function AdminHeader({
  setMobileOpen,
  onOpenQuickBooking,
}: {
  setMobileOpen: (open: boolean) => void;
  onOpenQuickBooking?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDay(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  interface HeaderNotif {
    id: string;
    title: string;
    desc: string;
    time: string;
  }
  const [notifications, setNotifications] = useState<HeaderNotif[]>([]);

  useEffect(() => {
    fetch("/api/admin/security")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.auditLogs)) {
          const mapped = d.auditLogs.slice(0, 6).map((log: any) => ({
            id: log.id,
            title: `${log.action} — ${log.entity}`,
            desc: log.newValue || log.oldValue || `Admin: ${log.adminUser}`,
            time: new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          }));
          setNotifications(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/bookings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0B1423]/95 backdrop-blur-md border-b border-[#1B2A42] px-4 lg:px-8 py-3 flex items-center justify-between text-white shadow-xl">
      {/* Left: Mobile Toggle & Live Bokaro Date/Time Clock */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg bg-[#111E31] border border-[#1B2A42] transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Date and Time Display */}
        <div className="hidden sm:flex items-center space-x-2.5 bg-[#111E31] border border-[#1B2A42] px-3.5 py-1.5 rounded-lg shadow-inner">
          <div className="flex items-center space-x-1.5 text-xs text-[#E9DFD2]">
            <Calendar className="w-3.5 h-3.5 text-[#C4984F]" />
            <span className="font-semibold text-white">{currentDay}</span>
            <span className="text-white/40">,</span>
            <span className="text-[#E9DFD2]/80">{currentDate}</span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center space-x-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#C4984F]" />
            <span className="text-[#D8B875] font-mono font-bold tracking-wider">
              {currentTime || "Loading..."}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Fast Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full mx-4">
        <Search className="w-3.5 h-3.5 absolute left-3 text-white/40 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guest, ID, phone..."
          className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4984F] transition-all"
        />
      </form>

      {/* Right: Quick CTA, View Website Button & Notifications */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Quick New Reservation CTA */}
        {onOpenQuickBooking && (
          <button
            onClick={onOpenQuickBooking}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Reservation</span>
            <span className="sm:hidden">Book</span>
          </button>
        )}

        {/* View Customer Website Button */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111E31] hover:bg-[#1B2A42] text-[#E9DFD2] hover:text-white text-xs font-semibold border border-[#1B2A42] hover:border-[#C4984F]/50 transition-all shadow-sm group"
          title="Open customer website in a new tab"
        >
          <Globe className="w-3.5 h-3.5 text-[#C4984F] group-hover:rotate-12 transition-transform" />
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 text-[#D8B875]" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg bg-[#111E31] hover:bg-[#1B2A42] text-white transition-colors border border-[#1B2A42] cursor-pointer"
            title="System Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-[#D8B875]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C4984F] animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1423] border border-[#1B2A42] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#C4984F]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Audit Alerts & Updates
                  </span>
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[#1B2A42]/60 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    No recent system notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-[#111E31]/60 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#D8B875]">{n.title}</span>
                        <span className="text-[10px] text-white/50">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#E9DFD2]/70 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-[#070D17] text-center border-t border-[#1B2A42]">
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-[#C4984F] hover:text-[#D8B875] font-semibold tracking-wider uppercase"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
