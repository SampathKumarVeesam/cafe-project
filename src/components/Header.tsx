import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Coffee, 
  Clock, 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  Ticket,
  Volume2,
  Menu,
  X,
  User,
  CheckCircle2,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { Zone, CustomerProfile } from '../data/cafeData';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  currentZone: Zone;
  tableNumber: string;
  onOpenSeatingModal: () => void;
  customerProfile: CustomerProfile | null;
  onSelectZoneTab?: () => void;
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const handleNavClick = (view: 'explore' | 'menu' | 'waits' | 'connect' | 'team') => {
    setActiveView(view);
    setIsMobileDrawerOpen(false);
  };

  const displayName = currentZone.name.replace(' (AC)', '');

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--theme-header-bg)] border-b border-[var(--theme-border)] transition-all">
        {/* =========================================================================
            HEADER ROW: Non-colliding flex alignment with guaranteed clearance
        ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 xl:gap-4">
          
          {/* LEFT: Café Brand Monogram & Title */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => handleNavClick('explore')}
              className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--theme-accent)] via-[var(--theme-pop)] to-[var(--theme-c1)] p-[1.5px] shadow-lg shadow-[var(--theme-glow)] transition-transform group-hover:scale-105 flex-shrink-0">
                <div className="w-full h-full bg-[var(--theme-bg)] rounded-[10px] flex items-center justify-center">
                  <span className="font-serif text-sm sm:text-base font-bold text-[var(--theme-text-primary)] tracking-tight">L</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base sm:text-lg tracking-wider font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap">
                  LUMINA CAFÉ
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[var(--theme-accent)]/20 text-[var(--theme-text-primary)] border border-[var(--theme-accent)]/30 hidden xs:inline-block">
                  AI
                </span>
              </div>
            </button>
          </div>

          {/* =========================================================================
              DESKTOP CENTER (≥ 1024px): Seating Pill + 5 Navigation Tabs
          ========================================================================= */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
            {/* Active Seating Zone Pill with Responsive Display */}
            <button
              onClick={onOpenSeatingModal}
              title={`Seated in ${currentZone.name} · ${tableNumber} (Click to change)`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] transition-all cursor-pointer group shadow-sm flex-shrink-0 whitespace-nowrap"
            >
              <span 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: currentZone.accentColor }} 
              />
              <span className="hidden xl:inline font-semibold text-[var(--theme-text-primary)] max-w-[110px] truncate">
                {displayName}
              </span>
              <span className="hidden xl:inline text-[var(--theme-border-accent)] opacity-60">·</span>
              <span className="font-mono text-[var(--theme-pop)] font-bold">
                {tableNumber}
              </span>
              <Edit3 className="w-3 h-3 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-accent)] transition-colors ml-0.5 flex-shrink-0" />
            </button>

            {/* Main Navigation Tabs (All 5 items cleanly spaced) */}
            <nav className="flex items-center gap-0.5 xl:gap-1 bg-[var(--theme-surface-glass)] p-1 rounded-xl border border-[var(--theme-border)] flex-shrink-0">
              <button
                onClick={() => handleNavClick('explore')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'explore'
                    ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Atmosphere</span>
              </button>
              <button
                onClick={() => handleNavClick('menu')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'menu'
                    ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Menu</span>
              </button>
              <button
                onClick={() => handleNavClick('waits')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'waits'
                    ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
                }`}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Waits</span>
              </button>
              <button
                onClick={() => handleNavClick('connect')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'connect'
                    ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Connect</span>
              </button>
              <button
                onClick={() => handleNavClick('team')}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'team'
                    ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Team</span>
              </button>
            </nav>
          </div>

          {/* =========================================================================
              TABLET CENTER (640px – 1023px): Condensed Single-Row Navigation
          ========================================================================= */}
          <nav className="hidden sm:flex lg:hidden items-center gap-0.5 bg-[var(--theme-surface-glass)] p-1 rounded-xl border border-[var(--theme-border)] flex-shrink-0">
            <button
              onClick={() => handleNavClick('explore')}
              title="Atmosphere & Floor"
              className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'explore'
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Floor</span>
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              title="Menu"
              className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'menu'
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Menu</span>
            </button>
            <button
              onClick={() => handleNavClick('waits')}
              title="Wait Times"
              className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'waits'
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Waits</span>
            </button>
            <button
              onClick={() => handleNavClick('connect')}
              title="Connect"
              className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'connect'
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Connect</span>
            </button>
            <button
              onClick={() => handleNavClick('team')}
              title="Team Dashboard"
              className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'team'
                  ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Team</span>
            </button>
          </nav>

          {/* =========================================================================
              RIGHT CLUSTER: Controls & Actions (Always flex-shrink-0)
          ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Tablet Seating Pill (Iconified / Compact) */}
            <button
              onClick={onOpenSeatingModal}
              title={`Seated in ${currentZone.name} · ${tableNumber}`}
              className="hidden sm:flex lg:hidden items-center gap-1.5 px-2 py-1.5 rounded-xl bg-[var(--theme-surface-glass)] border border-[var(--theme-border)] text-xs font-medium cursor-pointer flex-shrink-0"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentZone.accentColor }} />
              <span className="font-mono text-[var(--theme-pop)] font-bold">{tableNumber}</span>
            </button>

            {/* Theme Selector Toggle */}
            <ThemeSelector />

            {/* Ambient Soundscape Toggle (xl screens only to preserve space) */}
            <button
              onClick={onToggleAmbientSound}
              title={ambientSoundPlaying ? 'Pause café ambient soundscape' : 'Play café acoustic soundscape'}
              className={`hidden xl:flex p-1.5 rounded-xl border text-xs transition-all cursor-pointer flex-shrink-0 ${
                ambientSoundPlaying
                  ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)] text-[var(--theme-pop)]'
                  : 'bg-[var(--theme-surface-glass)] border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Vouchers & Badges Wallet (xl screens only) */}
            <button
              onClick={onOpenVouchers}
              title="View earned vouchers & badges"
              className="hidden xl:flex relative p-1.5 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] transition-all cursor-pointer flex-shrink-0"
            >
              <Ticket className="w-4 h-4 text-[var(--theme-pop)]" />
              {voucherCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--theme-accent)] text-[10px] font-bold text-black flex items-center justify-center">
                  {voucherCount}
                </span>
              )}
            </button>

            {/* Live Cart Count Badge Button */}
            <button
              onClick={onOpenCart}
              title="Review order tray"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs font-medium text-[var(--theme-text-primary)] transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--theme-accent)] flex-shrink-0" />
              <span className="hidden xl:inline">Tray</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--theme-accent)] text-black font-bold text-[11px] flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Session Profile Icon / Badge */}
            {customerProfile?.isVerified ? (
              <div 
                title={`Verified Guest: ${customerProfile.name} (${customerProfile.phone})`}
                className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex-shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span className="font-semibold truncate max-w-[70px]">
                  {customerProfile.name.split(' ')[0]}
                </span>
              </div>
            ) : null}

            {/* Talk to Aria Button (Desktop / Tablet) */}
            <button
              onClick={onOpenAriaChat}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-pop)] text-black text-xs font-bold shadow-md shadow-[var(--theme-glow)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Aria</span>
            </button>

            {/* MOBILE HAMBURGER BUTTON (< 640px) */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open navigation drawer"
              className="sm:hidden p-2 rounded-xl bg-[var(--theme-surface-glass)] hover:bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] transition-all cursor-pointer flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-[var(--theme-text-primary)]" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MOBILE SUB-HEADER BANNER (< 640px): Persistent Slim Sub-Strip
        ========================================================================= */}
        <div className="sm:hidden flex items-center justify-between px-4 py-1.5 bg-[var(--theme-surface-glass)] border-t border-[var(--theme-border)]/60 text-xs text-[var(--theme-text-muted)]">
          <div className="flex items-center gap-2 truncate">
            <span 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ backgroundColor: currentZone.accentColor }} 
            />
            <span className="font-semibold text-[var(--theme-text-primary)] truncate">
              {displayName}
            </span>
            <span className="text-[var(--theme-border-accent)] opacity-60">·</span>
            <span className="font-mono text-[var(--theme-pop)] font-bold">
              {tableNumber}
            </span>
          </div>

          <button
            onClick={onOpenSeatingModal}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--theme-accent)] hover:underline ml-2 flex-shrink-0 cursor-pointer"
          >
            <span>Change</span>
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE SLIDE-OUT OFF-CANVAS DRAWER (< 640px)
      ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden animate-fadeIn">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container from the right */}
          <div className="absolute top-0 right-0 bottom-0 w-[84%] max-w-[340px] bg-[var(--theme-surface-elevated)] border-l border-[var(--theme-border-accent)] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft z-10 pb-[max(20px,env(safe-area-inset-bottom))]">
            
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-pop)] p-[1px]">
                    <div className="w-full h-full bg-[var(--theme-bg)] rounded-[7px] flex items-center justify-center">
                      <span className="font-serif text-sm font-bold text-[var(--theme-text-primary)]">L</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[var(--theme-text-primary)]">
                      LUMINA CAFÉ
                    </h3>
                    <p className="text-[10px] text-[var(--theme-text-muted)]">
                      Ground Floor Experience
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account / Session Status Card */}
              <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] font-semibold">
                  Session Status
                </div>
                {customerProfile?.isVerified ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span className="font-bold text-[var(--theme-text-primary)]">
                      {customerProfile.name}
                    </span>
                    <span className="text-[10px] text-[var(--theme-text-muted)] font-mono">
                      (+91 {customerProfile.phone})
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--theme-text-muted)]">
                    Guest Ordering · Tabletop Verified
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] font-semibold px-2 pb-1">
                  Explore Lumina
                </div>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'explore'
                      ? 'bg-[var(--theme-accent)] text-black shadow-md'
                      : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Ground Floor & Atmosphere</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('menu')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'menu'
                      ? 'bg-[var(--theme-accent)] text-black shadow-md'
                      : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4" />
                    <span>Elevated Menu</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('waits')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'waits'
                      ? 'bg-[var(--theme-accent)] text-black shadow-md'
                      : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4" />
                    <span>Better Waits & Timing</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('connect')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'connect'
                      ? 'bg-[var(--theme-accent)] text-black shadow-md'
                      : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Connect with Tablemates</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('team')}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'team'
                      ? 'bg-[var(--theme-accent)] text-black shadow-md'
                      : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Café Team Ops</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Utility shortcuts */}
              <div className="space-y-2 pt-3 border-t border-[var(--theme-border)]">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenVouchers();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[var(--theme-pop)]" />
                    <span>Vouchers & Badges</span>
                  </div>
                  <span className="font-bold text-[var(--theme-accent)] font-mono">{voucherCount}</span>
                </button>

                <button
                  onClick={onToggleAmbientSound}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[var(--theme-accent)]" />
                    <span>Acoustic Soundscape</span>
                  </div>
                  <span className="text-[10px] text-[var(--theme-text-muted)]">
                    {ambientSoundPlaying ? 'Playing' : 'Paused'}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions: Talk to Aria */}
            <div className="pt-4 border-t border-[var(--theme-border)] space-y-2">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onOpenAriaChat();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-pop)] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[var(--theme-glow)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Talk to Aria AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
