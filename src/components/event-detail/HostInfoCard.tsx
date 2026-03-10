"use client";

import Link from "next/link";

interface HostInfoCardProps {
  hostId: string;
  hostName: string;
  hostDisplayName?: string | null;
  hostImage?: string | null;
  hostBio?: string | null;
  eventCount: number;
}

export default function HostInfoCard({
  hostId,
  hostName,
  hostDisplayName,
  hostImage,
  hostBio,
  eventCount,
}: HostInfoCardProps) {
  const displayLabel = hostDisplayName || hostName;

  return (
    <Link
      href={`/host/${hostId}`}
      className="animate-fade-up block rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-4 card-shadow transition-colors"
    >
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
        Hosted by
      </h2>
      <div className="flex items-center gap-3">
        {hostImage ? (
          <img
            src={hostImage}
            alt={displayLabel}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--color-border-subtle)]"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] ring-2 ring-[var(--color-border-subtle)]">
            <span className="text-lg font-bold text-[var(--color-text-muted)]">
              {displayLabel.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--color-text-primary)] truncate">
            {displayLabel}
          </p>
          {hostBio && (
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] line-clamp-2">
              {hostBio}
            </p>
          )}
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {eventCount} {eventCount === 1 ? "event" : "events"}
          </p>
        </div>
      </div>
    </Link>
  );
}
