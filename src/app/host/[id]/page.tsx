'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Calendar } from 'lucide-react';
import { hosts, events } from '@/lib/mock-data';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';

export default function HostProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isFollowing, setIsFollowing] = useState(false);

  const host = hosts.find((h) => h.id === id);

  if (!host) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--color-text-secondary)]">Host not found.</p>
      </div>
    );
  }

  const hostEvents = events.filter((e) => e.host.id === id);

  const typeLabel: Record<string, string> = {
    studio: 'Studio',
    individual: 'Individual',
    organization: 'Organization',
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Sticky glass header */}
      <header className="glass sticky top-0 z-40 border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3 sm:px-8">
          <Link href="/" className="tap-target btn-press flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
          </Link>
          <h1 className="font-display truncate text-base font-bold text-[var(--color-text-primary)]">
            {host.name}
          </h1>
        </div>
      </header>

      {/* Host info */}
      <section className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
        <div className="animate-fade-up flex flex-col items-center">
          {/* Avatar */}
          <img
            src={host.avatar}
            alt={host.name}
            className="h-20 w-20 rounded-full bg-[var(--color-surface-subtle)] object-cover ring-4 ring-[var(--color-primary)]/10"
          />

          {/* Name + verified + type */}
          <div className="mt-3 flex items-center gap-1.5">
            <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              {host.name}
            </h2>
            {host.verified && (
              <BadgeCheck className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
            )}
          </div>
          <span className="mt-1 rounded-full bg-[var(--color-surface-subtle)] px-3 py-0.5 text-xs font-semibold text-[var(--color-text-muted)]">
            {typeLabel[host.type]}
          </span>

          {/* Stats row */}
          <div className="mt-5 flex items-center gap-0 divide-x divide-[var(--color-border-subtle)]">
            <div className="flex flex-col items-center px-6">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">
                {host.followerCount.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Followers</span>
            </div>
            <div className="flex flex-col items-center px-6">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">
                {host.eventCount}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Events</span>
            </div>
          </div>

          {/* Follow button */}
          <button
            onClick={() => setIsFollowing((prev) => !prev)}
            className={`btn-press mt-5 rounded-full px-8 py-2.5 text-sm font-semibold transition-all ${
              isFollowing
                ? 'border border-[var(--color-border-subtle)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
                : 'bg-[var(--color-primary)] text-white'
            }`}
            style={{ boxShadow: isFollowing ? 'none' : 'var(--shadow-button)' }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </section>

      {/* Events section */}
      <main className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
          Events by {host.name}
        </h3>

        {hostEvents.length === 0 ? (
          <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--color-card)] p-8 text-center card-shadow">
            <Calendar className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              No events yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            {hostEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
