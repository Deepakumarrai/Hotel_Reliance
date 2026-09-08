"use client";

import React from "react";

type StatusType =
  | "SUCCESS"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "PENDING"
  | "CANCELLED"
  | "REFUNDED"
  | "QUOTED"
  | "LOST"
  | "ACTIVE"
  | "INACTIVE"
  | string;

interface AdminStatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function AdminStatusBadge({ status, label }: AdminStatusBadgeProps) {
  const upper = (status || "").toUpperCase();

  let style = "bg-[#FAF7F2] text-[#6B6255] border-[#E8DFD2]";
  let dotColor = "#8A8277";

  if (
    upper === "SUCCESS" ||
    upper === "CONFIRMED" ||
    upper === "CHECKED_IN" ||
    upper === "ACTIVE" ||
    upper === "AVAILABLE" ||
    upper === "VERIFIED"
  ) {
    style = "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]";
    dotColor = "#15803D";
  } else if (upper === "CHECKED_OUT" || upper === "QUOTED" || upper === "INFO") {
    style = "bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]";
    dotColor = "#1D4ED8";
  } else if (upper === "PENDING" || upper === "UNASSIGNED" || upper === "WARNING") {
    style = "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
    dotColor = "#B45309";
  } else if (upper === "CANCELLED" || upper === "LOST" || upper === "DANGER" || upper === "MAINTENANCE") {
    style = "bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]";
    dotColor = "#E11D48";
  } else if (upper === "REFUNDED") {
    style = "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]";
    dotColor = "#7E22CE";
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border shadow-2xs ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: dotColor }} />
      <span>{label || status}</span>
    </span>
  );
}
