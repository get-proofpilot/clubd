'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  Star,
  UserPlus,
  Trophy,
  Users,
  CheckCheck,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface NotificationItem {
  id: string;
  type: 'rsvp' | 'reminder' | 'review' | 'follow' | 'milestone' | 'friend_going';
  text: string;
  timeAgo: string;
  read: boolean;
  eventId?: string;
  eventImage?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'rsvp',
    text: "Jordan RSVP'd to your event",
    timeAgo: '5m ago',
    read: false,
    eventId: 'e3',
    eventImage: '/images/events/event-3.jpg',
  },
  {
    id: 'n2',
    type: 'reminder',
    text: 'Saturday Morning Run Club starts in 2 hours',
    timeAgo: '30m ago',
    read: false,
    eventId: 'e1',
    eventImage: '/images/events/event-1.jpg',
  },
  {
    id: 'n3',
    type: 'review',
    text: 'Maya left a review on your event',
    timeAgo: '1h ago',
    read: false,
    eventId: 'e4',
    eventImage: '/images/events/event-4.jpg',
  },
  {
    id: 'n4',
    type: 'follow',
    text: 'Carlos started following you',
    timeAgo: '2h ago',
    read: false,
  },
  {
    id: 'n5',
    type: 'milestone',
    text: "You've attended 10 events!",
    timeAgo: '3h ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'friend_going',
    text: 'Sophie is going to Ceramics Night Out',
    timeAgo: '5h ago',
    read: true,
    eventId: 'e6',
    eventImage: '/images/events/event-6.jpg',
  },
  {
    id: 'n7',
    type: 'rsvp',
    text: "Liam RSVP'd to your event",
    timeAgo: '8h ago',
    read: true,
    eventId: 'e9',
    eventImage: '/images/events/event-9.jpg',
  },
  {
    id: 'n8',
    type: 'reminder',
    text: 'Sunset Yoga in the Park is tomorrow at 6 PM',
    timeAgo: '12h ago',
    read: true,
    eventId: 'e10',
    eventImage: '/images/events/event-10.jpg',
  },
  {
    id: 'n9',
    type: 'friend_going',
    text: 'Ava is going to Vinyl & Vibes Listening Party',
    timeAgo: '1d ago',
    read: true,
    eventId: 'e8',
    eventImage: '/images/events/event-8.jpg',
  },
  {
    id: 'n10',
    type: 'review',
    text: 'Ethan left a review on your event',
    timeAgo: '2d ago',
    read: true,
    eventId: 'e11',
    eventImage: '/images/events/event-11.jpg',
  },
];

function getNotificationIcon(type: NotificationItem['type']) {
  switch (type) {
    case 'rsvp':
      return <CalendarCheck className="h-4 w-4 text-[var(--color-primary)]" />;
    case 'reminder':
      return <Clock className="h-4 w-4 text-[var(--color-accent)]" />;
    case 'review':
      return <Star className="h-4 w-4 text-[var(--color-accent)]" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-[var(--color-success)]" />;
    case 'milestone':
      return <Trophy className="h-4 w-4 text-[var(--color-primary)]" />;
    case 'friend_going':
      return <Users className="h-4 w-4 text-[var(--color-text-secondary)]" />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-5xl px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="tap-target btn-press -ml-2 flex items-center justify-center rounded-full p-2 transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" />
              </Link>
              <div>
                <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-press flex items-center gap-1.5 rounded-full bg-[var(--color-surface-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="flex flex-col">
          {notifications.map((item, idx) => {
            const isLast = idx === notifications.length - 1;

            const content = (
              <div
                className={`animate-fade-up flex gap-3 py-4 ${
                  !isLast ? 'border-b border-[var(--color-border-subtle)]' : ''
                } ${
                  !item.read
                    ? 'border-l-2 border-l-[var(--color-primary)] pl-3'
                    : 'pl-[14px]'
                }`}
                style={{ '--stagger': idx } as React.CSSProperties}
              >
                <div className="relative shrink-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      !item.read
                        ? 'bg-[var(--color-primary)]/10'
                        : 'bg-[var(--color-surface-subtle)]'
                    }`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>
                  {!item.read && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm leading-snug ${
                      !item.read
                        ? 'font-medium text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {item.text}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {item.timeAgo}
                  </p>
                </div>

                {item.eventImage && (
                  <img
                    src={item.eventImage}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-[var(--radius-md)] object-cover sm:h-16 sm:w-16"
                  />
                )}
              </div>
            );

            if (item.eventId) {
              return (
                <Link
                  key={item.id}
                  href={`/event/${item.eventId}`}
                  className="transition-lift"
                  onClick={() => markAsRead(item.id)}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className="cursor-pointer"
              >
                {content}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
