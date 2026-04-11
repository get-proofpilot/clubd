'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  Star,
  BadgeCheck,
  Bookmark,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';
import { hosts, events, reviews } from '@/lib/mock-data';
import type { Event } from '@/lib/types';
import MobileContainer from '@/components/MobileContainer';

type HostTab = 'upcoming' | 'past' | 'reviews' | 'about';

export default function HostProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<HostTab>('upcoming');
  const [isFollowing, setIsFollowing] = useState(false);

  const host = hosts.find((h) => h.id === id);

  if (!host) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[var(--color-text-secondary)]">Host not found.</p>
        </div>
      </MobileContainer>
    );
  }

  const hostEvents = events.filter((e) => e.host.id === id);
  const hostReviews = reviews.filter((r) => hostEvents.some((e) => e.id === r.eventId));

  const tabs: { key: HostTab; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming Events' },
    { key: 'past', label: 'Past Events' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'about', label: 'About' },
  ];

  // Mock highlight images
  const highlights = [
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80',
    'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=300&q=80',
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=300&q=80',
  ];

  return (
    <MobileContainer>
      {/* Header */}
      <header className="w-full z-50 flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </Link>
          <h1 className="font-display font-bold text-xl text-[var(--color-text-primary)]">Host Profile</h1>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors">
            <Share2 size={18} strokeWidth={1.8} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors">
            <MoreVertical size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4 hide-scroll bg-white">
        <div className="content-max">
          {/* Host Info */}
          <section className="px-4 md:px-6 lg:px-8 pt-6 pb-4 relative">
            {/* Cover Image */}
            <div className="w-full h-28 md:h-44 lg:h-56 rounded-2xl overflow-hidden mb-10 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                src={hostEvents[0]?.coverImage ?? 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80'}
                alt={host.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Avatar */}
            <div className="absolute top-[84px] md:top-[140px] lg:top-[180px] left-4 md:left-6 lg:left-8 flex items-end gap-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                {host.verified && (
                  <div className="absolute bottom-1 right-1 w-7 h-7 bg-[var(--color-brand-500)] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <BadgeCheck size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">{host.name}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                    <MapPin size={14} className="text-[var(--color-brand-500)]" />
                    Los Angeles, CA
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[var(--color-surface-subtle)] px-2.5 py-1 rounded-lg border border-gray-100">
                  <Star size={12} className="text-orange-400 fill-orange-400" />
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">4.9</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">(120)</span>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mt-3 leading-relaxed max-w-2xl">
                Building a community of runners in LA. All paces welcome! We host weekly 5K and 10K runs followed by coffee & chats.
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-brand-600)] bg-[var(--color-brand-50)] px-3 py-1.5 rounded-full">
                  <Instagram size={12} /> @{host.name.toLowerCase().replace(/\s/g, '')}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-brand-600)] bg-[var(--color-brand-50)] px-3 py-1.5 rounded-full">
                  <LinkIcon size={12} /> {host.name.toLowerCase().replace(/\s/g, '')}.com
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-5 py-4 border-y border-gray-100">
              <div className="text-center flex-1">
                <p className="font-display font-bold text-xl text-[var(--color-text-primary)]">
                  {host.followerCount >= 1000 ? `${(host.followerCount / 1000).toFixed(1)}k` : host.followerCount}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">Followers</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center flex-1">
                <p className="font-display font-bold text-xl text-[var(--color-text-primary)]">{host.eventCount}</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">Events Hosted</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center flex-1">
                <p className="font-display font-bold text-xl text-[var(--color-text-primary)]">98%</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">Response Rate</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 md:flex-none md:px-10 py-3 text-sm font-bold rounded-xl transition-colors shadow-[var(--shadow-soft)] ${
                  isFollowing
                    ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] border border-gray-200'
                    : 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Host'}
              </button>
              <button className="flex-1 md:flex-none md:px-10 py-3 bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                Message
              </button>
            </div>
          </section>

          {/* Highlights */}
          <section className="px-4 md:px-6 lg:px-8 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">Highlights</h3>
            {/* Mobile: horizontal scroll; Desktop: grid */}
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-2 md:hidden">
              {highlights.map((src, i) => (
                <div key={i} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover" src={src} alt={`Highlight ${i + 1}`} />
                </div>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-4 md:gap-3">
              {highlights.map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover" src={src} alt={`Highlight ${i + 1}`} />
                </div>
              ))}
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
              {(activeTab === 'upcoming' || activeTab === 'past') && (
                <HostEventList events={hostEvents} />
              )}

              {activeTab === 'reviews' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostReviews.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-secondary)] text-center py-12 col-span-full">No reviews yet</p>
                  ) : (
                    hostReviews.map((review) => (
                      <div key={review.id} className="bg-[var(--color-surface-subtle)] rounded-xl p-4 border border-gray-100 max-w-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{review.userName}</p>
                              <p className="text-[10px] text-[var(--color-text-secondary)]">
                                Attended {events.find((e) => e.id === review.eventId)?.title ?? 'event'}
                              </p>
                            </div>
                          </div>
                          <div className="flex text-orange-400 text-xs">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <span key={i}>&#9733;</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] italic">&ldquo;{review.text}&rdquo;</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-gray-100 max-w-2xl">
                  <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-3">About {host.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Building a community of runners in LA. All paces welcome! We host weekly 5K and 10K runs followed by coffee & chats. Join us to sweat and socialize.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      <span className="font-semibold text-[var(--color-text-primary)]">Type:</span> {host.type}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      <span className="font-semibold text-[var(--color-text-primary)]">Events hosted:</span> {host.eventCount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </MobileContainer>
  );
}

// ---------------------------------------------------------------------------
// Host Event List
// ---------------------------------------------------------------------------
function HostEventList({ events: eventList }: { events: Event[] }) {
  if (eventList.length === 0) {
    return <p className="text-sm text-[var(--color-text-secondary)] text-center py-12">No events</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {eventList.map((event) => {
        const d = new Date(event.date);
        const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
        const priceDisplay = event.pricingType === 'free'
          ? 'Free'
          : event.ticketTiers?.[0]
          ? `$${(event.ticketTiers[0].priceInCents / 100).toFixed(0)}`
          : 'Paid';

        return (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="bg-white rounded-2xl p-3 shadow-[var(--shadow-soft)] border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover" src={event.coverImage} alt={event.title} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-[var(--color-brand-600)] font-bold">{dateLabel} &middot; {event.time}</span>
                      <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-500)]" onClick={(e) => e.preventDefault()}>
                        <Bookmark size={14} />
                      </button>
                    </div>
                    <h4 className="font-display font-bold text-base text-[var(--color-text-primary)] leading-tight mb-1">{event.title}</h4>
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <MapPin size={10} /> {event.location.name.split(',')[0]}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {event.friendsGoing.slice(0, 2).map((f) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={f.id} src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full border-2 border-white" />
                        ))}
                      </div>
                      {event.friendsGoing.length > 0 && (
                        <span className="text-[10px] text-[var(--color-text-secondary)] ml-2 font-medium">
                          {event.friendsGoing.length} friends going
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">{priceDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      <div className="col-span-full">
        <button className="w-full py-3 mt-2 bg-white text-[var(--color-brand-600)] text-sm font-bold rounded-xl border border-[var(--color-brand-200)] hover:bg-[var(--color-brand-50)] transition-colors">
          View All Events
        </button>
      </div>
    </div>
  );
}
