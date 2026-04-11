"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  BadgeCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatTime, getCategoryLabel } from "@/lib/utils";

// Instagram icon (lucide doesn't have it)
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Clubd mark
function ClubdMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4C24 4 27 18 30 21C33 24 44 24 44 24C44 24 33 24 30 27C27 30 24 44 24 44C24 44 21 30 18 27C15 24 4 24 4 24C4 24 15 24 18 21C21 18 24 4 24 4Z"
        fill="#FF6B2B"
      />
    </svg>
  );
}

interface CommunityData {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: string | null;
  description: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  locationLabel: string | null;
  instagramHandle: string | null;
  websiteUrl: string | null;
  verified: boolean | null;
  followerCount: number | null;
}

interface EventData {
  id: string;
  title: string;
  description: string | null;
  category: string;
  locationName: string | null;
  address: string | null;
  startsAt: Date;
  endsAt: Date | null;
  capacity: number | null;
  rsvpCount: number | null;
  imageUrl: string | null;
  pricingType: string;
}

interface Props {
  community: CommunityData;
  events: EventData[];
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    community: "Community",
    studio: "Studio",
    brand: "Local Business",
    organization: "Organization",
  };
  return labels[type] || type;
}

export default function CommunityLanding({ community, events }: Props) {
  const hasEvents = events.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-72 md:h-96 w-full">
        {community.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="w-full h-full object-cover"
            src={community.coverImageUrl}
            alt={community.name}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-brand-700)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {community.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={community.avatarUrl}
                  alt={community.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[var(--color-brand-500)] border-4 border-white shadow-lg flex items-center justify-center text-white font-display font-bold text-2xl">
                  {community.name.charAt(0)}
                </div>
              )}
              {community.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--color-brand-500)] rounded-full border-2 border-white flex items-center justify-center">
                  <BadgeCheck size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/20 text-white backdrop-blur-sm">
                  {typeLabel(community.type)}
                </span>
                {community.category && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[var(--color-brand-500)]/80 text-white backdrop-blur-sm">
                    {getCategoryLabel(community.category)}
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl md:text-4xl text-white leading-tight truncate">
                {community.name}
              </h1>
              {community.locationLabel && (
                <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {community.locationLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Stats + Social Bar */}
        <section className="flex flex-wrap items-center gap-4 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <Calendar size={16} className="text-[var(--color-brand-500)]" />
            <span className="font-semibold text-[var(--color-text-primary)]">
              {events.length}
            </span>{" "}
            upcoming {events.length === 1 ? "event" : "events"}
          </div>

          {(community.followerCount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Users size={16} className="text-[var(--color-brand-500)]" />
              <span className="font-semibold text-[var(--color-text-primary)]">
                {community.followerCount! >= 1000
                  ? `${(community.followerCount! / 1000).toFixed(1)}k`
                  : community.followerCount}
              </span>{" "}
              followers
            </div>
          )}

          <div className="flex-1" />

          {/* Social links */}
          <div className="flex items-center gap-2">
            {community.instagramHandle && (
              <a
                href={`https://instagram.com/${community.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] text-xs font-semibold hover:bg-[var(--color-brand-100)] transition-colors"
              >
                <InstagramIcon size={14} />@{community.instagramHandle}
              </a>
            )}
            {community.websiteUrl && (
              <a
                href={community.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                <ExternalLink size={14} /> Website
              </a>
            )}
          </div>
        </section>

        {/* About */}
        {community.description && (
          <section className="py-6 border-b border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed max-w-2xl">
              {community.description}
            </p>
          </section>
        )}

        {/* ── Upcoming Events ──────────────────────────────────────── */}
        <section className="py-8">
          <h2 className="font-display font-bold text-xl md:text-2xl text-[var(--color-text-primary)] mb-5">
            Upcoming Events
          </h2>

          {hasEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
              <Calendar
                size={40}
                className="text-[var(--color-text-muted)] mx-auto mb-3"
              />
              <p className="font-semibold text-[var(--color-text-primary)]">
                No upcoming events
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Check back soon for new events from {community.name}
              </p>
            </div>
          )}
        </section>

        {/* ── Claim This Page CTA ──────────────────────────────────── */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-secondary)] p-8 md:p-10 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-500)]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-brand-500)]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="font-display font-bold text-xl md:text-2xl mb-2">
                Is this your business?
              </h3>
              <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg">
                Claim this page to manage your events, reach local customers,
                and grow your community on clubd.
              </p>
              <a
                href={`mailto:team@clubd.app?subject=${encodeURIComponent(`Claim my page — ${community.name}`)}&body=${encodeURIComponent(`Hi Clubd team,\n\nI'd like to claim the page for ${community.name} (${community.locationLabel}).\n\nMy name:\nMy role:\nBest contact:\n`)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] bg-[var(--color-brand-500)] text-white font-bold text-sm hover:bg-[var(--color-brand-600)] transition-colors shadow-[var(--shadow-button)]"
              >
                Claim This Page
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="py-8 border-t border-[var(--color-border)] text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ClubdMark size={18} />
            <span>
              Powered by{" "}
              <span className="font-display font-bold text-[var(--color-brand-500)]">
                clubd
              </span>
            </span>
          </Link>
        </footer>
      </div>
    </div>
  );
}

// ── Event Card ──────────────────────────────────────────────────────────────

function EventCard({ event }: { event: EventData }) {
  const startsAt = new Date(event.startsAt);
  const dayName = startsAt.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = startsAt.getDate();
  const month = startsAt.toLocaleDateString("en-US", { month: "short" });

  const priceLabel =
    event.pricingType === "free"
      ? "Free"
      : event.pricingType === "paid"
        ? "Paid"
        : "Free";

  return (
    <Link
      href={`/event/${event.id}`}
      className="group block bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
    >
      {/* Event image */}
      <div className="relative h-40 md:h-48 w-full">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            src={event.imageUrl}
            alt={event.title}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-100)] to-[var(--color-brand-200)]" />
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              event.pricingType === "free"
                ? "bg-[var(--color-success)]/90 text-white"
                : "bg-white/90 text-[var(--color-text-primary)] backdrop-blur"
            }`}
          >
            {priceLabel}
          </span>
        </div>

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-xl px-2.5 py-1.5 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase text-[var(--color-brand-500)] leading-none">
            {month}
          </p>
          <p className="text-lg font-display font-bold text-[var(--color-text-primary)] leading-none mt-0.5">
            {dayNum}
          </p>
          <p className="text-[10px] text-[var(--color-text-secondary)] leading-none mt-0.5">
            {dayName}
          </p>
        </div>
      </div>

      {/* Event info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-base text-[var(--color-text-primary)] leading-snug mb-2 group-hover:text-[var(--color-brand-500)] transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mb-1.5">
          <Clock size={13} className="shrink-0" />
          <span>{formatTime(startsAt)}</span>
          {event.endsAt && (
            <span className="text-[var(--color-text-muted)]">
              {" "}
              — {formatTime(new Date(event.endsAt))}
            </span>
          )}
        </div>

        {event.locationName && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mb-3">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{event.locationName}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {(event.rsvpCount ?? 0) > 0 && (
            <span className="text-xs text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {event.rsvpCount}
              </span>{" "}
              going
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-brand-500)] text-white text-xs font-bold group-hover:bg-[var(--color-brand-600)] transition-colors">
            RSVP <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
