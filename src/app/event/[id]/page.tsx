'use client';

import { use, useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Share2,
  Heart,
  BadgeCheck,
  Users,
} from 'lucide-react';
import { events, reviews } from '@/lib/mock-data';
import type L from 'leaflet';
import { formatDate, formatTime, getCategoryLabel, getCategoryColor } from '@/lib/utils';
import FriendAvatarStack from '@/components/FriendAvatarStack';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const event = events.find((e) => e.id === id);

  const [isGoing, setIsGoing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'attendees' | 'reviews'>('about');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Leaflet mini map
  useEffect(() => {
    if (typeof window === 'undefined' || !event || !mapContainerRef.current || mapInstanceRef.current) return;

    // Inject Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((leaflet) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const { lat, lng } = event.location;
      const map = leaflet.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([lat, lng], 14);

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
      }).addTo(map);

      leaflet.marker([lat, lng]).addTo(map);
      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [event]);

  const handleRsvp = useCallback(() => {
    setIsGoing((prev) => {
      if (!prev) showToast("You're going! See you there.");
      return !prev;
    });
  }, [showToast]);

  const handleSave = useCallback(() => {
    setIsSaved((prev) => !prev);
  }, []);

  const handleFollow = useCallback(() => {
    setIsFollowing((prev) => {
      if (!prev) showToast(`Following ${event?.host.name ?? 'host'}`);
      return !prev;
    });
  }, [showToast, event?.host.name]);

  const handleShare = useCallback(async () => {
    if (!event) return;
    const shareData = {
      title: event.title,
      text: `Check out ${event.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied!');
      }
    } catch {
      // User cancelled share or clipboard failed — silently ignore
    }
  }, [event, showToast]);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center animate-fade-up">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">Event not found</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const eventReviews = reviews.filter((r) => r.eventId === event.id);
  const avgRating =
    eventReviews.length > 0
      ? (eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length).toFixed(1)
      : null;
  const capacityPercent = Math.round((event.attendeeCount / event.capacity) * 100);

  const similarEvents = events
    .filter((e) => e.category === event.category && e.id !== event.id)
    .slice(0, 4);

  const handleTabClick = (tab: 'about' | 'attendees' | 'reviews') => {
    setActiveTab(tab);
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
  };

  const attendeeAvatars = Array.from({ length: Math.min(event.attendeeCount, 10) }, (_, i) => ({
    id: `att-${i}`,
    name: `Attendee ${i + 1}`,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=attendee${event.id}${i}`,
    eventsAttended: 0,
    following: false,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* ── Hero Image ─────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-4xl overflow-hidden sm:mt-4 sm:rounded-2xl">
        <div className="relative h-72 w-full overflow-hidden sm:h-96">
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="gradient-overlay-top absolute inset-x-0 top-0 h-24" />
          <div className="gradient-overlay-bottom absolute inset-x-0 bottom-0 h-36" />

          {/* Back */}
          <Link
            href="/"
            className="absolute left-4 top-[max(env(safe-area-inset-top),16px)] z-10 flex h-10 w-10 items-center justify-center rounded-full glass-dark border border-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white" strokeWidth={1.8} />
          </Link>

          {/* Share */}
          <button
            onClick={handleShare}
            className="absolute right-4 top-[max(env(safe-area-inset-top),16px)] z-10 flex h-10 w-10 items-center justify-center rounded-full glass-dark border border-white/10"
          >
            <Share2 className="h-5 w-5 text-white" strokeWidth={1.8} />
          </button>

          {/* Category badge */}
          <span
            className={`absolute bottom-4 left-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase ${getCategoryColor(event.category)}`}
            style={{ boxShadow: 'var(--shadow-pill)' }}
          >
            {getCategoryLabel(event.category)}
          </span>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        {/* Title */}
        <div className="mt-5 flex items-start justify-between gap-3 animate-fade-up">
          <h1 className="font-display text-[26px] font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
            {event.title}
          </h1>
          {event.isFree && (
            <span className="mt-1 shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
              Free
            </span>
          )}
        </div>

        {/* Date + Time */}
        <div className="animate-fade-up mt-4 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]" style={{ '--stagger': 1 } as React.CSSProperties}>
          <Calendar className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
          <span className="font-medium">
            {formatDate(event.date)} &middot; {formatTime(event.time)}
          </span>
          {event.isRecurring && (
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
              Recurring
            </span>
          )}
        </div>

        {/* Location */}
        <div className="animate-fade-up mt-3 flex items-start gap-3 text-sm text-[var(--color-text-secondary)]" style={{ '--stagger': 2 } as React.CSSProperties}>
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" strokeWidth={1.8} />
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">{event.location.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{event.location.address}</p>
          </div>
        </div>

        {/* ── Mini Map Preview ─────────────────────────────────────── */}
        <a
          href={`https://maps.google.com/?q=${event.location.lat},${event.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block"
        >
          <div
            ref={mapContainerRef}
            className="h-40 w-full rounded-[var(--radius-md)] overflow-hidden"
          />
        </a>

        {/* ── Tab Navigation ──────────────────────────────────────── */}
        <div className="sticky top-0 z-20 mt-5 flex gap-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]">
          {(['about', 'attendees', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition border-b-2 ${
                activeTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Two-column layout on desktop ────────────────────────────── */}
        <div className="mt-7 grid grid-cols-1 gap-7 md:grid-cols-[1fr_300px]">
          {/* Left column */}
          <div className="flex flex-col gap-7">
            {/* About */}
            <div id="about" className="animate-fade-up scroll-mt-16" style={{ '--stagger': 3 } as React.CSSProperties}>
              <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">About</h2>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-[var(--color-text-secondary)]">
                {event.description}
              </p>
            </div>

            {/* Who's Going */}
            <div id="attendees" className="animate-fade-up scroll-mt-16" style={{ '--stagger': 5 } as React.CSSProperties}>
              <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                Who&apos;s Going
              </h2>

              {event.friendsGoing.length > 0 && (
                <div className="mt-3">
                  <FriendAvatarStack users={event.friendsGoing} label="going" maxShow={5} />
                </div>
              )}

              {/* Capacity bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <Users className="h-4 w-4" strokeWidth={1.8} />
                    <span className="font-medium">
                      {event.attendeeCount}/{event.capacity} spots filled
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-muted)]">
                    {capacityPercent}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Attendee grid */}
              <div className="mt-4 grid grid-cols-10 gap-1.5">
                {attendeeAvatars.map((att) => (
                  <img
                    key={att.id}
                    src={att.avatar}
                    alt={att.name}
                    className="h-8 w-8 rounded-full bg-[var(--color-surface-subtle)] object-cover ring-1 ring-[var(--color-border-subtle)]"
                  />
                ))}
                {event.attendeeCount > 10 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] text-[10px] font-bold text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border-subtle)]">
                    +{event.attendeeCount - 10}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {eventReviews.length > 0 && (
              <div id="reviews" className="animate-fade-up scroll-mt-16" style={{ '--stagger': 6 } as React.CSSProperties}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">Reviews</h2>
                  {avgRating && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                      <span className="text-sm font-bold">{avgRating}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">({eventReviews.length})</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  {eventReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-[var(--radius-md)] bg-[var(--color-card)] p-4 border border-[var(--color-border-subtle)]"
                      style={{ boxShadow: 'var(--shadow-xs)' }}
                    >
                      <div className="flex items-center gap-3">
                        <img src={review.userAvatar} alt={review.userName} className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{review.userName}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'text-[var(--color-border)]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Host card (sticky on desktop) */}
          <div className="md:order-first md:order-none">
            <div
              className="animate-fade-up rounded-[var(--radius-card)] bg-[var(--color-card)] p-4 border border-[var(--color-border-subtle)] card-shadow md:sticky md:top-24"
              style={{ '--stagger': 4 } as React.CSSProperties}
            >
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Hosted by
              </h2>
              <Link href={`/host/${event.host.id}`} className="flex items-center gap-3 group">
                <img
                  src={event.host.avatar}
                  alt={event.host.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--color-border-subtle)]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{event.host.name}</span>
                    {event.host.verified && <BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" />}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {event.host.followerCount.toLocaleString()} followers &middot; {event.host.eventCount} events
                  </p>
                </div>
              </Link>
              <button
                onClick={handleFollow}
                className={`btn-press mt-4 w-full rounded-full border-2 py-2 text-xs font-bold transition-colors ${
                  isFollowing
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
                }`}
              >
                {isFollowing ? 'Following \u2713' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── More Like This ─────────────────────────────────────────────── */}
      {similarEvents.length > 0 && (
        <div className="mx-auto mt-10 max-w-2xl px-5 sm:px-8">
          <h2 className="font-display font-bold text-[var(--color-text-primary)]">More Like This</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {similarEvents.map((ev) => (
              <Link key={ev.id} href={`/event/${ev.id}`} className="w-[180px] shrink-0 group">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)]">
                  <img
                    src={ev.coverImage}
                    alt={ev.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1">{ev.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(ev.date)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{ev.location.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-5 animate-fade-up">
          <div
            className="rounded-[var(--radius-md)] glass-white border border-[var(--color-border-subtle)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] card-shadow"
          >
            {toast}
          </div>
        </div>
      )}

      {/* ── Fixed Bottom Bar ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 glass-white border-t border-[var(--color-border-subtle)] pb-safe">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3 sm:px-8">
          <button
            onClick={handleSave}
            className={`btn-press flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-card)] transition-colors ${
              isSaved
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : ''}`}
              strokeWidth={1.8}
            />
          </button>
          {isGoing ? (
            <button
              onClick={handleRsvp}
              className="btn-press flex h-12 flex-1 items-center justify-center rounded-[var(--radius-button)] border-2 border-[var(--color-primary)] bg-transparent font-bold text-[var(--color-primary)] tracking-wide transition-colors"
            >
              Cancel RSVP
            </button>
          ) : (
            <button
              onClick={handleRsvp}
              className="btn-press flex h-12 flex-1 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] font-bold text-white tracking-wide"
              style={{ boxShadow: 'var(--shadow-button)' }}
            >
              RSVP — I&apos;m Going
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
