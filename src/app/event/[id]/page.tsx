"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import {
  formatDate,
  formatTime,
  getCategoryLabel,
  getCategoryColor,
} from "@/lib/utils";
import { trpcReact } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";
import RsvpButton from "@/components/RsvpButton";
import EventGallery from "@/components/event-detail/EventGallery";
import StaticMapCard from "@/components/event-detail/StaticMapCard";
import HostInfoCard from "@/components/event-detail/HostInfoCard";
import AnnouncementList from "@/components/event-detail/AnnouncementList";
import ShareButton from "@/components/event-detail/ShareButton";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();

  const [isSaved, setIsSaved] = useState(false);
  const viewTracked = useRef(false);

  // ── Data Loading ──────────────────────────────────────────────────────────
  const { data, isLoading, error } = trpcReact.event.getById.useQuery({ id });

  const { data: attendeeData } = trpcReact.event.getAttendees.useQuery(
    { eventId: id, limit: 3 },
    { enabled: !!data?.event },
  );

  const trackViewMutation = trpcReact.event.trackView.useMutation();

  // ── View Tracking (once on mount) ─────────────────────────────────────────
  useEffect(() => {
    if (!data?.event || viewTracked.current) return;
    viewTracked.current = true;
    trackViewMutation.mutate({ eventId: id, viewType: "page_view" });
  }, [data?.event, id, trackViewMutation]);

  // ── Share Tracking ────────────────────────────────────────────────────────
  const handleShareTracked = useCallback(() => {
    trackViewMutation.mutate({ eventId: id, viewType: "share_click" });
  }, [id, trackViewMutation]);

  const handleSave = useCallback(() => {
    setIsSaved((prev) => !prev);
  }, []);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pb-28">
        <div className="relative mx-auto max-w-4xl overflow-hidden sm:mt-4 sm:rounded-2xl">
          <div className="h-72 w-full animate-pulse bg-[var(--color-surface-subtle)] sm:h-96" />
        </div>
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="mt-5 h-8 w-3/4 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          <div className="mt-4 h-40 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]" />
          <div className="mt-7 h-20 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]" />
        </div>
      </div>
    );
  }

  // ── Not Found or Access Control ───────────────────────────────────────────
  if (error || !data || !data.event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center animate-fade-up">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Event not found
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const event = data.event;
  const host = data.host;

  // Hide draft/cancelled events from non-hosts
  if (
    event.status !== "published" &&
    event.hostId !== session?.user?.id
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center animate-fade-up">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Event not found
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived Data ──────────────────────────────────────────────────────────
  const images = data.images ?? [];
  const galleryImages =
    images.length > 0
      ? images
      : event.imageUrl
        ? [{ url: event.imageUrl, sortOrder: 0 }]
        : [];

  const rsvpCount = event.rsvpCount ?? 0;
  const capacity = event.capacity;
  const capacityPercent =
    capacity && capacity > 0 ? Math.round((rsvpCount / capacity) * 100) : 0;

  const ticketTiers = data.ticketTiers ?? [];
  const lowestPrice =
    ticketTiers.length > 0
      ? Math.min(...ticketTiers.map((t) => t.priceInCents))
      : 0;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://clubd.app/event/${id}`;

  // Format date/time from startsAt
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;

  const formattedDate = formatDate(startsAt);
  const formattedTime = formatTime(startsAt);

  // Format time range
  let timeDisplay = `${formattedDate} \u00B7 ${formattedTime}`;
  if (endsAt) {
    const sameDay = startsAt.toDateString() === endsAt.toDateString();
    if (sameDay) {
      timeDisplay = `${formattedDate} \u00B7 ${formattedTime} - ${formatTime(endsAt)}`;
    } else {
      timeDisplay = `${formattedDate}, ${formattedTime} - ${formatDate(endsAt)}, ${formatTime(endsAt)}`;
    }
  }

  // Recurring indicator
  const isRecurring = !!event.templateEventId;

  // Attendee preview
  const attendees = attendeeData?.attendees ?? [];
  const totalAttendees = attendeeData?.total ?? rsvpCount;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* -- Hero / Gallery ------------------------------------------------ */}
      <div className="relative mx-auto max-w-4xl overflow-hidden sm:mt-4 sm:rounded-2xl">
        <EventGallery images={galleryImages} title={event.title} />

        {/* Back button */}
        <Link
          href="/"
          className="absolute left-4 top-[max(env(safe-area-inset-top),16px)] z-10 flex h-10 w-10 items-center justify-center rounded-full glass-dark border border-white/10"
        >
          <ArrowLeft className="h-5 w-5 text-white" strokeWidth={1.8} />
        </Link>

        {/* Share button */}
        <ShareButton
          title={event.title}
          url={shareUrl}
          onShareTracked={handleShareTracked}
        />

        {/* Category badge */}
        <span
          className={`absolute bottom-4 left-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase ${getCategoryColor(event.category)}`}
          style={{ boxShadow: "var(--shadow-pill)" }}
        >
          {getCategoryLabel(event.category)}
        </span>
      </div>

      {/* -- Content ------------------------------------------------------- */}
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        {/* Title + pricing badge */}
        <div className="mt-5 flex items-start justify-between gap-3 animate-fade-up">
          <h1 className="font-display text-[26px] font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
            {event.title}
          </h1>
          {event.pricingType === "free" && (
            <span
              className="mt-1 shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: "var(--color-success-muted)",
                color: "var(--color-success)",
              }}
            >
              Free
            </span>
          )}
          {event.pricingType === "paid" && ticketTiers.length > 0 && (
            <span
              className="mt-1 shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: "var(--color-primary-muted)",
                color: "var(--color-primary)",
              }}
            >
              From ${(lowestPrice / 100).toFixed(0)}
            </span>
          )}
        </div>

        {/* Date / Time */}
        <div
          className="animate-fade-up mt-4 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          <Calendar
            className="h-4 w-4 text-[var(--color-primary)]"
            strokeWidth={1.8}
          />
          <span className="font-medium">{timeDisplay}</span>
          {isRecurring && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: "var(--color-primary-muted)",
                color: "var(--color-primary)",
              }}
            >
              Recurring
            </span>
          )}
        </div>

        {/* Location */}
        {(event.locationName || event.address) && (
          <div
            className="animate-fade-up mt-3 flex items-start gap-3 text-sm text-[var(--color-text-secondary)]"
            style={{ "--stagger": 2 } as React.CSSProperties}
          >
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
              strokeWidth={1.8}
            />
            <div>
              {event.locationName && (
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {event.locationName}
                </p>
              )}
              {event.address && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  {event.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Static Map */}
        {event.locationLat && event.locationLng && event.address && (
          <StaticMapCard
            lat={event.locationLat}
            lng={event.locationLng}
            address={event.address}
            locationName={event.locationName ?? undefined}
          />
        )}

        {/* Announcements */}
        {data.announcements && data.announcements.length > 0 && (
          <div className="mt-7">
            <AnnouncementList announcements={data.announcements} />
          </div>
        )}

        {/* About */}
        {event.description && (
          <div
            className="animate-fade-up mt-7"
            style={{ "--stagger": 3 } as React.CSSProperties}
          >
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
              About
            </h2>
            <p className="mt-2.5 text-[14px] leading-[1.7] text-[var(--color-text-secondary)]">
              {event.description}
            </p>
          </div>
        )}

        {/* Who's Going */}
        <div
          className="animate-fade-up mt-7"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
            Who&apos;s Going
          </h2>

          {/* Attendee avatar preview */}
          {attendees.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {attendees.map((att) => (
                  <div key={att.userId} className="relative">
                    {att.userImage ? (
                      <img
                        src={att.userImage}
                        alt={att.userDisplayName || att.userName}
                        className="h-8 w-8 rounded-full bg-[var(--color-surface-subtle)] object-cover ring-2 ring-[var(--color-bg)]"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] ring-2 ring-[var(--color-bg)]">
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                          {(att.userDisplayName || att.userName)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {totalAttendees > 3 && (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  and {totalAttendees - attendees.length} others
                </span>
              )}
            </div>
          )}

          {/* Capacity bar */}
          {capacity && capacity > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <Users className="h-4 w-4" strokeWidth={1.8} />
                  <span className="font-medium">
                    {rsvpCount}/{capacity} spots filled
                  </span>
                </div>
                <span className="text-xs font-bold text-[var(--color-text-muted)]">
                  {capacityPercent}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* No capacity set -- just show count */}
          {(!capacity || capacity <= 0) && rsvpCount > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Users className="h-4 w-4" strokeWidth={1.8} />
              <span className="font-medium">
                {rsvpCount} {rsvpCount === 1 ? "person" : "people"} going
              </span>
            </div>
          )}
        </div>

        {/* Host Info Card */}
        {host && (
          <div
            className="mt-7"
            style={{ "--stagger": 5 } as React.CSSProperties}
          >
            <HostInfoCard
              hostId={host.id}
              hostName={host.name}
              hostDisplayName={host.displayName}
              hostImage={host.image}
              hostBio={host.bio}
              eventCount={host.eventCount}
            />
          </div>
        )}
      </div>

      {/* -- Fixed Bottom Bar ---------------------------------------------- */}
      <RsvpButton
        eventId={event.id}
        pricingType={event.pricingType as "free" | "free_with_upsell" | "paid"}
        userRsvpStatus={
          data.userRsvp?.status as
            | "going"
            | "interested"
            | "attended"
            | "cancelled"
            | undefined
        }
        isAuthenticated={!!session?.user}
        isSaved={isSaved}
        onSaveToggle={handleSave}
      />
    </div>
  );
}
