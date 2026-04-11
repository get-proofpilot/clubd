'use client';

import type { TicketTier } from '@/lib/types';
import TicketTierCard from './TicketTierCard';

interface TicketSelectionProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  onQuantityChange: (tierId: string, quantity: number) => void;
  onContinue: () => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function TicketSelection({
  tiers,
  quantities,
  onQuantityChange,
  onContinue,
}: TicketSelectionProps) {
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const subtotal = tiers.reduce(
    (sum, tier) => sum + tier.priceInCents * (quantities[tier.id] ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
        Select Tickets
      </h2>

      <div className="flex flex-col gap-3">
        {tiers.map((tier) => (
          <TicketTierCard
            key={tier.id}
            tier={tier}
            quantity={quantities[tier.id] ?? 0}
            onQuantityChange={(q) => onQuantityChange(tier.id, q)}
          />
        ))}
      </div>

      {/* Running total + continue */}
      <div className="sticky bottom-0 mt-2 rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] card-shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {totalItems} ticket{totalItems !== 1 ? 's' : ''}
          </span>
          <span className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(subtotal)}
          </span>
        </div>
        <button
          onClick={onContinue}
          disabled={totalItems === 0}
          className="btn-press w-full rounded-[var(--radius-button)] bg-[var(--color-primary)] py-3 font-bold text-white tracking-wide transition-colors disabled:opacity-40"
          style={{ boxShadow: 'var(--shadow-button)' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
