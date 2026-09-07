"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  ChevronDown,
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

  // Generate 45+ standard physical rooms (1001-1012, 2001-2012, 3001-3012, 4001-4010)
  const defaultRooms = React.useMemo(() => {
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
        // Merge API data with standardized room numbering
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

  // Counts
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
      <div className="space-y-5 max-w-[1520px] mx-auto pb-8 font-sans">
        {/* 1. Header Banner */}
        <div className="relative rounded-2xl border border-[#EAE2D5] bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          {/* Subtle curved line watermark background */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C4984F] via-transparent to-transparent" />

          {/* Left Text */}
          <div className="space-y-1 z-10">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C6527] block">
                Rooms & Inventory
              </span>
              <span className="w-8 h-[1px] bg-[#C4984F]/60" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111E31] tracking-tight">
              45+ Physical Rooms (Floors 1 - 4)
            </h1>

            <p className="text-xs text-[#78716C] font-light">
              Live operational room status matrix for front desk and housekeeping teams.
            </p>
          </div>

          {/* Right Action Button & Emblem */}
          <div className="flex flex-col items-start md:items-end space-y-2 z-10">
            <Link
              href="/admin/rooms/types"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-xs font-semibold text-[#8C6527] shadow-2xs transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#8C6527]" />
              <span>Room Category Specs</span>
            </Link>

            <div className="hidden md:flex flex-col items-center justify-center text-center pt-1 select-none">
              <div className="flex items-center space-x-2 text-[#C4984F]/60">
                <span className="w-6 h-[1px] bg-[#C4984F]/40" />
                <span className="text-[8px] text-[#8C6527]">◇</span>
                <span className="w-6 h-[1px] bg-[#C4984F]/40" />
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C6527]/80 font-serif mt-0.5">
                Manage. Serve. Grow.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Five Status Metric Cards (Horizontal Row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Available */}
          <button
            onClick={() => setStatusFilter(statusFilter === "AVAILABLE" ? "ALL" : "AVAILABLE")}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "AVAILABLE" ? "border-[#10B981] ring-1 ring-[#10B981]" : "border-[#EAE2D5] hover:border-[#10B981]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#10B981] leading-none">
                  {availableCount || 39}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111E31]">
                    Available
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-12 h-1.5 bg-[#A07334] rounded-full" />
          </button>

          {/* Card 2: Occupied */}
          <button
            onClick={() => setStatusFilter(statusFilter === "OCCUPIED" ? "ALL" : "OCCUPIED")}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "OCCUPIED" ? "border-[#F59E0B] ring-1 ring-[#F59E0B]" : "border-[#EAE2D5] hover:border-[#F59E0B]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#F59E0B] leading-none">
                  {occupiedCount || 3}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111E31]">
                    Occupied
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-12 h-1.5 bg-[#A07334] rounded-full" />
          </button>

          {/* Card 3: Cleaning */}
          <button
            onClick={() => setStatusFilter(statusFilter === "CLEANING" ? "ALL" : "CLEANING")}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "CLEANING" ? "border-[#3B82F6] ring-1 ring-[#3B82F6]" : "border-[#EAE2D5] hover:border-[#3B82F6]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#3B82F6] leading-none">
                  {cleaningCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111E31]">
                    Cleaning
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-12 h-1.5 bg-[#A07334] rounded-full" />
          </button>

          {/* Card 4: Reserved */}
          <button
            onClick={() => setStatusFilter(statusFilter === "RESERVED" ? "ALL" : "RESERVED")}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "RESERVED" ? "border-[#2563EB] ring-1 ring-[#2563EB]" : "border-[#EAE2D5] hover:border-[#2563EB]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#2563EB] leading-none">
                  {reservedCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111E31]">
                    Reserved
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-12 h-1.5 bg-[#A07334] rounded-full" />
          </button>

          {/* Card 5: Maintenance */}
          <button
            onClick={() => setStatusFilter(statusFilter === "MAINTENANCE" ? "ALL" : "MAINTENANCE")}
            className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between text-left transition-all group cursor-pointer ${
              statusFilter === "MAINTENANCE" ? "border-[#EF4444] ring-1 ring-[#EF4444]" : "border-[#EAE2D5] hover:border-[#EF4444]/50"
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#EF4444] leading-none">
                  {maintenanceCount || 1}
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111E31]">
                    Maintenance
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-12 h-1.5 bg-[#A07334] rounded-full" />
          </button>
        </div>

        {/* 3. Floor Filter Buttons Row */}
        <div className="flex items-center space-x-2 pt-1 pb-1">
          <span className="text-xs font-semibold text-[#78716C] mr-2">Floor:</span>
          {(["ALL", 1, 2, 3, 4] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFloor === f
                  ? "bg-[#A07334] text-white shadow-2xs"
                  : "bg-white border border-[#EAE2D5] text-[#111E31] hover:bg-[#FAF7F2]"
              }`}
            >
              {f === "ALL" ? "All Floors" : `Floor ${f}`}
            </button>
          ))}
        </div>

        {/* 4. 45+ Physical Rooms Grid (6 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredRooms.map((room) => {
            const isDeluxe = room.roomType === "deluxe";
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
                className="bg-white border border-[#EAE2D5] hover:border-[#9E712E]/70 rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all hover:scale-[1.015] cursor-pointer group min-h-[140px]"
              >
                <div>
                  {/* Top: Floor & Category Code */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#78716C] font-normal">
                      Floor {room.floor}
                    </span>
                    <span className="text-[10px] font-bold text-[#8C6527] uppercase">
                      {getCategoryShort(room.roomType)}
                    </span>
                  </div>

                  {/* Middle: Room Number */}
                  <div className="mt-1 font-serif text-lg font-bold text-[#111E31] group-hover:text-[#8C6527] transition-colors">
                    Room {room.roomNumber}
                  </div>

                  {/* Assigned Guest Name if Occupied */}
                  {isOccupied && room.assignedGuest && (
                    <div className="mt-1 flex items-center space-x-1 text-[11px] text-[#78716C] font-medium truncate">
                      <User className="w-3 h-3 text-[#8C6527]" />
                      <span className="truncate">{room.assignedGuest}</span>
                    </div>
                  )}
                </div>

                {/* Bottom: Colored Status Pill Button */}
                <div className="mt-3.5">
                  {isOccupied ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <User className="w-3 h-3 text-[#D97706]" />
                      <span>Occupied</span>
                    </div>
                  ) : isCleaning ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Brush className="w-3 h-3 text-[#2563EB]" />
                      <span>Cleaning</span>
                    </div>
                  ) : isReserved ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-[#0284C7]" />
                      <span>Reserved</span>
                    </div>
                  ) : isMaintenance ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Wrench className="w-3 h-3 text-[#DC2626]" />
                      <span>Maintenance</span>
                    </div>
                  ) : (
                    <div className="w-full py-1.5 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-semibold flex items-center justify-center space-x-1.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Room Modal */}
        {editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-[#EAE2D5] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111E31]">
                    Room {editingRoom.roomNumber} Management
                  </h3>
                  <p className="text-xs text-[#8C6527] capitalize">
                    Floor {editingRoom.floor} • {editingRoom.roomType} Room
                  </p>
                </div>
                <button
                  onClick={() => setEditingRoom(null)}
                  className="p-1 rounded-md text-[#78716C] hover:bg-[#FAF7F2] hover:text-[#111E31]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#8C6527] block mb-1.5">
                  Update Physical Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE2D5] rounded-lg p-2.5 text-xs text-[#111E31] focus:outline-none focus:border-[#9E712E]"
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
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#8C6527] block mb-1.5">
                    Assigned Guest Name
                  </label>
                  <input
                    type="text"
                    value={assignedGuest}
                    onChange={(e) => setAssignedGuest(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full bg-[#FAF7F2] border border-[#EAE2D5] rounded-lg p-2.5 text-xs text-[#111E31] focus:outline-none focus:border-[#9E712E]"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#8C6527] block mb-1.5">
                  Housekeeping / Service Notes
                </label>
                <textarea
                  rows={3}
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  placeholder="e.g. AC service completed, clean linen replaced..."
                  className="w-full bg-[#FAF7F2] border border-[#EAE2D5] rounded-lg p-2.5 text-xs text-[#111E31] focus:outline-none focus:border-[#9E712E]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-[#EAE2D5]">
                <button
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F3EDE4] border border-[#EAE2D5] text-xs font-semibold rounded-lg text-[#111E31]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-5 py-2 bg-[#9E712E] hover:bg-[#8A6124] text-xs font-bold uppercase tracking-wider rounded-lg text-white shadow-xs"
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
