'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Users,
  ArrowLeft,
  Loader2,
  Send,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { formatDate, formatTime, getCategoryLabel } from '@/lib/utils';

type EventStatus = 'draft' | 'published' | 'cancelled';

function StatusBadge({ status }: { status: EventStatus }) {
  const config: Record<EventStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
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
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${c.bg} ${c.text}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export default function HostDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const utils = trpcReact.useUtils();

  const { data: eventsData, isLoading: eventsLoading } = trpcReact.host.myEvents.useQuery(
    undefined,
    { enabled: !!session?.user },
  );

  const publishEvent = trpcReact.host.publishEvent.useMutation({
    onSuccess: () => {
      utils.host.myEvents.invalidate();
    },
  });

  const cancelEvent = trpcReact.host.cancelEvent.useMutation({
    onSuccess: () => {
      utils.host.myEvents.invalidate();
    },
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
  const hasEvents = upcoming.length > 0 || past.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="tap-target flex items-center justify-center rounded-full">
              <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
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

      <main className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
        {/* Error banners */}
        {publishEvent.error && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Publish failed: {publishEvent.error.message}
          </div>
        )}
        {cancelEvent.error && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Cancel failed: {cancelEvent.error.message}
          </div>
        )}

        {/* Empty state */}
        {!hasEvents && (
          <div className="mt-12 flex flex-col items-center text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
              <Calendar className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-[var(--color-text-primary)]">
              No events yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
              Create your first event and start building your community.
            </p>
            <Link
              href="/host/create"
              className="mt-6 flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition-transform active:scale-95"
              style={{ boxShadow: 'var(--shadow-button)' }}
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Create Event
            </Link>
          </div>
        )}

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
              Upcoming Events
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPublish={(id) => publishEvent.mutate({ eventId: id })}
                  onCancel={(id) => cancelEvent.mutate({ eventId: id })}
                  isPublishing={publishEvent.isPending}
                  isCancelling={cancelEvent.isPending}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section className={upcoming.length > 0 ? 'mt-10' : ''}>
            <h2 className="font-display text-base font-bold text-[var(--color-text-secondary)]">
              Past Events
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPublish={(id) => publishEvent.mutate({ eventId: id })}
                  onCancel={(id) => cancelEvent.mutate({ eventId: id })}
                  isPublishing={publishEvent.isPending}
                  isCancelling={cancelEvent.isPending}
                  isPast
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Card Component
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: string;
    startsAt: Date;
    endsAt: Date | null;
    status: string | null;
    rsvpCount: number | null;
    imageUrl: string | null;
    locationName: string | null;
    address: string | null;
  };
  onPublish: (id: string) => void;
  onCancel: (id: string) => void;
  isPublishing: boolean;
  isCancelling: boolean;
  isPast?: boolean;
}

function EventCard({ event, onPublish, onCancel, isPublishing, isCancelling, isPast }: EventCardProps) {
  const status = (event.status ?? 'draft') as EventStatus;

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] card-shadow ${isPast ? 'opacity-70' : ''}`}
    >
      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] truncate">
                {event.title}
              </h3>
              <StatusBadge status={status} />
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(event.startsAt)} {formatTime(event.startsAt)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {event.rsvpCount ?? 0} RSVPs
              </span>
            </div>

            {event.locationName && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
                {event.locationName}
              </p>
            )}

            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {getCategoryLabel(event.category)}
            </span>
          </div>

          {/* Thumbnail */}
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover"
            />
          )}
        </div>
      </div>

      {/* Action bar */}
      {!isPast && (
        <div className="flex border-t border-[var(--color-border-subtle)]">
          {status === 'draft' && (
            <button
              onClick={() => onPublish(event.id)}
              disabled={isPublishing}
              className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-subtle)] disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Publish
            </button>
          )}

          {status !== 'cancelled' && (
            <>
              <Link
                href={`/host/create?edit=${event.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 border-l border-[var(--color-border-subtle)] py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Edit
              </Link>

              <button
                onClick={() => onCancel(event.id)}
                disabled={isCancelling}
                className="flex flex-1 items-center justify-center gap-1.5 border-l border-[var(--color-border-subtle)] py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isCancelling ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
