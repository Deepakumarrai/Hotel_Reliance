import React from "react";
import { ToastProvider } from "@/components/admin/ToastContext";
import { AdminWebSocketProvider } from "@/components/admin/AdminWebSocketContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminWebSocketProvider>{children}</AdminWebSocketProvider>
    </ToastProvider>
  );
}
