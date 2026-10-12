import React, { useState } from 'react';
import { 
  Voucher 
} from '../data/cafeData';
import { 
  Ticket, 
  Award, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  MapPin
} from 'lucide-react';

interface VoucherWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: Voucher[];
  badges: string[];
}

export const VoucherWalletModal: React.FC<VoucherWalletModalProps> = ({
  isOpen,
  onClose,
  vouchers,
  badges,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-6 max-h-[85vh] overflow-y-auto transition-all">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)]">
            <Award className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
            <span>Your Lumina Privileges & Rewards</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text-primary)]">
            Voucher & Status Wallet
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)]">
            Every micro-challenge completed with Aria unlocks status badges and real in-café privileges for your next visit.
          </p>
        </div>

        {/* Earned Badges Section */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-semibold text-[var(--theme-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--theme-pop)]" />
            <span>Earned Status Badges ({badges.length})</span>
          </h3>

          {badges.length === 0 ? (
            <div className="p-4 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] italic text-center">
              Complete a 45-second Café Challenge with Aria to earn your first status badge!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border-accent)] text-xs font-bold text-[var(--theme-text-primary)] flex items-center gap-2 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vouchers List */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-semibold text-[var(--theme-text-primary)] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[var(--theme-accent)]" />
            <span>Active Next-Visit Vouchers ({vouchers.length})</span>
          </h3>

          {vouchers.length === 0 ? (
            <div className="p-4 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] italic text-center">
              No active vouchers yet. Take a challenge at checkout to generate your personalized voucher code.
            </div>
          ) : (
            <div className="space-y-3">
              {vouchers.map((vouch, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border-accent)] shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-[var(--theme-pop)]">
                      {vouch.discount}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      {vouch.expiresIn}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--theme-text-muted)]">
                    Perk: <strong className="text-[var(--theme-text-primary)]">{vouch.perk}</strong>
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--theme-border)]">
                    <div className="font-mono text-xs font-bold text-[var(--theme-text-primary)] bg-[var(--theme-bg)] px-3 py-1.5 rounded-lg border border-[var(--theme-border)]">
                      {vouch.code}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--theme-text-muted)] hidden sm:inline flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--theme-accent)]" />
                        {vouch.zone}
                      </span>
                      <button
                        onClick={() => handleCopy(vouch.code)}
                        className="px-3 py-1 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-border)]/20 text-xs text-[var(--theme-accent)] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[var(--theme-border)]"
                      >
                        {copiedCode === vouch.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-[var(--theme-border)]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-primary)] transition-colors cursor-pointer"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
