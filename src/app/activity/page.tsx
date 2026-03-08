'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  MessageCircle,
  Star,
  Trophy,
  Calendar,
  TrendingUp,
  Users,
  ChevronRight,
  Zap,
  UserPlus,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { activities, events, users, currentUser } from '@/lib/mock-data';
import type { ActivityItem } from '@/lib/types';
import BottomNav from '@/components/BottomNav';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type FilterTab = 'all' | 'friends' | 'trending';

const TABS: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Zap size={14} /> },
  { key: 'friends', label: 'Friends', icon: <Users size={14} /> },
  { key: 'trending', label: 'Trending', icon: <TrendingUp size={14} /> },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function getEvent(eventId?: string) {
  if (!eventId) return null;
  return events.find((e) => e.id === eventId) ?? null;
}

// ---------------------------------------------------------------------------
// Stats Banner
// ---------------------------------------------------------------------------

function StatsBanner() {
  const stats = [
    { value: '12', label: 'Events', sublabel: 'this month', icon: <Calendar size={16} className="text-[var(--color-primary)]" /> },
    { value: '4', label: 'Week', sublabel: 'streak', icon: <Flame size={16} className="text-orange-500" /> },
    { value: '6', label: 'Friends', sublabel: 'active', icon: <Users size={16} className="text-[var(--cat-outdoor)]" /> },
    { value: '3', label: 'Reviews', sublabel: 'written', icon: <Star size={16} className="text-[var(--color-accent)]" /> },
  ];

  return (
    <div className="scrollbar-hide -mx-5 flex gap-2.5 overflow-x-auto px-5 py-3 sm:-mx-8 sm:px-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-card)] px-4 py-3 card-shadow"
          style={{ minWidth: '140px' }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)]">
            {stat.icon}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg font-bold text-[var(--color-text-primary)]">{stat.value}</span>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{stat.sublabel}</span>
            </div>
            <span className="text-[11px] text-[var(--color-text-secondary)]">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly Digest
// ---------------------------------------------------------------------------

function WeeklyDigest() {
  return (
    <div className="mx-0 mt-1 mb-2 rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-r from-[var(--color-card)] to-[var(--color-surface-subtle)] p-4 card-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
          <TrendingUp size={14} className="text-[var(--color-primary)]" />
        </div>
        <span className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">This Week</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="font-display text-xl font-bold text-[var(--color-primary)]">18</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">friend events</div>
        </div>
        <div className="text-center">
          <div className="font-display text-xl font-bold text-[var(--color-accent)]">7</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">new reviews</div>
        </div>
        <div className="text-center">
          <div className="font-display text-xl font-bold text-[var(--cat-outdoor)]">42</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">RSVPs</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--color-surface-subtle)] px-3 py-2">
        <Trophy size={14} className="text-[var(--color-accent)] shrink-0" />
        <span className="text-xs text-[var(--color-text-secondary)]">
          <strong className="text-[var(--color-text-primary)]">Saturday Morning Run Club</strong> was the most popular — 5 friends went
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kudos Button (Strava-style)
// ---------------------------------------------------------------------------

function KudosButton({ count, onToggle, active }: { count: number; onToggle: () => void; active: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`btn-press flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ${
        active
          ? 'bg-orange-500/15 text-orange-600'
          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:bg-orange-500/10 hover:text-orange-500'
      }`}
    >
      <Flame size={13} className={active ? 'fill-orange-500' : ''} />
      <span>{count}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Activity Card Components
// ---------------------------------------------------------------------------

function RSVPCard({ item }: { item: ActivityItem }) {
  const event = getEvent(item.eventId);
  if (!event) return null;
  const firstName = item.user.name.split(' ')[0];

  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="flex gap-3">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug">
            <strong className="font-semibold">{firstName}</strong>
            <span className="text-[var(--color-text-secondary)]"> is going to </span>
            <strong className="font-semibold">{event.title}</strong>
          </p>
        </div>
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
        <MapPin size={11} />
        <span className="truncate">{event.location.name}</span>
        <span>&middot;</span>
        <span>{event.time}</span>
      </div>
    </Link>
  );
}

function AttendedCard({ item }: { item: ActivityItem }) {
  const event = getEvent(item.eventId);
  if (!event) return null;
  const firstName = item.user.name.split(' ')[0];

  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug">
            <strong className="font-semibold">{firstName}</strong>
            <span className="text-[var(--color-text-secondary)]"> attended </span>
            <strong className="font-semibold">{event.title}</strong>
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--color-success)]/10 px-2 py-0.5">
            <CheckCircle2 size={11} className="text-[var(--color-success)]" />
            <span className="text-[11px] font-medium text-[var(--color-success)]">Was there</span>
          </div>
        </div>
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover opacity-80"
        />
      </div>
    </Link>
  );
}

function ReviewCard({ item }: { item: ActivityItem }) {
  const event = getEvent(item.eventId);
  if (!event || !item.review) return null;
  const firstName = item.user.name.split(' ')[0];

  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug">
            <strong className="font-semibold">{firstName}</strong>
            <span className="text-[var(--color-text-secondary)]"> reviewed </span>
            <strong className="font-semibold">{event.title}</strong>
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < item.review!.rating
                    ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'text-[var(--color-border)]'
                }
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            &ldquo;{item.review.text}&rdquo;
          </p>
        </div>
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
      </div>
    </Link>
  );
}

function MilestoneCard({ item }: { item: ActivityItem }) {
  if (!item.milestone) return null;
  const firstName = item.user.name.split(' ')[0];

  return (
    <div className="rounded-xl bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/8 border border-[var(--color-primary)]/15 p-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{item.milestone.icon}</span>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {firstName} hit {item.milestone.count} {item.milestone.label}!
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Keep it up!
          </p>
        </div>
      </div>
    </div>
  );
}

function GroupRSVPCard({ item }: { item: ActivityItem }) {
  const event = getEvent(item.eventId);
  if (!event || !item.users) return null;

  const names = item.users.map((u) => u.name.split(' ')[0]);
  const displayNames =
    names.length <= 2
      ? names.join(' and ')
      : `${names[0]}, ${names[1]}, and ${names.length - 2} other${names.length - 2 > 1 ? 's' : ''}`;

  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug">
            <strong className="font-semibold">{displayNames}</strong>
            <span className="text-[var(--color-text-secondary)]"> are going to </span>
            <strong className="font-semibold">{event.title}</strong>
          </p>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="btn-press mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-[11px] font-bold text-white transition-all"
            style={{ boxShadow: '0 2px 8px var(--color-primary)' }}
          >
            <Users size={12} />
            Join them
          </button>
        </div>
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
      </div>
    </Link>
  );
}

function FollowedHostCard({ item }: { item: ActivityItem }) {
  if (!item.host) return null;
  const firstName = item.user.name.split(' ')[0];

  return (
    <Link href={`/host/${item.host.id}`} className="block">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug">
            <strong className="font-semibold">{firstName}</strong>
            <span className="text-[var(--color-text-secondary)]"> started following </span>
            <strong className="font-semibold">{item.host.name}</strong>
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span>{item.host.followerCount.toLocaleString()} followers</span>
            <span>&middot;</span>
            <span>{item.host.eventCount} events</span>
          </div>
        </div>
        <img
          src={item.host.avatar}
          alt={item.host.name}
          className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-surface-subtle)] object-cover"
        />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Activity Card Wrapper
// ---------------------------------------------------------------------------

function ActivityCard({ item, index }: { item: ActivityItem; index: number }) {
  const [kudosGiven, setKudosGiven] = useState(false);
  const kudosTotal = item.kudosCount + (kudosGiven ? 1 : 0);

  const typeIcon: Record<string, React.ReactNode> = {
    rsvp: <MapPin size={12} className="text-[var(--color-primary)]" />,
    attended: <CheckCircle2 size={12} className="text-[var(--color-success)]" />,
    review: <Star size={12} className="text-[var(--color-accent)]" />,
    milestone: <Trophy size={12} className="text-[var(--color-accent)]" />,
    group_rsvp: <Users size={12} className="text-[var(--color-primary)]" />,
    followed_host: <UserPlus size={12} className="text-[var(--color-cat-outdoor)]" />,
  };

  return (
    <div
      className="animate-fade-up"
      style={{ '--stagger': index } as React.CSSProperties}
    >
      <div className="flex gap-3 py-3.5">
        {/* Avatar + type badge */}
        <div className="relative shrink-0">
          {item.type === 'group_rsvp' && item.users ? (
            <div className="relative h-11 w-11">
              <img
                src={item.users[0].avatar}
                alt=""
                className="absolute top-0 left-0 h-8 w-8 rounded-full bg-[var(--color-surface-subtle)] border-2 border-[var(--color-bg)] object-cover z-[2]"
              />
              <img
                src={item.users[1].avatar}
                alt=""
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[var(--color-surface-subtle)] border-2 border-[var(--color-bg)] object-cover z-[1]"
              />
            </div>
          ) : (
            <img
              src={item.user.avatar}
              alt={item.user.name}
              className="h-11 w-11 rounded-full bg-[var(--color-surface-subtle)] object-cover"
            />
          )}
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-card)] shadow-sm">
            {typeIcon[item.type]}
          </div>
        </div>

        {/* Card content */}
        <div className="min-w-0 flex-1">
          {item.type === 'rsvp' && <RSVPCard item={item} />}
          {item.type === 'attended' && <AttendedCard item={item} />}
          {item.type === 'review' && <ReviewCard item={item} />}
          {item.type === 'milestone' && <MilestoneCard item={item} />}
          {item.type === 'group_rsvp' && <GroupRSVPCard item={item} />}
          {item.type === 'followed_host' && <FollowedHostCard item={item} />}

          {/* Footer: timestamp + kudos + comments */}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {timeAgo(item.timestamp)}
            </span>
            <KudosButton
              count={kudosTotal}
              active={kudosGiven}
              onToggle={() => setKudosGiven(!kudosGiven)}
            />
            {item.commentCount > 0 && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"
              >
                <MessageCircle size={12} />
                <span>{item.commentCount}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trending Events Section
// ---------------------------------------------------------------------------

function TrendingEvents() {
  // Events sorted by friend activity
  const trending = [...events]
    .sort((a, b) => b.friendsGoing.length - a.friendsGoing.length)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-2 py-2">
      <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-1">
        Popular with friends
      </h3>
      {trending.map((event, i) => (
        <Link
          key={event.id}
          href={`/event/${event.id}`}
          className="animate-fade-up flex items-center gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-3 card-shadow transition-lift"
          style={{ '--stagger': i } as React.CSSProperties}
        >
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {event.title}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {event.time} &middot; {event.location.name}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              {/* Friend avatars */}
              <div className="flex -space-x-1.5">
                {event.friendsGoing.slice(0, 3).map((friend) => (
                  <img
                    key={friend.id}
                    src={friend.avatar}
                    alt=""
                    className="h-5 w-5 rounded-full border-2 border-[var(--color-card)] bg-[var(--color-surface-subtle)] object-cover"
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                {event.friendsGoing.length} friend{event.friendsGoing.length !== 1 ? 's' : ''} going
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="shrink-0 text-[var(--color-text-muted)]" />
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredActivities = useMemo(() => {
    switch (activeTab) {
      case 'friends':
        // Only show activities from followed users
        return activities.filter((a) => {
          const u = users.find((u) => u.id === a.user.id);
          return u?.following;
        });
      case 'trending':
        // Show group RSVPs and high-kudos activities
        return activities
          .filter((a) => a.type === 'group_rsvp' || a.kudosCount >= 10)
          .sort((a, b) => b.kudosCount - a.kudosCount);
      default:
        return activities;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-3xl px-5 pb-2 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                Activity
              </h1>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                See what your friends are up to
              </p>
            </div>
            {/* Your avatar */}
            <Link href="/profile" className="btn-press">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface-subtle)] object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Stats Banner */}
        <StatsBanner />

        {/* Weekly Digest */}
        <WeeklyDigest />

        {/* Filter Tabs */}
        <div className="sticky top-[72px] z-20 -mx-5 px-5 sm:-mx-8 sm:px-8 pt-2 pb-1 glass">
          <div className="flex gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn-press flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trending section (when on trending tab) */}
        {activeTab === 'trending' && <TrendingEvents />}

        {/* Activity Feed */}
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {filteredActivities.map((item, index) => (
            <ActivityCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* End of feed */}
        <div className="py-12 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            You&rsquo;re all caught up
          </p>
          <Link
            href="/"
            className="btn-press mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2 text-xs font-bold text-white"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            Discover more events
            <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
