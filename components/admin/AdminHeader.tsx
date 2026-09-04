"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { useToast } from "./ToastContext";

export function AdminHeader({
  setMobileOpen,
  onOpenQuickBooking,
}: {
  setMobileOpen: (open: boolean) => void;
  onOpenQuickBooking?: () => void;
}) {
  const { showToast } = useToast();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: "n1",
      title: "New Booking #HR-98220",
      desc: "Vikash Agarwal booked Family Suite for 2 nights.",
      time: "10 mins ago",
      type: "booking",
    },
    {
      id: "n2",
      title: "Banquet Enquiry Received",
      desc: "Wedding reception quote for 280 guests.",
      time: "1 hr ago",
      type: "banquet",
    },
    {
      id: "n3",
      title: "Room 104 Housekeeping",
      desc: "Room 104 marked as CLEANING.",
      time: "2 hrs ago",
      type: "room",
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#111E31] border-b border-[#1B2A42] px-4 lg:px-8 py-3.5 flex items-center justify-between text-white shadow-md">
      {/* Left: Mobile Toggle & Date Display */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-white/80 hover:text-white rounded-md bg-[#1B2A42] hover:bg-[#1B2A42]/80 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2.5 text-xs text-[#E9DFD2]/80 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#C4984F]" />
          <span>{currentDate || "Today"}</span>
          <span className="text-white/20">•</span>
          <Clock className="w-3.5 h-3.5 text-[#C4984F]" />
          <span className="text-[#D8B875] font-semibold">{currentTime}</span>
        </div>
      </div>

      {/* Right: Quick CTA, Notifications & View Live Site */}
      <div className="flex items-center space-x-3">
        {onOpenQuickBooking && (
          <button
            onClick={onOpenQuickBooking}
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-white text-xs font-semibold tracking-wider uppercase shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
        )}

        {/* View Live Public Site */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#1B2A42] hover:bg-[#253755] text-[#E9DFD2] text-xs font-medium border border-[#9E712E]/30 transition-colors"
          title="Open Hotel Reliance Public Website in New Tab"
        >
          <span>View Website</span>
          <ExternalLink className="w-3 h-3 text-[#C4984F]" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded bg-[#1B2A42] hover:bg-[#253755] text-white transition-colors border border-[#1B2A42]"
            title="System Notifications"
          >
            <Bell className="w-4 h-4 text-[#D8B875]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C4984F] animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1423] border border-[#1B2A42] rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#C4984F]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Notifications & Alerts
                  </span>
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[#1B2A42] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#111E31]/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#D8B875]">{n.title}</span>
                      <span className="text-[10px] text-white/50">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#E9DFD2]/70 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
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
