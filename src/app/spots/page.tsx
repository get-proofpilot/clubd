'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Star, X, MapPin, Calendar } from 'lucide-react';
import { events, reviews } from '@/lib/mock-data';
import BottomNav from '@/components/BottomNav';

// ---------------------------------------------------------------------------
// Category mapping — derive from location name keywords
// ---------------------------------------------------------------------------

type VenueCategory = 'All' | 'Parks' | 'Studios' | 'Venues' | 'Restaurants' | 'Beaches';

const categories: VenueCategory[] = ['All', 'Parks', 'Studios', 'Venues', 'Restaurants', 'Beaches'];

function getVenueCategory(locationName: string): VenueCategory[] {
  const n = locationName.toLowerCase();
  const matched: VenueCategory[] = [];

  if (/park|preserve|canyon/.test(n)) matched.push('Parks');
  if (/studio|den|lab/.test(n) && !/anti-mall/.test(n)) matched.push('Studios');
  if (/market|mall|lab/.test(n)) matched.push('Venues');
  if (/rooftop|street/.test(n) && !/t-street/.test(n)) matched.push('Restaurants');
  if (/beach|t-street/.test(n)) matched.push('Beaches');

  return matched.length > 0 ? matched : ['Venues'];
}

// ---------------------------------------------------------------------------
// Derive unique venues from events
// ---------------------------------------------------------------------------

interface Venue {
  name: string;
  address: string;
  image: string;
  eventIds: string[];
  firstEventId: string;
  averageRating: number;
  reviewCount: number;
  eventCount: number;
  categories: VenueCategory[];
}

function buildVenues(): Venue[] {
  const venueMap = new Map<
    string,
    { name: string; address: string; image: string; eventIds: string[] }
  >();

  for (const event of events) {
    const key = event.location.name;
    const existing = venueMap.get(key);
    if (existing) {
      existing.eventIds.push(event.id);
    } else {
      venueMap.set(key, {
        name: event.location.name,
        address: event.location.address,
        image: event.coverImage,
        eventIds: [event.id],
      });
    }
  }

  const venues: Venue[] = [];

  for (const [, v] of venueMap) {
    const venueReviews = reviews.filter((r) => v.eventIds.includes(r.eventId));
    const avgRating =
      venueReviews.length > 0
        ? venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length
        : 0;

    venues.push({
      name: v.name,
      address: v.address,
      image: v.image,
      eventIds: v.eventIds,
      firstEventId: v.eventIds[0],
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: venueReviews.length,
      eventCount: v.eventIds.length,
      categories: getVenueCategory(v.name),
    });
  }

  // Sort by review count descending, then by event count
  venues.sort((a, b) => b.reviewCount - a.reviewCount || b.eventCount - a.eventCount);

  return venues;
}

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.round(rating)
              ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
              : 'text-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SpotsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory>('All');

  const allVenues = useMemo(() => buildVenues(), []);

  const filteredVenues = useMemo(() => {
    let result = allVenues;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q),
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((v) => v.categories.includes(selectedCategory));
    }

    return result;
  }, [allVenues, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-5xl px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="btn-press flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border-subtle)]"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--color-text-primary)]" />
            </Link>
            <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              Top Spots
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Search Bar */}
        <div className="pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search venues, addresses..."
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

        {/* Category Pills */}
        <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 py-2 sm:-mx-8 sm:px-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn-press shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Venue List */}
        <div className="mt-3 flex flex-col gap-3">
          {filteredVenues.map((venue, idx) => (
            <Link
              key={venue.name}
              href={`/event/${venue.firstEventId}`}
              className="animate-fade-up btn-press block rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] card-shadow transition-lift"
              style={{ '--stagger': idx } as React.CSSProperties}
            >
              <div className="flex gap-3 p-3">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="h-20 w-20 shrink-0 rounded-[var(--radius-md)] object-cover"
                />
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h3 className="font-semibold text-[var(--color-text-primary)] leading-snug truncate">
                    {venue.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] truncate">
                    {venue.address}
                  </p>
                  {venue.reviewCount > 0 ? (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Stars rating={venue.averageRating} />
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        {venue.averageRating}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        ({venue.reviewCount})
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">No reviews yet</p>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {venue.eventCount} event{venue.eventCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredVenues.length === 0 && (
            <div className="py-16 text-center">
              <MapPin className="mx-auto h-10 w-10 text-[var(--color-border)]" />
              <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)]">
                No spots found
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Try a different search or category
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
