'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, MapPin, Search, X } from 'lucide-react';
import { events } from '@/lib/mock-data';
import { EventCategory } from '@/lib/types';
import { getEventsByCategory, getEventsByTimeSection } from '@/lib/utils';
import EventCard from '@/components/EventCard';
import CategoryFilter from '@/components/CategoryFilter';
import BottomNav from '@/components/BottomNav';
import TimeSection from '@/components/TimeSection';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import FriendsRow from '@/components/FriendsRow';
import SuggestedEvents from '@/components/SuggestedEvents';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply search filter first, then category filter
  const searched = searchQuery.trim()
    ? events.filter((event) => {
        const q = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.name.toLowerCase().includes(q) ||
          event.host.name.toLowerCase().includes(q)
        );
      })
    : events;

  const filtered = selectedCategory !== 'all'
    ? getEventsByCategory(searched, selectedCategory)
    : searched;

  const tonight = getEventsByTimeSection(filtered, 'tonight');
  const weekend = getEventsByTimeSection(filtered, 'this-weekend');
  const thisWeek = getEventsByTimeSection(filtered, 'this-week');
  const thisMonth = getEventsByTimeSection(filtered, 'this-month');

  const hasNoResults =
    tonight.length === 0 &&
    weekend.length === 0 &&
    thisWeek.length === 0 &&
    thisMonth.length === 0;

  let cardIndex = 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-[max(env(safe-area-inset-top),12px)] pb-2 sm:px-8">
          <div>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight text-[var(--color-secondary)]">
              Clubd
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <MapPin className="h-3 w-3 text-[var(--color-primary)]" strokeWidth={2.2} />
              <span className="font-medium">Orange County, CA</span>
            </div>
          </div>
          <Link
            href="/notifications"
            className="tap-target relative flex items-center justify-center rounded-full bg-[var(--color-card)] p-2.5 border border-[var(--color-border-subtle)]"
            style={{ boxShadow: 'var(--shadow-xs)' }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
              3
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-5xl px-5 pt-2 pb-2 sm:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, hosts, places..."
              className="h-11 w-full rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-[var(--color-text-muted)]" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mx-auto max-w-5xl px-5 pb-3 sm:px-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={(cat: EventCategory | 'all') => setSelectedCategory(cat)}
          />
        </div>
      </header>

      {/* ── Event Feed ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-5 pt-5 sm:px-8">
        <FeaturedCarousel />
        <FriendsRow />

        {hasNoResults && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)]">
              <span className="text-2xl text-[var(--color-text-muted)]">?</span>
            </div>
            <p className="font-display text-base font-bold text-[var(--color-text-primary)]">
              No events found
            </p>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              Try a different category or check back later.
            </p>
          </div>
        )}

        {tonight.length > 0 && (
          <section className="mb-8">
            <TimeSection title="Tonight" eventCount={tonight.length} showSeeAll={tonight.length > 3} />
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tonight.map((event) => (
                <EventCard key={event.id} event={event} index={cardIndex++} />
              ))}
            </div>
          </section>
        )}

        {weekend.length > 0 && (
          <section className="mb-8">
            <TimeSection title="This Weekend" eventCount={weekend.length} showSeeAll={weekend.length > 3} />
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {weekend.map((event) => (
                <EventCard key={event.id} event={event} index={cardIndex++} />
              ))}
            </div>
          </section>
        )}

        {thisWeek.length > 0 && (
          <section className="mb-8">
            <TimeSection title="This Week" eventCount={thisWeek.length} showSeeAll={thisWeek.length > 3} />
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {thisWeek.map((event) => (
                <EventCard key={event.id} event={event} index={cardIndex++} />
              ))}
            </div>
          </section>
        )}

        {thisMonth.length > 0 && (
          <section className="mb-8">
            <TimeSection title="Coming Up" eventCount={thisMonth.length} showSeeAll={thisMonth.length > 3} />
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {thisMonth.map((event) => (
                <EventCard key={event.id} event={event} index={cardIndex++} />
              ))}
            </div>
          </section>
        )}

        <SuggestedEvents title="Suggested for You" events={events.slice(6)} />
      </main>

      <BottomNav />
    </div>
  );
}
