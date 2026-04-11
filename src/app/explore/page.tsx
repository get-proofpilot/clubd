'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  SlidersHorizontal,
  Heart,
  Share2,
  BadgeCheck,
  MapPin,
  Calendar,
} from 'lucide-react';
import { events, currentUser } from '@/lib/mock-data';
import type { Event } from '@/lib/types';
import MobileContainer from '@/components/MobileContainer';

const categoryLabels: Record<string, string> = {
  fitness: 'Fitness', wellness: 'Wellness', social: 'Social', outdoor: 'Outdoor',
  'food-drink': 'Food & Drink', creative: 'Creative', family: 'Family', community: 'Community',
};

const categoryColors: Record<string, string> = {
  fitness: 'text-red-700', wellness: 'text-emerald-700', social: 'text-[var(--color-brand-600)]',
  outdoor: 'text-blue-700', 'food-drink': 'text-amber-700', creative: 'text-purple-700',
  family: 'text-pink-700', community: 'text-teal-700',
};

function formatEventDate(date: string, time: string): string {
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return `Today, ${time}`;
  const tom = new Date(now); tom.setDate(tom.getDate() + 1);
  if (d.toDateString() === tom.toDateString()) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

const QUICK_FILTERS = ['All', 'Today', 'Free', 'Outdoor', 'Beginner'];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = events.filter((event) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!event.title.toLowerCase().includes(q) && !event.description.toLowerCase().includes(q) && !event.host.name.toLowerCase().includes(q)) return false;
    }
    if (activeFilter === 'Today') return new Date(event.date).toDateString() === new Date().toDateString();
    if (activeFilter === 'Free') return event.pricingType === 'free';
    if (activeFilter === 'Outdoor') return event.category === 'outdoor';
    return true;
  });

  const forYouEvents = filtered.slice(0, 4);
  const friendsGoingEvents = filtered.filter((e) => e.friendsGoing.length > 0).slice(0, 6);
  const weekendEvents = filtered.slice(2, 8);

  return (
    <MobileContainer>
      {/* ── Mobile Header (hidden on desktop — desktop uses top nav) ── */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md pt-[max(env(safe-area-inset-top),12px)] pb-3 px-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-brand-100)]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">{getGreeting()} 👋</p>
              <h1 className="font-display font-semibold text-lg text-[var(--color-text-primary)] leading-tight">{currentUser.name}</h1>
            </div>
          </div>
          <Link href="/notifications" className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-brand-50)] transition-colors relative">
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[var(--color-primary)] rounded-full border border-white" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={15} className="text-[var(--color-text-muted)]" />
          </div>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events, hosts, or friends..." className="w-full bg-[var(--color-surface-subtle)] border-none rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-brand-500)] transition-all outline-none" />
          <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <SlidersHorizontal size={16} className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-500)] transition-colors" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex overflow-x-auto hide-scroll gap-2 pb-1 -mx-4 px-4">
          {QUICK_FILTERS.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-50)] border border-gray-200'}`}>{filter}</button>
          ))}
        </div>
      </header>

      {/* ── Main Feed ─────────────────────────────────────────── */}
      <main className="flex-1 pb-4">
        {/* Desktop search + filters bar */}
        <div className="hidden md:block border-b border-gray-100 bg-white">
          <div className="content-max px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events, hosts, or friends..." className="w-full bg-[var(--color-surface-subtle)] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent outline-none" />
              </div>
              <div className="flex gap-2">
                {QUICK_FILTERS.map((filter) => (
                  <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-[var(--color-text-secondary)] hover:bg-gray-100 border border-gray-200'}`}>{filter}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="content-max px-4 md:px-6 lg:px-8 pt-6 space-y-8 md:space-y-10">
          {/* For You */}
          {forYouEvents.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-display font-bold text-xl md:text-2xl text-[var(--color-text-primary)]">For You</h2>
                <Link href="/discover" className="text-sm font-medium text-[var(--color-primary)] hover:opacity-80">See all</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {forYouEvents.map((event) => <EventCardFeed key={event.id} event={event} />)}
              </div>
            </section>
          )}

          {/* Friends Are Going */}
          {friendsGoingEvents.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl md:text-2xl text-[var(--color-text-primary)] mb-4">Friends Are Going</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {friendsGoingEvents.map((event) => <EventCardMini key={event.id} event={event} />)}
              </div>
            </section>
          )}

          {/* Sponsored */}
          <section>
            <article className="bg-[var(--color-secondary)] rounded-2xl md:rounded-3xl p-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[var(--color-brand-500)] rounded-full blur-[60px] opacity-40" />
              <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-[var(--color-accent)] rounded-full blur-[60px] opacity-30" />
              <div className="bg-[var(--color-secondary)]/80 backdrop-blur-sm rounded-[18px] md:rounded-[22px] p-5 md:p-8 relative z-10 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">Sponsored</span>
                  <span className="text-white/60 text-xs flex items-center gap-1"><BadgeCheck size={12} className="text-[var(--color-brand-400)]" /> Verified Host</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2">Nike Run Club: City Series</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-xl">Join 500+ runners for our monthly mega-run. Exclusive merch for early RSVPs.</p>
                <button className="w-full md:w-auto md:px-8 py-3 rounded-xl bg-[var(--color-brand-500)] text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity">RSVP Now</button>
              </div>
            </article>
          </section>

          {/* This Weekend */}
          {weekendEvents.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl md:text-2xl text-[var(--color-text-primary)] mb-4">This Weekend Nearby</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {weekendEvents.map((event) => <EventListItem key={event.id} event={event} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </MobileContainer>
  );
}

// ---------------------------------------------------------------------------
// EventCardFeed
// ---------------------------------------------------------------------------
function EventCardFeed({ event }: { event: Event }) {
  const priceDisplay = event.pricingType === 'free' ? 'Free' : event.ticketTiers?.length ? `$${(Math.min(...event.ticketTiers.map((t) => t.priceInCents)) / 100).toFixed(0)}` : 'Paid';

  return (
    <Link href={`/event/${event.id}`}>
      <article className="bg-white rounded-2xl p-3 shadow-[var(--shadow-soft)] border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={event.coverImage} alt={event.title} />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="glass-pill px-2.5 py-1 rounded-full text-[11px] font-bold text-[var(--color-brand-700)]">{categoryLabels[event.category] ?? event.category}</span>
          </div>
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[var(--color-text-primary)] hover:text-red-500 transition-colors" onClick={(e) => e.preventDefault()}><Heart size={15} /></button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-[15px] leading-snug mb-0.5 text-[var(--color-text-primary)] line-clamp-2">{event.title}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] flex items-center gap-1"><Calendar size={13} className="text-[var(--color-brand-500)] shrink-0" />{formatEventDate(event.date, event.time)}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-sm font-bold text-[var(--color-text-primary)]">{priceDisplay}</span>
              <span className="text-[11px] text-[var(--color-text-muted)]"><MapPin size={10} className="inline" /> {event.location.name.split(',')[0]}</span>
            </div>
          </div>

          {event.friendsGoing.length > 0 && (
            <div className="flex items-center bg-[var(--color-brand-50)]/60 rounded-lg p-2.5 border border-[var(--color-brand-100)]/40">
              <div className="flex -space-x-2 mr-2.5">
                {event.friendsGoing.slice(0, 3).map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={f.id} src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full border-2 border-white" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[var(--color-brand-800)]">{event.friendsGoing.length} Pals going</span>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity" onClick={(e) => e.preventDefault()}>Going</button>
            <button className="flex-1 py-2 rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-[13px] font-semibold hover:bg-[var(--color-brand-100)] transition-colors border border-[var(--color-brand-100)]" onClick={(e) => e.preventDefault()}>Interested</button>
            <button className="w-9 rounded-lg bg-gray-50 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors border border-gray-100" onClick={(e) => e.preventDefault()}><Share2 size={14} /></button>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// EventCardMini
// ---------------------------------------------------------------------------
function EventCardMini({ event }: { event: Event }) {
  return (
    <Link href={`/event/${event.id}`}>
      <article className="bg-white rounded-2xl p-2.5 shadow-[var(--shadow-soft)] border border-gray-100 flex flex-col h-full hover:shadow-[var(--shadow-card)] transition-shadow">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover" src={event.coverImage} alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {event.friendsGoing.length > 0 && (
            <div className="absolute bottom-2 left-2 flex -space-x-1.5">
              {event.friendsGoing.slice(0, 2).map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.id} src={f.avatar} alt={f.name} className="w-5 h-5 rounded-full border border-white" />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 block ${categoryColors[event.category] ?? 'text-[var(--color-brand-600)]'}`}>{categoryLabels[event.category] ?? event.category}</span>
          <h3 className="font-display font-bold text-sm text-[var(--color-text-primary)] leading-tight mb-0.5 line-clamp-2">{event.title}</h3>
          <p className="text-[11px] text-[var(--color-text-secondary)]">{formatEventDate(event.date, event.time)}</p>
        </div>
        <button className="w-full mt-2.5 py-1.5 rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-xs font-semibold hover:bg-[var(--color-brand-100)] transition-colors" onClick={(e) => e.preventDefault()}>Join Them</button>
      </article>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// EventListItem
// ---------------------------------------------------------------------------
function EventListItem({ event }: { event: Event }) {
  const d = new Date(event.date);
  const dateLabel = `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`;
  const priceDisplay = event.pricingType === 'free' ? 'Free' : event.ticketTiers?.length ? `$${(Math.min(...event.ticketTiers.map((t) => t.priceInCents)) / 100).toFixed(0)}` : 'Paid';

  return (
    <Link href={`/event/${event.id}`}>
      <article className="bg-white rounded-2xl p-3 shadow-[var(--shadow-soft)] border border-gray-100 flex gap-3 hover:shadow-[var(--shadow-card)] transition-shadow">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover" src={event.coverImage} alt={event.title} />
          <div className="absolute top-1 left-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold text-[var(--color-text-primary)]">{dateLabel}</div>
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 block ${categoryColors[event.category] ?? 'text-[var(--color-brand-600)]'}`}>{categoryLabels[event.category] ?? event.category}</span>
            <h3 className="font-display font-bold text-sm md:text-base text-[var(--color-text-primary)] leading-tight mb-0.5 line-clamp-1">{event.title}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">{event.location.name.split(',')[0]} &middot; {priceDisplay}</p>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex -space-x-1.5">
              {event.friendsGoing.slice(0, 2).map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.id} src={f.avatar} alt={f.name} className="w-5 h-5 rounded-full border border-white" />
              ))}
              {event.attendeeCount > 2 && <div className="w-5 h-5 rounded-full border border-white bg-[var(--color-brand-100)] flex items-center justify-center text-[8px] font-bold text-[var(--color-brand-700)]">+{event.attendeeCount - 2}</div>}
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-xs font-semibold">Interested</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
