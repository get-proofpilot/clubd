'use client';

import { use, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Loader2 } from 'lucide-react';
import { events as mockEvents } from '@/lib/mock-data';
import { trpc } from '@/lib/trpc';
import { formatDate, formatTime } from '@/lib/utils';
import Confirmation from '@/components/checkout/Confirmation';
import UpsellSection from '@/components/UpsellSection';

export default function RegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const event = mockEvents.find((e) => e.id === id);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [ticketData, setTicketData] = useState<{ ticketId: string; qrCodeHash: string } | null>(null);

  // Upsell quantities for free_with_upsell events
  const [upsellQuantities, setUpsellQuantities] = useState<Record<string, number>>({});

  // Try to prefill from session
  useEffect(() => {
    // Check for pending intent from auth gate
    const stored = sessionStorage.getItem('clubd_pending_intent');
    if (stored) {
      sessionStorage.removeItem('clubd_pending_intent');
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (email !== confirmEmail) {
        setError('Email addresses do not match');
        return;
      }
      setSubmitting(true);
      setError(null);

      try {
        const result = await trpc.rsvp.create.mutate({
          eventId: id,
          attendeeName: `${firstName} ${lastName}`.trim(),
          attendeeEmail: email,
        });

        setTicketData({
          ticketId: result.ticket.id,
          qrCodeHash: result.ticket.qrCodeHash,
        });
        setConfirmed(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [id, firstName, lastName, email, confirmEmail],
  );

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">Event not found</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)]">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (confirmed && ticketData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pb-16">
        <div className="mx-auto max-w-md px-5 pt-8 sm:px-8">
          <Confirmation
            eventTitle={event.title}
            eventDate={event.date}
            eventLocation={`${event.location.name}, ${event.location.address}`}
            eventDescription={event.description}
            attendeeName={`${firstName} ${lastName}`.trim()}
            ticketId={ticketData.ticketId}
            qrCodeHash={ticketData.qrCodeHash}
          />
          <div className="mt-6 text-center">
            <Link
              href={`/event/${id}`}
              className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
            >
              Back to event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-white border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
          <button onClick={() => router.back()} className="text-[var(--color-text-primary)]">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            Register
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 pt-5 sm:px-8">
        {/* Event summary */}
        <div className="rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] card-shadow overflow-hidden mb-6">
          <div className="h-32 overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <h2 className="font-display font-bold text-[var(--color-text-primary)]">{event.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>{formatDate(event.date)} &middot; {formatTime(event.time)}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>{event.location.name}</span>
            </div>
          </div>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            Your Details
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Confirm Email
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              className="w-full rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          {/* Upsell section for free_with_upsell events */}
          {event.pricingType === 'free_with_upsell' && event.ticketTiers && (
            <UpsellSection
              tiers={event.ticketTiers}
              quantities={upsellQuantities}
              onQuantityChange={(tierId, qty) =>
                setUpsellQuantities((prev) => ({ ...prev, [tierId]: qty }))
              }
            />
          )}

          {/* Terms */}
          <label className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              I agree to the event terms and conditions
            </span>
          </label>

          {error && (
            <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !agreedToTerms}
            className="btn-press mt-2 w-full rounded-[var(--radius-button)] bg-[var(--color-primary)] py-3.5 font-bold text-white tracking-wide transition-colors disabled:opacity-40"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </span>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
