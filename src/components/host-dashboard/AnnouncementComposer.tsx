'use client';

import { useState } from 'react';
import { Megaphone, Loader2, CheckCircle } from 'lucide-react';
import { trpcReact } from '@/lib/trpc';

interface Announcement {
  id: string;
  message: string;
  createdAt: Date;
}

interface AnnouncementComposerProps {
  eventId: string;
  existingAnnouncements: Announcement[];
}

const MAX_CHARS = 2000;

export default function AnnouncementComposer({
  eventId,
  existingAnnouncements,
}: AnnouncementComposerProps) {
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const utils = trpcReact.useUtils();

  const createAnnouncement = trpcReact.host.createAnnouncement.useMutation({
    onSuccess: () => {
      setMessage('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      // Refresh the event detail query to show new announcement
      utils.host.eventDetail.invalidate({ eventId });
    },
  });

  const handleSubmit = () => {
    if (!message.trim() || message.length > MAX_CHARS) return;
    createAnnouncement.mutate({ eventId, message: message.trim() });
  };

  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = message.trim().length > 0 && !isOverLimit && !createAnnouncement.isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Megaphone
          className="h-4 w-4 text-[var(--color-primary)]"
          strokeWidth={1.8}
        />
        <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
          Announcements
        </h3>
      </div>

      {/* Composer */}
      <div className="mt-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write an announcement for attendees..."
          rows={3}
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />

        <div className="mt-1.5 flex items-center justify-between">
          <span
            className={`text-xs ${
              isOverLimit ? 'text-red-500 font-semibold' : 'text-[var(--color-text-muted)]'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {createAnnouncement.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Megaphone className="h-3.5 w-3.5" />
            )}
            Post Announcement
          </button>
        </div>
      </div>

      {/* Success feedback */}
      {showSuccess && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
          <CheckCircle className="h-3.5 w-3.5" />
          Announcement posted!
        </div>
      )}

      {/* Error feedback */}
      {createAnnouncement.error && (
        <div className="mt-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {createAnnouncement.error.message}
        </div>
      )}

      {/* Existing announcements */}
      {existingAnnouncements.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {existingAnnouncements.map((ann) => {
            const date = new Date(ann.createdAt);
            const timeAgo = formatRelativeTime(date);

            return (
              <div
                key={ann.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] px-3.5 py-3"
              >
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {ann.message}
                </p>
                <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
                  {timeAgo}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Format a Date into a relative time string (e.g., "2 hours ago", "3 days ago").
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHrs > 0) return `${diffHrs}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}
