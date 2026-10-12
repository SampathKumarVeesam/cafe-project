import React, { useState } from 'react';
import { 
  CartItem, 
  Zone, 
  Voucher,
  CustomerProfile,
  InvoiceData
} from '../data/cafeData';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Ticket, 
  Award, 
  ShieldCheck, 
  X, 
  CheckCircle,
  Clock, 
  ArrowRight,
  ShieldAlert,
  CreditCard,
  QrCode,
  Smartphone,
  Check,
  User,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  currentZone: Zone;
  tableNumber: string;
  onUpdateTableNumber: (table: string) => void;
  customerProfile: CustomerProfile | null;
  onUpdateCustomerProfile: (profile: CustomerProfile) => void;
  challengeCompleted: boolean;
  challengeFailed?: boolean;
  challengeBadge: string | null;
  activeVoucher: Voucher | null;
  immediatePerk: string | null;
  onStartChallenge: () => void;
  onOrderSuccess: (invoice: InvoiceData) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  currentZone,
  tableNumber,
  onUpdateTableNumber,
  customerProfile,
  onUpdateCustomerProfile,
  challengeCompleted,
  challengeFailed = false,
  challengeBadge,
  activeVoucher,
  immediatePerk,
  onStartChallenge,
  onOrderSuccess,
}) => {
  const [specialRequest, setSpecialRequest] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  // Direct checkout customer inputs (if not logged in via OTP)
  const [guestName, setGuestName] = useState<string>(customerProfile?.name || '');
  const [guestPhone, setGuestPhone] = useState<string>(customerProfile?.phone || '');
  const [guestEmail, setGuestEmail] = useState<string>(customerProfile?.email || '');

  // Card inputs
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExp, setCardExp] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('491');

  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Exact tiered discount calculation
  let discountPercent = 0.0;
  if (challengeCompleted && activeVoucher) {
    if (activeVoucher.discountPercentage) {
      discountPercent = activeVoucher.discountPercentage / 100;
    } else if (activeVoucher.discount.includes('30%')) {
      discountPercent = 0.30;
    } else if (activeVoucher.discount.includes('15%')) {
      discountPercent = 0.15;
    } else if (activeVoucher.discount.includes('5%')) {
      discountPercent = 0.05;
    } else {
      discountPercent = 0.15;
    }
  }

  const discountAmount = rawSubtotal * discountPercent;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  // 5% GST (2.5% CGST + 2.5% SGST)
  const cgst = Number((taxableAmount * 0.025).toFixed(2));
  const sgst = Number((taxableAmount * 0.025).toFixed(2));
  const totalTax = Number((cgst + sgst).toFixed(2));
  const finalTotal = Number((taxableAmount + totalTax).toFixed(2));

  const estimatedWait = cart.length > 0 ? Math.max(...cart.map((c) => c.waitTimeMinutes)) : 0;

  const handleCheckoutClick = async () => {
    setFormError(null);

    // Validate customer contact
    const finalName = (customerProfile?.name || guestName).trim() || 'Valued Guest';
    const cleanPhone = (customerProfile?.phone || guestPhone).replace(/\D/g, '');
    const finalEmail = (customerProfile?.email || guestEmail).trim() || 'guest@luminacafe.com';

    if (!cleanPhone || cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number for invoice delivery.');
      return;
    }

    setProcessingPayment(true);

    try {
      const providerLabel =
        paymentMethod === 'upi'
          ? upiApp === 'gpay'
            ? 'Google Pay'
            : upiApp === 'phonepe'
            ? 'PhonePe'
            : upiApp === 'paytm'
            ? 'Paytm'
            : 'UPI QR'
          : 'Visa Platinum';

      const res = await fetch('/api/order/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          seatingZone: currentZone.name,
          tableNumber: tableNumber || 'Table 4',
          customer: {
            name: finalName,
            phone: cleanPhone,
            email: finalEmail,
            isVerified: Boolean(customerProfile?.isVerified),
          },
          voucher: challengeCompleted && activeVoucher ? activeVoucher : null,
          paymentMethod,
          paymentDetails: {
            provider: providerLabel,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || 'Payment processing failed. Please retry.');
        setProcessingPayment(false);
        return;
      }

      // Update customer profile state if not set
      if (!customerProfile?.isVerified) {
        onUpdateCustomerProfile({
          name: finalName,
          phone: cleanPhone,
          email: finalEmail,
        });
      }

      onClose();
      onOrderSuccess(data.invoice);
    } catch (err: any) {
      setFormError('Network error processing checkout.');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[var(--theme-text-primary)] transition-all">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--theme-border)] flex items-center justify-between bg-[var(--theme-surface-elevated)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-semibold text-[var(--theme-text-primary)]">
                Your Lumina Order Tray
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-text-primary)] font-mono">
                {cart.reduce((a, c) => a + c.quantity, 0)} Items
              </span>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
              Seated in <strong className="text-[var(--theme-text-primary)]">{currentZone.name}</strong> · {tableNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-[var(--theme-text-muted)]">
                Your order tray is currently empty.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--theme-accent)] text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Explore Elevated Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm sm:text-base font-semibold text-[var(--theme-text-primary)]">
                          {item.name}
                        </span>
                        <span className="text-xs text-[var(--theme-text-muted)] font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-1 italic">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-[var(--theme-surface)] p-1 rounded-xl border border-[var(--theme-border)]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 rounded-lg hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-primary)] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[var(--theme-text-primary)] px-1 min-w-[16px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 rounded-lg hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-primary)] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-[var(--theme-pop)] min-w-[50px] text-right font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-[var(--theme-text-muted)] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TIERED CAFÉ CHALLENGE BANNER */}
              {!challengeCompleted && !challengeFailed ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--theme-surface-elevated)] via-[var(--theme-surface)] to-[var(--theme-bg)] border border-[var(--theme-accent)]/50 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--theme-pop)] animate-pulse" />
                      <span className="font-serif text-sm font-semibold text-[var(--theme-text-primary)]">
                        Aria's Tiered Café Challenge
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)] bg-[var(--theme-accent)]/15 px-2 py-0.5 rounded border border-[var(--theme-accent)]/30">
                      Up to 30% OFF
                    </span>
                  </div>

                  <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                    Test your sensory palate across 3 attempts before paying. Solve Attempt 1 for 30% OFF, Attempt 2 for 15% OFF, or Attempt 3 for 5% OFF!
                  </p>

                  <button
                    onClick={onStartChallenge}
                    className="w-full py-2.5 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Play Challenge (Aim for 30% OFF)</span>
                  </button>
                </div>
              ) : challengeCompleted && activeVoucher ? (
                <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      <span>Challenge Solved · {activeVoucher.discount} Voucher Applied!</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--theme-accent)]">
                      {activeVoucher.code}
                    </span>
                  </div>
                  {immediatePerk && (
                    <p className="text-[11px] text-[#10B981] italic">
                      Unlocked: {immediatePerk}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                  <span>3 Challenge Attempts Used · Proceeding at Regular Menu Pricing</span>
                </div>
              )}

              {/* Seating & Barista Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--theme-text-muted)] font-medium">
                    Table / Seat Number:
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => onUpdateTableNumber(e.target.value)}
                    placeholder="e.g. Table 12"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--theme-text-muted)] font-medium">
                    Barista Craft Note:
                  </label>
                  <input
                    type="text"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Extra hot oat milk, cinnamon dusted"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Contact for Invoice Delivery (if not authenticated) */}
              {!customerProfile?.isVerified && (
                <div className="p-4 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--theme-text-primary)] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>Invoice Delivery Details</span>
                    </span>
                    <span className="text-[10px] text-[var(--theme-text-muted)]">
                      PDF & WhatsApp Dispatch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your Name"
                      className="px-3 py-2 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:outline-none"
                    />
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-[11px] text-[var(--theme-text-muted)] font-mono">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Mobile (10 digits)"
                        className="w-full pl-9 pr-2 py-2 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs font-mono text-[var(--theme-text-primary)] focus:outline-none"
                      />
                    </div>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Email for PDF"
                      className="px-3 py-2 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD SELECTION */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-[var(--theme-text-muted)]">
                  Select Payment Method:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      paymentMethod === 'upi'
                        ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]'
                        : 'bg-[var(--theme-surface-elevated)] border-[var(--theme-border)] hover:border-[var(--theme-border)]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[var(--theme-pop)]" />
                        <span className="font-semibold text-xs text-[var(--theme-text-primary)]">
                          Instant UPI / QR
                        </span>
                      </div>
                      {paymentMethod === 'upi' && <Check className="w-4 h-4 text-[var(--theme-accent)]" />}
                    </div>
                    <span className="text-[10px] text-[var(--theme-text-muted)]">
                      Google Pay, PhonePe, Paytm & QR
                    </span>
                  </div>

                  {/* Card Option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      paymentMethod === 'card'
                        ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]'
                        : 'bg-[var(--theme-surface-elevated)] border-[var(--theme-border)] hover:border-[var(--theme-border)]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[var(--theme-accent)]" />
                        <span className="font-semibold text-xs text-[var(--theme-text-primary)]">
                          Credit / Debit Card
                        </span>
                      </div>
                      {paymentMethod === 'card' && <Check className="w-4 h-4 text-[var(--theme-accent)]" />}
                    </div>
                    <span className="text-[10px] text-[var(--theme-text-muted)]">
                      Visa, Mastercard, Amex, RuPay
                    </span>
                  </div>
                </div>

                {/* Sub-inputs for chosen payment method */}
                {paymentMethod === 'upi' ? (
                  <div className="p-3 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex items-center justify-around gap-2 text-xs">
                    {(['gpay', 'phonepe', 'paytm', 'qr'] as const).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          upiApp === app
                            ? 'bg-[var(--theme-accent)] text-black shadow-sm'
                            : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                        }`}
                      >
                        {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : app === 'paytm' ? 'Paytm' : 'Scan QR'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] grid grid-cols-3 gap-2 text-xs font-mono">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="col-span-2 px-2.5 py-1.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)]"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-1/2 px-2 py-1.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)]"
                      />
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-1/2 px-2 py-1.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ITEMIZED FINANCIAL BILL SUMMARY WITH 5% GST BREAKDOWN */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[var(--theme-text-muted)]">
                  <span>Menu Items Subtotal:</span>
                  <span>${rawSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981] font-bold">
                    <span>Voucher Discount ({(discountPercent * 100).toFixed(0)}% OFF):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--theme-text-muted)] border-t border-[var(--theme-border)]/50 pt-1.5">
                  <span>Taxable Base Value:</span>
                  <span>${taxableAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[11px] text-[var(--theme-text-muted)]">
                  <span>CGST (2.5%):</span>
                  <span>${cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[11px] text-[var(--theme-text-muted)]">
                  <span>SGST (2.5%):</span>
                  <span>${sgst.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-[var(--theme-border)] flex justify-between items-center text-sm font-bold text-[var(--theme-text-primary)]">
                  <span className="font-serif text-base">Grand Total (Incl. GST):</span>
                  <span className="font-serif text-xl text-[var(--theme-pop)]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs">
                  {formError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[var(--theme-text-muted)] text-center sm:text-left">
              Delivery to <span className="text-[var(--theme-text-primary)] font-semibold">{currentZone.name} · {tableNumber}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] text-xs font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer w-full sm:w-auto"
              >
                Continue Browsing
              </button>

              <button
                disabled={processingPayment}
                onClick={handleCheckoutClick}
                className="px-6 py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--theme-glow)] cursor-pointer w-full sm:w-auto whitespace-nowrap disabled:opacity-50"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ${finalTotal.toFixed(2)} & Dispatch Invoice</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
