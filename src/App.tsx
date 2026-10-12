import React, { useState, useRef, useEffect } from 'react';
import { 
  ZONES, 
  Zone, 
  MenuItem, 
  CartItem, 
  Voucher,
  CustomerProfile,
  InvoiceData
} from './data/cafeData';
import { Header } from './components/Header';
import { GroundFloorMap } from './components/GroundFloorMap';
import { MenuSection } from './components/MenuSection';
import { BetterWaitsPanel } from './components/BetterWaitsPanel';
import { ConnectPeopleModal } from './components/ConnectPeopleModal';
import { CafeTeamDashboard } from './components/CafeTeamDashboard';
import { CartAndCheckoutModal } from './components/CartAndCheckoutModal';
import { CafeChallengeModal } from './components/CafeChallengeModal';
import { AriaChatDrawer } from './components/AriaChatDrawer';
import { VoucherWalletModal } from './components/VoucherWalletModal';
import { OnboardingModal } from './components/OnboardingModal';
import { OtpAuthModal } from './components/OtpAuthModal';
import { SeatingZoneModal } from './components/SeatingZoneModal';
import { DigitalInvoiceModal } from './components/DigitalInvoiceModal';
import { ThemeProvider } from './theme/ThemeContext';
import { CustomCursor } from './components/CustomCursor';
import { 
  Sparkles, 
  Coffee, 
  X
} from 'lucide-react';

function CafeAppContent() {
  const [currentZone, setCurrentZone] = useState<Zone>(ZONES[0]);
  const [tableNumber, setTableNumber] = useState<string>(() => {
    return localStorage.getItem('lumina_table_number') || 'Table 4';
  });
  const [activeView, setActiveView] = useState<'explore' | 'menu' | 'waits' | 'connect' | 'team'>('explore');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Customer & Device Authentication State
  const [deviceToken] = useState<string>(() => {
    let token = localStorage.getItem('lumina_device_token');
    if (!token) {
      token = `dev_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('lumina_device_token', token);
    }
    return token;
  });

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(() => {
    const saved = localStorage.getItem('lumina_customer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // 6-Hour Challenge Cooldown State
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState<number>(0);

  // Unified Onboarding, Seating & Invoice Modal States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    // Show onboarding on fresh session if no seating choice confirmed yet
    return !sessionStorage.getItem('lumina_onboarding_completed');
  });
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [isSeatingModalOpen, setIsSeatingModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [latestInvoice, setLatestInvoice] = useState<InvoiceData | null>(null);

  // Challenge & Rewards state
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [challengeFailed, setChallengeFailed] = useState<boolean>(false);
  const [challengeBadge, setChallengeBadge] = useState<string | null>(null);
  const [immediatePerk, setImmediatePerk] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  
  // Active Order state
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState<boolean>(false);
  const [isAriaChatOpen, setIsAriaChatOpen] = useState<boolean>(false);
  const [isVoucherWalletOpen, setIsVoucherWalletOpen] = useState<boolean>(false);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ambient sound simulator using Web Audio API
  const [ambientSoundPlaying, setAmbientSoundPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleToggleAmbientSound = () => {
    if (ambientSoundPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSoundPlaying(false);
      showToast('Ambient café soundscape paused');
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Generate warm subtle pink/brown noise simulating coffeehouse acoustic murmur
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.02; // very gentle volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Low-pass filter for cozy muffled warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        setAmbientSoundPlaying(true);
        showToast(`Immersed in ${currentZone.name} acoustic soundscape`);
      } catch (err) {
        console.warn('Audio play error:', err);
      }
    }
  };

  // Add item to cart
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to tray · Aria suggests pairing with your zone`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from order tray');
  };

  const handleSelectZone = (zone: Zone) => {
    setCurrentZone(zone);
    showToast(`Welcome to ${zone.name} — ${zone.tagline}`);
  };

  // Elevate item with Aria
  const handleElevateItemWithAria = (item: MenuItem) => {
    setIsAriaChatOpen(true);
  };

  // Challenge completion handler
  const handleChallengeSuccess = (voucher: Voucher, badge: string, perk: string) => {
    setChallengeCompleted(true);
    setChallengeFailed(false);
    setChallengeBadge(badge);
    setImmediatePerk(perk);
    setVouchers((prev) => [voucher, ...prev]);
    if (!badges.includes(badge)) {
      setBadges((prev) => [...prev, badge]);
    }
    showToast(`Celebration! Earned "${badge}" status + ${voucher.discount} voucher ${voucher.code}`);
  };

  // Challenge failed handler (all 3 attempts exhausted)
  const handleChallengeFailed = () => {
    setChallengeFailed(true);
    showToast('Challenge attempts exhausted. Order will proceed at regular price.');
  };

  // Check Cooldown Effect
  useEffect(() => {
    const checkCooldown = async () => {
      const localExp = Number(localStorage.getItem('lumina_challenge_cooldown') || '0');
      const now = Date.now();
      if (localExp > now) {
        setCooldownActive(true);
        setCooldownRemainingMs(localExp - now);
      }

      try {
        const res = await fetch('/api/auth/check-cooldown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: customerProfile?.phone,
            email: customerProfile?.email,
            deviceToken,
          }),
        });
        const data = await res.json();
        if (data.inCooldown) {
          setCooldownActive(true);
          setCooldownRemainingMs(data.remainingMs);
          localStorage.setItem('lumina_challenge_cooldown', data.expiresAt.toString());
        }
      } catch (e) {
        // ignore
      }
    };
    checkCooldown();
  }, [customerProfile?.phone, customerProfile?.email, deviceToken]);

  // Dual Route Handlers
  const handleSelectPlayAndOrder = () => {
    if (cooldownActive && cooldownRemainingMs > 0) {
      showToast('Challenge cooldown active (1 play per 6 hours). Please proceed to direct order.');
      return;
    }
    setIsOnboardingOpen(false);
    sessionStorage.setItem('lumina_onboarding_completed', 'true');

    if (customerProfile?.isVerified) {
      setIsChallengeModalOpen(true);
      showToast(`Welcome back, ${customerProfile.name}! Café Challenge unlocked.`);
    } else {
      setIsOtpModalOpen(true);
    }
  };

  const handleSelectDirectOrder = () => {
    setIsOnboardingOpen(false);
    sessionStorage.setItem('lumina_onboarding_completed', 'true');
    setIsSeatingModalOpen(true);
  };

  const handleOtpSuccess = (profile: CustomerProfile) => {
    setCustomerProfile(profile);
    localStorage.setItem('lumina_customer_profile', JSON.stringify(profile));
    setIsOtpModalOpen(false);
    setIsChallengeModalOpen(true);
    showToast(`Welcome, ${profile.name}! Challenge unlocked for up to 30% OFF.`);
  };

  const handleConfirmSeating = (zone: Zone, table: string) => {
    setCurrentZone(zone);
    setTableNumber(table);
    localStorage.setItem('lumina_table_number', table);
    setIsSeatingModalOpen(false);
    setActiveView('menu');
    showToast(`Seated at ${zone.name} — ${table} · Welcome to our handcrafted menu!`);
  };

  const handleRecordChallengeCooldown = async () => {
    const sixHoursMs = 6 * 60 * 60 * 1000;
    const expiresAt = Date.now() + sixHoursMs;
    setCooldownActive(true);
    setCooldownRemainingMs(sixHoursMs);
    localStorage.setItem('lumina_challenge_cooldown', expiresAt.toString());

    try {
      await fetch('/api/auth/record-challenge-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerProfile?.phone,
          email: customerProfile?.email,
          deviceToken,
        }),
      });
    } catch (e) {
      console.warn('Could not record cooldown on server:', e);
    }
  };

  const handleOrderSuccess = (invoice: InvoiceData) => {
    setLatestInvoice(invoice);
    setActiveOrder({
      orderId: invoice.orderId,
      items: invoice.items,
      total: invoice.grandTotal,
      zone: invoice.seating.zone,
      tableNumber: invoice.seating.table,
    });
    setCart([]);
    setIsInvoiceModalOpen(true);
    showToast(`Order ${invoice.orderId} placed! Receipt sent to your email & WhatsApp.`);
  };

  // Confirm Order handler (legacy compatibility)
  const handleConfirmOrder = (orderData: any) => {
    setActiveOrder(orderData);
    setCart([]);
    setIsCartOpen(false);
    setActiveView('waits');
    showToast(`Order confirmed! Ticket ${orderData.orderId} sent to espresso bar`);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-primary)] flex flex-col font-sans selection:bg-[var(--theme-accent)]/30 selection:text-[var(--theme-text-primary)] relative transition-colors duration-300">
      {/* Playful Custom Cursor with Physics & Fluid Burst */}
      <CustomCursor />

      {/* Ambient Café Background Texture & Glow Orbs */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] bg-cover bg-fixed bg-center z-0"
        style={{ backgroundImage: `url('/images/hero_cafe.jpg')` }}
      />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[var(--theme-accent)]/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--theme-pop)]/8 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border-accent)] text-xs font-medium text-[var(--theme-text-primary)] shadow-2xl backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-[var(--theme-pop)] flex-shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header with Theme Selector & Editable Seating Badge */}
      <Header
        currentZone={currentZone}
        tableNumber={tableNumber}
        onOpenSeatingModal={() => setIsSeatingModalOpen(true)}
        customerProfile={customerProfile}
        onSelectZoneTab={() => setIsSeatingModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAriaChat={() => setIsAriaChatOpen(true)}
        voucherCount={vouchers.length}
        onOpenVouchers={() => setIsVoucherWalletOpen(true)}
        ambientSoundPlaying={ambientSoundPlaying}
        onToggleAmbientSound={handleToggleAmbientSound}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        {activeView === 'explore' && (
          <GroundFloorMap
            currentZone={currentZone}
            onSelectZone={handleSelectZone}
            onTalkToAriaAboutZone={(zone) => {
              setCurrentZone(zone);
              setIsAriaChatOpen(true);
            }}
          />
        )}

        {activeView === 'menu' && (
          <MenuSection
            currentZone={currentZone}
            onAddToCart={handleAddToCart}
            onElevateItemWithAria={handleElevateItemWithAria}
            cartItemIds={cart.map((c) => c.id)}
          />
        )}

        {activeView === 'waits' && (
          <BetterWaitsPanel
            currentZone={currentZone}
            activeOrder={activeOrder}
            onSelectZone={handleSelectZone}
            onTalkToAriaAboutTiming={() => setIsAriaChatOpen(true)}
          />
        )}

        {activeView === 'connect' && (
          <ConnectPeopleModal
            currentZone={currentZone}
            onTalkToAriaAboutConnection={(topic) => setIsAriaChatOpen(true)}
          />
        )}

        {activeView === 'team' && (
          <CafeTeamDashboard
            currentZone={currentZone}
            onSelectZone={handleSelectZone}
          />
        )}
      </main>

      {/* Sticky Bottom Quick-Bar for Mobile / Guests */}
      <div className="sticky bottom-0 z-30 p-3 bg-[var(--theme-surface-glass)] backdrop-blur-lg border-t border-[var(--theme-border)] sm:hidden flex items-center justify-between gap-2">
        <button
          onClick={() => setIsAriaChatOpen(true)}
          className="flex-1 py-2 rounded-xl bg-[var(--theme-accent)] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talk to Aria</span>
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 py-2 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-primary)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Coffee className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span>Tray ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--theme-border)] bg-[var(--theme-surface)] py-8 px-4 text-xs text-[var(--theme-text-muted)] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">
              LUMINA CAFÉ
            </span>
            <span>·</span>
            <span>Ground Floor Experience</span>
            <span>·</span>
            <span>Powered by Google AI (Gemini 3.8 Flash)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Current Seating: {currentZone.name}</span>
            <span>·</span>
            <button
              onClick={() => setIsVoucherWalletOpen(true)}
              className="text-[var(--theme-accent)] hover:underline cursor-pointer"
            >
              My Vouchers & Badges ({vouchers.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {/* 1. Onboarding Landing Modal (Dual Entry Route) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onSelectPlayAndOrder={handleSelectPlayAndOrder}
        onSelectDirectOrder={handleSelectDirectOrder}
        cooldownActive={cooldownActive}
        cooldownRemainingMs={cooldownRemainingMs}
      />

      {/* 2. OTP Authentication Gate (Option A) */}
      <OtpAuthModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onAuthSuccess={handleOtpSuccess}
        deviceToken={deviceToken}
      />

      {/* 3. 5-Zone Seating Selection Modal (Direct Route / Editable Badge) */}
      <SeatingZoneModal
        isOpen={isSeatingModalOpen}
        onClose={() => setIsSeatingModalOpen(false)}
        selectedZone={currentZone}
        tableNumber={tableNumber}
        onConfirmSeating={handleConfirmSeating}
      />

      {/* 4. Itemized Digital Tax Invoice Modal */}
      <DigitalInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={latestInvoice}
        onTrackOrder={() => {
          setIsInvoiceModalOpen(false);
          setActiveView('waits');
        }}
      />

      {/* 5. Cart & Checkout Tray */}
      <CartAndCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currentZone={currentZone}
        tableNumber={tableNumber}
        onUpdateTableNumber={(t) => setTableNumber(t)}
        customerProfile={customerProfile}
        onUpdateCustomerProfile={(p) => setCustomerProfile(p)}
        challengeCompleted={challengeCompleted}
        challengeFailed={challengeFailed}
        challengeBadge={challengeBadge}
        activeVoucher={vouchers[0] || null}
        immediatePerk={immediatePerk}
        onStartChallenge={() => {
          setIsCartOpen(false);
          handleSelectPlayAndOrder();
        }}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 6. Café Challenge Modal with 6-Hour Cooldown Lock */}
      <CafeChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        zone={currentZone}
        cart={cart}
        onChallengeSuccess={handleChallengeSuccess}
        onChallengeFailed={handleChallengeFailed}
        onRecordCooldown={handleRecordChallengeCooldown}
        challengeCompleted={challengeCompleted}
        challengeFailed={challengeFailed}
        activeVoucher={vouchers[0] || null}
      />

      <AriaChatDrawer
        isOpen={isAriaChatOpen}
        onClose={() => setIsAriaChatOpen(false)}
        currentZone={currentZone}
        cart={cart}
        challengeCompleted={challengeCompleted}
        activeVoucher={vouchers[0] || null}
        onStartChallenge={() => {
          setIsAriaChatOpen(false);
          setIsChallengeModalOpen(true);
        }}
        onOpenMenu={() => {
          setIsAriaChatOpen(false);
          setActiveView('menu');
        }}
        onOpenWaits={() => {
          setIsAriaChatOpen(false);
          setActiveView('waits');
        }}
      />

      <VoucherWalletModal
        isOpen={isVoucherWalletOpen}
        onClose={() => setIsVoucherWalletOpen(false)}
        vouchers={vouchers}
        badges={badges}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CafeAppContent />
    </ThemeProvider>
  );
}
