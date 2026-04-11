'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Users, Calendar, BookUser } from 'lucide-react';
import MobileContainer from '@/components/MobileContainer';
import { events, users, currentUser } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabKey = 'rsvps' | 'reviews' | 'popular';

interface FriendActivityItem {
  id: string;
  friends: { name: string; avatar: string }[];
  action: string; // e.g. "are going", "is interested", "reviewed"
  timeAgo: string;
  event: {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
  };
}

interface PopularCard {
  id: string;
  title: string;
  category: string;
  dateBadge: string;
  image: string;
  friendAvatars: string[];
  friendLabel: string;
  eventId: string;
}

// ---------------------------------------------------------------------------
// Mock friend activity feed (matches the design's shape)
// ---------------------------------------------------------------------------

const friendActivityFeed: FriendActivityItem[] = [
  {
    id: 'fa-1',
    friends: [
      { name: 'Maya', avatar: users[1].avatar },
      { name: 'Carlos', avatar: users[2].avatar },
      { name: 'Sophie', avatar: users[5].avatar },
      { name: 'Jordan', avatar: users[0].avatar },
    ],
    action: 'are going',
    timeAgo: '2h ago',
    event: {
      id: 'e3',
      title: 'Saturday Morning Run Club',
      category: 'Fitness',
      date: 'Sat, 7:00 AM',
      image: events[2].coverImage,
    },
  },
  {
    id: 'fa-2',
    friends: [{ name: 'David', avatar: users[3].avatar }],
    action: 'is interested',
    timeAgo: '5h ago',
    event: {
      id: 'e4',
      title: 'Sunset Yoga at the Bluffs',
      category: 'Wellness',
      date: 'Sat, 5:30 PM',
      image: events[3].coverImage,
    },
  },
  {
    id: 'fa-3',
    friends: [
      { name: 'Tyler', avatar: users[4].avatar },
      { name: 'Elena', avatar: users[7].avatar },
    ],
    action: 'are going',
    timeAgo: '8h ago',
    event: {
      id: 'e9',
      title: 'Beach Cleanup Volunteer Day',
      category: 'Community',
      date: 'Sat, 8:00 AM',
      image: events[8].coverImage,
    },
  },
  {
    id: 'fa-4',
    friends: [{ name: 'Sophie', avatar: users[5].avatar }],
    action: 'reviewed',
    timeAgo: '12h ago',
    event: {
      id: 'e1',
      title: 'Popup Ramen Night',
      category: 'Food & Drink',
      date: 'Tonight, 7:00 PM',
      image: events[0].coverImage,
    },
  },
];

const popularCards: PopularCard[] = [
  {
    id: 'pop-1',
    title: 'Seal Release Watch Party',
    category: 'Community',
    dateBadge: 'Sat 10AM',
    image: events[12].coverImage,
    friendAvatars: [users[0].avatar, users[1].avatar, users[5].avatar],
    friendLabel: '4 friends going',
    eventId: 'e13',
  },
  {
    id: 'pop-2',
    title: 'Ceramics Night Out',
    category: 'Creative',
    dateBadge: 'Fri 7PM',
    image: events[9].coverImage,
    friendAvatars: [users[1].avatar, users[5].avatar],
    friendLabel: '2 friends interested',
    eventId: 'e10',
  },
  {
    id: 'pop-3',
    title: 'Open Mic Night',
    category: 'Creative',
    dateBadge: 'Thu 7PM',
    image: events[7].coverImage,
    friendAvatars: [users[3].avatar, users[6].avatar],
    friendLabel: '3 friends going',
    eventId: 'e8',
  },
];

// ---------------------------------------------------------------------------
// Helper: render friend text like "Maya + 3 friends are going"
// ---------------------------------------------------------------------------

function friendLabel(item: FriendActivityItem): React.ReactNode {
  const first = item.friends[0].name;
  const count = item.friends.length - 1;
  if (count === 0) {
    return (
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
        <span className="font-bold">{first}</span> {item.action}
      </p>
    );
  }
  return (
    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
      <span className="font-bold">{first}</span> + {count} friend{count > 1 ? 's' : ''} {item.action}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Activity Feed Card
// ---------------------------------------------------------------------------

function ActivityFeedCard({ item }: { item: FriendActivityItem }) {
  return (
    <article className="bg-white rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-gray-100">
      {/* Top row: avatars + text + timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {item.friends.slice(0, 2).map((friend, i) => (
              <img
                key={friend.name + i}
                src={friend.avatar}
                alt={friend.name}
                className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-surface-subtle)] object-cover"
                style={{ zIndex: 20 - i * 10, position: 'relative' }}
              />
            ))}
            {item.friends.length > 2 && (
              <div
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold relative"
                style={{
                  backgroundColor: 'var(--color-brand-100, #ede9fe)',
                  color: 'var(--color-brand-700, #6d28d9)',
                  zIndex: 0,
                }}
              >
                +{item.friends.length - 2}
              </div>
            )}
          </div>
          {friendLabel(item)}
        </div>
        <span className="text-xs shrink-0 ml-2" style={{ color: 'var(--color-text-secondary)' }}>
          {item.timeAgo}
        </span>
      </div>

      {/* Event preview row */}
      <Link href={`/event/${item.event.id}`} className="flex gap-3 group">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            src={item.event.image}
            alt={item.event.title}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span
            className="text-[10px] font-bold uppercase tracking-wider mb-1 block"
            style={{ color: 'var(--color-brand-600, #7c3aed)' }}
          >
            {item.event.category}
          </span>
          <h3
            className="font-display font-bold text-base leading-tight mb-1 truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {item.event.title}
          </h3>
          <p
            className="text-xs mb-2 flex items-center gap-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Calendar size={12} />
            {item.event.date}
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 py-1.5 rounded-xl text-white text-xs font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-brand-500)' }}
              onClick={(e) => e.preventDefault()}
            >
              Join
            </button>
            <button
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-text-primary)',
              }}
              onClick={(e) => e.preventDefault()}
            >
              Interested
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Popular Carousel Card
// ---------------------------------------------------------------------------

function PopularCarouselCard({ card }: { card: PopularCard }) {
  return (
    <Link
      href={`/event/${card.eventId}`}
      className="w-56 md:w-auto shrink-0 md:shrink bg-white rounded-2xl p-3 shadow-[var(--shadow-soft)] border border-gray-100 block"
    >
      <div className="h-32 rounded-2xl overflow-hidden relative mb-3">
        <img className="w-full h-full object-cover" src={card.image} alt={card.title} />
        <div
          className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {card.dateBadge}
        </div>
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-wider mb-1 block"
        style={{ color: 'var(--color-brand-600, #7c3aed)' }}
      >
        {card.category}
      </span>
      <h3
        className="font-display font-bold text-base leading-tight mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {card.title}
      </h3>
      <div className="flex items-center justify-between mb-3">
        <div className="flex -space-x-1.5">
          {card.friendAvatars.map((av, i) => (
            <img
              key={i}
              src={av}
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white bg-[var(--color-surface-subtle)] object-cover"
            />
          ))}
        </div>
        <span
          className="text-[10px] font-semibold"
          style={{ color: 'var(--color-brand-700, #6d28d9)' }}
        >
          {card.friendLabel}
        </span>
      </div>
      <button
        className="w-full py-2 rounded-xl text-sm font-semibold transition-colors"
        style={{
          backgroundColor: 'var(--color-surface-subtle)',
          color: 'var(--color-text-primary)',
        }}
        onClick={(e) => e.preventDefault()}
      >
        View Details
      </button>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('rsvps');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'rsvps', label: 'RSVPs' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'popular', label: 'Popular' },
  ];

  return (
    <MobileContainer>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white pt-[max(env(safe-area-inset-top),12px)] pb-2 border-b border-gray-100 shadow-sm">
        {/* Mobile title row */}
        <div className="md:hidden flex items-center justify-between mb-4 px-4">
          <h1
            className="font-display font-bold text-xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Friend Activity
          </h1>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors relative"
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
              color: 'var(--color-text-primary)',
            }}
          >
            <UserPlus size={18} />
            <span
              className="absolute top-0 right-0 w-3 h-3 border-2 border-white rounded-full"
              style={{ backgroundColor: 'var(--color-accent, #CD3F25)' }}
            />
          </button>
        </div>

        {/* Tabs */}
        <div className="content-max px-4 md:px-6 lg:px-8">
          <div className="flex gap-4 border-b border-gray-100 overflow-x-auto hide-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2.5 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'font-semibold border-b-2'
                    : 'font-medium hover:opacity-80'
                }`}
                style={
                  activeTab === tab.key
                    ? {
                        color: 'var(--color-brand-600, #7c3aed)',
                        borderBottomColor: 'var(--color-brand-600, #7c3aed)',
                      }
                    : { color: 'var(--color-text-secondary)' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto pb-4 hide-scroll"
        style={{ backgroundColor: 'rgba(248, 250, 252, 0.3)' }}
      >
        <div className="content-max px-4 md:px-6 lg:px-8 space-y-6 md:space-y-10">
          {/* Social Feed */}
          <section className="pt-4 md:pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendActivityFeed.map((item) => (
                <ActivityFeedCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Popular with your circle - horizontal carousel on mobile, grid on desktop */}
          <section className="py-2">
            <h2
              className="font-display font-bold text-lg md:text-xl mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Popular with your circle
            </h2>
            {/* Mobile: horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto hide-scroll pr-4 pb-4 md:hidden">
              {popularCards.map((card) => (
                <PopularCarouselCard key={card.id} card={card} />
              ))}
            </div>
            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-4">
              {popularCards.map((card) => (
                <PopularCarouselCard key={card.id} card={card} />
              ))}
            </div>
          </section>

          {/* Find more friends CTA */}
          <section className="py-6 pb-8">
            <div
              className="rounded-2xl p-6 text-center border relative overflow-hidden max-w-xl md:mx-auto"
              style={{
                background: 'linear-gradient(to bottom right, var(--color-brand-50, #f5f3ff), var(--color-brand-100, #ede9fe))',
                borderColor: 'var(--color-brand-200, #ddd6fe)',
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
                  style={{ color: 'var(--color-brand-500)' }}
                >
                  <Users size={28} />
                </div>
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Find more friends
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Connect your contacts to see what events your friends are attending.
                </p>
                <button
                  className="w-full max-w-xs mx-auto py-3 rounded-2xl text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-brand-500)',
                    boxShadow: '0 8px 20px -4px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <BookUser size={16} />
                  Sync Contacts
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MobileContainer>
  );
}
