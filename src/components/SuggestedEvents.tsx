"use client";

import Link from "next/link";
import type { Event } from "@/lib/types";

interface SuggestedEventsProps {
  title: string;
  events: Event[];
}

export default function SuggestedEvents({ title, events }: SuggestedEventsProps) {
  const visibleEvents = events.slice(0, 6);

  return (
    <section className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
          {title}
        </h2>
        <Link
          href="#"
          className="text-sm font-medium text-[var(--color-primary)]"
        >
          See all
        </Link>
      </div>

      {/* Horizontal scroll container */}
      <div
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4"
        style={{ flexWrap: "nowrap" }}
      >
        {visibleEvents.map((event) => {
          const formattedDate = new Date(event.date).toLocaleDateString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
            }
          );

          return (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="w-[200px] shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-card)] card-shadow border border-[var(--color-border-subtle)] transition-lift"
            >
              {/* Square cover image */}
              <div className="relative aspect-square w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Card content */}
              <div className="flex flex-col gap-1 p-3">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {event.location.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {formattedDate} &middot; {event.time}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
