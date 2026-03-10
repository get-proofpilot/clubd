'use client';

import { use, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit3,
  Share2,
  Repeat,
  Send,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { formatDate, formatTime, getCategoryLabel } from '@/lib/utils';
import AttendeeList from '@/components/host-dashboard/AttendeeList';
import AnnouncementComposer from '@/components/host-dashboard/AnnouncementComposer';
import EventStats from '@/components/host-dashboard/EventStats';

type EventStatus = 'draft' | 'published' | 'cancelled';

function StatusBadge({ status }: { status: EventStatus }) {
  const config: Record<
    EventStatus,
    { label: string; bg: string; text: string; icon: React.ReactNode }
  > = {
    draft: {
      label: 'Draft',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: <Clock className="h-3 w-3" />,
    },
    published: {
      label: 'Published',
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const c = config[status] || config.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${c.bg} ${c.text}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

export default function EventManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  // State
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRepeatForm, setShowRepeatForm] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<
    'weekly' | 'biweekly' | 'monthly' | 'custom'
  >('weekly');
  const [repeatCount, setRepeatCount] = useState(4);
  const [customInterval, setCustomInterval] = useState(7);
  const [repeatSuccess, setRepeatSuccess] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Data
  const utils = trpcReact.useUtils();
  const { data, isLoading, error } = trpcReact.host.eventDetail.useQuery(
    { eventId: id },
    { enabled: !!session?.user },
  );

  // Mutations
  const publishEvent = trpcReact.host.publishEvent.useMutation({
    onSuccess: () => {
      utils.host.eventDetail.invalidate({ eventId: id });
      setToast('Event published!');
    },
  });

  const cancelEvent = trpcReact.host.cancelEvent.useMutation({
    onSuccess: () => {
      utils.host.eventDetail.invalidate({ eventId: id });
      setShowCancelDialog(false);
      setCancelReason('');
      setToast('Event cancelled');
    },
  });

  const repeatEvent = trpcReact.host.repeatEvent.useMutation({
    onSuccess: (result) => {
      setRepeatSuccess(result.eventIds);
      setShowRepeatForm(false);
    },
  });

  const trackView = trpcReact.event.trackView.useMutation();

  // Share handler
  const handleShare = useCallback(async () => {
    if (!data?.event) return;
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/event/${id}`
        : `https://clubd.app/event/${id}`;

    const shareData = {
      title: data.event.title,
      text: `Check out ${data.event.title}`,
      url: shareUrl,
    };

    // Track share click
    trackView.mutate({ eventId: id, viewType: 'share_click' });

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setToast('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share -- silently ignore
    }
  }, [data?.event, id, trackView]);

  // Toast auto-dismiss
  if (toast) {
    setTimeout(() => setToast(null), 2500);
  }

  // Auth guard
  if (!sessionLoading && !session?.user) {
    router.push('/login');
    return null;
  }

  // Loading state
  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
            <Link
              href="/host/dashboard"
              className="tap-target flex items-center justify-center rounded-full"
            >
              <ArrowLeft
                className="h-5 w-5 text-[var(--color-text-primary)]"
                strokeWidth={1.8}
              />
            </Link>
            <div className="h-5 w-40 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
        </header>
        <div className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]"
              />
            ))}
          </div>
          <div className="mt-6 h-12 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]" />
          <div className="mt-6 h-40 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]" />
        </div>
      </div>
    );
  }

  // Not found or not authorized
  if (error || !data?.event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center animate-fade-up">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Not authorized
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            You can only manage events you created.
          </p>
          <Link
            href="/host/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Verify ownership
  if (data.event.hostId !== session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center animate-fade-up">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Not authorized
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            You can only manage events you created.
          </p>
          <Link
            href="/host/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const event = data.event;
  const status = (event.status ?? 'draft') as EventStatus;
  const isCancelled = status === 'cancelled';
  const isDraft = status === 'draft';
  const announcements = data.announcements ?? [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-10">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <Link
            href="/host/dashboard"
            className="tap-target flex items-center justify-center rounded-full"
          >
            <ArrowLeft
              className="h-5 w-5 text-[var(--color-text-primary)]"
              strokeWidth={1.8}
            />
          </Link>
          <h1 className="min-w-0 flex-1 truncate font-display text-lg font-bold text-[var(--color-text-primary)]">
            {event.title}
          </h1>
          <StatusBadge status={status} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        {/* ── Error Banners ──────────────────────────────────────────── */}
        {publishEvent.error && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Publish failed: {publishEvent.error.message}
          </div>
        )}
        {cancelEvent.error && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Cancel failed: {cancelEvent.error.message}
          </div>
        )}
        {repeatEvent.error && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Repeat failed: {repeatEvent.error.message}
          </div>
        )}

        {/* ── Quick Stats ────────────────────────────────────────────── */}
        <section className="animate-fade-up">
          <EventStats eventId={id} />
        </section>

        {/* ── Actions Bar ────────────────────────────────────────────── */}
        {!isCancelled && (
          <section className="mt-6 flex flex-wrap gap-2 animate-fade-up">
            {/* Edit */}
            <Link
              href={`/host/create?edit=${event.id}`}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Link>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>

            {/* Repeat */}
            <button
              onClick={() => setShowRepeatForm(!showRepeatForm)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <Repeat className="h-3.5 w-3.5" />
              Repeat
            </button>

            {/* Publish (draft only) */}
            {isDraft && (
              <button
                onClick={() => publishEvent.mutate({ eventId: event.id })}
                disabled={publishEvent.isPending}
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
                style={{ boxShadow: 'var(--shadow-button)' }}
              >
                {publishEvent.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Publish
              </button>
            )}

            {/* Cancel (published events only) */}
            {!isDraft && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel Event
              </button>
            )}
          </section>
        )}

        {/* ── Repeat Form (expandable) ───────────────────────────────── */}
        {showRepeatForm && (
          <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-4 card-shadow animate-fade-up">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Create Recurring Events
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Generate future occurrences based on this event
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Frequency
                </label>
                <select
                  value={repeatFrequency}
                  onChange={(e) =>
                    setRepeatFrequency(
                      e.target.value as 'weekly' | 'biweekly' | 'monthly' | 'custom',
                    )
                  }
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Occurrences
                </label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={repeatCount}
                  onChange={(e) =>
                    setRepeatCount(Math.max(1, Math.min(52, Number(e.target.value))))
                  }
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
                />
              </div>
            </div>

            {repeatFrequency === 'custom' && (
              <div className="mt-3">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Interval (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={customInterval}
                  onChange={(e) =>
                    setCustomInterval(
                      Math.max(1, Math.min(365, Number(e.target.value))),
                    )
                  }
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
                />
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  repeatEvent.mutate({
                    eventId: event.id,
                    frequency: repeatFrequency,
                    count: repeatCount,
                    ...(repeatFrequency === 'custom'
                      ? { customIntervalDays: customInterval }
                      : {}),
                  })
                }
                disabled={repeatEvent.isPending}
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
              >
                {repeatEvent.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Repeat className="h-3.5 w-3.5" />
                )}
                Create {repeatCount} Events
              </button>
              <button
                onClick={() => setShowRepeatForm(false)}
                className="rounded-full border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Repeat success */}
        {repeatSuccess && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-4 py-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Created {repeatSuccess.length} new events!
              </span>
            </div>
            <Link
              href="/host/dashboard"
              className="mt-2 inline-block text-xs font-semibold text-green-600 underline underline-offset-2"
            >
              View all events
            </Link>
          </div>
        )}

        {/* ── Cancel Confirmation Dialog ──────────────────────────────── */}
        {showCancelDialog && (
          <div className="mt-4 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 animate-fade-up">
            <h3 className="text-sm font-bold text-red-800">
              Cancel this event?
            </h3>
            <p className="mt-1 text-xs text-red-600">
              This action cannot be undone. The event will be marked as
              cancelled and attendees will be notified.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Optional: reason for cancellation..."
              rows={2}
              className="mt-3 w-full resize-none rounded-[var(--radius-md)] border border-red-200 bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-red-300 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  cancelEvent.mutate({
                    eventId: event.id,
                    ...(cancelReason.trim()
                      ? { reason: cancelReason.trim() }
                      : {}),
                  })
                }
                disabled={cancelEvent.isPending}
                className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
              >
                {cancelEvent.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Yes, Cancel Event
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelReason('');
                }}
                className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
              >
                Keep Event
              </button>
            </div>
          </div>
        )}

        {/* ── Attendees ──────────────────────────────────────────────── */}
        <section className="mt-8 animate-fade-up">
          <AttendeeList eventId={id} />
        </section>

        {/* ── Announcements ──────────────────────────────────────────── */}
        <section className="mt-8 animate-fade-up">
          <AnnouncementComposer
            eventId={id}
            existingAnnouncements={announcements}
          />
        </section>

        {/* ── Event Details Summary ──────────────────────────────────── */}
        <section className="mt-8 animate-fade-up">
          <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
            Event Details
          </h3>
          <div className="mt-3 rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-4 card-shadow">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <Calendar
                  className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                  strokeWidth={1.8}
                />
                <span>
                  {formatDate(event.startsAt)} {formatTime(event.startsAt)}
                  {event.endsAt && ` - ${formatTime(event.endsAt)}`}
                </span>
              </div>

              {(event.locationName || event.address) && (
                <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                    strokeWidth={1.8}
                  />
                  <span>{event.locationName || event.address}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <Tag
                  className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                  strokeWidth={1.8}
                />
                <span>{getCategoryLabel(event.category)}</span>
              </div>

              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <Users
                  className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                  strokeWidth={1.8}
                />
                <span>
                  {event.capacity ? `${event.capacity} capacity` : 'Unlimited'}{' '}
                  &middot;{' '}
                  {event.pricingType === 'free'
                    ? 'Free'
                    : event.pricingType === 'paid'
                      ? 'Paid'
                      : 'Free w/ Upsells'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-5 animate-fade-up">
          <div className="rounded-[var(--radius-md)] glass-white border border-[var(--color-border-subtle)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] card-shadow">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
