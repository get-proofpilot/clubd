'use client';

import type { TicketTier } from '@/lib/types';
import PromoCodeInput from './PromoCodeInput';

interface OrderSummaryProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  eventId: string;
  serviceFeePercent: number;
  discountInCents?: number;
  promoCode?: string;
  onPromoApplied: (code: string, discountInCents: number) => void;
  onPromoRemoved: () => void;
}

function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderSummary({
  tiers,
  quantities,
  eventId,
  serviceFeePercent,
  discountInCents = 0,
  promoCode,
  onPromoApplied,
  onPromoRemoved,
}: OrderSummaryProps) {
  const lineItems = tiers
    .filter((t) => (quantities[t.id] ?? 0) > 0)
    .map((t) => ({
      name: t.name,
      quantity: quantities[t.id],
      total: t.priceInCents * quantities[t.id],
    }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const serviceFee = Math.round((subtotal - discountInCents) * (serviceFeePercent / 100));
  const total = subtotal - discountInCents + serviceFee;

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] card-shadow p-4">
      <h3 className="font-display font-bold text-[var(--color-text-primary)] mb-3">
        Order Summary
      </h3>

      <div className="flex flex-col gap-2 text-sm">
        {lineItems.map((item) => (
          <div key={item.name} className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">
              {item.quantity}x {item.name}
            </span>
            <span className="font-medium text-[var(--color-text-primary)]">
              {formatPrice(item.total)}
            </span>
          </div>
        ))}

        {discountInCents > 0 && (
          <div className="flex justify-between text-[var(--color-success)]">
            <span>Promo ({promoCode})</span>
            <span className="font-medium">-{formatPrice(discountInCents)}</span>
          </div>
        )}

        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Service fee</span>
            <span className="text-[var(--color-text-secondary)]">
              {formatPrice(serviceFee)}
            </span>
          </div>
        )}

        <div className="mt-2 border-t border-[var(--color-border-subtle)] pt-2 flex justify-between">
          <span className="font-bold text-[var(--color-text-primary)]">Total</span>
          <span className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <PromoCodeInput
          eventId={eventId}
          appliedCode={promoCode}
          onApplied={onPromoApplied}
          onRemoved={onPromoRemoved}
        />
      </div>
    </div>
  );
}
