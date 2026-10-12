import React, { useState, useEffect } from 'react';
import { 
  HOURLY_FLOW, 
  Zone, 
  ZONES 
} from '../data/cafeData';
import { 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Coffee, 
  CheckCircle, 
  Flame, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface BetterWaitsPanelProps {
  currentZone: Zone;
  activeOrder: any | null;
  onSelectZone: (zone: Zone) => void;
  onTalkToAriaAboutTiming: () => void;
}

export const BetterWaitsPanel: React.FC<BetterWaitsPanelProps> = ({
  currentZone,
  activeOrder,
  onSelectZone,
  onTalkToAriaAboutTiming,
}) => {
  const [orderStage, setOrderStage] = useState<number>(activeOrder ? 1 : 0);

  useEffect(() => {
    if (!activeOrder) return;
    setOrderStage(1);
    const timer1 = setTimeout(() => setOrderStage(2), 6000);
    const timer2 = setTimeout(() => setOrderStage(3), 14000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeOrder?.orderId]);

  const stages = [
    { title: 'Ticket Queued', desc: 'Bean batch selected & weighing scale zeroed' },
    { title: 'Grinding & Dialing', desc: 'Precision burr grinding to 240 microns' },
    { title: 'Extraction & Crafting', desc: '9-bar pressure extraction & microfoam texture' },
    { title: 'Ready for Service', desc: `Handcrafted delivery direct to ${activeOrder?.zone || currentZone.name}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner with Rich Background Image */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-border)] p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
        {/* Background Café Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/images/zone_window_lounge.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/90 to-[var(--theme-surface-elevated)]/75 backdrop-blur-[1px]" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)] backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
            <span>Aria · Better Waits Intelligence</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text-primary)]">
            Time, Flow & Readiness Status
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed">
            We turn wait time into transparent craft. Monitor real-time espresso throughput, peak hour predictions, and order readiness.
          </p>
        </div>

        <button
          onClick={onTalkToAriaAboutTiming}
          className="relative z-10 px-4 py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-[var(--theme-glow)] cursor-pointer flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Aria for Best Visit Time</span>
        </button>
      </div>

      {/* ACTIVE ORDER READINESS TRACKER (If order is active) */}
      {activeOrder && (
        <div className="rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border-accent)] p-6 shadow-2xl space-y-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--theme-border)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[var(--theme-accent)] animate-pulse" />
                <h3 className="font-serif text-lg font-semibold text-[var(--theme-text-primary)]">
                  Live Order Tracker · {activeOrder.orderId}
                </h3>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Delivering to: <strong className="text-[var(--theme-text-primary)]">{activeOrder.tableNumber || 'Table 4'}</strong> in {activeOrder.zone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">
                  Est. Readiness
                </div>
                <div className="font-serif text-lg font-bold text-[#10B981]">
                  {orderStage === 3 ? 'Ready for You!' : `~${activeOrder.estimatedWait || 4} Mins`}
                </div>
              </div>
            </div>
          </div>

          {/* 4-Stage Progress Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {stages.map((stg, idx) => {
              const isPast = idx < orderStage;
              const isCurrent = idx === orderStage;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isPast
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
                      : isCurrent
                      ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/40 text-[var(--theme-text-primary)] shadow-lg shadow-[var(--theme-glow)]'
                      : 'bg-[var(--theme-surface-elevated)] border-[var(--theme-border)] text-[var(--theme-text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Stage 0{idx + 1}
                    </span>
                    {isPast ? (
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    ) : isCurrent ? (
                      <Zap className="w-4 h-4 text-[var(--theme-accent)] animate-bounce" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[var(--theme-border)]" />
                    )}
                  </div>
                  <div className="font-serif text-sm font-semibold mb-1">
                    {stg.title}
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {stg.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Special Order Note Badge */}
          {activeOrder.immediatePerk && (
            <div className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-pop)] flex items-center justify-between">
              <span>Unlocked with Aria's Challenge:</span>
              <strong className="text-[var(--theme-text-primary)]">{activeOrder.immediatePerk}</strong>
            </div>
          )}
        </div>
      )}

      {/* Real-Time Café Throughput & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl p-5 bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-3 transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-[var(--theme-accent)]" />
              Espresso Bar Throughput
            </span>
            <span className="text-[#10B981] font-semibold">Optimal</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[var(--theme-pop)]">
            4.2 mins
          </div>
          <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
            Synesso copper groupheads dialed in. Single-origin pour-overs average 5 mins.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-3 transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4 text-[var(--theme-pop)]" />
              Artisan Oven Queue
            </span>
            <span className="text-[#F59E0B] font-semibold">Moderate</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[var(--theme-pop)]">
            6.5 mins
          </div>
          <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
            Fresh stone hearth warming for laminated brioche & summer truffle tartines.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-3 transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              Today's Recommended Golden Hour
            </span>
            <span className="text-[#10B981] font-semibold">Tranquil</span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#10B981]">
            3:30 – 5:00 PM
          </div>
          <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
            Sun slants softly into Window Lounge; acoustic levels drop below 45 dB.
          </p>
        </div>
      </div>

      {/* Hourly Flow Chart & Load Breakdown */}
      <div className="rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] p-5 sm:p-7 shadow-xl space-y-5 transition-all">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--theme-text-primary)]">
            Ground Floor Load & Wait Times by Hour
          </h3>
          <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
            Plan your return visit around our tranquility waves.
          </p>
        </div>

        <div className="space-y-3">
          {HOURLY_FLOW.map((slot) => {
            const isHigh = slot.load > 75;
            const isSweetSpot = slot.load <= 55;

            return (
              <div
                key={slot.hour}
                className="p-3.5 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-[120px]">
                  <span className="font-mono font-bold text-[var(--theme-text-primary)] text-sm">
                    {slot.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isSweetSpot
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : isHigh
                        ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>

                {/* Load Bar */}
                <div className="flex-1 max-w-md mx-2">
                  <div className="h-2 w-full bg-[var(--theme-bg)] rounded-full overflow-hidden border border-[var(--theme-border)]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHigh ? 'bg-[#EF4444]' : isSweetSpot ? 'bg-[#10B981]' : 'bg-[var(--theme-accent)]'
                      }`}
                      style={{ width: `${slot.load}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span className="text-[var(--theme-text-muted)]">
                    Capacity: <strong className="text-[var(--theme-text-primary)]">{slot.load}%</strong>
                  </span>
                  <span className="text-[var(--theme-pop)] font-semibold min-w-[70px]">
                    ~{slot.waitMin} min wait
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Balancer Recommendations */}
      <div className="p-5 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-3 transition-all">
        <h4 className="font-serif text-base font-semibold text-[var(--theme-text-primary)]">
          Aria's Dynamic Seating Suggestions
        </h4>
        <p className="text-xs text-[var(--theme-text-muted)]">
          Looking for a quieter table right now? See which zones have the lowest rush:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => onSelectZone(z)}
              className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 border border-[var(--theme-border)] text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="font-medium text-xs text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)]">
                  {z.name}
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)]">{z.decibels} dB · {z.occupancyPercent}% seated</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--theme-accent)] opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
