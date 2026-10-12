import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  X, 
  Loader2, 
  MapPin
} from 'lucide-react';
import { Zone, CartItem, Voucher } from '../data/cafeData';

interface Message {
  sender: 'aria' | 'user';
  text: string;
  timestamp: string;
}

interface AriaChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentZone: Zone;
  cart: CartItem[];
  challengeCompleted: boolean;
  activeVoucher: Voucher | null;
  onStartChallenge: () => void;
  onOpenMenu: () => void;
  onOpenWaits: () => void;
}

export const AriaChatDrawer: React.FC<AriaChatDrawerProps> = ({
  isOpen,
  onClose,
  currentZone,
  cart,
  challengeCompleted,
  activeVoucher,
  onStartChallenge,
  onOpenMenu,
  onOpenWaits,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'aria',
      text: `Hello! I'm Aria, your Digital Companion here at Lumina Café. You're currently settled in our ${currentZone.name} — the ambient light and sensory notes are lovely today. How may I elevate your experience right now?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 0.98;
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) => v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen')
      );
      if (naturalVoice) utterance.voice = naturalVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/aria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          zone: currentZone,
          cart,
          challengeState: {
            completed: challengeCompleted,
            voucherCode: activeVoucher?.code || null,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm delighted you're enjoying your time in Lumina Café.";

      const ariaMsg: Message = {
        sender: 'aria',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ariaMsg]);
      speakText(reply);
    } catch (err) {
      const fallbackAria: Message = {
        sender: 'aria',
        text: `Here in our ${currentZone.name}, every brew is an invitation to slow down. Would you care for an elevated beverage pairing suggestion?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAria]);
    } finally {
      setLoading(false);
    }
  };

  const promptSuggestions = [
    `Describe the sensory mood of ${currentZone.name}`,
    'Recommend a drink that matches my mood',
    'What is the wait time right now?',
    'Tell me the story behind Kyoto Slow-Drip',
    'Start my 45-second Café Challenge',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg h-full bg-[var(--theme-surface)] border-l border-[var(--theme-border)] shadow-2xl flex flex-col justify-between text-[var(--theme-text-primary)] animate-slideLeft transition-all">
        {/* Drawer Header with Background Image */}
        <div className="relative overflow-hidden p-4 sm:p-5 border-b border-[var(--theme-border)] flex items-center justify-between">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url('/images/hero_cafe.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/90 to-[var(--theme-surface-elevated)]/80" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--theme-accent)] via-[var(--theme-pop)] to-[var(--theme-c2)] p-[1.5px] shadow-lg shadow-[var(--theme-glow)]">
                <div className="w-full h-full bg-[var(--theme-bg)] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--theme-accent)]" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-[var(--theme-bg)] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-semibold text-[var(--theme-text-primary)]">
                  Aria Companion
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[var(--theme-accent)]/20 text-[var(--theme-text-primary)] border border-[var(--theme-accent)]/30">
                  Lumina AI
                </span>
              </div>
              <div className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[var(--theme-accent)]" />
                <span>Seated at {currentZone.name}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {/* Voice toggle */}
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title={speechEnabled ? 'Disable voice playback' : 'Enable Aria voice playback'}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                speechEnabled
                  ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)] text-[var(--theme-pop)]'
                  : 'bg-[var(--theme-surface-elevated)] border-[var(--theme-border)] text-[var(--theme-text-muted)]'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--theme-surface-elevated)] hover:bg-[var(--theme-border)]/20 border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isAria = msg.sender === 'aria';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isAria ? 'justify-start' : 'justify-end'}`}
              >
                {isAria && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex-shrink-0 flex items-center justify-center text-[var(--theme-accent)]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed space-y-1 ${
                    isAria
                      ? 'bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] shadow'
                      : 'bg-[var(--theme-accent)] text-black font-semibold shadow-md shadow-[var(--theme-glow)]'
                  }`}
                >
                  <p className={isAria ? 'font-serif text-[var(--theme-text-primary)]' : ''}>
                    {msg.text}
                  </p>
                  <div
                    className={`text-[10px] text-right ${
                      isAria ? 'text-[var(--theme-text-muted)]' : 'text-black/60'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] italic flex items-center gap-2">
                <span>Aria is contemplating the sensory notes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Context Action Bar */}
        <div className="px-4 py-2 bg-[var(--theme-surface-elevated)] border-t border-[var(--theme-border)] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-[var(--theme-text-muted)] whitespace-nowrap">Suggested:</span>
          {promptSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-border)]/20 border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:text-[var(--theme-accent)] whitespace-nowrap transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[var(--theme-surface)] border-t border-[var(--theme-border)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Aria to elevate, pair, or tell a story..."
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-primary)] focus:border-[var(--theme-accent)] focus:outline-none placeholder-[var(--theme-text-muted)]"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-3 rounded-xl bg-[var(--theme-accent)] hover:brightness-110 disabled:opacity-40 text-black font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-muted)] mt-2">
            <span>Powered by Google Gemini 3.8 Flash</span>
            <div className="flex gap-2">
              <button
                onClick={onStartChallenge}
                className="hover:text-[var(--theme-accent)] underline transition-colors cursor-pointer"
              >
                Café Challenge
              </button>
              <span>·</span>
              <button
                onClick={onOpenMenu}
                className="hover:text-[var(--theme-accent)] underline transition-colors cursor-pointer"
              >
                Menu
              </button>
              <span>·</span>
              <button
                onClick={onOpenWaits}
                className="hover:text-[var(--theme-accent)] underline transition-colors cursor-pointer"
              >
                Wait Times
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
