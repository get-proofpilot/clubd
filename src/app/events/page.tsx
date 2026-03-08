'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Inbox } from 'lucide-react';
import { events, rsvps, currentUser } from '@/lib/mock-data';
import { formatDate, getCategoryLabel, getCategoryColor } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';

type TabKey = 'going' | 'interested' | 'past';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'going', label: 'Going' },
  { key: 'interested', label: 'Interested' },
  { key: 'past', label: 'Past' },
];

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('going');

  const myRsvps = rsvps.filter((r) => r.userId === currentUser.id);
  const goingIds = myRsvps.filter((r) => r.status === 'going').map((r) => r.eventId);
  const interestedIds = myRsvps.filter((r) => r.status === 'interested').map((r) => r.eventId);
  const attendedIds = myRsvps.filter((r) => r.status === 'attended').map((r) => r.eventId);

  const goingEvents = events.filter((e) => goingIds.includes(e.id));
  const interestedEvents = events.filter((e) => interestedIds.includes(e.id));
  const pastEvents = events.filter((e) => attendedIds.includes(e.id));

  const activeEvents = activeTab === 'going' ? goingEvents : activeTab === 'interested' ? interestedEvents : pastEvents;

  const emptyMessages: Record<TabKey, { title: string; body: string }> = {
    going: { title: 'No events yet', body: "RSVP to events on the home feed and they'll show up here." },
    interested: { title: "Nothing saved", body: "Tap the heart on events you're curious about." },
    past: { title: "No history", body: "Events you've attended will appear here." },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-5xl px-5 pb-1 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">My Events</h1>
        </div>
        <div className="mx-auto max-w-5xl px-5 pt-3 pb-2 sm:px-8">
          <div className="inline-flex gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[var(--radius-sm)] px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[var(--color-card)] text-[var(--color-text-primary)] card-shadow'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-3 sm:px-8">
        {activeEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-card)] py-16 card-shadow max-w-lg mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
              {activeTab === 'past' ? <Calendar className="h-6 w-6 text-[var(--color-text-muted)]" strokeWidth={1.8} /> : <Inbox className="h-6 w-6 text-[var(--color-text-muted)]" strokeWidth={1.8} />}
            </div>
            <p className="mt-4 font-display text-base font-bold text-[var(--color-text-primary)]">{emptyMessages[activeTab].title}</p>
            <p className="mt-1 max-w-[240px] text-center text-sm text-[var(--color-text-secondary)]">{emptyMessages[activeTab].body}</p>
            <Link href="/" className="btn-press mt-5 rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-bold text-white" style={{ boxShadow: 'var(--shadow-button)' }}>
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {activeEvents.map((event, i) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="animate-fade-up flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-card)] p-3 card-shadow transition-lift"
                style={{ '--stagger': i } as React.CSSProperties}
              >
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className={`h-20 w-20 shrink-0 rounded-[var(--radius-md)] object-cover ${activeTab === 'past' ? 'opacity-70 grayscale-[30%]' : ''}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{event.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{formatDate(event.date)} &middot; {event.time}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{event.location.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${getCategoryColor(event.category)}`} />
                    <span className="text-[11px] text-[var(--color-text-muted)]">{getCategoryLabel(event.category)}</span>
                    {activeTab !== 'past' && event.friendsGoing.length > 0 && (
                      <>
                        <span className="text-[11px] text-[var(--color-text-muted)]">&middot;</span>
                        <span className="text-[11px] font-semibold text-[var(--color-primary)]">{event.friendsGoing.length} friend{event.friendsGoing.length > 1 ? 's' : ''} going</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
