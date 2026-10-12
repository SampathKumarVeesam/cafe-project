import React, { useState } from 'react';
import { 
  MapPin, 
  Check, 
  X, 
  ArrowRight, 
  Wind, 
  Sun, 
  Leaf, 
  Headphones, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { ZONES, Zone } from '../data/cafeData';

interface SeatingZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: Zone;
  tableNumber: string;
  onConfirmSeating: (zone: Zone, table: string) => void;
}

export const SeatingZoneModal: React.FC<SeatingZoneModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  tableNumber: initialTableNumber,
  onConfirmSeating,
}) => {
  const [activeZone, setActiveZone] = useState<Zone>(selectedZone);
  const [tableInput, setTableInput] = useState<string>(initialTableNumber || 'Table 4');

  if (!isOpen) return null;

  const handleSelectZone = (zone: Zone) => {
    setActiveZone(zone);
    if (zone.id === 'takeaway-counter' && (!tableInput || tableInput.startsWith('Table'))) {
      setTableInput('Counter Pickup');
    } else if (zone.id !== 'takeaway-counter' && tableInput === 'Counter Pickup') {
      setTableInput('Table 4');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalTable = tableInput.trim() || (activeZone.id === 'takeaway-counter' ? 'Counter Pickup' : 'Table 1');
    onConfirmSeating(activeZone, finalTable);
    onClose();
  };

  const getZoneIcon = (id: string) => {
    switch (id) {
      case 'main-indoor-hall':
        return <Wind className="w-4 h-4 text-[#F59E0B]" />;
      case 'balcony-rooftop':
        return <Sun className="w-4 h-4 text-[#EC4899]" />;
      case 'garden-patio':
        return <Leaf className="w-4 h-4 text-[#10B981]" />;
      case 'work-pods':
        return <Headphones className="w-4 h-4 text-[#8B5CF6]" />;
      case 'takeaway-counter':
        return <ShoppingBag className="w-4 h-4 text-[#06B6D4]" />;
      default:
        return <MapPin className="w-4 h-4 text-[var(--theme-accent)]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-6 transition-all max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-pop)] text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ground Floor Location Targeting</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text-primary)]">
            Where are you seated today?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)]">
            Choose your seating zone below so our baristas can deliver your order directly to your table or prep it for counter takeaway.
          </p>
        </div>

        {/* The 5 Location Zones */}
        <div className="space-y-2.5">
          {ZONES.map((zone) => {
            const isSelected = activeZone.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => handleSelectZone(zone)}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[var(--theme-surface-elevated)] border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 shadow-lg shadow-[var(--theme-glow)]'
                    : 'bg-[var(--theme-surface)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-surface-elevated)]/60'
                }`}
              >
                {/* Background image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url('${zone.imageUrl}')` }}
                />

                <div className="relative z-10 flex items-start gap-3.5 flex-1">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{ 
                      backgroundColor: `${zone.accentColor}15`,
                      borderColor: `${zone.accentColor}40` 
                    }}
                  >
                    {getZoneIcon(zone.id)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm sm:text-base font-bold text-[var(--theme-text-primary)]">
                        {zone.name}
                      </span>
                      <span 
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium"
                        style={{ 
                          backgroundColor: `${zone.accentColor}20`,
                          color: zone.accentColor 
                        }}
                      >
                        {zone.temperature}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--theme-text-muted)] line-clamp-1">
                      {zone.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-[11px] text-[var(--theme-text-muted)] hidden sm:inline">
                    {zone.occupancyPercent}% Occupied
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] text-black'
                        : 'border-[var(--theme-border)] text-transparent group-hover:border-[var(--theme-accent)]/40'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seat / Table Number Input */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 border-t border-[var(--theme-border)]">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--theme-text-muted)] flex items-center justify-between">
              <span>Seat / Table Identifier</span>
              <span className="text-[11px] text-[var(--theme-accent)]">
                Printed on your tabletop or chair QR token
              </span>
            </label>
            <input
              type="text"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              placeholder="e.g. Table 12, Booth 3, or Bar Stool 5"
              className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs sm:text-sm font-medium text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--theme-glow)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Seating ({activeZone.name} · {tableInput || 'Table 1'}) & Open Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
