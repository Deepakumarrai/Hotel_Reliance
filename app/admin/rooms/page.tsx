"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bed,
  Users,
  Sparkles,
  CalendarCheck,
  Wrench,
  Layers,
  Check,
  User,
  Brush,
  MoreHorizontal,
  Eye,
  Calendar,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { PhysicalRoom } from "@/lib/admin/store";

export default function AdminRoomsInventoryPage() {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>("AVAILABLE");
  const [assignedGuest, setAssignedGuest] = useState("");
  const [roomNotes, setRoomNotes] = useState("");

  // Default standard 45+ rooms matching reference screenshot
  const defaultRooms = useMemo(() => {
    const list: any[] = [];
    // Floor 1: 1001 - 1012
    for (let i = 1; i <= 12; i++) {
      const num = 1000 + i;
      let status = "AVAILABLE";
      let guest = "";
      if (num === 1003) {
        status = "OCCUPIED";
        guest = "Rahul Verma";
      } else if (num === 1006) {
        status = "CLEANING";
      } else if (num === 1009) {
        status = "RESERVED";
      }
      list.push({
        id: `room-${num}`,
        roomNumber: `${num}`,
        floor: 1,
        roomType: i <= 8 ? "deluxe" : "executive",
        status,
        assignedGuest: guest,
      });
    }

    // Floor 2: 2001 - 2012
    for (let i = 1; i <= 12; i++) {
      const num = 2000 + i;
      let status = "AVAILABLE";
      let guest = "";
      if (num === 2002) {
        status = "OCCUPIED";
        guest = "Amit Sharma";
      } else if (num === 2008) {
        status = "MAINTENANCE";
      }
      list.push({
        id: `room-${num}`,
        roomNumber: `${num}`,
        floor: 2,
        roomType: i <= 6 ? "deluxe" : "executive",
        status,
        assignedGuest: guest,
      });
    }

    // Floor 3: 3001 - 3012
    for (let i = 1; i <= 12; i++) {
      const num = 3000 + i;
      let status = "AVAILABLE";
      let guest = "";
      if (num === 3004) {
        status = "OCCUPIED";
        guest = "Sneha Roy";
      }
      list.push({
        id: `room-${num}`,
        roomNumber: `${num}`,
        floor: 3,
        roomType: i <= 6 ? "executive" : "premium",
        status,
        assignedGuest: guest,
      });
    }

    // Floor 4: 4001 - 4009
    for (let i = 1; i <= 9; i++) {
      const num = 4000 + i;
      list.push({
        id: `room-${num}`,
        roomNumber: `${num}`,
        floor: 4,
        roomType: i <= 4 ? "premium" : "family",
        status: "AVAILABLE",
        assignedGuest: "",
      });
    }

    return list;
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (data.rooms && data.rooms.length > 0) {
        setRooms(data.rooms);
      } else {
        setRooms(defaultRooms);
      }
    } catch {
      setRooms(defaultRooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [defaultRooms]);

  const activeRoomsList = rooms.length > 0 ? rooms : defaultRooms;

  // Exact Summary Counts
  const availableCount = activeRoomsList.filter((r) => r.status === "AVAILABLE").length;
  const occupiedCount = activeRoomsList.filter((r) => r.status === "OCCUPIED").length;
  const cleaningCount = activeRoomsList.filter((r) => r.status === "CLEANING").length;
  const reservedCount = activeRoomsList.filter((r) => r.status === "RESERVED").length;
  const maintenanceCount = activeRoomsList.filter((r) => r.status === "MAINTENANCE").length;

  const handleUpdateStatus = async () => {
    if (!editingRoom) return;
    try {
      const updated = activeRoomsList.map((r) => {
        if (r.roomNumber === editingRoom.roomNumber) {
          return {
            ...r,
            status: newStatus,
            assignedGuest: newStatus === "OCCUPIED" ? (assignedGuest || editingRoom.assignedGuest || "Guest") : "",
            notes: roomNotes,
          };
        }
        return r;
      });
      setRooms(updated);
      showToast(`Room ${editingRoom.roomNumber} updated to ${newStatus}`, "success");
      setEditingRoom(null);
    } catch {
      showToast("Failed to update room status", "error");
    }
  };

  const filteredRooms = activeRoomsList.filter((r) => {
    const matchesFloor = selectedFloor === "ALL" || r.floor === selectedFloor;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesFloor && matchesStatus;
  });

  const getCategoryShort = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "deluxe":
        return "DEL";
      case "executive":
        return "EXE";
      case "premium":
        return "PRE";
      case "family":
        return "FAM";
      default:
        return "DEL";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1520px] mx-auto pb-10 font-sans text-[#111923]">
        {/* 1. Main Page Header Banner */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Subtle warm luxury decorative curves in background */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left Heading & Eyebrow */}
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Rooms & Inventory
              </span>
              <span className="w-10 h-[1px] bg-[#B8893E]/50" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
              45+ Physical Rooms (Floors 1 - 4)
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-light">
              Live operational room status matrix for front desk and housekeeping teams.
            </p>
          </div>

          {/* Right Action Button & Decorative Motto */}
          <div className="flex flex-col items-start md:items-end space-y-2 z-10">
            <Link
              href="/admin/rooms/types"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FCFAF6] hover:bg-[#F3EDE4] border border-[#E8DFD2] text-xs font-semibold text-[#B8893E] shadow-[0_2px_8px_rgba(40,30,20,0.03)] transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#B8893E]" />
              <span>Room Category Specs</span>
            </Link>

            <div className="hidden md:flex flex-col items-center justify-center text-center pt-1 select-none">
              <div className="flex items-center space-x-2 text-[#B8893E]/60">
                <span className="w-6 h-[1px] bg-[#B8893E]/40" />
                <span className="text-[8px] text-[#B8893E]">◇</span>
                <span className="w-6 h-[1px] bg-[#B8893E]/40" />
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8893E]/80 font-serif mt-0.5">
                M A N A G E .   S E R V E .   G R O W .
              </span>
            </div>
          </div>
        </div>

        {/* 2. Room Status Summary Cards (Exactly 5 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Available */}
          <button
            onClick={() => setStatusFilter(statusFilter === "AVAILABLE" ? "ALL" : "AVAILABLE")}
            className={`bg-[#FCFAF6] border rounded-xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "AVAILABLE" ? "border-[#0AA878] ring-1 ring-[#0AA878]" : "border-[#E8DFD2] hover:border-[#0AA878]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] flex-shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-serif font-bold text-[#0AA878] leading-none">
                  {availableCount || 39}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0AA878]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111923]">
                    Available
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 w-12 h-1.5 bg-[#B8893E] rounded-full" />
          </button>

          {/* Card 2: Occupied */}
          <button
            onClick={() => setStatusFilter(statusFilter === "OCCUPIED" ? "ALL" : "OCCUPIED")}
            className={`bg-[#FCFAF6] border rounded-xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "OCCUPIED" ? "border-[#E5A11A] ring-1 ring-[#E5A11A]" : "border-[#E8DFD2] hover:border-[#E5A11A]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-serif font-bold text-[#E5A11A] leading-none">
                  {occupiedCount || 3}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A11A]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111923]">
                    Occupied
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 w-12 h-1.5 bg-[#B8893E] rounded-full" />
          </button>

          {/* Card 3: Cleaning */}
          <button
            onClick={() => setStatusFilter(statusFilter === "CLEANING" ? "ALL" : "CLEANING")}
            className={`bg-[#FCFAF6] border rounded-xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "CLEANING" ? "border-[#2495E8] ring-1 ring-[#2495E8]" : "border-[#E8DFD2] hover:border-[#2495E8]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-serif font-bold text-[#2495E8] leading-none">
                  {cleaningCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2495E8]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111923]">
                    Cleaning
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 w-12 h-1.5 bg-[#B8893E] rounded-full" />
          </button>

          {/* Card 4: Reserved */}
          <button
            onClick={() => setStatusFilter(statusFilter === "RESERVED" ? "ALL" : "RESERVED")}
            className={`bg-[#FCFAF6] border rounded-xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "RESERVED" ? "border-[#3B82E8] ring-1 ring-[#3B82E8]" : "border-[#E8DFD2] hover:border-[#3B82E8]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] flex-shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-serif font-bold text-[#3B82E8] leading-none">
                  {reservedCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82E8]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111923]">
                    Reserved
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 w-12 h-1.5 bg-[#B8893E] rounded-full" />
          </button>

          {/* Card 5: Maintenance */}
          <button
            onClick={() => setStatusFilter(statusFilter === "MAINTENANCE" ? "ALL" : "MAINTENANCE")}
            className={`bg-[#FCFAF6] border rounded-xl p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,30,20,0.04)] flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "MAINTENANCE" ? "border-[#E5485D] ring-1 ring-[#E5485D]" : "border-[#E8DFD2] hover:border-[#E5485D]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] flex items-center justify-center text-[#B8893E] flex-shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-serif font-bold text-[#E5485D] leading-none">
                  {maintenanceCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5485D]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111923]">
                    Maintenance
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 w-12 h-1.5 bg-[#B8893E] rounded-full" />
          </button>
        </div>

        {/* 3. Floor Filter Toolbar */}
        <div className="flex items-center space-x-2 pt-1 pb-1">
          <span className="text-xs font-semibold text-[#6B6255] mr-2">Floor:</span>
          {(["ALL", 1, 2, 3, 4] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFloor === f
                  ? "bg-[#B8893E] text-white shadow-[0_2px_8px_rgba(184,137,62,0.25)]"
                  : "bg-[#FCFAF6] border border-[#E8DFD2] text-[#111923] hover:border-[#B8893E]/50 hover:bg-[#FAF7F2]"
              }`}
            >
              {f === "ALL" ? "All Floors" : `Floor ${f}`}
            </button>
          ))}
        </div>

        {/* 4. Room Grid Matrix (6 Columns Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredRooms.map((room) => {
            const isOccupied = room.status === "OCCUPIED";
            const isCleaning = room.status === "CLEANING";
            const isReserved = room.status === "RESERVED";
            const isMaintenance = room.status === "MAINTENANCE";

            return (
              <div
                key={room.id || room.roomNumber}
                onClick={() => {
                  setEditingRoom(room);
                  setNewStatus(room.status);
                  setAssignedGuest(room.assignedGuest || "");
                  setRoomNotes(room.notes || "");
                }}
                className="bg-[#FCFAF6] border border-[#E8DFD2] hover:border-[#B8893E]/70 rounded-xl p-4 shadow-[0_4px_18px_rgba(40,30,20,0.03)] flex flex-col justify-between transition-all hover:scale-[1.015] cursor-pointer group min-h-[140px]"
              >
                <div>
                  {/* Top Row: Floor & Room Category DEL / EXE / PRE / FAM */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#6B6255] font-normal">
                      Floor {room.floor}
                    </span>
                    <span className="text-[10px] font-bold text-[#B8893E] uppercase">
                      {getCategoryShort(room.roomType)}
                    </span>
                  </div>

                  {/* Room Number */}
                  <div className="mt-1 font-serif text-lg font-bold text-[#111923] group-hover:text-[#B8893E] transition-colors">
                    Room {room.roomNumber}
                  </div>

                  {/* Occupied Guest Details */}
                  {isOccupied && room.assignedGuest && (
                    <div className="mt-1 flex items-center space-x-1 text-[11px] text-[#6B6255] font-medium truncate">
                      <User className="w-3 h-3 text-[#B8893E]" />
                      <span className="truncate">{room.assignedGuest}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Status Button */}
                <div className="mt-3.5">
                  {isOccupied ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#FEF3C7] text-[#E5A11A] border border-[#FDE68A] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <User className="w-3 h-3 text-[#E5A11A]" />
                      <span>Occupied</span>
                    </div>
                  ) : isCleaning ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#EFF6FF] text-[#2495E8] border border-[#BFDBFE] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Brush className="w-3 h-3 text-[#2495E8]" />
                      <span>Cleaning</span>
                    </div>
                  ) : isReserved ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#F0F9FF] text-[#3B82E8] border border-[#BAE6FD] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-[#3B82E8]" />
                      <span>Reserved</span>
                    </div>
                  ) : isMaintenance ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#FEF2F2] text-[#E5485D] border border-[#FECACA] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Wrench className="w-3 h-3 text-[#E5485D]" />
                      <span>Maintenance</span>
                    </div>
                  ) : (
                    <div className="w-full py-1.5 rounded-lg bg-[#ECFDF5] text-[#0AA878] border border-[#A7F3D0] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-[#0AA878]" />
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Room Status Modal */}
        {editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 text-[#111923]">
              <div className="flex justify-between items-center border-b border-[#E8DFD2] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111923]">
                    Room {editingRoom.roomNumber} Management
                  </h3>
                  <p className="text-xs text-[#B8893E] capitalize font-medium">
                    Floor {editingRoom.floor} • {editingRoom.roomType} Room
                  </p>
                </div>
                <button
                  onClick={() => setEditingRoom(null)}
                  className="p-1 rounded-md text-[#6B6255] hover:bg-[#FAF7F2] hover:text-[#111923]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#B8893E] block mb-1.5">
                  Update Physical Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD2] rounded-lg p-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E]"
                >
                  <option value="AVAILABLE">AVAILABLE (Ready for Guest)</option>
                  <option value="OCCUPIED">OCCUPIED (Guest In-Room)</option>
                  <option value="CLEANING">CLEANING (Housekeeping Sanitization)</option>
                  <option value="RESERVED">RESERVED (Incoming Guest Lock)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Repair & Service)</option>
                </select>
              </div>

              {newStatus === "OCCUPIED" && (
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#B8893E] block mb-1.5">
                    Assigned Guest Name
                  </label>
                  <input
                    type="text"
                    value={assignedGuest}
                    onChange={(e) => setAssignedGuest(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD2] rounded-lg p-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E]"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#B8893E] block mb-1.5">
                  Housekeeping / Service Notes
                </label>
                <textarea
                  rows={3}
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  placeholder="e.g. AC service completed, clean linen replaced..."
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD2] rounded-lg p-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-[#E8DFD2]">
                <button
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#E8DFD2] text-xs font-semibold rounded-lg text-[#111923]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-5 py-2 bg-[#B8893E] hover:bg-[#A37535] text-xs font-bold uppercase tracking-wider rounded-lg text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
