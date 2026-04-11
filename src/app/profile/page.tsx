'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  Settings,
  MapPin,
  BadgeCheck,
  Bookmark,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { currentUser, events, reviews, rsvps } from '@/lib/mock-data';
import { EventCategory } from '@/lib/types';
import type { Event } from '@/lib/types';
import MobileContainer from '@/components/MobileContainer';

const INTEREST_LABELS: Record<string, string> = {
  [EventCategory.Fitness]: 'Run Clubs',
  [EventCategory.Wellness]: 'Yoga',
  [EventCategory.FoodDrink]: 'Coffee Meets',
  [EventCategory.Creative]: 'Art Exhibitions',
  [EventCategory.Outdoor]: 'Hiking',
  [EventCategory.Social]: 'Social Events',
};

const INTERESTS = [
  EventCategory.Fitness,
  EventCategory.Wellness,
  EventCategory.FoodDrink,
  EventCategory.Creative,
];

type ProfileTab = 'upcoming' | 'past' | 'saved' | 'reviews';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('upcoming');

  const goingIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'going').map((r) => r.eventId);
  const interestedIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'interested').map((r) => r.eventId);
  const attendedIds = rsvps.filter((r) => r.userId === currentUser.id && r.status === 'attended').map((r) => r.eventId);

  const upcomingEvents = events.filter((e) => goingIds.includes(e.id) || interestedIds.includes(e.id));
  const pastEvents = events.filter((e) => attendedIds.includes(e.id));
  const savedEvents = events.slice(0, 3); // Mock saved
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past Events' },
    { key: 'saved', label: 'Saved' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <MobileContainer>
      {/* Header */}
      <header className="w-full z-50 flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100">
        {/* Mobile title */}
        <h1 className="md:hidden font-display font-bold text-xl text-[var(--color-text-primary)]">Profile</h1>
        {/* Desktop spacer (top nav handles the title) */}
        <div className="hidden md:block" />
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors">
            <Share2 size={18} strokeWidth={1.8} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors">
            <Settings size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4 hide-scroll bg-white">
        {/* Profile Info */}
        <section className="content-max px-4 md:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-[72px] h-[72px] md:w-24 md:h-24 rounded-full object-cover border-4 border-[var(--color-surface-purple)]"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-brand-500)] rounded-full border-2 border-white flex items-center justify-center">
                <BadgeCheck size={12} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">{currentUser.name}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-[var(--color-brand-500)]" />
                Silver Lake, LA
              </p>
            </div>
          </div>

          {/* Stats + Actions row: stack on mobile, side by side on desktop */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 mt-5">
            {/* Stats */}
            <div className="flex gap-5">
              <div className="text-center">
                <p className="font-display font-bold text-xl text-[var(--color-text-primary)]">{currentUser.eventsAttended}</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">Events this month</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="font-display font-bold text-xl text-[var(--color-text-primary)]">148</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">Friends</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-4 md:mt-0 md:w-auto">
              <button className="flex-1 md:flex-none md:px-8 py-2.5 bg-[var(--color-secondary)] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                Edit Profile
              </button>
              <button className="flex-1 md:flex-none md:px-8 py-2.5 bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                Find Friends
              </button>
            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="content-max px-4 md:px-6 lg:px-8 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-xs font-semibold rounded-full border border-[var(--color-brand-200)]"
              >
                {INTEREST_LABELS[cat] ?? cat}
              </span>
            ))}
            <button className="w-8 h-8 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-gray-100 border border-gray-200">
              <Plus size={14} />
            </button>
          </div>
        </section>

        {/* Tab Bar */}
        <section className="sticky top-[73px] bg-white z-40 border-b border-gray-100">
          <div className="content-max flex overflow-x-auto hide-scroll px-4 md:px-6 lg:px-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-3 text-sm font-semibold shrink-0 transition-colors ${
                  activeTab === tab.key
                    ? 'text-[var(--color-text-primary)] border-b-2 border-[var(--color-brand-500)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        <section className="bg-[var(--color-surface-subtle)]/30 min-h-[400px]">
          <div className="content-max px-4 md:px-6 lg:px-8 py-4">
            {activeTab === 'upcoming' && (
              <EventCardList events={upcomingEvents} emptyText="No upcoming events" statusMap={Object.fromEntries([
                ...goingIds.map((id) => [id, 'Going'] as const),
                ...interestedIds.map((id) => [id, 'Interested'] as const),
              ])} />
            )}
            {activeTab === 'past' && (
              <EventCardList events={pastEvents} emptyText="No past events yet" statusMap={Object.fromEntries(attendedIds.map((id) => [id, 'Attended'] as const))} />
            )}
            {activeTab === 'saved' && (
              <EventCardList events={savedEvents} emptyText="No saved events" statusMap={{}} />
            )}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myReviews.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)] text-center py-12 col-span-full">No reviews yet</p>
                ) : (
                  myReviews.map((review) => {
                    const evt = events.find((e) => e.id === review.eventId);
                    return (
                      <div key={review.id} className="bg-white rounded-2xl p-3.5 shadow-[var(--shadow-soft)] border border-gray-100">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{evt?.title ?? 'Event'}</p>
                        <div className="flex text-orange-400 text-xs mt-1 gap-0.5">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <span key={i}>&#9733;</span>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)] italic">&ldquo;{review.text}&rdquo;</p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </MobileContainer>
  );
}

// ---------------------------------------------------------------------------
// Profile Event Card List
// ---------------------------------------------------------------------------
function EventCardList({
  events: eventList,
  emptyText,
  statusMap,
}: {
  events: Event[];
  emptyText: string;
  statusMap: Record<string, string>;
}) {
  if (eventList.length === 0) {
    return <p className="text-sm text-[var(--color-text-secondary)] text-center py-12">{emptyText}</p>;
  }

  const statusColors: Record<string, string> = {
    Going: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
    Interested: 'bg-orange-100 text-orange-700',
    Attended: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {eventList.map((event) => {
        const status = statusMap[event.id];
        const dateStr = new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        return (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="bg-white rounded-2xl p-3.5 shadow-[var(--shadow-soft)] border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {status && (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${statusColors[status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {status}
                    </span>
                  )}
                  <span className="text-xs text-[var(--color-text-secondary)] font-medium">{dateStr}, {event.time}</span>
                </div>
                <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-500)]" onClick={(e) => e.preventDefault()}>
                  <Bookmark size={16} />
                </button>
              </div>

              <h4 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-1">{event.title}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex items-center gap-1">
                <MapPin size={12} /> {event.location.name.split(',')[0]}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {event.friendsGoing.slice(0, 3).map((friend) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={friend.id}
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  {event.friendsGoing.length > 0 && (
                    <span className="text-xs text-[var(--color-text-secondary)] ml-2 font-medium">
                      +{event.friendsGoing.length} friends going
                    </span>
                  )}
                </div>
                <button
                  className="w-8 h-8 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)]"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
