'use client';

import { Minus, Plus, Star } from 'lucide-react';
import type { TicketTier } from '@/lib/types';

interface TicketTierCardProps {
  tier: TicketTier;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function TicketTierCard({
  tier,
  quantity,
  onQuantityChange,
}: TicketTierCardProps) {
  const isSoldOut = tier.capacity != null && tier.soldCount >= tier.capacity;
  const remaining = tier.capacity != null ? tier.capacity - tier.soldCount : null;

  return (
    <div
      className={`relative rounded-[var(--radius-card)] border-2 p-4 transition-colors ${
        quantity > 0
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]'
          : 'border-[var(--color-border-subtle)] bg-[var(--color-card)]'
      } ${isSoldOut ? 'opacity-50' : ''}`}
    >
      {/* Popular badge */}
      {tier.isPopular && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          <Star className="h-3 w-3 fill-white" />
          Most Popular
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-display font-bold text-[var(--color-text-primary)]">
            {tier.name}
          </h3>
          {tier.description && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {tier.description}
            </p>
          )}

          {/* Perks */}
          {tier.perks.length > 0 && (
            <ul className="mt-2.5 flex flex-col gap-1">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-primary)]">&#10003;</span>
                  {perk}
                </li>
              ))}
            </ul>
          )}

          {remaining != null && remaining <= 10 && remaining > 0 && (
            <p className="mt-2 text-xs font-semibold text-[var(--color-error)]">
              Only {remaining} left
            </p>
          )}
        </div>

        {/* Price + quantity */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            {tier.originalPriceInCents != null && (
              <span className="text-xs text-[var(--color-text-muted)] line-through mr-1.5">
                {formatPrice(tier.originalPriceInCents)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              {tier.priceInCents === 0 ? 'Free' : formatPrice(tier.priceInCents)}
            </span>
          </div>

          {!isSoldOut ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                disabled={quantity === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[var(--color-text-primary)]">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
