import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Gift, 
  Coffee, 
  CheckCircle2, 
  Zap,
  Lock
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSelectPlayAndOrder: () => void;
  onSelectDirectOrder: () => void;
  cooldownActive: boolean;
  cooldownRemainingMs: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSelectPlayAndOrder,
  onSelectDirectOrder,
  cooldownActive,
  cooldownRemainingMs,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(cooldownRemainingMs);

  useEffect(() => {
    setTimeLeft(cooldownRemainingMs);
  }, [cooldownRemainingMs]);

  useEffect(() => {
    if (!cooldownActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownActive, timeLeft]);

  if (!isOpen) return null;

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-6 transition-all">
        {/* Background Ambient Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url('/images/hero_cafe.jpg')` }}
        />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[var(--theme-accent)]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[var(--theme-pop)]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Branding */}
        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-pop)] animate-pulse" />
            <span>Welcome to Lumina Café · Ground Floor</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[var(--theme-text-primary)]">
            How would you like to order today?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] max-w-lg mx-auto">
            Choose your dining route below. Win up to 30% OFF vouchers with Aria's Challenge, or jump straight into table seating.
          </p>
        </div>

        {/* Dual Option Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* OPTION A: Play & Order (Gamified Route) */}
          <div className="relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[var(--theme-surface-elevated)] to-[var(--theme-surface)] border border-[var(--theme-accent)]/60 hover:border-[var(--theme-accent)] shadow-xl hover:shadow-[var(--theme-glow)] transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--theme-accent)]/20 text-[var(--theme-pop)] flex items-center justify-center border border-[var(--theme-accent)]/40">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-accent)] text-black shadow-sm">
                  Up to 30% OFF
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors">
                  Play & Order
                </h3>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1 leading-relaxed">
                  Test your sensory palate with Aria's 60-second Café Challenge. Win tiered vouchers (30%, 15%, or 5% OFF) applied instantly to your bill.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-[var(--theme-text-muted)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Secure Mobile & Email OTP Auth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>Instant Voucher Applied to Cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
                  <span>1 Play per 6 Hours</span>
                </div>
              </div>
            </div>

            {/* Action or Cooldown State */}
            <div className="pt-5">
              {cooldownActive && timeLeft > 0 ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#EF4444]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cooldown Active</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-[var(--theme-text-primary)] mt-1">
                      Next challenge in: {formatCountdown(timeLeft)}
                    </div>
                  </div>
                  <button
                    onClick={onSelectDirectOrder}
                    className="w-full py-2.5 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] hover:bg-[var(--theme-border)]/20 text-xs font-semibold text-[var(--theme-text-primary)] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Proceed to Direct Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onSelectPlayAndOrder}
                  className="w-full py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer group-hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Play & Unlock Voucher</span>
                </button>
              )}
            </div>
          </div>

          {/* OPTION B: Skip to Order Directly (Direct Route) */}
          <div className="relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[var(--theme-surface-elevated)] to-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] text-[var(--theme-accent)] flex items-center justify-center border border-[var(--theme-border)]">
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-surface-glass)] text-[var(--theme-text-muted)] border border-[var(--theme-border)]">
                  Instant Table Order
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors">
                  Skip to Order Directly
                </h3>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1 leading-relaxed">
                  Bypass the challenge and OTP verification. Pick your table in any of our 5 location zones and order handcrafted specialty drinks immediately.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-[var(--theme-text-muted)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>No Registration / No OTP Gate</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>Select from 5 Atmosphere Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" />
                  <span>Standard Menu Pricing (0% Voucher)</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-5">
              <button
                onClick={onSelectDirectOrder}
                className="w-full py-3 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-accent)] hover:text-black border border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-[var(--theme-text-primary)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:scale-[1.02]"
              >
                <span>Select Seating & Order Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="relative z-10 text-[11px] text-center text-[var(--theme-text-muted)]">
          Table QR Code verified · Lumina Café Acoustic & Roastery Ground Floor Experience
        </p>
      </div>
    </div>
  );
};
