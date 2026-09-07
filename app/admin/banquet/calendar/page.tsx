"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Sparkles,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface ScheduledEvent {
  id: string;
  title: string;
  client: string;
  venue: string;
  date: string;
  timeSlot: "Morning" | "Evening" | "Full Day";
  guests: number;
  status: "CONFIRMED" | "TENTATIVE";
  notes?: string;
}

export default function BanquetCalendarPage() {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(() => new Date("2026-09-07T00:00:00"));
  const [modalOpen, setModalOpen] = useState(false);

  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([
    {
      id: "EVT-101",
      title: "SAIL Bokaro Leadership Conference",
      client: "Bokaro Steel Plant (SAIL)",
      venue: "AC Banquet Hall",
      date: "2026-09-08",
      timeSlot: "Full Day",
      guests: 180,
      status: "CONFIRMED",
      notes: "Projector, stage podium & high-tea buffet",
    },
    {
      id: "EVT-102",
      title: "Agarwal Family Silver Jubilee",
      client: "Rajesh Agarwal",
      venue: "Wedding Lawn",
      date: "2026-09-11",
      timeSlot: "Evening",
      guests: 150,
      status: "CONFIRMED",
      notes: "Outdoor lighting, cocktail bar & buffet",
    },
    {
      id: "EVT-103",
      title: "Deshmukh Sangeet & Reception",
      client: "Ananya Deshmukh",
      venue: "Grand Ballroom",
      date: "2026-09-12",
      timeSlot: "Evening",
      guests: 450,
      status: "CONFIRMED",
      notes: "Grand stage, DJ console & flower decor",
    },
    {
      id: "EVT-104",
      title: "Rotary Club Bokaro Meeting",
      client: "Rotary International",
      venue: "AC Banquet Hall",
      date: "2026-09-13",
      timeSlot: "Morning",
      guests: 80,
      status: "TENTATIVE",
      notes: "Breakfast buffet & podium mic",
    },
  ]);

  const venues = [
    { name: "Grand Ballroom", capacity: "500 Guests", floor: "Ground Floor" },
    { name: "AC Banquet Hall", capacity: "250 Guests", floor: "1st Floor" },
    { name: "Wedding Lawn", capacity: "800 Guests", floor: "Outdoor Lawn" },
  ];

  // Generate 7 days for the weekly slot view
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase(),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  const shiftDays = (offset: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    setCurrentDate(next);
  };

  const [newEvent, setNewEvent] = useState({
    title: "",
    client: "",
    venue: "Grand Ballroom",
    date: "2026-09-08",
    timeSlot: "Evening" as "Morning" | "Evening" | "Full Day",
    guests: 200,
    notes: "",
  });

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ScheduledEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: newEvent.title,
      client: newEvent.client,
      venue: newEvent.venue,
      date: newEvent.date,
      timeSlot: newEvent.timeSlot,
      guests: Number(newEvent.guests),
      status: "CONFIRMED",
      notes: newEvent.notes,
    };
    setScheduledEvents([...scheduledEvents, created]);
    showToast(`Event '${newEvent.title}' scheduled on ${newEvent.date}!`, "success");
    setModalOpen(false);
    setNewEvent({
      title: "",
      client: "",
      venue: "Grand Ballroom",
      date: "2026-09-08",
      timeSlot: "Evening",
      guests: 200,
      notes: "",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Background subtle luxury glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Main Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Event Scheduler & Banquet Slots
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/banquet"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Venues Management"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                Banquet & Event Calendar
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Monitor venue slot occupancy, scheduled wedding dates, corporate meetings, and banquet reservations.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <div className="flex items-center space-x-1.5 mr-2">
              <button
                onClick={() => shiftDays(-7)}
                title="Previous Week"
                className="w-9 h-9 rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => shiftDays(7)}
                title="Next Week"
                className="w-9 h-9 rounded-lg bg-[#0E151D] hover:bg-[#B8893E] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>BOOK EVENT SLOT</span>
            </button>
          </div>
        </div>

        {/* 2. Venue Schedule Matrix */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden space-y-6">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EDE6DB]">
                  <th className="py-4 px-5 font-bold text-[#A97A38] uppercase tracking-wider text-[11px] w-64">
                    EVENT VENUE
                  </th>
                  {days.map((day) => (
                    <th key={day.dateStr} className="py-3.5 px-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-[#777065] block tracking-wider">
                        {day.dayName}
                      </span>
                      <div className="text-[13px] font-bold text-[#111923] mt-0.5">
                        {day.dayNumber} {day.month}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB]">
                {venues.map((venue) => (
                  <tr key={venue.name} className="hover:bg-[#FCFAF6]/60 transition-colors">
                    {/* Venue Details */}
                    <td className="py-4 px-5 align-middle">
                      <div className="font-bold text-[13.5px] text-[#A97A38]">
                        {venue.name}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-0.5 font-normal">
                        {venue.capacity} • {venue.floor}
                      </div>
                    </td>

                    {/* Day Slots */}
                    {days.map((day) => {
                      const eventsOnDay = scheduledEvents.filter(
                        (e) => e.venue === venue.name && e.date === day.dateStr
                      );

                      return (
                        <td key={day.dateStr} className="py-3 px-2 text-center align-middle">
                          {eventsOnDay.length === 0 ? (
                            <div className="p-2.5 rounded-xl border border-dashed border-[#E8DFD2] bg-[#FAF7F2]/40 text-center text-[#A89F91] text-[11px]">
                              <span className="block font-medium">Available</span>
                              <span className="text-[9px] uppercase tracking-wider text-[#B8893E]/60 block mt-0.5">
                                Open Slot
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {eventsOnDay.map((evt) => (
                                <div
                                  key={evt.id}
                                  className={`p-2.5 rounded-xl border text-left shadow-2xs transition-all ${
                                    evt.status === "CONFIRMED"
                                      ? "bg-[#DCFCE7]/70 border-[#86EFAC] text-[#15803D]"
                                      : "bg-[#FEF3C7]/70 border-[#FDE68A] text-[#B45309]"
                                  }`}
                                >
                                  <div className="font-bold text-[11.5px] truncate text-[#111923]">
                                    {evt.title}
                                  </div>
                                  <div className="text-[10px] text-[#6B6255] mt-0.5 flex items-center justify-between">
                                    <span>{evt.timeSlot}</span>
                                    <span className="font-bold">{evt.guests} pax</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Footer Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs pt-4 border-t border-[#EDE6DB] gap-3">
            <div className="flex flex-wrap items-center gap-4 text-[#554E44]">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] inline-block" />
                <span className="text-[11px] font-medium">Confirmed Booking</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] inline-block" />
                <span className="text-[11px] font-medium">Tentative / Inquiry</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-xs border border-dashed border-[#B8893E] bg-[#FAF7F2] inline-block" />
                <span className="text-[11px] font-medium">Available Slot</span>
              </span>
            </div>

            <span className="text-[11px] text-[#A97A38] italic font-medium">
              * Click any slot or use the button above to book a new event slot.
            </span>
          </div>
        </div>

        {/* Modal: Book Event Slot */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 font-sans">
              <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3.5">
                <h3 className="font-serif text-[22px] font-bold text-[#111923]">
                  Book Banquet / Event Slot
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookSlot} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Event Title / Function Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="e.g. Sharma Sangeet Night / Corporate Annual Meet"
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Client / Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newEvent.client}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, client: e.target.value })
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Target Venue
                    </label>
                    <select
                      value={newEvent.venue}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, venue: e.target.value })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      <option value="Grand Ballroom">Grand Ballroom</option>
                      <option value="AC Banquet Hall">AC Banquet Hall</option>
                      <option value="Wedding Lawn">Wedding Lawn</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={newEvent.timeSlot}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          timeSlot: e.target.value as any,
                        })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Expected Pax
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={newEvent.guests}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, guests: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Special Specs / Catering Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newEvent.notes}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, notes: e.target.value })
                    }
                    placeholder="e.g. Stage backdrop, DJ setup, AC banquet buffet..."
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2.5 pt-4 border-t border-[#EDE6DB]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] rounded-xl text-xs font-semibold text-[#111923] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Confirm Slot Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
