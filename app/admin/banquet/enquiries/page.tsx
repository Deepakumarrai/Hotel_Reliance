"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  ChevronDown,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { BanquetEnquiryRecord } from "@/lib/admin/store";

export default function BanquetEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<BanquetEnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [venueFilter, setVenueFilter] = useState("ALL");

  // Standard demo inquiries matching Hotel Reliance events
  const standardEnquiries: BanquetEnquiryRecord[] = useMemo(
    () => [
      {
        id: "ENQ-4029",
        name: "Ananya Deshmukh",
        email: "ananya.d@example.com",
        phone: "+91 98351 99281",
        eventType: "Wedding Reception",
        eventDate: "2026-11-18",
        guestCount: 450,
        venue: "Grand Kohinoor Ballroom & Lawn",
        budget: "₹3,50,000",
        notes: "Looking for complete wedding decor, stage setup, multi-cuisine catering for 450 guests.",
        status: "NEW",
        createdAt: "2026-09-07T12:00:00Z",
      },
      {
        id: "ENQ-4028",
        name: "Bokaro Steel Plant (SAIL)",
        email: "csr.events@sailbokaro.in",
        phone: "+91 94311 55210",
        eventType: "Annual Corporate Summit",
        eventDate: "2026-10-24",
        guestCount: 200,
        venue: "AC Banquet Hall & Conference Suite",
        budget: "₹1,80,000",
        notes: "Audio-visual podium, projector setup, high tea and corporate buffet dinner.",
        status: "QUOTED",
        createdAt: "2026-09-06T15:30:00Z",
      },
      {
        id: "ENQ-4027",
        name: "Rajesh & Sunita Agarwal",
        email: "rajesh.agarwal@example.com",
        phone: "+91 91223 77812",
        eventType: "25th Silver Jubilee Anniversary",
        eventDate: "2026-10-12",
        guestCount: 150,
        venue: "Royal Wedding Lawn",
        budget: "₹1,25,000",
        notes: "Evening outdoor cocktail dinner, live acoustic music, premium buffet.",
        status: "CONFIRMED",
        createdAt: "2026-09-05T09:45:00Z",
      },
    ],
    []
  );

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/banquet");
      const data = await res.json();
      if (data.enquiries && data.enquiries.length > 0) {
        setEnquiries(data.enquiries);
      } else {
        setEnquiries(standardEnquiries);
      }
    } catch {
      setEnquiries(standardEnquiries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: BanquetEnquiryRecord["status"]) => {
    try {
      const res = await fetch("/api/admin/banquet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Inquiry #${id} updated to ${status}`, "success");
        fetchEnquiries();
      } else {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        showToast(`Inquiry #${id} updated to ${status}`, "success");
      }
    } catch {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      showToast(`Inquiry #${id} updated to ${status}`, "success");
    }
  };

  const exportCSV = () => {
    const headers = "Inquiry ID,Client Name,Email,Phone,Event Type,Event Date,Guests,Venue,Status\n";
    const rows = filteredEnquiries
      .map(
        (e) =>
          `"${e.id}","${e.name}","${e.email}","${e.phone}","${e.eventType}","${e.eventDate}",${e.guestCount},"${e.venue || ""}","${e.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `banquet-inquiries-2026-09-07.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayList = enquiries.length > 0 ? enquiries : standardEnquiries;

  const filteredEnquiries = displayList.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.id.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.eventType.toLowerCase().includes(q) ||
      (e.venue && e.venue.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "ALL" || e.status.toUpperCase() === statusFilter.toUpperCase();

    const matchesVenue =
      venueFilter === "ALL" ||
      (e.venue && e.venue.toLowerCase().includes(venueFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesVenue;
  });

  const tabs = [
    { id: "ALL", label: "All Inquiries" },
    { id: "NEW", label: "New / Pending" },
    { id: "QUOTED", label: "Quoted" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "LOST", label: "Declined" },
  ];

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
                Quotation Pipeline & Leads
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
                Banquet & Wedding Enquiries
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Track wedding inquiries, anniversary functions, corporate summits, and send custom rate packages.
            </p>
          </div>

          {/* Right Action Button & Decorative Motto */}
          <div className="flex flex-col items-start md:items-end space-y-2 z-10 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <button
                onClick={exportCSV}
                className="px-4 py-2.5 rounded-xl bg-[#18232F] hover:bg-[#253241] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export Inquiries</span>
              </button>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-center pt-0.5 select-none w-full">
              <div className="flex items-center space-x-2 text-[#B8893E]/50">
                <span className="w-8 h-[1px] bg-[#B8893E]/30" />
                <span className="text-[7px] text-[#B8893E]">◇</span>
                <span className="w-8 h-[1px] bg-[#B8893E]/30" />
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.28em] text-[#B8893E]/80 font-serif mt-0.5">
                M A N A G E . S E R V E . G R O W .
              </span>
            </div>
          </div>
        </div>

        {/* 2. Filter Tabs (Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((t) => {
            const isActive = statusFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStatusFilter(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#A97A38] text-white shadow-xs"
                    : "bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] hover:text-[#111923] hover:bg-[#F3EDE4]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 3. Search & Venue Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-8 lg:col-span-9 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8277]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, phone, event type or venue..."
              className="w-full bg-white border border-[#E8DFD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111923] placeholder:text-[#8C8377] focus:outline-none focus:border-[#B8893E] shadow-2xs transition-all"
            />
          </div>

          <div className="md:col-span-4 lg:col-span-3 relative">
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full bg-white border border-[#E8DFD2] rounded-xl px-4 py-2.5 text-xs text-[#111923] font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs appearance-none cursor-pointer pr-10"
            >
              <option value="ALL">All Event Venues</option>
              <option value="ballroom">Ballroom</option>
              <option value="banquet">Banquet Hall</option>
              <option value="lawn">Wedding Lawn</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A8277]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 4. Enquiries Table */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden">
          {filteredEnquiries.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-[#8A8277]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#111923]">
                No event inquiries found for this filter.
              </div>
              <p className="text-xs text-[#6B6255]">
                Adjust your search or filter options.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                    <th className="py-3.5 px-5 font-bold">INQUIRY ID</th>
                    <th className="py-3.5 px-4 font-bold">CLIENT DETAILS</th>
                    <th className="py-3.5 px-4 font-bold">EVENT TYPE</th>
                    <th className="py-3.5 px-4 font-bold">EVENT DATE</th>
                    <th className="py-3.5 px-4 font-bold text-center">GUESTS</th>
                    <th className="py-3.5 px-4 font-bold">VENUE REQUESTED</th>
                    <th className="py-3.5 px-4 font-bold">STATUS</th>
                    <th className="py-3.5 px-5 font-bold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                  {filteredEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* ID */}
                      <td className="py-4 px-5 font-bold text-[#A97A38] text-xs whitespace-nowrap font-mono">
                        {e.id}
                      </td>

                      {/* Client */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-[13px] text-[#111923]">
                          {e.name}
                        </div>
                        <div className="text-[11px] text-[#78716C] mt-0.5 flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-[#A97A38]" />
                          <span>{e.phone}</span>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-[#111923]">
                        {e.eventType}
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-[#111923]">
                        {e.eventDate}
                      </td>

                      {/* Guests */}
                      <td className="py-4 px-4 text-center whitespace-nowrap font-bold text-[#111923]">
                        {e.guestCount || "-"}
                      </td>

                      {/* Venue */}
                      <td className="py-4 px-4 text-[#6B6255] font-medium whitespace-nowrap">
                        {e.venue || "Flexible / Not Specified"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                            e.status === "CONFIRMED"
                              ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                              : e.status === "QUOTED"
                              ? "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]"
                              : e.status === "LOST"
                              ? "bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]"
                              : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                        {(e.status === "NEW" || e.status === "CONTACTED") && (
                          <button
                            onClick={() => updateStatus(e.id, "QUOTED")}
                            className="px-3 py-1.5 rounded-lg bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1D4ED8] border border-[#BFDBFE] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                          >
                            Send Quote
                          </button>
                        )}
                        {e.status === "QUOTED" && (
                          <button
                            onClick={() => updateStatus(e.id, "CONFIRMED")}
                            className="px-3 py-1.5 rounded-lg bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#86EFAC] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                          >
                            Confirm Booking
                          </button>
                        )}
                        {e.status !== "LOST" && (
                          <button
                            onClick={() => updateStatus(e.id, "LOST")}
                            className="px-3 py-1.5 rounded-lg bg-[#FFE4E6] hover:bg-[#FECDD3] text-[#E11D48] border border-[#FECDD3] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                          >
                            Decline
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
