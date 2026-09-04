import React from "react";
import { ToastProvider } from "@/components/admin/ToastContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
