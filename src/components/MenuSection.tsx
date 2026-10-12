import React, { useState } from 'react';
import { 
  MENU_ITEMS, 
  MenuItem, 
  Zone 
} from '../data/cafeData';
import { 
  Sparkles, 
  Plus, 
  Clock, 
  HeartHandshake, 
  Tag, 
  Info, 
  Check 
} from 'lucide-react';

interface MenuSectionProps {
  currentZone: Zone;
  onAddToCart: (item: MenuItem) => void;
  onElevateItemWithAria: (item: MenuItem) => void;
  cartItemIds: string[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  currentZone,
  onAddToCart,
  onElevateItemWithAria,
  cartItemIds,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'brews' | 'espresso' | 'pastries' | 'savory' | 'elixirs'>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'brews', label: 'Signature Brews' },
    { id: 'espresso', label: 'Espresso Crafts' },
    { id: 'pastries', label: 'Artisanal Pastries' },
    { id: 'savory', label: 'Savory Provisions' },
    { id: 'elixirs', label: 'Zero-Proof Elixirs' },
  ];

  return (
    <div className="space-y-6">
      {/* Zone-Specific Recommendation Header with Atmospheric Background Image */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-border)] p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/images/zone_bar_counter.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/95 via-[var(--theme-surface)]/90 to-[var(--theme-surface-elevated)]/75 backdrop-blur-[1px]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 text-xs font-semibold text-[var(--theme-text-primary)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
            <span>Curated for {currentZone.name}</span>
          </div>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[var(--theme-text-primary)] mt-2">
            The Artisanal Lumina Collection
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-1 max-w-xl">
            Never just an order — every brew and bite is crafted with single-origin transparency and sensory intentionality.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 p-3 rounded-xl bg-[var(--theme-surface-glass)] backdrop-blur-md border border-[var(--theme-border)] text-xs shadow-lg">
          <HeartHandshake className="w-4 h-4 text-[var(--theme-pop)]" />
          <div>
            <span className="text-[var(--theme-text-muted)]">Aria's Zone Harmony:</span>
            <div className="text-[var(--theme-text-primary)] font-medium">
              {currentZone.id === 'window-lounge' && 'Refreshing stone-fruit brews for vibrant natural light'}
              {currentZone.id === 'corner-booth' && 'Rich velvet flat whites & brain-fuel savory tartines'}
              {currentZone.id === 'bar-counter' && 'Front-row espresso ristrettos & single-origin dialog'}
              {currentZone.id === 'garden-patio' && 'Crisp botanical tonics with garden rosemary sprigs'}
              {currentZone.id === 'quiet-nook' && 'Ceremonial stone-ground matcha for sustained serenity'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[var(--theme-accent)] text-black font-semibold shadow-md'
                : 'bg-[var(--theme-surface)] text-[var(--theme-text-muted)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/40 hover:text-[var(--theme-text-primary)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Item Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isInCart = cartItemIds.includes(item.id);
          const isZoneRecommended = currentZone.recommendedPairingIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative group ${
                isZoneRecommended
                  ? 'bg-[var(--theme-surface-elevated)] border-[var(--theme-accent)] shadow-lg shadow-[var(--theme-glow)] ring-1 ring-[var(--theme-accent)]/30'
                  : 'bg-[var(--theme-surface)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50'
              }`}
            >
              {/* Menu Item Culinary Image Banner */}
              <div className="relative w-full h-44 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-surface)] via-transparent to-black/30" />
                
                {/* Highlight Ribbon */}
                {item.badgeHighlight && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--theme-surface-glass)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] backdrop-blur-md shadow-md">
                      {item.badgeHighlight}
                    </span>
                  </div>
                )}

                {/* Zone Recommendation Badge */}
                {isZoneRecommended && (
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--theme-accent)] text-black text-[10px] font-bold shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Best for {currentZone.name}</span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-[var(--theme-text-primary)] leading-snug">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-serif text-base font-bold text-[var(--theme-pop)]">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[var(--theme-text-muted)]">·</span>
                    <span className="text-[var(--theme-text-muted)] flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-[var(--theme-accent)]" />
                      ~{item.waitTimeMinutes} min wait
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                  {item.tagline}
                </p>

                {/* Tasting Notes */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[var(--theme-surface-elevated)] border border-[var(--theme-border)] text-[10px] font-medium text-[var(--theme-accent)]"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Origin tag */}
                <div className="text-[11px] text-[var(--theme-text-muted)] pt-2 border-t border-[var(--theme-border)] flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[var(--theme-accent)]" />
                  <span className="truncate">{item.origin}</span>
                </div>

                {/* Expanded Sensory Story */}
                {isExpanded && (
                  <div className="p-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs space-y-2 mt-2 animate-fadeIn">
                    <div className="text-[var(--theme-accent)] font-medium flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      <span>The Artisan Story:</span>
                    </div>
                    <p className="text-[var(--theme-text-muted)] leading-relaxed italic">
                      "{item.story}"
                    </p>
                    <div className="pt-1 text-[var(--theme-text-muted)]">
                      <span className="text-[#10B981] font-medium">Dietary: </span>
                      {item.dietaryTags.join(' · ')}
                    </div>
                    <div className="pt-1 text-[var(--theme-pop)]">
                      <span className="text-[var(--theme-accent)] font-medium">Sensory Ritual: </span>
                      {item.elevationTip}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 bg-[var(--theme-surface-elevated)] border-t border-[var(--theme-border)] flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
                >
                  {isExpanded ? 'Less info' : 'View story & notes'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onElevateItemWithAria(item)}
                    title="Ask Aria to elevate and pair this item"
                    className="p-2 rounded-xl bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-glass)] border border-[var(--theme-border)] text-[var(--theme-pop)] text-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAddToCart(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isInCart
                        ? 'bg-[#10B981] text-black hover:bg-[#059669]'
                        : 'bg-[var(--theme-accent)] hover:brightness-110 text-black shadow-md shadow-[var(--theme-glow)]'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added (+1)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
