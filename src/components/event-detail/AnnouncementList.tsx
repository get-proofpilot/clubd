"use client";

import { useState } from "react";

interface Announcement {
  id: string;
  message: string;
  createdAt: Date;
  authorName: string;
  authorDisplayName: string | null;
  authorImage: string | null;
}

interface AnnouncementListProps {
  announcements: Announcement[];
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AnnouncementList({
  announcements,
}: AnnouncementListProps) {
  const [showAll, setShowAll] = useState(false);

  if (!announcements || announcements.length === 0) return null;

  const visible = showAll ? announcements : announcements.slice(0, 5);

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
        Updates from Host
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {visible.map((a) => {
          const authorLabel = a.authorDisplayName || a.authorName;
          return (
            <div
              key={a.id}
              className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-3"
            >
              <div className="flex items-center gap-2">
                {a.authorImage ? (
                  <img
                    src={a.authorImage}
                    alt={authorLabel}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                      {authorLabel.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {authorLabel}
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  {timeAgo(a.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {a.message}
              </p>
            </div>
          );
        })}
      </div>
      {announcements.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm font-semibold text-[var(--color-primary)]"
        >
          Show more
        </button>
      )}
    </div>
  );
}
