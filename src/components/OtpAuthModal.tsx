import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Loader2, 
  RefreshCw, 
  Phone, 
  Mail, 
  User, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CustomerProfile } from '../data/cafeData';

interface OtpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: CustomerProfile) => void;
  deviceToken: string;
}

export const OtpAuthModal: React.FC<OtpAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  deviceToken,
}) => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');

  // OTP state
  const [otpValue, setOtpValue] = useState<string>('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 60-second resend countdown
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: cleanPhone,
          email: emailAddress.trim(),
          deviceToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.inCooldown) {
          setErrorMsg(data.message || '6-hour cooldown active on this phone/device.');
        } else {
          setErrorMsg(data.message || 'Failed to send OTP. Please try again.');
        }
        return;
      }

      setStep('otp');
      setDemoOtp(data.demoOtp || null);
      setCountdown(60);
      setCanResend(false);
      setSuccessNotice(`6-Digit OTP dispatched to +91 ${cleanPhone} and ${emailAddress}.`);
    } catch (err: any) {
      setErrorMsg('Network error sending OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (otpValue.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: otpValue.trim(),
          deviceToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Incorrect OTP. Please try again.');
        return;
      }

      // Success! Pass profile
      onAuthSuccess({
        name: data.profile?.name || fullName,
        phone: cleanPhone,
        email: data.profile?.email || emailAddress,
        isVerified: true,
        verifiedAt: Date.now(),
      });
    } catch (err: any) {
      setErrorMsg('Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[560px] mx-auto rounded-3xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-5 transition-all my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--theme-accent)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-pop)] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Play & Order Verification</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--theme-text-primary)]">
            {step === 'form' ? 'Customer Registration' : 'Enter 6-Digit OTP'}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)]">
            {step === 'form'
              ? 'Provide your details to unlock the 30% OFF Café Challenge and claim your voucher.'
              : `We sent a 6-digit verification code to +91 ${mobileNumber} and ${emailAddress}.`}
          </p>
        </div>

        {/* Error / Notice Display */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center gap-2 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successNotice && step === 'otp' && (
          <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center gap-2 text-xs text-[#10B981]">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 'form' ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--theme-text-muted)] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--theme-text-muted)] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>Mobile Number (10 Digits)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[var(--theme-text-muted)] font-mono">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs font-mono text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--theme-text-muted)] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>Email Address (For PDF Invoice)</span>
              </label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="elena@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 min-h-[48px] py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send 6-Digit OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            {/* Instant Demo OTP helper */}
            {demoOtp && (
              <div className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border-accent)] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-pop)]">Live Demo OTP</span>
                  <div className="font-mono text-sm font-bold text-[var(--theme-accent)] tracking-wider">
                    {demoOtp}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpValue(demoOtp)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--theme-accent)]/20 hover:bg-[var(--theme-accent)]/30 text-[var(--theme-text-primary)] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Auto-Fill OTP
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--theme-text-muted)] flex items-center justify-between">
                <span>Enter 6-Digit Code</span>
                <span className="font-mono text-[11px] text-[var(--theme-text-muted)]">
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Ready to resend'}
                </span>
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] font-mono text-lg py-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
              >
                Change Details
              </button>
              <button
                type="button"
                disabled={!canResend || loading}
                onClick={() => handleSendOtp()}
                className="text-[var(--theme-accent)] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend OTP</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otpValue.length !== 6}
              className="w-full min-h-[48px] py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify & Unlock Challenge</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
