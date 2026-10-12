import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Ticket, 
  Receipt,
  Share2,
  ExternalLink
} from 'lucide-react';
import { InvoiceData } from '../data/cafeData';

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  onTrackOrder: () => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onTrackOrder,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessageUrl = `https://api.whatsapp.com/send?phone=91${invoice.customer.phone}&text=${encodeURIComponent(
    `☕ *Lumina Café Order Receipt*\nOrder ID: ${invoice.orderId}\nInvoice: ${invoice.invoiceNumber}\nTotal Paid: $${invoice.grandTotal.toFixed(2)}\nSeating: ${invoice.seating.zone} - ${invoice.seating.table}\nThank you for dining with us!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-2xl text-[var(--theme-text-primary)] space-y-6 transition-all max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-5 right-5 p-2 rounded-full bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Invoice Header */}
        <div className="border-b border-[var(--theme-border)] pb-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
              <Receipt className="w-4 h-4" />
              <span>Official Tax Invoice & Receipt</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
              Payment Confirmed
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[var(--theme-text-primary)] print:text-black">
                LUMINA CAFÉ
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)] print:text-gray-600">
                Ground Floor Roastery & Artisan Bar · GSTIN: 29AABCL1234F1Z5
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-xs">
              <div className="font-bold text-[var(--theme-accent)] print:text-black">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[var(--theme-text-muted)] text-[11px] print:text-gray-600">
                {invoice.createdAt}
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Seating Meta */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs print:bg-gray-100 print:text-black">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)]">
              Guest Details
            </span>
            <div className="font-semibold text-[var(--theme-text-primary)] print:text-black">
              {invoice.customer.name}
            </div>
            <div className="text-[11px] text-[var(--theme-text-muted)] font-mono">
              +91 {invoice.customer.phone}
            </div>
            <div className="text-[11px] text-[var(--theme-text-muted)] truncate">
              {invoice.customer.email}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)]">
              Seating & Station
            </span>
            <div className="font-semibold text-[var(--theme-text-primary)] flex items-center gap-1.5 print:text-black">
              <MapPin className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>{invoice.seating.zone}</span>
            </div>
            <div className="text-[11px] text-[var(--theme-pop)] font-bold">
              {invoice.seating.table}
            </div>
            <div className="text-[11px] text-[var(--theme-text-muted)]">
              Payment: {invoice.payment.provider || invoice.payment.method.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Itemized Cart List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)] border-b border-[var(--theme-border)] pb-2 print:text-gray-600">
            <span>Item Description</span>
            <div className="flex items-center gap-6">
              <span>Qty</span>
              <span className="w-16 text-right">Amount</span>
            </div>
          </div>

          <div className="space-y-2 divide-y divide-[var(--theme-border)]/40">
            {invoice.items.map((item) => (
              <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--theme-text-primary)] print:text-black">
                    {item.name}
                  </span>
                  <div className="text-[10px] text-[var(--theme-text-muted)] print:text-gray-600">
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
                <div className="flex items-center gap-6 font-mono">
                  <span className="text-center w-6 text-[var(--theme-text-muted)] print:text-black">
                    x{item.quantity}
                  </span>
                  <span className="w-16 text-right font-semibold text-[var(--theme-text-primary)] print:text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="p-4 rounded-2xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2 text-xs font-mono print:bg-white print:border-gray-300">
          <div className="flex items-center justify-between text-[var(--theme-text-muted)] print:text-gray-700">
            <span>Menu Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>

          {invoice.voucher && (
            <div className="flex items-center justify-between text-[#10B981] font-bold">
              <span className="flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5" />
                <span>Voucher ({invoice.voucher.code} · {invoice.voucher.discountPercentage}% OFF):</span>
              </span>
              <span>-${invoice.voucher.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[var(--theme-text-muted)] print:text-gray-700 border-t border-[var(--theme-border)]/50 pt-1.5">
            <span>Taxable Value:</span>
            <span>${invoice.taxableAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-muted)] print:text-gray-600">
            <span>CGST (2.5%):</span>
            <span>${invoice.cgst.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-muted)] print:text-gray-600">
            <span>SGST (2.5%):</span>
            <span>${invoice.sgst.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[var(--theme-text-primary)] border-t border-[var(--theme-border)] pt-2 print:text-black">
            <span className="font-serif">Grand Total Paid:</span>
            <span className="text-[var(--theme-pop)] print:text-black">${invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Automated Dispatch Notification Box */}
        <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 space-y-2 text-xs print:hidden">
          <div className="flex items-center gap-2 font-bold text-[#10B981]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Automated Receipt Dispatch Triggered</span>
          </div>
          <div className="space-y-1 text-[11px] text-[var(--theme-text-muted)]">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Full itemized PDF invoice dispatched to <strong>{invoice.customer.email}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Digital bill & live order link sent to <strong>+91 {invoice.customer.phone}</strong> via WhatsApp / SMS</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 print:hidden">
          <button
            onClick={handlePrint}
            className="py-3 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/30 border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-primary)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <a
            href={whatsappMessageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onTrackOrder();
            }}
            className="py-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[var(--theme-glow)] cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Track in Better Waits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
