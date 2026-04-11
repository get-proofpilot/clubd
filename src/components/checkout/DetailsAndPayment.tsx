'use client';

import { useState, useCallback } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import type { TicketTier } from '@/lib/types';
import OrderSummary from './OrderSummary';

interface DetailsAndPaymentProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  eventId: string;
  serviceFeePercent: number;
  orderId: string;
  attendeeName: string;
  attendeeEmail: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPaymentComplete: () => void;
  promoCode?: string;
  discountInCents?: number;
  onPromoApplied: (code: string, discountInCents: number) => void;
  onPromoRemoved: () => void;
}

export default function DetailsAndPayment({
  tiers,
  quantities,
  eventId,
  serviceFeePercent,
  orderId,
  attendeeName,
  attendeeEmail,
  onNameChange,
  onEmailChange,
  onPaymentComplete,
  promoCode,
  discountInCents,
  onPromoApplied,
  onPromoRemoved,
}: DetailsAndPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setProcessing(true);
      setError(null);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? 'Payment failed');
        setProcessing(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/event/${eventId}/checkout?step=confirmation&orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message ?? 'Payment failed');
        setProcessing(false);
        return;
      }

      onPaymentComplete();
      setProcessing(false);
    },
    [stripe, elements, eventId, orderId, onPaymentComplete],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Attendee details */}
      <div>
        <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-4">
          Your Details
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => onNameChange(e.target.value)}
              required
              className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={attendeeEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Order summary */}
      <OrderSummary
        tiers={tiers}
        quantities={quantities}
        eventId={eventId}
        serviceFeePercent={serviceFeePercent}
        discountInCents={discountInCents}
        promoCode={promoCode}
        onPromoApplied={onPromoApplied}
        onPromoRemoved={onPromoRemoved}
      />

      {/* Stripe Payment Element */}
      <div>
        <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-4">
          Payment
        </h2>
        <PaymentElement />
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-press w-full rounded-[var(--radius-button)] bg-[var(--color-primary)] py-3.5 font-bold text-white tracking-wide transition-colors disabled:opacity-40"
        style={{ boxShadow: 'var(--shadow-button)' }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          'Complete Purchase'
        )}
      </button>
    </form>
  );
}
