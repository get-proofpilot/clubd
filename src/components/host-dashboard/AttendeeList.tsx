'use client';

import { useState } from 'react';
import { Users, Loader2, ChevronDown } from 'lucide-react';
import { trpcReact } from '@/lib/trpc';

interface AttendeeListProps {
  eventId: string;
}

const PAGE_SIZE = 50;

export default function AttendeeList({ eventId }: AttendeeListProps) {
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = trpcReact.host.eventAttendees.useQuery({
    eventId,
    limit: PAGE_SIZE,
    offset,
  });

  const attendees = data?.attendees ?? [];
  const total = data?.total ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
        <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
          {total} {total === 1 ? 'Attendee' : 'Attendees'}
        </h3>
      </div>

      {/* Empty state */}
      {attendees.length === 0 && (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          No RSVPs yet
        </p>
      )}

      {/* Attendee list */}
      {attendees.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {attendees.map((att) => {
            const name = att.userDisplayName || att.userName || att.attendeeName || 'Guest';
            const initial = name.charAt(0).toUpperCase();
            const rsvpDate = att.rsvpCreatedAt
              ? new Date(att.rsvpCreatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={att.rsvpId}
                className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] px-3 py-2.5"
              >
                {/* Avatar */}
                {att.userImage ? (
                  <img
                    src={att.userImage}
                    alt={name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[var(--color-border-subtle)]"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-muted)] ring-1 ring-[var(--color-border-subtle)]">
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      {initial}
                    </span>
                  </div>
                )}

                {/* Name + RSVP date */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {name}
                  </p>
                  {rsvpDate && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      RSVP&apos;d {rsvpDate}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more button */}
      {total > offset + PAGE_SIZE && (
        <button
          onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
        >
          <ChevronDown className="h-4 w-4" />
          Load More ({total - offset - PAGE_SIZE} remaining)
        </button>
      )}
    </div>
  );
}
