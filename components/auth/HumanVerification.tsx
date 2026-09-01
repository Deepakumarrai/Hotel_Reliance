"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, Loader2 } from "lucide-react";

interface HumanVerificationProps {
  isVerified: boolean;
  onVerify: (verified: boolean) => void;
  error?: string;
}

export function HumanVerification({
  isVerified,
  onVerify,
  error
}: HumanVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleToggle = () => {
    if (isVerified) {
      onVerify(false);
      return;
    }

    setIsVerifying(true);
    // Simulate brief human interaction verification delay
    setTimeout(() => {
      setIsVerifying(false);
      onVerify(true);
    }, 600);
  };

  return (
    <div className="space-y-1.5">
      <div
        className={`flex items-center justify-between p-3.5 bg-white border transition-all ${
          error
            ? "border-red-500/60 bg-red-50/10"
            : isVerified
            ? "border-gold bg-gold/5"
            : "border-border-custom hover:border-gold/50"
        }`}
      >
        <button
          type="button"
          onClick={handleToggle}
          disabled={isVerifying}
          className="flex items-center space-x-3 focus:outline-none group text-left cursor-pointer"
          aria-label="Confirm you are human"
          aria-checked={isVerified}
          role="checkbox"
        >
          <div
            className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
              isVerified
                ? "bg-gold text-white border border-gold"
                : isVerifying
                ? "border-2 border-gold border-t-transparent animate-spin bg-transparent"
                : "border-2 border-muted/40 group-hover:border-gold bg-white"
            }`}
          >
            {isVerified && <Check className="w-4 h-4 stroke-[3]" />}
          </div>

          <span className="text-xs font-medium text-dark select-none">
            {isVerifying
              ? "Verifying security credentials..."
              : isVerified
              ? "Human verification confirmed"
              : "I am a human (Security verification)"}
          </span>
        </button>

        <div className="flex flex-col items-end text-right pl-3 select-none">
          <div className="flex items-center space-x-1 text-gold">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-serif font-semibold tracking-wider uppercase">
              Reliance Guard
            </span>
          </div>
          <span className="text-[8px] text-muted tracking-tight">Privacy & Terms</span>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium pl-1">
          {error}
        </p>
      )}
      <p className="text-[10px] text-muted leading-tight font-light pl-1">
        Human verification is required before creating an account to protect guest security.
      </p>
    </div>
  );
}
