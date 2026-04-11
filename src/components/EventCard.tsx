"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import FriendAvatarStack from "./FriendAvatarStack";

interface EventCardProps {
  event: Event;
  index?: number;
}

const categoryLabels: Record<EventCategory, string> = {
  fitness: "Fitness",
  wellness: "Wellness",
  social: "Social",
  outdoor: "Outdoor",
  "food-drink": "Food & Drink",
  creative: "Creative",
  family: "Family",
  community: "Community",
};

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const {
    id,
    title,
    date,
    time,
    location,
    category,
    attendeeCount,
    interestedCount,
    coverImage,
    host,
    friendsGoing,
  } = event;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/event/${id}`}
      className="animate-fade-up group block overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-card)] card-shadow transition-lift border border-[var(--color-border-subtle)]"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="gradient-overlay-top absolute inset-0 pointer-events-none" />
        <div className="gradient-overlay-bottom absolute inset-0 pointer-events-none" />

        {/* Category badge */}
        <span
          className={`badge-${category} absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase`}
          style={{ boxShadow: "var(--shadow-pill)" }}
        >
          {categoryLabels[category]}
        </span>

        {/* Price badge */}
        {event.pricingType === 'paid' && event.ticketTiers && event.ticketTiers.length > 0 && (
          <span
            className="absolute top-3.5 right-3.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--color-text-primary)] uppercase backdrop-blur-sm"
            style={{ boxShadow: "var(--shadow-pill)" }}
          >
            From ${(Math.min(...event.ticketTiers.map((t) => t.priceInCents)) / 100).toFixed(0)}
          </span>
        )}
        {event.pricingType === 'free' && (
          <span
            className="absolute top-3.5 right-3.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
            style={{ backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)', boxShadow: "var(--shadow-pill)" }}
          >
            Free
          </span>
        )}

        {/* Title + date overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-[19px] font-bold leading-snug text-white drop-shadow-sm line-clamp-2">
            {title}
          </h3>
          <p className="mt-1.5 text-[13px] font-medium text-white/75 tracking-wide">
            {formattedDate} &middot; {time}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 px-4 pt-3.5 pb-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
          <MapPin size={14} strokeWidth={1.8} className="shrink-0 text-[var(--color-text-muted)]" />
          <span className="truncate text-[13px]">{location.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[13px] text-[var(--color-text-secondary)]">
          <span>
            <span className="font-semibold text-[var(--color-text-primary)]">{attendeeCount}</span> going
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
          <span>
            <span className="font-semibold text-[var(--color-text-primary)]">{interestedCount}</span> interested
          </span>
        </div>

        {/* Friends going */}
        {friendsGoing.length > 0 && (
          <FriendAvatarStack users={friendsGoing} label="going" maxShow={3} size="sm" />
        )}

        {/* Host */}
        <div className="flex items-center gap-2 border-t border-[var(--color-border-subtle)] pt-3">
          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={host.avatar}
              alt={host.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="truncate text-xs font-medium text-[var(--color-text-secondary)]">
            Hosted by {host.name}
          </span>
          {host.verified && (
            <BadgeCheck size={14} className="shrink-0 text-[var(--color-primary)]" />
          )}
        </div>
      </div>
    </Link>
  );
}
