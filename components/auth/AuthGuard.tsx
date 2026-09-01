"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Lock, ArrowRight, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface AuthGuardProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  title = "Guest Sign-In Required",
  description = "Please sign in or create an account to view your reservations and manage your Hotel Reliance guest profile."
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-serif tracking-widest text-muted">
            Checking guest credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-cream min-h-[75vh] flex items-center">
        <Container className="max-w-md">
          <div className="bg-white border border-border-custom p-8 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 bg-primary text-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                AUTHENTICATION REQUIRED
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-dark">{title}</h1>
              <p className="text-xs text-muted leading-relaxed font-light">{description}</p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => openAuthModal("signin")}
                className="py-3 text-xs tracking-widest uppercase font-bold"
              >
                Sign In / Register
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Link href="/" className="block">
                <Button variant="secondary" fullWidth className="py-2.5 text-xs uppercase tracking-wider">
                  <Home className="w-3.5 h-3.5 mr-2" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return <>{children}</>;
}
