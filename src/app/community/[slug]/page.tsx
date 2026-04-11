'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Share2, MapPin, BadgeCheck, Instagram,
  Globe, Plus, Calendar, Users,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { getCategoryLabel, formatDate, formatTime } from '@/lib/utils';
import MobileContainer from '@/components/MobileContainer';

type Tab = 'upcoming' | 'past' | 'about';

export default function CommunityProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { data: session } = authClient.useSession();

  const { data, isLoading, error } = trpcReact.community.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
        </div>
      </MobileContainer>
    );
  }

  if (error || !data) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[var(--color-text-secondary)]">Community not found.</p>
        </div>
      </MobileContainer>
    );
  }

  const { community, events } = data;
  const isOwner = session?.user?.id === community.ownerId;
  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.startsAt) >= now);
  const pastEvents = events.filter((e) => new Date(e.startsAt) < now);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
    { key: 'past', label: `Past (${pastEvents.length})` },
    { key: 'about', label: 'About' },
  ];

  const typeLabels: Record<string, string> = {
    community: 'Community',
    studio: 'Studio',
    brand: 'Brand',
    organization: 'Organization',
  };

  return (
    <MobileContainer>
      {/* Header */}
      <header className="w-full z-50 flex justify-between items-center px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </Link>
          <h1 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
            {typeLabels[community.type] || 'Community'}
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors">
          <Share2 size={18} strokeWidth={1.8} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scroll bg-white">
        {/* Cover Image */}
        {community.coverImageUrl ? (
          <div className="relative h-44 w-full">
            <img
              src={community.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-28 w-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10" />
        )}

        {/* Profile section */}
        <div className="px-5 -mt-10 relative">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-[var(--color-surface-subtle)] shadow-md">
            {community.avatarUrl ? (
              <img src={community.avatarUrl} alt={community.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-text-muted)]">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + verification */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                {community.name}
              </h2>
              {community.verified && (
                <BadgeCheck size={20} className="text-[var(--color-primary)]" fill="currentColor" stroke="white" />
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
              <span className="rounded-full bg-[var(--color-surface-subtle)] px-2.5 py-1 font-medium">
                {typeLabels[community.type]}
              </span>
              {community.category && (
                <span>{getCategoryLabel(community.category)}</span>
              )}
              {community.locationLabel && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {community.locationLabel}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6">
            <div className="text-center">
              <p className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                {events.length}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Events</p>
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                {community.followerCount ?? 0}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Followers</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            {isOwner ? (
              <Link
                href={`/host/create?community=${community.id}`}
                className="btn-press flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] font-semibold text-white text-sm"
                style={{ boxShadow: 'var(--shadow-button)' }}
              >
                <Plus size={16} /> Create Event
              </Link>
            ) : (
              <button className="btn-press flex h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] font-semibold text-white text-sm">
                Follow
              </button>
            )}
          </div>

          {/* Social links */}
          {(community.instagramHandle || community.websiteUrl) && (
            <div className="mt-4 flex items-center gap-4">
              {community.instagramHandle && (
                <a
                  href={`https://instagram.com/${community.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <Instagram size={14} /> @{community.instagramHandle}
                </a>
              )}
              {community.websiteUrl && (
                <a
                  href={community.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-100">
          <div className="flex px-5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 py-4">
          {activeTab === 'about' && (
            <div>
              {community.description ? (
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {community.description}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">No description yet.</p>
              )}
            </div>
          )}

          {(activeTab === 'upcoming' || activeTab === 'past') && (
            <div className="space-y-3">
              {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar size={32} className="mx-auto text-[var(--color-text-muted)]" />
                  <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    No {activeTab} events
                  </p>
                </div>
              ) : (
                (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
                  <Link
                    key={event.id}
                    href={`/event/${event.id}`}
                    className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-colors hover:bg-[var(--color-surface-subtle)]"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="h-16 w-16 flex-shrink-0 rounded-[var(--radius-sm)] object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-sm text-[var(--color-text-primary)]">
                        {event.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        {formatDate(event.startsAt)} at {formatTime(event.startsAt)}
                      </p>
                      {event.locationName && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                          <MapPin size={10} /> {event.locationName}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </MobileContainer>
  );
}
