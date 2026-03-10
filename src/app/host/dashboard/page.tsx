'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import EventList from '@/components/host-dashboard/EventList';
import StripeConnectCard from '@/components/host-dashboard/StripeConnectCard';

function HostDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Stripe Connect callback feedback
  const stripeStatus = searchParams.get('stripe');
  const [stripeBanner, setStripeBanner] = useState<string | null>(null);

  useEffect(() => {
    if (stripeStatus === 'complete') {
      setStripeBanner('Stripe account connected successfully!');
    } else if (stripeStatus === 'retry') {
      setStripeBanner('Stripe setup incomplete. Please try again.');
    } else if (stripeStatus === 'error') {
      setStripeBanner('There was an issue verifying your Stripe account.');
    }
  }, [stripeStatus]);

  const { data: eventsData, isLoading: eventsLoading } =
    trpcReact.host.myEvents.useQuery(undefined, {
      enabled: !!session?.user,
    });

  // Auth guard
  if (!sessionLoading && !session?.user) {
    router.push('/login');
    return null;
  }

  if (sessionLoading || eventsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  const upcoming = eventsData?.upcoming ?? [];
  const past = eventsData?.past ?? [];

  // Determine Stripe account status from session user metadata
  const user = session?.user as
    | {
        stripeAccountEnabled?: boolean;
        stripeAccountId?: string;
      }
    | undefined;
  const stripeAccountEnabled = user?.stripeAccountEnabled ?? false;
  const stripeAccountId = user?.stripeAccountId ?? null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="tap-target flex items-center justify-center rounded-full"
            >
              <ArrowLeft
                className="h-5 w-5 text-[var(--color-text-primary)]"
                strokeWidth={1.8}
              />
            </Link>
            <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              My Events
            </h1>
          </div>
          <Link
            href="/host/create"
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition-transform active:scale-95"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Event
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        {/* Stripe banner */}
        {stripeBanner && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
              stripeStatus === 'complete'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {stripeStatus === 'complete' ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {stripeBanner}
          </div>
        )}

        {/* Tab Toggle: Upcoming / Past */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-1.5 text-xs opacity-80">
                ({upcoming.length})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTab === 'past'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            Past
            {past.length > 0 && (
              <span className="ml-1.5 text-xs opacity-80">
                ({past.length})
              </span>
            )}
          </button>
        </div>

        {/* Event List */}
        <div className="mt-5">
          {activeTab === 'upcoming' ? (
            <EventList events={upcoming} type="upcoming" />
          ) : (
            <EventList events={past} type="past" />
          )}
        </div>

        {/* Stripe Connect Card */}
        <div className="mt-8">
          <StripeConnectCard
            stripeAccountEnabled={stripeAccountEnabled}
            stripeAccountId={stripeAccountId}
          />
        </div>
      </main>
    </div>
  );
}

export default function HostDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      }
    >
      <HostDashboardContent />
    </Suspense>
  );
}
