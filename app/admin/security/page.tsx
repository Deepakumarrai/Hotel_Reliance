"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, KeyRound, Lock, User, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
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
      })
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                System Integrity & Access Control
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/settings"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Settings"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                Admin Security & Audit Trail
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Monitor login attempt rate limits (4-attempt / 2-hour lockout policy), active sessions, and administrative action logs.
            </p>
          </div>

          {/* Right Status Badge */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl px-6 py-4 shadow-xs flex items-center space-x-3 self-start md:self-auto flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#059669] font-bold block">
                POLICY ACTIVE
              </span>
              <div className="text-sm font-bold text-[#111923]">
                Zero Trust Protection
              </div>
            </div>
          </div>
        </div>

        {/* 2. Security Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl border border-[#E8DFD2] bg-white shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669] block">
              ACTIVE SESSIONS
            </span>
            <div className="text-2xl font-serif font-bold text-[#111923]">
              {stats.activeSessionCount} Valid Token
            </div>
            <span className="text-xs text-[#78716C] block">
              HTTP-Only Signed Cookie
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8DFD2] bg-white shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
              BRUTE FORCE PROTECTION
            </span>
            <div className="text-2xl font-serif font-bold text-[#111923]">
              4 Attempt Limit
            </div>
            <span className="text-xs text-[#78716C] block">
              2-Hour IP Lockout Enforced
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8DFD2] bg-white shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB] block">
              LOCKED IP ADDRESSES
            </span>
            <div className="text-2xl font-serif font-bold text-[#111923]">
              {stats.lockedIpCount} Locked
            </div>
            <span className="text-xs text-[#78716C] block">
              Auto-clears after 2 hours
            </span>
          </div>
        </div>

        {/* 3. Audit Log Stream */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-4">
          <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3.5">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#A97A38]" />
              <h2 className="font-serif text-base font-bold text-[#111923]">
                Administrative Action Audit Stream
              </h2>
            </div>
            <span className="text-xs text-[#78716C] font-mono">{logs.length} Logged Events</span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                  <th className="py-3 px-4 font-bold">TIMESTAMP</th>
                  <th className="py-3 px-4 font-bold">OPERATOR</th>
                  <th className="py-3 px-4 font-bold">ACTION</th>
                  <th className="py-3 px-4 font-bold">TARGET ENTITY</th>
                  <th className="py-3 px-4 font-bold">EVENT DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#78716C]">
                      No administrative audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#78716C]">
                        {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}{" "}
                        •{" "}
                        {new Date(log.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#A97A38]">
                        {log.adminUser}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-xs text-[#111923]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8DFD2] text-[10px] font-mono">
                          {log.entity} #{log.entityId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B6255] max-w-xs truncate">
                        {log.newValue || log.oldValue || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-3">
            {logs.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#78716C]">
                No administrative audit events recorded yet.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#FCFAF6] border border-[#E8DFD2] space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-[#111923]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#A97A38] font-semibold">{log.adminUser}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8DFD2] text-[10px] font-mono">
                      {log.entity} #{log.entityId}
                    </span>
                  </div>
                  {(log.newValue || log.oldValue) && (
                    <div className="text-[11px] text-[#6B6255] bg-white p-2 rounded-lg border border-[#EDE6DB] truncate">
                      {log.newValue || log.oldValue}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
