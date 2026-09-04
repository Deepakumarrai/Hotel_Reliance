"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BedDouble,
  Filter,
  CheckCircle2,
  Sparkles,
  Wrench,
  Brush,
  AlertTriangle,
  User,
  Layers,
  ArrowRight,
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
  const [editingRoom, setEditingRoom] = useState<PhysicalRoom | null>(null);
  const [newStatus, setNewStatus] = useState<PhysicalRoom["status"]>("AVAILABLE");
  const [roomNotes, setRoomNotes] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (data.rooms) setRooms(data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleUpdateStatus = async () => {
    if (!editingRoom) return;
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: editingRoom.roomNumber,
          status: newStatus,
          notes: roomNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Room ${editingRoom.roomNumber} status updated to ${newStatus}`, "success");
        setEditingRoom(null);
        fetchRooms();
      }
    } catch {
      showToast("Failed to update room status", "error");
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesFloor = selectedFloor === "ALL" || r.floor === selectedFloor;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesFloor && matchesStatus;
  });

  const getStatusBadge = (status: PhysicalRoom["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return {
          bg: "bg-emerald-950/80 text-emerald-400 border-emerald-500/40",
          label: "Available",
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
        };
      case "OCCUPIED":
        return {
          bg: "bg-amber-950/80 text-amber-400 border-amber-500/40",
          label: "Occupied",
          icon: <User className="w-3 h-3 text-amber-400" />,
        };
      case "RESERVED":
        return {
          bg: "bg-blue-950/80 text-blue-400 border-blue-500/40",
          label: "Reserved",
          icon: <Sparkles className="w-3 h-3 text-blue-400" />,
        };
      case "CLEANING":
        return {
          bg: "bg-cyan-950/80 text-cyan-400 border-cyan-500/40",
          label: "Cleaning",
          icon: <Brush className="w-3 h-3 text-cyan-400" />,
        };
      case "MAINTENANCE":
        return {
          bg: "bg-rose-950/80 text-rose-400 border-rose-500/40",
          label: "Maintenance",
          icon: <Wrench className="w-3 h-3 text-rose-400" />,
        };
      default:
        return {
          bg: "bg-gray-900 text-gray-400 border-gray-700",
          label: status,
          icon: null,
        };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Physical Inventory Manager
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              45+ Physical Rooms (Floors 1 - 4)
            </h1>
            <p className="text-xs text-[#E9DFD2]/60 mt-1">
              Live operational room status matrix for front desk and housekeeping teams.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/rooms/types"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-[#C4984F]" />
              <span>Room Category Specs</span>
            </Link>
          </div>
        </div>

        {/* Status Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setStatusFilter("AVAILABLE")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              statusFilter === "AVAILABLE"
                ? "bg-emerald-950/60 border-emerald-500 text-white"
                : "bg-[#111E31] border-[#1B2A42] text-white/70 hover:border-emerald-500/40"
            }`}
          >
            <div className="text-xl font-bold text-emerald-400">
              {rooms.filter((r) => r.status === "AVAILABLE").length}
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-300">Available</span>
          </button>

          <button
            onClick={() => setStatusFilter("OCCUPIED")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              statusFilter === "OCCUPIED"
                ? "bg-amber-950/60 border-amber-500 text-white"
                : "bg-[#111E31] border-[#1B2A42] text-white/70 hover:border-amber-500/40"
            }`}
          >
            <div className="text-xl font-bold text-amber-400">
              {rooms.filter((r) => r.status === "OCCUPIED").length}
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-300">Occupied</span>
          </button>

          <button
            onClick={() => setStatusFilter("CLEANING")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              statusFilter === "CLEANING"
                ? "bg-cyan-950/60 border-cyan-500 text-white"
                : "bg-[#111E31] border-[#1B2A42] text-white/70 hover:border-cyan-500/40"
            }`}
          >
            <div className="text-xl font-bold text-cyan-400">
              {rooms.filter((r) => r.status === "CLEANING").length}
            </div>
            <span className="text-[10px] uppercase font-bold text-cyan-300">Cleaning</span>
          </button>

          <button
            onClick={() => setStatusFilter("RESERVED")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              statusFilter === "RESERVED"
                ? "bg-blue-950/60 border-blue-500 text-white"
                : "bg-[#111E31] border-[#1B2A42] text-white/70 hover:border-blue-500/40"
            }`}
          >
            <div className="text-xl font-bold text-blue-400">
              {rooms.filter((r) => r.status === "RESERVED").length}
            </div>
            <span className="text-[10px] uppercase font-bold text-blue-300">Reserved</span>
          </button>

          <button
            onClick={() => setStatusFilter("MAINTENANCE")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              statusFilter === "MAINTENANCE"
                ? "bg-rose-950/60 border-rose-500 text-white"
                : "bg-[#111E31] border-[#1B2A42] text-white/70 hover:border-rose-500/40"
            }`}
          >
            <div className="text-xl font-bold text-rose-400">
              {rooms.filter((r) => r.status === "MAINTENANCE").length}
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-300">Maintenance</span>
          </button>
        </div>

        {/* Floor Switcher & Reset Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1B2A42] pb-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-white/50 mr-2">Floor:</span>
            {(["ALL", 1, 2, 3, 4] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFloor === f
                    ? "bg-[#C4984F] text-white shadow-sm"
                    : "bg-[#111E31] text-[#E9DFD2]/70 hover:bg-[#1B2A42]"
                }`}
              >
                {f === "ALL" ? "All Floors" : `Floor ${f}`}
              </button>
            ))}
          </div>

          {statusFilter !== "ALL" && (
            <button
              onClick={() => setStatusFilter("ALL")}
              className="text-xs text-[#C4984F] hover:underline"
            >
              Clear Status Filter ({statusFilter})
            </button>
          )}
        </div>

        {/* 45+ Physical Rooms Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredRooms.map((room) => {
            const badge = getStatusBadge(room.status);
            return (
              <div
                key={room.id}
                onClick={() => {
                  setEditingRoom(room);
                  setNewStatus(room.status);
                  setRoomNotes(room.notes || "");
                }}
                className="bg-[#0B1423] border border-[#1B2A42] hover:border-[#C4984F] rounded-xl p-4 shadow-md transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-white/40 font-semibold block">
                        Floor {room.floor}
                      </span>
                      <div className="text-xl font-bold font-mono text-white group-hover:text-[#D8B875] transition-colors">
                        Room {room.roomNumber}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#C4984F] uppercase font-bold">
                      {room.roomType.slice(0, 3)}
                    </span>
                  </div>

                  {room.assignedGuest && (
                    <div className="mt-2 text-[11px] font-semibold text-white/80 truncate">
                      👤 {room.assignedGuest}
                    </div>
                  )}

                  {room.notes && (
                    <div className="mt-1 text-[10px] text-amber-300/80 italic truncate">
                      ⚠️ {room.notes}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1B2A42]">
                  <div
                    className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center justify-center space-x-1 ${badge.bg}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Room Status Drawer / Modal */}
        {editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#1B2A42] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Room {editingRoom.roomNumber} Management
                  </h3>
                  <p className="text-xs text-[#C4984F] capitalize">
                    Floor {editingRoom.floor} • {editingRoom.roomType} Room
                  </p>
                </div>
                <button
                  onClick={() => setEditingRoom(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-2">
                  Update Physical Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PhysicalRoom["status"])}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#C4984F]"
                >
                  <option value="AVAILABLE">AVAILABLE (Ready for Guest)</option>
                  <option value="OCCUPIED">OCCUPIED (Guest In-Room)</option>
                  <option value="CLEANING">CLEANING (Housekeeping Sanitization)</option>
                  <option value="RESERVED">RESERVED (Incoming Guest Lock)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Repair & Service)</option>
                  <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-2">
                  Housekeeping / Engineering Notes
                </label>
                <textarea
                  rows={3}
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  placeholder="e.g. AC service completed, clean linen replaced..."
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1B2A42]">
                <button
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-[#1B2A42] text-xs font-semibold rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-5 py-2 bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-xs font-bold uppercase rounded text-white shadow-md"
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
