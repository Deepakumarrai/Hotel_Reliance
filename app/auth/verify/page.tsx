"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { HumanVerification } from "@/components/auth/HumanVerification";
import { Button } from "@/components/ui/Button";

export default function VerificationPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleContinue = () => {
    if (isVerified) {
      setConfirmed(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-border-custom shadow-2xl p-8 sm:p-10 space-y-6 text-center">
        <div className="w-14 h-14 bg-primary text-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
            SECURITY CHECKPOINT
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-dark">
            Human Verification
          </h1>
          <p className="text-xs text-muted leading-relaxed font-light">
            Hotel Reliance enforces strict security protocols to prevent automated reservations and protect guest data.
          </p>
        </div>

        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-cream border border-gold/40 text-center space-y-4"
          >
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-dark">Verification Complete</h3>
              <p className="text-xs text-muted">You may now proceed to booking or account management.</p>
            </div>
            <Link href="/rooms" className="block pt-2">
              <Button variant="primary" fullWidth size="sm">
                Explore Rooms & Suites
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6 pt-2">
            <HumanVerification
              isVerified={isVerified}
              onVerify={setIsVerified}
            />

            <Button
              onClick={handleContinue}
              variant="primary"
              fullWidth
              disabled={!isVerified}
              className="py-3 text-xs tracking-widest uppercase font-bold"
            >
              Verify & Proceed
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="text-center pt-2 border-t border-border-custom">
          <Link
            href="/"
            className="text-xs font-semibold text-muted hover:text-dark uppercase tracking-wider"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
