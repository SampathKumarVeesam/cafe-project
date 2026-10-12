import React from 'react';
import { 
  ZONES, 
  Zone 
} from '../data/cafeData';
import { 
  Sun, 
  Coffee, 
  BookOpen, 
  Leaf, 
  Sparkles, 
  Check, 
  Thermometer, 
  Gauge, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface GroundFloorMapProps {
  currentZone: Zone;
  onSelectZone: (zone: Zone) => void;
  onTalkToAriaAboutZone: (zone: Zone) => void;
}

export const GroundFloorMap: React.FC<GroundFloorMapProps> = ({
  currentZone,
  onSelectZone,
  onTalkToAriaAboutZone,
}) => {
  return (
    <div className="space-y-6">
      {/* Aria's Welcome Banner with Rich Background Image */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-border)] p-5 sm:p-7 shadow-2xl transition-all">
        {/* Background Café Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/hero_cafe.jpg')` }}
        />
        {/* Luxury Dynamic Theme Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/85 to-[var(--theme-surface-elevated)]/75 backdrop-blur-[1px]" />
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-60 h-60 bg-[var(--theme-accent)]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
              <span>Aria · Ground Floor Greeting</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[var(--theme-text-primary)]">
              Welcome to Lumina Café.
            </h1>
            <p className="text-sm sm:text-base text-[var(--theme-text-muted)] leading-relaxed">
              You are standing at our warm brass entryway. The air smells of freshly ground Ethiopian heirloom beans and warm cardamom brioche. Where is your heart pulling you today?
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-[var(--theme-surface-glass)] backdrop-blur-md border border-[var(--theme-border)] text-xs space-y-1 shadow-lg">
              <div className="text-[var(--theme-text-muted)]">Currently Seated in:</div>
              <div className="font-serif text-base font-semibold text-[var(--theme-text-primary)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentZone.accentColor }} />
                {currentZone.name}
              </div>
            </div>
            <button
              onClick={() => onTalkToAriaAboutZone(currentZone)}
              className="px-4 py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-[var(--theme-glow)] cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Ask Aria About Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Architectural Floor Plan */}
      <div className="rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] p-5 sm:p-7 shadow-2xl space-y-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--theme-border)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--theme-accent)]" />
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--theme-text-primary)]">
                Architectural Floor Plan · Ground Floor
              </h2>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
              Click any zone pin or area below to relocate or immerse into its acoustic and light profile.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--theme-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Quiet / Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              Vibrant Rush
            </span>
          </div>
        </div>

        {/* 2.5D Stylized Architectural Map Diagram */}
        <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[500px] rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] overflow-hidden p-3 sm:p-5 select-none transition-all">
          {/* Subtle floor grid texture lines */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--theme-accent) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-widest text-[var(--theme-text-muted)] font-mono flex flex-col items-center pointer-events-none">
            <span>N · BOULEVARD</span>
            <div className="w-4 h-4 border border-[var(--theme-border)] rounded-full flex items-center justify-center my-0.5">
              <div className="w-1.5 h-1.5 bg-[var(--theme-accent)] rounded-full" />
            </div>
            <span>S · PATIO GARDENS</span>
          </div>

          {/* Entrance Doorway Marker */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[var(--theme-accent)] bg-[var(--theme-surface-glass)] px-2 py-0.5 rounded border border-[var(--theme-border)]">
              Main Brass Entrance
            </span>
            <div className="w-8 h-1 bg-[var(--theme-accent)]/50 rounded-full mt-0.5" />
          </div>

          {/* ZONE 1: Main Indoor Hall (Top Left) */}
          <div
            onClick={() => onSelectZone(ZONES[0])}
            className={`absolute top-4 left-4 w-[42%] h-[40%] rounded-xl transition-all cursor-pointer p-3 flex flex-col justify-between border ${
              currentZone.id === 'main-indoor-hall'
                ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                : 'bg-[var(--theme-surface)]/90 border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface-elevated)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#F59E0B]" />
                <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">Main Indoor Hall (AC)</span>
              </div>
              {currentZone.id === 'main-indoor-hall' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--theme-accent)] text-black font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Here
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2">
              Climate-controlled comfort, natural daylight & plush velvet armchairs.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] pt-1 border-t border-[var(--theme-border)]">
              <span>52 dB · Amber Warmth</span>
              <span className="text-[#F59E0B] font-medium">{ZONES[0].occupancyPercent}% Seated</span>
            </div>
          </div>

          {/* ZONE 2: Takeaway / Counter Pickup (Center Island) */}
          <div
            onClick={() => onSelectZone(ZONES[4])}
            className={`absolute top-[48%] left-[28%] -translate-y-1/2 w-[44%] h-[32%] rounded-xl transition-all cursor-pointer p-3 flex flex-col justify-between border ${
              currentZone.id === 'takeaway-counter'
                ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                : 'bg-[var(--theme-surface)]/90 border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface-elevated)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#06B6D4]" />
                <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">Takeaway / Counter</span>
              </div>
              {currentZone.id === 'takeaway-counter' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--theme-accent)] text-black font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Here
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2">
              Front-row espresso bar wands, grab-and-go speed & roast cupping.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] pt-1 border-t border-[var(--theme-border)]">
              <span>66 dB · Active Station</span>
              <span className="text-[#06B6D4] font-medium">{ZONES[4].occupancyPercent}% Occupied</span>
            </div>
          </div>

          {/* ZONE 3: Open-Air Balcony / Rooftop (Top Right) */}
          <div
            onClick={() => onSelectZone(ZONES[1])}
            className={`absolute top-4 right-4 w-[40%] h-[42%] rounded-xl transition-all cursor-pointer p-3 flex flex-col justify-between border ${
              currentZone.id === 'balcony-rooftop'
                ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                : 'bg-[var(--theme-surface)]/90 border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface-elevated)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EC4899]" />
                <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">Open-Air Balcony</span>
              </div>
              {currentZone.id === 'balcony-rooftop' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--theme-accent)] text-black font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Here
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2">
              Panoramic boulevard views, open sky breeze & fairy canopy lantern glow.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] pt-1 border-t border-[var(--theme-border)]">
              <span>58 dB · Sunset Breeze</span>
              <span className="text-[#EC4899] font-medium">{ZONES[1].occupancyPercent}% Seated</span>
            </div>
          </div>

          {/* ZONE 4: Garden Patio (Bottom Left) */}
          <div
            onClick={() => onSelectZone(ZONES[2])}
            className={`absolute bottom-4 left-4 w-[40%] h-[38%] rounded-xl transition-all cursor-pointer p-3 flex flex-col justify-between border ${
              currentZone.id === 'garden-patio'
                ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                : 'bg-[var(--theme-surface)]/90 border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface-elevated)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#10B981]" />
                <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">Garden Patio</span>
              </div>
              {currentZone.id === 'garden-patio' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--theme-accent)] text-black font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Here
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2">
              Mature olive trees, limestone fountain water trickle & jasmine vines.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] pt-1 border-t border-[var(--theme-border)]">
              <span>48 dB · Fountain Calm</span>
              <span className="text-[#10B981] font-medium">{ZONES[2].occupancyPercent}% Seated</span>
            </div>
          </div>

          {/* ZONE 5: Work Pods / Private Lounge (Bottom Right) */}
          <div
            onClick={() => onSelectZone(ZONES[3])}
            className={`absolute bottom-4 right-4 w-[40%] h-[38%] rounded-xl transition-all cursor-pointer p-3 flex flex-col justify-between border ${
              currentZone.id === 'work-pods'
                ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                : 'bg-[var(--theme-surface)]/90 border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-surface-elevated)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">Work Pods</span>
              </div>
              {currentZone.id === 'work-pods' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--theme-accent)] text-black font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Here
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2">
              Acoustic walnut pods, high-speed power outlets & focus reading lamps.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] pt-1 border-t border-[var(--theme-border)]">
              <span>38 dB · Quiet Sanctuary</span>
              <span className="text-[#8B5CF6] font-medium">{ZONES[3].occupancyPercent}% Seated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Sensory Deep Dive Cards (All 5 zones) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[var(--theme-text-primary)]">
            Explore Sensory Profiles of Each Zone
          </h3>
          <span className="text-xs text-[var(--theme-text-muted)]">
            Every zone choice elevates your experience
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ZONES.map((zone) => {
            const isCurrent = zone.id === currentZone.id;
            return (
              <div
                key={zone.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 group overflow-hidden ${
                  isCurrent
                    ? 'bg-[var(--theme-surface-elevated)] border-[var(--theme-accent)] shadow-xl shadow-[var(--theme-glow)] ring-1 ring-[var(--theme-accent)]/30'
                    : 'bg-[var(--theme-surface)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50'
                }`}
              >
                {/* Zone Atmospheric Image Header */}
                <div className="relative w-full h-40 -mx-5 -mt-5 mb-1 overflow-hidden">
                  <img 
                    src={zone.imageUrl} 
                    alt={zone.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-surface)] via-[var(--theme-surface)]/40 to-black/30" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-md"
                      style={{ backgroundColor: zone.accentColor }} 
                    />
                    <span className="text-xs font-semibold text-white drop-shadow-md">
                      {zone.lightProfile.split('(')[0]}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] text-[var(--theme-pop)] font-mono">
                    {zone.decibels} dB
                  </div>

                  {isCurrent && (
                    <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-full bg-[var(--theme-accent)] text-black text-[10px] font-bold shadow-md">
                      Your Table
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: zone.accentColor }}
                      />
                      <h4 className="font-serif text-base font-semibold text-[var(--theme-text-primary)]">
                        {zone.name}
                      </h4>
                    </div>
                    {!isCurrent && (
                      <button
                        onClick={() => onSelectZone(zone)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-elevated)] text-xs font-medium text-[var(--theme-accent)] border border-[var(--theme-border)] cursor-pointer transition-colors"
                      >
                        Sit Here
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[var(--theme-text-muted)] italic font-serif leading-relaxed">
                    "{zone.tagline}"
                  </p>

                  <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                    {zone.detailedAtmosphere}
                  </p>

                  {/* Sensory attributes */}
                  <div className="space-y-1.5 pt-2 border-t border-[var(--theme-border)] text-[11px]">
                    <div className="flex items-center justify-between text-[var(--theme-text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                        Soundscape:
                      </span>
                      <span className="font-medium text-[var(--theme-text-primary)]">{zone.decibels} dB</span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--theme-text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
                        Climate:
                      </span>
                      <span className="font-medium text-[var(--theme-text-primary)]">{zone.temperature}</span>
                    </div>
                    <div className="text-[var(--theme-text-muted)]">
                      <span className="text-[var(--theme-accent)] font-medium">Aromas:</span> {zone.aroma}
                    </div>
                    <div className="text-[var(--theme-text-muted)]">
                      <span className="text-[#10B981] font-medium">Best For:</span> {zone.idealFor}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--theme-border)] flex items-center justify-between">
                  <button
                    onClick={() => onTalkToAriaAboutZone(zone)}
                    className="text-xs text-[var(--theme-accent)] hover:brightness-110 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Aria's pairing tip</span>
                  </button>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">
                    {zone.occupancyPercent}% seated
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
