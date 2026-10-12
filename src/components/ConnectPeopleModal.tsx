import React, { useState } from 'react';
import { 
  MOCK_KINDRED_GUESTS, 
  Zone, 
  ZONES 
} from '../data/cafeData';
import { 
  Users, 
  Sparkles, 
  Coffee, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  Check
} from 'lucide-react';

interface ConnectPeopleModalProps {
  currentZone: Zone;
  onTalkToAriaAboutConnection: (interest: string) => void;
}

export const ConnectPeopleModal: React.FC<ConnectPeopleModalProps> = ({
  currentZone,
  onTalkToAriaAboutConnection,
}) => {
  const [guestVibe, setGuestVibe] = useState<string>('Reading speculative literature & sipping single-origin');
  const [optedIn, setOptedIn] = useState<boolean>(true);
  const [sentCheers, setSentCheers] = useState<Record<string, boolean>>({});
  const [customInterest, setCustomInterest] = useState<string>('');

  const sampleVibes = [
    'Reading speculative sci-fi',
    'Deep UI/UX design session',
    'Specialty coffee single-origin cupping',
    'Journaling & reflective prose',
    'Building AI models & agent workflows',
    'Listening to vinyl neo-soul',
  ];

  const handleSendCheer = (guestId: string) => {
    setSentCheers((prev) => ({ ...prev, [guestId]: true }));
    setTimeout(() => {
      setSentCheers((prev) => ({ ...prev, [guestId]: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Rich Background Image */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-border)] p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
        {/* Background Café Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/images/zone_garden_patio.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/90 to-[var(--theme-surface-elevated)]/75 backdrop-blur-[1px]" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)] backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
            <span>Aria · Subtle Café Connections</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text-primary)]">
            Shared Frequencies & Serendipity
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed">
            Lumina Café is a living room for kindred minds. Completely opt-in and anonymous — discover shared passions in other seating zones and spark thoughtful dialogues.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 p-3 rounded-xl bg-[var(--theme-surface-glass)] backdrop-blur-md border border-[var(--theme-border)] text-xs shadow-lg">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <div>
            <span className="text-[var(--theme-text-muted)]">Guest Privacy Promise:</span>
            <div className="text-[#10B981] font-medium">100% Anonymous & Zero Pressure</div>
          </div>
        </div>
      </div>

      {/* Your Current Vibe Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-semibold text-[var(--theme-text-primary)]">
              What frequency are you on right now?
            </h3>
            <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
              Aria uses this to match you with thoughtful conversation starters.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--theme-text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={optedIn}
              onChange={(e) => setOptedIn(e.target.checked)}
              className="accent-[var(--theme-accent)] rounded"
            />
            <span>Broadcasting anonymous frequency</span>
          </label>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {sampleVibes.map((vibe, idx) => (
            <button
              key={idx}
              onClick={() => setGuestVibe(vibe)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                guestVibe === vibe
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow'
                  : 'bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)]/50'
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Or type what you're working on, reading, or contemplating..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none placeholder-[var(--theme-text-muted)]"
          />
          <button
            onClick={() => {
              if (customInterest.trim()) {
                setGuestVibe(customInterest.trim());
                setCustomInterest('');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 border border-[var(--theme-border)] text-xs text-[var(--theme-accent)] font-semibold cursor-pointer transition-colors"
          >
            Update Vibe
          </button>
        </div>
      </div>

      {/* Kindred Guests in the Café */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[var(--theme-text-primary)]">
            Kindred Guests Currently in Other Zones
          </h3>
          <span className="text-xs text-[var(--theme-text-muted)]">
            Seated across Ground Floor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_KINDRED_GUESTS.map((guest) => {
            const guestZone = ZONES.find((z) => z.id === guest.zoneId);
            const isCheered = sentCheers[guest.id];

            return (
              <div
                key={guest.id}
                className="p-5 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] font-serif font-bold text-xs">
                        {guest.pseudonym.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">
                          {guest.pseudonym}
                        </h4>
                        <div className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: guestZone?.accentColor || 'var(--theme-accent)' }}
                          />
                          <span>Seated in {guestZone?.name}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--theme-surface-elevated)] text-[var(--theme-pop)] border border-[var(--theme-border)]">
                      {guest.topic}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                    "{guest.currentVibe}"
                  </p>

                  <div className="p-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-1.5 text-xs">
                    <div className="text-[var(--theme-text-muted)] flex items-center gap-1.5 text-[11px]">
                      <Coffee className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>Sipping: <strong className="text-[var(--theme-text-primary)]">{guest.currentDrink}</strong></span>
                    </div>

                    <div className="text-[var(--theme-accent)] font-medium pt-1 text-[11px] flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>Aria's Icebreaker: <em className="text-[var(--theme-text-muted)] font-normal font-serif">"{guest.icebreaker}"</em></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--theme-border)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onTalkToAriaAboutConnection(guest.topic)}
                    className="text-xs text-[var(--theme-accent)] hover:brightness-110 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
                    <span>Ask Aria to introduce topic</span>
                  </button>

                  <button
                    onClick={() => handleSendCheer(guest.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCheered
                        ? 'bg-[#10B981] text-black font-semibold'
                        : 'bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-primary)] border border-[var(--theme-border)]'
                    }`}
                  >
                    {isCheered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Silent Nod Sent</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                        <span>Send Virtual Coffee Cheer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
