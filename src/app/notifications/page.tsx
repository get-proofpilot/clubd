'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Settings,
  BellOff,
  Check,
  Ticket,
  ArrowUp,
  UserPlus,
  Clock,
  Megaphone,
  Sparkles,
  Star,
} from 'lucide-react';
import MobileContainer from '@/components/MobileContainer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationType =
  | 'rsvp_update'
  | 'friend_activity'
  | 'reminder'
  | 'host_announcement'
  | 'recommendation'
  | 'friends_interested';

interface NotificationItem {
  id: string;
  type: NotificationType;
  unread: boolean;
  timestamp: string;
  title: string;
  body: string;
  avatar?: string;
  avatars?: string[];
  actionButtons?: { label: string; variant: 'primary' | 'secondary' }[];
  miniCard?: {
    image: string;
    title: string;
    subtitle: string;
  };
}

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

type FilterKey = 'all' | 'rsvps' | 'friends' | 'hosts';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'rsvps', label: 'RSVPs' },
  { key: 'friends', label: 'Friends' },
  { key: 'hosts', label: 'Hosts' },
];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const notifications: NotificationItem[] = [
  // --- New / Unread ---
  {
    id: 'n1',
    type: 'rsvp_update',
    unread: true,
    timestamp: '2 hours ago',
    title: 'Spot Opened!',
    body: "You've been moved off the waitlist for Sunrise Coastal 5K & Coffee.",
    actionButtons: [
      { label: 'Claim Spot', variant: 'primary' },
      { label: 'Decline', variant: 'secondary' },
    ],
  },
  {
    id: 'n2',
    type: 'friend_activity',
    unread: true,
    timestamp: '4 hours ago',
    title: 'Maya',
    body: 'joined an event you saved: Rooftop Vinyasa Flow.',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
  },
  // --- Earlier / Read ---
  {
    id: 'n3',
    type: 'reminder',
    unread: false,
    timestamp: 'Yesterday',
    title: 'Starting Soon:',
    body: 'Pottery Workshop begins in 2 hours.',
  },
  {
    id: 'n4',
    type: 'host_announcement',
    unread: false,
    timestamp: 'Yesterday',
    title: 'CityRunners',
    body: 'posted an update for Sunrise Coastal 5K: "Weather looks great, see everyone at the pier!"',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
  },
  {
    id: 'n5',
    type: 'recommendation',
    unread: false,
    timestamp: '2 days ago',
    title: 'Recommended for you:',
    body: 'Based on your activity, you might like Beginner Bouldering Meetup. 5 friends are interested.',
    miniCard: {
      image:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/18b5361133-5b13c3163cafcf891da2.png',
      title: 'Beginner Bouldering Meetup',
      subtitle: 'Sat, Nov 4 \u2022 The Climbing Gym',
    },
  },
  {
    id: 'n6',
    type: 'friends_interested',
    unread: false,
    timestamp: '3 days ago',
    title: 'Alex and David',
    body: 'are interested in Local Indie Music Night.',
    avatars: [
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filterNotifications(items: NotificationItem[], filter: FilterKey) {
  if (filter === 'all') return items;
  if (filter === 'rsvps') return items.filter((n) => n.type === 'rsvp_update');
  if (filter === 'friends')
    return items.filter((n) => n.type === 'friend_activity' || n.type === 'friends_interested');
  if (filter === 'hosts')
    return items.filter((n) => n.type === 'host_announcement' || n.type === 'reminder');
  return items;
}

// ---------------------------------------------------------------------------
// Icon area for each notification type
// ---------------------------------------------------------------------------

function NotificationIcon({ item }: { item: NotificationItem }) {
  // Avatar-based types
  if (item.type === 'friend_activity' && item.avatar) {
    return (
      <div className="relative">
        <img
          src={item.avatar}
          alt={item.title}
          className="h-12 w-12 rounded-full border border-gray-200 object-cover"
        />
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500">
          <UserPlus className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
    );
  }

  if (item.type === 'host_announcement' && item.avatar) {
    return (
      <div className="relative">
        <img
          src={item.avatar}
          alt={item.title}
          className="h-12 w-12 rounded-full border border-gray-200 object-cover"
        />
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-black">
          <Megaphone className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
    );
  }

  if (item.type === 'friends_interested' && item.avatars) {
    return (
      <div className="relative">
        <div className="flex -space-x-2">
          {item.avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="relative h-10 w-10 rounded-full border-2 border-white object-cover"
              style={{ zIndex: item.avatars!.length - i }}
            />
          ))}
        </div>
        <div className="absolute -bottom-1 -right-1 z-30 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--color-brand-500)]">
          <Star className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
    );
  }

  // Icon-based types
  if (item.type === 'rsvp_update') {
    return (
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-100)] text-[var(--color-brand-600)]">
          <Ticket className="h-5 w-5" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--color-brand-500)]">
          <ArrowUp className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
    );
  }

  if (item.type === 'reminder') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
        <Clock className="h-5 w-5" />
      </div>
    );
  }

  if (item.type === 'recommendation') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9E3FF] text-[var(--color-brand-600)]">
        <Sparkles className="h-5 w-5" />
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = filterNotifications(notifications, activeFilter);
  const newItems = filtered.filter((n) => n.unread);
  const earlierItems = filtered.filter((n) => !n.unread);

  return (
    <MobileContainer>
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[var(--color-brand-500)]/20 bg-[#E9E3FF] px-4 md:px-0 pt-[max(env(safe-area-inset-top),12px)] pb-3 grain-bg">
        <div className="content-max w-full flex items-center justify-between px-0 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-display text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
              Notifications
            </h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-text-primary)] shadow-sm transition-colors hover:bg-gray-50">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <section className="sticky top-[73px] z-40 border-b border-gray-100 bg-white">
        <div className="content-max px-4 md:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto hide-scroll">
            {FILTERS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-black text-white'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--color-surface-subtle)]/30 pb-4 hide-scroll">
        <div className="content-max">
          {/* New group */}
          {newItems.length > 0 && (
            <section className="mt-4">
              <div className="px-4 md:px-6 lg:px-8 py-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  New
                </h2>
              </div>
              <div className="max-w-2xl md:mx-auto">
                {newItems.map((item) => (
                  <NotificationRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Earlier group */}
          {earlierItems.length > 0 && (
            <section className="mt-4">
              <div className="px-4 md:px-6 lg:px-8 py-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Earlier
                </h2>
              </div>
              <div className="max-w-2xl md:mx-auto">
                {earlierItems.map((item) => (
                  <NotificationRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
                <BellOff className="h-7 w-7 text-[var(--color-text-secondary)]" />
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--color-text-primary)]">
                No notifications yet
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                We&apos;ll let you know when something comes up.
              </p>
            </div>
          )}
        </div>
      </main>
    </MobileContainer>
  );
}

// ---------------------------------------------------------------------------
// Notification Row
// ---------------------------------------------------------------------------

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <div className="relative border-b border-gray-100 bg-white px-4 md:px-6 py-3 pl-8 md:pl-10">
      {/* Unread dot */}
      {item.unread && (
        <span className="absolute left-2 md:left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--color-brand-500)]" />
      )}

      <div className="flex gap-3">
        {/* Icon area */}
        <div className="relative shrink-0">
          <NotificationIcon item={item} />
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug text-[var(--color-text-primary)]">
            <span className="font-bold">{item.title}</span>{' '}
            {item.body}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{item.timestamp}</p>

          {/* Action buttons (RSVP update) */}
          {item.actionButtons && (
            <div className="mt-3 flex gap-2">
              {item.actionButtons.map((btn) =>
                btn.variant === 'primary' ? (
                  <button
                    key={btn.label}
                    className="rounded-lg bg-[var(--color-brand-500)] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-brand-600)]"
                  >
                    {btn.label}
                  </button>
                ) : (
                  <button
                    key={btn.label}
                    className="rounded-lg border border-gray-200 bg-[var(--color-surface-subtle)] px-4 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-gray-100"
                  >
                    {btn.label}
                  </button>
                )
              )}
            </div>
          )}

          {/* Mini event card (recommendation) */}
          {item.miniCard && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <img
                src={item.miniCard.image}
                alt={item.miniCard.title}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-bold text-[var(--color-text-primary)]">
                  {item.miniCard.title}
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">
                  {item.miniCard.subtitle}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
