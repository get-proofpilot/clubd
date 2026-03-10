'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { trpcReact } from '@/lib/trpc';

interface StripeConnectCardProps {
  stripeAccountEnabled: boolean;
  stripeAccountId?: string | null;
}

export default function StripeConnectCard({
  stripeAccountEnabled,
  stripeAccountId,
}: StripeConnectCardProps) {
  const [redirecting, setRedirecting] = useState(false);

  const setupStripeConnect = trpcReact.host.setupStripeConnect.useMutation({
    onSuccess: (data) => {
      setRedirecting(true);
      window.location.href = data.url;
    },
  });

  if (stripeAccountEnabled) {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-800">
              Payouts Active
            </h3>
            <p className="text-xs text-green-600">
              Your Stripe account is connected and ready to receive payouts
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = setupStripeConnect.isPending || redirecting;

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-5 card-shadow">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-muted)]">
          <CreditCard className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            Set Up Payouts
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Connect your bank account to receive payouts for paid events
          </p>
        </div>
      </div>

      {setupStripeConnect.error && (
        <div className="mt-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {setupStripeConnect.error.message}
        </div>
      )}

      <button
        onClick={() => setupStripeConnect.mutate()}
        disabled={isLoading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
        style={{ boxShadow: 'var(--shadow-button)' }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {redirecting ? 'Redirecting...' : 'Setting up...'}
          </>
        ) : (
          'Connect with Stripe'
        )}
      </button>
    </div>
  );
}
