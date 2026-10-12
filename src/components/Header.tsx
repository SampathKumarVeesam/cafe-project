import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Coffee, 
  Clock, 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  Ticket,
  Volume2
} from 'lucide-react';
import { Zone, CustomerProfile } from '../data/cafeData';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  currentZone: Zone;
  tableNumber: string;
  onOpenSeatingModal: () => void;
  customerProfile: CustomerProfile | null;
  onSelectZoneTab: () => void;
  activeView: 'explore' | 'menu' | 'waits' | 'connect' | 'team';
  setActiveView: (view: 'explore' | 'menu' | 'waits' | 'connect' | 'team') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAriaChat: () => void;
  voucherCount: number;
  onOpenVouchers: () => void;
  ambientSoundPlaying: boolean;
  onToggleAmbientSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentZone,
  tableNumber,
  onOpenSeatingModal,
  customerProfile,
  onSelectZoneTab,
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
  onOpenAriaChat,
  voucherCount,
  onOpenVouchers,
  ambientSoundPlaying,
  onToggleAmbientSound,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--theme-header-bg)] border-b border-[var(--theme-border)] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('explore')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-accent)] via-[var(--theme-pop)] to-[var(--theme-c1)] p-[1.5px] shadow-lg shadow-[var(--theme-glow)] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[var(--theme-bg)] rounded-[10px] flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-[var(--theme-text-primary)] tracking-tight">L</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wider font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors">
                  LUMINA CAFÉ
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[var(--theme-accent)]/20 text-[var(--theme-text-primary)] border border-[var(--theme-accent)]/30">
                  Google AI
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] hidden sm:block">
                Digital Companion <span className="text-[var(--theme-accent)] font-medium">Aria</span> · Ground Floor
              </p>
            </div>
          </button>
        </div>

        {/* Navigation tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--theme-surface-glass)] p-1 rounded-xl border border-[var(--theme-border)]">
          <button
            onClick={() => setActiveView('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'explore'
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Floor & Atmosphere
          </button>
          <button
            onClick={() => setActiveView('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'menu'
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Elevated Menu
          </button>
          <button
            onClick={() => setActiveView('waits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'waits'
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Better Waits
          </button>
          <button
            onClick={() => setActiveView('connect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'connect'
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Connect
          </button>
          <button
            onClick={() => setActiveView('team')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'team'
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Café Team Mode
          </button>
        </nav>

        {/* Right action cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Theme 4-Color Selector Pill */}
          <ThemeSelector />

          {/* Editable Seating Zone & Table Pill Badge */}
          <button
            onClick={onOpenSeatingModal}
            title="Click to change your seating zone or table number"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] transition-all cursor-pointer group shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-[var(--theme-text-primary)] hidden xs:inline">
              {currentZone.name}
            </span>
            <span className="text-[var(--theme-border)] hidden sm:inline">—</span>
            <span className="font-mono text-[var(--theme-pop)] font-bold">
              {tableNumber}
            </span>
            <span className="text-[10px] text-[var(--theme-text-muted)] underline ml-1 hidden md:inline">
              Edit
            </span>
          </button>

          {/* Guest Profile badge if authenticated via Option A */}
          {customerProfile?.isVerified && (
            <div 
              title={`Logged in as ${customerProfile.name} (+91 ${customerProfile.phone})`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="font-medium truncate max-w-[90px]">{customerProfile.name}</span>
            </div>
          )}

          {/* Ambient Soundscape Simulator */}
          <button
            onClick={onToggleAmbientSound}
            title={ambientSoundPlaying ? 'Pause café ambient soundscape' : 'Play café acoustic soundscape'}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              ambientSoundPlaying
                ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)] text-[var(--theme-pop)]'
                : 'bg-[var(--theme-surface-glass)] border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Vouchers & Badges Button */}
          <button
            onClick={onOpenVouchers}
            title="View earned vouchers & badges"
            className="relative p-2 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-[var(--theme-pop)]" />
            {voucherCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--theme-accent)] text-[10px] font-bold text-black flex items-center justify-center">
                {voucherCount}
              </span>
            )}
          </button>

          {/* Cart & Challenge Button */}
          <button
            onClick={onOpenCart}
            title="Review order & start mandatory challenge"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs font-medium text-[var(--theme-text-primary)] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="hidden sm:inline">Order</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--theme-accent)] text-black font-bold text-[11px] flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Aria Summon Button */}
          <button
            onClick={onOpenAriaChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-pop)] text-black text-xs font-bold shadow-md shadow-[var(--theme-glow)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
            <span>Aria</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="flex md:hidden items-center justify-around mt-2 pt-2 border-t border-[var(--theme-border)] gap-1 text-[11px]">
        <button
          onClick={() => setActiveView('explore')}
          className={`px-2 py-1 rounded transition-colors ${
            activeView === 'explore' ? 'text-[var(--theme-accent)] font-semibold' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          Ground Floor
        </button>
        <button
          onClick={() => setActiveView('menu')}
          className={`px-2 py-1 rounded transition-colors ${
            activeView === 'menu' ? 'text-[var(--theme-accent)] font-semibold' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveView('waits')}
          className={`px-2 py-1 rounded transition-colors ${
            activeView === 'waits' ? 'text-[var(--theme-accent)] font-semibold' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          Waits
        </button>
        <button
          onClick={() => setActiveView('connect')}
          className={`px-2 py-1 rounded transition-colors ${
            activeView === 'connect' ? 'text-[var(--theme-accent)] font-semibold' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          Connect
        </button>
        <button
          onClick={() => setActiveView('team')}
          className={`px-2 py-1 rounded transition-colors ${
            activeView === 'team' ? 'text-[var(--theme-accent)] font-semibold' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          Team Mode
        </button>
      </div>
    </header>
  );
};
