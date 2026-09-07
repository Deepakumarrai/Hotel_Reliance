"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CustomCursor } from "@/components/animation/CustomCursor";
import { AuthModal } from "@/components/auth/AuthModal";
import { PageTransition } from "@/components/animation/PageTransition";

export function GuestLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[72px] lg:pt-[76px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CustomCursor />
      <AuthModal />
    </>
  );
}
