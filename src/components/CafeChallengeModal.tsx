import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Award, 
  Ticket, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Gift, 
  Copy, 
  Check, 
  X,
  AlertCircle,
  RotateCcw,
  Coffee,
  ShieldAlert
} from 'lucide-react';
import { Zone, CartItem, Voucher } from '../data/cafeData';

interface CafeChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
  cart: CartItem[];
  onChallengeSuccess: (voucher: Voucher, badge: string, immediatePerk: string) => void;
  onChallengeFailed?: () => void;
  onRecordCooldown?: () => void;
  challengeCompleted?: boolean;
  challengeFailed?: boolean;
  activeVoucher?: Voucher | null;
}

interface ChallengeData {
  id?: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  badge: string;
  immediatePerk: string;
  attempt?: number;
  potentialDiscount?: string;
}

interface VerifyResult {
  isCorrect: boolean;
  attempt: number;
  exhausted?: boolean;
  nextAttempt?: number;
  nextReward?: string;
  message?: string;
  voucher?: Voucher;
  badge?: string;
  immediatePerk?: string;
}

export const CafeChallengeModal: React.FC<CafeChallengeModalProps> = ({
  isOpen,
  onClose,
  zone,
  cart,
  onChallengeSuccess,
  onChallengeFailed,
  onRecordCooldown,
  challengeCompleted = false,
  challengeFailed = false,
  activeVoucher = null,
}) => {
  const [attempt, setAttempt] = useState<number>(1);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  
  // Selection & evaluation state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [awardedVoucher, setAwardedVoucher] = useState<Voucher | null>(activeVoucher);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSessionFailed, setIsSessionFailed] = useState<boolean>(challengeFailed);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (challengeCompleted && activeVoucher) {
        setAwardedVoucher(activeVoucher);
        setLoading(false);
      } else if (challengeFailed) {
        setIsSessionFailed(true);
        setLoading(false);
      } else {
        // Fresh challenge session
        setAttempt(1);
        setAskedQuestions([]);
        setSelectedOption(null);
        setVerifyResult(null);
        setAwardedVoucher(null);
        setIsSessionFailed(false);
        fetchChallengeQuestion(1, []);
      }
    }
  }, [isOpen, zone.id]);

  const fetchChallengeQuestion = async (currentAttempt: number, excluded: string[]) => {
    setLoading(true);
    setSelectedOption(null);
    setVerifyResult(null);

    try {
      const res = await fetch('/api/aria/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone,
          cart,
          attempt: currentAttempt,
          excludeQuestions: excluded,
        }),
      });
      const data = await res.json();
      setChallenge(data);
      if (data.title) {
        setAskedQuestions((prev) => Array.from(new Set([...prev, data.title])));
      }
    } catch (err) {
      console.error('Error fetching challenge:', err);
      // Hard fallback ensuring fresh question
      setChallenge({
        title: 'The Aroma Spectrum Challenge',
        question: 'Ethiopian Yirgacheffe heirloom beans are renowned across world barista championships for which signature aromatic bouquet?',
        options: [
          'Wild Jasmine, Bergamot & Candied Peach',
          'Heavy Smoky Peat & Charcoal',
          'Earthy Dark Molasses & Black Pepper',
        ],
        correctIndex: 0,
        explanation: 'Exquisite! Yirgacheffe washed beans are prized globally for their floral jasmine elegance and crisp stone-fruit sweetness.',
        badge: 'Flavour Curator',
        immediatePerk: 'Complimentary Madagascar Vanilla Foam Drizzle unlocked for this visit!',
        potentialDiscount: currentAttempt === 1 ? '30% OFF' : currentAttempt === 2 ? '15% OFF' : '5% OFF',
      });
    } finally {
      setLoading(false);
    }
  };

  // Option selection with strict locking & server verification
  const handleSelectOption = async (idx: number) => {
    if (selectedOption !== null || evaluating || !challenge) return; // Strict lock
    setSelectedOption(idx);
    setEvaluating(true);

    try {
      const res = await fetch('/api/aria/verify-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedIndex: idx,
          correctIndex: challenge.correctIndex,
          attempt,
          zone,
          badge: challenge.badge,
          immediatePerk: challenge.immediatePerk,
        }),
      });

      const data: VerifyResult = await res.json();
      setVerifyResult(data);

      if (data.isCorrect && data.voucher) {
        // Correct answer! Trigger confetti
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#66FCF1', '#8A2BE2', '#FCEE09', '#FF5E7E', '#7AE582'],
          });
        } catch (e) {
          // ignore
        }
        setAwardedVoucher(data.voucher);
        onRecordCooldown?.();
        onChallengeSuccess(data.voucher, data.badge || challenge.badge, data.immediatePerk || challenge.immediatePerk);
      } else {
        // Incorrect answer!
        if (data.exhausted || attempt >= 3) {
          setIsSessionFailed(true);
          onRecordCooldown?.();
          onChallengeFailed?.();
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      // Local state fallback verification
      const isCorrect = idx === challenge.correctIndex;
      if (isCorrect) {
        const discountPct = attempt === 1 ? 30 : attempt === 2 ? 15 : 5;
        const code = `LUMINA-${discountPct}-${Math.floor(1000 + Math.random() * 9000)}`;
        const localVoucher: Voucher = {
          code,
          discount: `${discountPct}% Off`,
          discountPercentage: discountPct,
          perk: attempt === 1 ? 'Madagascar Vanilla Foam Drizzle' : attempt === 2 ? 'Free Size Upgrade' : 'Cinnamon Sugar Sprinkle',
          badgeEarned: challenge.badge,
          issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          expiresIn: 'Valid for 30 days',
          zone: zone.name,
          attemptUsed: attempt,
        };
        setAwardedVoucher(localVoucher);
        setVerifyResult({ isCorrect: true, attempt });
        onChallengeSuccess(localVoucher, challenge.badge, challenge.immediatePerk);
      } else {
        const exhausted = attempt >= 3;
        if (exhausted) {
          setIsSessionFailed(true);
          onChallengeFailed?.();
        }
        setVerifyResult({
          isCorrect: false,
          attempt,
          exhausted,
          nextAttempt: attempt + 1,
          nextReward: attempt === 1 ? '15% OFF' : '5% OFF',
        });
      }
    } finally {
      setEvaluating(false);
    }
  };

  // Move to next unasked question for attempt 2 or 3
  const handleNextAttempt = () => {
    if (attempt >= 3) return;
    const nextAtt = attempt + 1;
    setAttempt(nextAtt);
    fetchChallengeQuestion(nextAtt, askedQuestions);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-6 transition-all">
        {/* Atmospheric Zone Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 transition-transform duration-1000 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${zone.imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/95 to-[var(--theme-surface-elevated)]/98 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="relative z-10 absolute top-5 right-5 p-2 rounded-full bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title & Attempt Tracker Strip */}
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
              <span>Aria's Sensory Challenge</span>
            </div>

            {/* 3-Attempt Progress Badges */}
            <div className="flex items-center gap-1.5 bg-[var(--theme-surface-elevated)] p-1 rounded-xl border border-[var(--theme-border)] text-[10px] font-mono">
              <span
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  attempt === 1 && !verifyResult?.isCorrect && !isSessionFailed
                    ? 'bg-[var(--theme-accent)] text-black shadow-sm'
                    : attempt > 1 || verifyResult?.isCorrect || isSessionFailed
                    ? 'opacity-40 line-through'
                    : 'text-[var(--theme-text-muted)]'
                }`}
              >
                1: 30% OFF
              </span>
              <span className="text-[var(--theme-border)]">·</span>
              <span
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  attempt === 2 && !verifyResult?.isCorrect && !isSessionFailed
                    ? 'bg-[var(--theme-accent)] text-black shadow-sm'
                    : attempt > 2 || (verifyResult?.isCorrect && attempt !== 2) || isSessionFailed
                    ? 'opacity-40 line-through'
                    : 'text-[var(--theme-text-muted)]'
                }`}
              >
                2: 15% OFF
              </span>
              <span className="text-[var(--theme-border)]">·</span>
              <span
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  attempt === 3 && !verifyResult?.isCorrect && !isSessionFailed
                    ? 'bg-[var(--theme-accent)] text-black shadow-sm'
                    : isSessionFailed
                    ? 'opacity-40 line-through'
                    : 'text-[var(--theme-text-muted)]'
                }`}
              >
                3: 5% OFF
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text-primary)]">
              {isSessionFailed
                ? 'Challenge Concluded'
                : awardedVoucher
                ? 'Challenge Completed!'
                : loading
                ? 'Preparing Question...'
                : challenge?.title || 'The Café Challenge'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-0.5">
              {!isSessionFailed && !awardedVoucher && (
                <span>
                  <strong className="text-[var(--theme-pop)]">Attempt {attempt} of 3:</strong>{' '}
                  {attempt === 1 && 'Select the correct answer now to win 30% OFF your entire bill!'}
                  {attempt === 2 && 'Second chance! Answer correctly now for 15% OFF your entire bill.'}
                  {attempt === 3 && 'Final opportunity! Answer correctly now for 5% OFF.'}
                </span>
              )}
              {isSessionFailed && 'All three attempts for this session have been used.'}
              {awardedVoucher && 'Your discount voucher has been generated and applied to your order tray.'}
            </p>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="relative z-10 py-12 flex flex-col items-center justify-center gap-3 text-[var(--theme-accent)]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs text-[var(--theme-text-muted)]">
              Aria is curating a unique question for Attempt {attempt}...
            </p>
          </div>
        ) : isSessionFailed ? (
          /* 3-ATTEMPTS EXHAUSTED / FAILED STATE */
          <div className="relative z-10 p-6 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[#EF4444]/40 space-y-5 animate-scaleUp text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center mx-auto text-[#EF4444]">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-serif text-lg font-semibold text-[var(--theme-text-primary)]">
                Better luck next time!
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                You have exhausted all 3 challenge attempts for this session. In line with our fair-craft policy, no discount voucher could be awarded for this order.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[11px] text-[var(--theme-text-muted)] flex items-center justify-center gap-2">
              <Coffee className="w-4 h-4 text-[var(--theme-accent)]" />
              <span>You can still enjoy our handcrafted single-origin menu at regular pricing.</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Proceed to Checkout at Regular Menu Price
              </button>
            </div>
          </div>
        ) : awardedVoucher ? (
          /* SUCCESS CELEBRATION STATE */
          <div className="relative z-10 p-5 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border-accent)] shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[var(--theme-pop)]" />
                <span>Solved on Attempt {awardedVoucher.attemptUsed || attempt}!</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                {awardedVoucher.discount} Active
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--theme-text-primary)] leading-relaxed italic">
              "{challenge?.explanation || 'Exquisite coffee knowledge! Your taste discernment is second to none.'}"
            </p>

            {/* Rewards Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--theme-accent)]/20 text-[var(--theme-pop)]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">
                    Earned Badge
                  </div>
                  <div className="text-xs font-bold text-[var(--theme-text-primary)]">
                    {awardedVoucher.badgeEarned}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">
                    Immediate Perk
                  </div>
                  <div className="text-xs font-bold text-[#10B981] line-clamp-1">
                    {challenge?.immediatePerk || 'Complimentary Barista Upgrade'}
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--theme-surface-elevated)] to-[var(--theme-surface)] border border-[var(--theme-border-accent)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-text-primary)]">
                  <Ticket className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span>Discount Voucher</span>
                </div>
                <span className="text-[10px] text-[#10B981] font-bold uppercase bg-[#10B981]/15 px-2 py-0.5 rounded">
                  {awardedVoucher.discount}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="font-mono text-sm sm:text-base font-bold text-[var(--theme-text-primary)] tracking-wider bg-[var(--theme-bg)] px-3 py-1.5 rounded-lg border border-[var(--theme-border)]">
                  {awardedVoucher.code}
                </div>
                <button
                  onClick={() => handleCopyCode(awardedVoucher.code)}
                  className="p-2 rounded-lg bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-xs text-[var(--theme-accent)] flex items-center gap-1 transition-colors cursor-pointer border border-[var(--theme-border)]"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[var(--theme-text-muted)] pt-1">
                Benefit: <strong className="text-[var(--theme-pop)]">{awardedVoucher.discount}</strong> + {awardedVoucher.perk}.
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--theme-glow)] cursor-pointer"
              >
                <span>Apply Reward & Return to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION & OPTIONS DISPLAY */
          challenge && (
            <div className="relative z-10 space-y-5">
              {/* The Question */}
              <div className="p-4 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)]">
                <p className="text-sm sm:text-base font-medium text-[var(--theme-text-primary)] leading-relaxed">
                  "{challenge.question}"
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {challenge.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswered = selectedOption !== null;
                  const isCorrect = idx === challenge.correctIndex;

                  let optionStyle = 'bg-[var(--theme-surface-elevated)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 text-[var(--theme-text-primary)]';
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle = 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] shadow-md shadow-[#10B981]/10 font-semibold';
                    } else if (isSelected) {
                      optionStyle = 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] font-semibold';
                    } else {
                      optionStyle = 'opacity-40 bg-[var(--theme-surface)] border-[var(--theme-border)] text-[var(--theme-text-muted)] cursor-not-allowed';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered || evaluating}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isAnswered ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'
                      } ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--theme-surface)] text-[11px] font-bold text-[var(--theme-accent)] flex items-center justify-center border border-[var(--theme-border)]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* EVALUATION PROGRESS OR INCORRECT TRY-AGAIN BOX */}
              {evaluating && (
                <div className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex items-center justify-center gap-2 text-xs text-[var(--theme-text-muted)]">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--theme-accent)]" />
                  <span>Aria is evaluating your palate discernment...</span>
                </div>
              )}

              {verifyResult && !verifyResult.isCorrect && !verifyResult.exhausted && (
                <div className="p-4 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-pop)]/60 space-y-3 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#EF4444] text-xs font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Incorrect Selection · No Voucher Awarded</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--theme-pop)]/20 text-[var(--theme-pop)] font-bold">
                      Attempt {attempt} Failed
                    </span>
                  </div>

                  <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                    {challenge.explanation}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] flex items-center justify-between">
                    <span>Remaining Chance:</span>
                    <strong className="text-[var(--theme-pop)] font-bold">
                      Attempt {attempt + 1} of 3 for {attempt + 1 === 2 ? '15% OFF' : '5% OFF'}
                    </strong>
                  </div>

                  <button
                    onClick={handleNextAttempt}
                    className="w-full py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again with New Question (Attempt {attempt + 1} of 3)</span>
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
