"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, KeyRound, Lock, User, Clock, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AuditLogEntry } from "@/lib/admin/store";

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState({
    activeSessionCount: 1,
    lockedIpCount: 0,
    recentAttempts: [] as Array<{ ip: string; attempts: number; isLocked: boolean; lastAttempt: string }>,
  });

  useEffect(() => {
    fetch("/api/admin/security")
      .then((r) => r.json())
      .then((d) => {
        if (d.auditLogs) setLogs(d.auditLogs);
        if (d.stats) setStats(d.stats);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            System Integrity & Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Admin Security & Audit Trail
          </h1>
          <p className="text-xs text-[#E9DFD2]/60 mt-1">
            Monitor login attempt rate limits (4-attempt / 2-hour lockout policy), active sessions, and administrative action logs.
          </p>
        </div>

        {/* Security Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#0c1f1f] shadow-lg">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Active Sessions</span>
            <div className="text-2xl font-serif font-bold text-white">{stats.activeSessionCount} Valid Token</div>
            <span className="text-[10px] text-white/50">HTTP-Only Signed Cookie</span>
          </div>

          <div className="p-5 rounded-xl border border-amber-500/30 bg-[#1f190e] shadow-lg">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Brute Force Protection</span>
            <div className="text-2xl font-serif font-bold text-white">4 Attempt Limit</div>
            <span className="text-[10px] text-white/50">2-Hour IP Lockout Enforced</span>
          </div>

          <div className="p-5 rounded-xl border border-blue-500/30 bg-[#111E31] shadow-lg">
            <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Locked IP Addresses</span>
            <div className="text-2xl font-serif font-bold text-white">{stats.lockedIpCount} Locked</div>
            <span className="text-[10px] text-white/50">Auto-clears after 2 hours</span>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-[#1B2A42] pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#C4984F]" />
              <h2 className="font-serif text-base font-bold text-white">Administrative Action Audit Stream</h2>
            </div>
            <span className="text-xs text-white/40 font-mono">{logs.length} Logged Events</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Timestamp</th>
                  <th className="py-3 font-bold">Operator</th>
                  <th className="py-3 font-bold">Action</th>
                  <th className="py-3 font-bold">Target Entity</th>
                  <th className="py-3 font-bold">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3 font-mono text-[11px] text-white/50">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} • {new Date(log.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 font-semibold text-[#D8B875]">{log.adminUser}</td>
                    <td className="py-3 font-mono font-bold text-xs text-white">{log.action}</td>
                    <td className="py-3 text-white/70">
                      <span className="px-2 py-0.5 rounded bg-[#111E31] border border-[#1B2A42] text-[10px]">
                        {log.entity} #{log.entityId}
                      </span>
                    </td>
                    <td className="py-3 text-white/80 max-w-xs truncate">{log.newValue || log.oldValue || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
