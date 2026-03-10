'use client';

import Link from 'next/link';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import { formatDate, formatTime, getCategoryLabel } from '@/lib/utils';

type EventStatus = 'draft' | 'published' | 'cancelled';

interface EventItem {
  id: string;
  title: string;
  startsAt: Date;
  rsvpCount: number | null;
  status: string | null;
  imageUrl: string | null;
  capacity: number | null;
  pricingType: string;
}

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

interface EventListProps {
  events: EventItem[];
  type: 'upcoming' | 'past';
}

export default function EventList({ events, type }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center text-center animate-fade-up">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
          <Calendar
            className="h-7 w-7 text-[var(--color-text-muted)]"
            strokeWidth={1.8}
          />
        </div>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {type === 'upcoming' ? 'No upcoming events' : 'No past events'}
        </p>
        {type === 'upcoming' && (
          <Link
            href="/host/create"
            className="mt-4 flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-xs font-bold text-white transition-transform active:scale-95"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Create Event
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => {
        const status = (event.status ?? 'draft') as EventStatus;
        const isPast = type === 'past';

        return (
          <Link
            key={event.id}
            href={`/event/${event.id}/manage`}
            className={`flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-4 card-shadow transition-colors hover:bg-[var(--color-surface-subtle)] ${
              isPast ? 'opacity-70' : ''
            }`}
          >
            {/* Thumbnail */}
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]">
                <Calendar
                  className="h-6 w-6 text-[var(--color-text-muted)]"
                  strokeWidth={1.5}
                />
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-sm font-bold text-[var(--color-text-primary)]">
                  {event.title}
                </h3>
                <StatusBadge status={status} />
              </div>

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {formatDate(event.startsAt)} {formatTime(event.startsAt)}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Users className="h-3.5 w-3.5" />
                <span>
                  {event.rsvpCount ?? 0}
                  {event.capacity ? ` / ${event.capacity}` : ''} RSVPs
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
