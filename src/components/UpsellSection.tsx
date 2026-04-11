'use client';

import { Sparkles } from 'lucide-react';
import type { TicketTier } from '@/lib/types';
import TicketTierCard from './checkout/TicketTierCard';

interface UpsellSectionProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  onQuantityChange: (tierId: string, quantity: number) => void;
}

export default function UpsellSection({
  tiers,
  quantities,
  onQuantityChange,
}: UpsellSectionProps) {
  if (tiers.length === 0) return null;

  return (
    <div className="mt-6 rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-primary-muted)] bg-[var(--color-card)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
        <h3 className="font-display font-bold text-[var(--color-text-primary)]">
          Enhance Your Experience
        </h3>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Optional add-ons to make your experience even better.
      </p>
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
    </div>
  );
}
