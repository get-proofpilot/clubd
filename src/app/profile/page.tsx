'use client';

import Link from 'next/link';
import { Calendar, Star, Settings, ChevronRight } from 'lucide-react';
import { currentUser, events, reviews, rsvps } from '@/lib/mock-data';
import { EventCategory } from '@/lib/types';
import { formatDate, getCategoryLabel, getCategoryColor } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';

const INTEREST_CATEGORIES = [
  EventCategory.Fitness,
  EventCategory.Wellness,
  EventCategory.FoodDrink,
  EventCategory.Outdoor,
  EventCategory.Social,
];

export default function ProfilePage() {
  const goingEventIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'going').map((r) => r.eventId);
  const interestedEventIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'interested').map((r) => r.eventId);
  const attendedEventIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'attended').map((r) => r.eventId);

  const upcomingEvents = events.filter((e) => goingEventIds.includes(e.id) || interestedEventIds.includes(e.id));
  const pastEvents = events.filter((e) => attendedEventIds.includes(e.id));
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Header */}
      <header className="bg-[var(--color-card)] pb-6 pt-[max(env(safe-area-inset-top),16px)] border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">Profile</h1>
            <button className="tap-target flex items-center justify-center" onClick={() => alert('Settings coming soon!')}>
              <Settings className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-24 w-24 rounded-full bg-[var(--color-surface-subtle)] object-cover ring-4 ring-[var(--color-primary)]/10"
            />
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">{currentUser.name}</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Member since Jan 2026</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-0 divide-x divide-[var(--color-border)] sm:justify-start">
            <div className="flex flex-col items-center px-6 sm:pl-0">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">{currentUser.eventsAttended}</span>
              <span className="text-xs text-[var(--color-text-muted)]">Events</span>
            </div>
            <div className="flex flex-col items-center px-6">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">{myReviews.length}</span>
              <span className="text-xs text-[var(--color-text-muted)]">Reviews</span>
            </div>
            <div className="flex flex-col items-center px-6">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">24</span>
              <span className="text-xs text-[var(--color-text-muted)]">Following</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 sm:justify-start justify-center">
            {INTEREST_CATEGORIES.map((cat) => (
              <span key={cat} className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getCategoryColor(cat)}`}>
                {getCategoryLabel(cat)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">Upcoming Events</h3>
              <Link href="/events" className="flex items-center gap-0.5 text-xs font-semibold text-[var(--color-primary)]">
                See all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-6 text-center card-shadow">
                <Calendar className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">No upcoming events. Explore the feed!</p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/event/${event.id}`} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-3 card-shadow transition-lift">
                    <img src={event.coverImage} alt={event.title} className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{event.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{formatDate(event.date)} &middot; {event.time}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${getCategoryColor(event.category)}`} />
                        <span className="text-[11px] text-[var(--color-text-muted)]">{getCategoryLabel(event.category)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">My Reviews</h3>
            {myReviews.length === 0 ? (
              <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-6 text-center card-shadow">
                <Star className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">No reviews yet. Attend an event to leave one!</p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {myReviews.map((review) => {
                  const reviewEvent = events.find((e) => e.id === review.eventId);
                  return (
                    <div key={review.id} className="rounded-[var(--radius-card)] bg-[var(--color-card)] p-4 card-shadow">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{reviewEvent?.title ?? 'Event'}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'text-[var(--color-border)]'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{review.text}</p>
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">{formatDate(review.createdAt)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Past Events */}
        <section className="mt-8">
          <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">Past Events</h3>
          {pastEvents.length === 0 ? (
            <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-6 text-center card-shadow max-w-lg">
              <p className="text-sm text-[var(--color-text-secondary)]">No past events yet.</p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {pastEvents.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-3 card-shadow transition-lift">
                  <img src={event.coverImage} alt={event.title} className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover opacity-75" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{event.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{formatDate(event.date)} &middot; {event.time}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--color-surface-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">Attended</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
