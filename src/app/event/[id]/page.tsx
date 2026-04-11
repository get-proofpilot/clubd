"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Ticket,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Droplets,
  Footprints,
  Wallet,
  Zap,
  BadgeCheck,
  Star,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getCategoryLabel,
} from "@/lib/utils";
import { trpcReact } from "@/lib/trpc";
import { authClient } from "@/lib/auth-client";
import RsvpButton from "@/components/RsvpButton";
import ShareButton from "@/components/event-detail/ShareButton";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();

  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const viewTracked = useRef(false);

  // ── Data Loading ──────────────────────────────────────────────────────────
  const { data, isLoading, error } = trpcReact.event.getById.useQuery({ id });

  const { data: attendeeData } = trpcReact.event.getAttendees.useQuery(
    { eventId: id, limit: 6 },
    { enabled: !!data?.event },
  );

  const trackViewMutation = trpcReact.event.trackView.useMutation();

  // ── View Tracking (once on mount) ─────────────────────────────────────────
  useEffect(() => {
    if (!data?.event || viewTracked.current) return;
    viewTracked.current = true;
    trackViewMutation.mutate({ eventId: id, viewType: "page_view" });
  }, [data?.event, id, trackViewMutation]);

  const handleShareTracked = useCallback(() => {
    trackViewMutation.mutate({ eventId: id, viewType: "share_click" });
  }, [id, trackViewMutation]);

  const handleSave = useCallback(() => {
    setIsSaved((prev) => !prev);
  }, []);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="app-shell flex flex-col min-h-screen">
        <div className="h-64 w-full animate-pulse bg-gray-200" />
        <div className="bg-white rounded-t-[24px] -mt-5 relative z-20 px-4 pt-5 pb-3 flex-1">
          <div className="h-7 w-3/4 animate-pulse rounded bg-gray-100 mb-4" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100 mb-3" />
          <div className="h-20 w-full animate-pulse rounded-2xl bg-gray-100 mb-3" />
          <div className="h-20 w-full animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (error || !data || !data.event) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">Event not found</p>
          <Link href="/explore" className="mt-3 inline-block text-sm font-semibold text-[var(--color-brand-600)] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const event = data.event;
  const host = data.host;

  // Hide draft/cancelled from non-hosts
  if (event.status !== "published" && event.hostId !== session?.user?.id) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">Event not found</p>
          <Link href="/explore" className="mt-3 inline-block text-sm font-semibold text-[var(--color-brand-600)] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived Data ──────────────────────────────────────────────────────────
  const coverImage = data.images?.[0]?.url ?? event.imageUrl ?? "";
  const rsvpCount = event.rsvpCount ?? 0;
  const capacity = event.capacity;
  const ticketTiers = data.ticketTiers ?? [];
  const lowestPrice = ticketTiers.length > 0 ? Math.min(...ticketTiers.map((t) => t.priceInCents)) : 0;
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://clubd.app/event/${id}`;

  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;
  const formattedDateFull = startsAt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  const timeRange = endsAt
    ? `${formatTime(startsAt)} - ${formatTime(endsAt)} PST`
    : `${formatTime(startsAt)} PST`;

  const attendees = attendeeData?.attendees ?? [];
  const totalAttendees = attendeeData?.total ?? rsvpCount;

  const priceDisplay = event.pricingType === "free" ? "Free" : ticketTiers.length > 0 ? `$${(lowestPrice / 100).toFixed(0)}` : "Paid";

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto pb-28 hide-scroll">
        {/* ── Cover Image + Floating Nav ────────────────────────── */}
        <section className="relative h-64 md:h-80 lg:h-96 w-full">
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="w-full h-full object-cover" src={coverImage} alt={event.title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Floating nav buttons */}
          <div className="absolute top-[max(env(safe-area-inset-top),12px)] left-4 right-4 z-10 flex justify-between items-center">
            <Link
              href="/explore"
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[var(--color-text-primary)] hover:bg-white transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[var(--color-text-primary)] hover:bg-white transition-colors"
              >
                <Bookmark size={16} strokeWidth={1.8} className={isSaved ? "fill-[var(--color-brand-500)] text-[var(--color-brand-500)]" : ""} />
              </button>
              <ShareButton title={event.title} url={shareUrl} onShareTracked={handleShareTracked} />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
            <span className="px-2.5 py-1 bg-[var(--color-brand-500)]/90 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider rounded-md">
              {getCategoryLabel(event.category)}
            </span>
          </div>
        </section>

        {/* ── Main Info ────────────────────────────────────────── */}
        <section className="bg-white rounded-t-[24px] md:rounded-none -mt-5 md:mt-0 relative z-20">
          <div className="content-max px-4 md:px-6 lg:px-8 pt-5 md:pt-8 pb-3">
          <h1 className="font-display font-bold text-xl md:text-3xl text-[var(--color-text-primary)] leading-tight mb-2 md:mb-3">
            {event.title}
          </h1>

          {/* Host Row */}
          {host && (
            <div className="flex items-center justify-between mb-4">
              <Link href={`/host/${host.id}`} className="flex items-center gap-2">
                {host.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={host.image} alt={host.displayName ?? host.name} className="w-10 h-10 rounded-full border-2 border-[var(--color-brand-100)] object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-100)] flex items-center justify-center text-[var(--color-brand-600)] font-bold">
                    {(host.displayName ?? host.name).charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                    Hosted by {host.displayName ?? host.name}
                    <BadgeCheck size={14} className="text-[var(--color-brand-500)]" />
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-[var(--color-text-primary)]">4.9</span> ({host.eventCount} events)
                  </div>
                </div>
              </Link>
              <button className="px-4 py-1.5 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] text-xs font-semibold hover:bg-[var(--color-brand-100)] transition-colors">
                Follow
              </button>
            </div>
          )}

          {/* Info Cards */}
          <div className="md:grid md:grid-cols-2 md:gap-4 mb-4">
          {/* Date & Time Card */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-gray-100 mb-2.5 md:mb-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1">{formattedDateFull}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{timeRange}</p>
              <button className="text-xs font-semibold text-[var(--color-brand-600)] mt-2 flex items-center gap-1">
                Add to Calendar <ChevronRight size={10} />
              </button>
            </div>
          </div>

          {/* Location Card */}
          {(event.locationName || event.address) && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-gray-100 mb-2.5 md:mb-0">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                {event.locationName && (
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1">{event.locationName}</h3>
                )}
                {event.address && (
                  <p className="text-xs text-[var(--color-text-secondary)]">{event.address}</p>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Price + Capacity */}
          <div className="flex gap-2.5 mb-4">
            <div className="flex-1 p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
              <Ticket size={18} className="text-[var(--color-brand-500)]" />
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Price</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{priceDisplay}</p>
              </div>
            </div>
            <div className="flex-1 p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
              <Users size={18} className="text-[var(--color-brand-500)]" />
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Capacity</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {capacity ? `${rsvpCount} / ${capacity} spots` : `${rsvpCount} going`}
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        <div className="h-px w-full bg-gray-100" />

        {/* ── Who's Going ──────────────────────────────────────── */}
        <section className="px-4 py-5 bg-white md:py-8">
          <div className="content-max md:px-6 lg:px-8">
          <h2 className="font-display font-bold text-lg md:text-xl text-[var(--color-text-primary)] mb-4">Who&apos;s Going</h2>

          {totalAttendees > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-brand-100)]/50 border border-[var(--color-brand-100)] mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {attendees.slice(0, 3).map((att) => (
                      att.userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={att.userId} src={att.userImage} alt={att.userDisplayName ?? att.userName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      ) : (
                        <div key={att.userId} className="w-10 h-10 rounded-full border-2 border-white bg-[var(--color-brand-200)] flex items-center justify-center text-xs font-bold text-[var(--color-brand-700)]">
                          {(att.userDisplayName ?? att.userName).charAt(0)}
                        </div>
                      )
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{totalAttendees} going</p>
                    {attendees.length > 0 && (
                      <p className="text-xs text-[var(--color-brand-700)]">
                        {attendees.slice(0, 3).map((a) => a.userDisplayName ?? a.userName).join(", ")}
                        {totalAttendees > 3 ? ` and ${totalAttendees - 3} others` : ""}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--color-brand-400)]" />
              </div>
            </div>
          )}

          {/* Attendee Preview Row */}
          {attendees.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">All Attendees ({totalAttendees})</p>
                <button className="text-xs font-semibold text-[var(--color-brand-600)]">See All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scroll pb-2">
                {attendees.map((att) => (
                  <div key={att.userId} className="flex flex-col items-center gap-1 shrink-0">
                    {att.userImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={att.userImage} alt={att.userDisplayName ?? att.userName} className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-subtle)] border border-gray-200 flex items-center justify-center text-sm font-bold text-[var(--color-text-secondary)]">
                        {(att.userDisplayName ?? att.userName).charAt(0)}
                      </div>
                    )}
                    <span className="text-[10px] font-medium text-[var(--color-text-primary)]">
                      {(att.userDisplayName ?? att.userName).split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </section>

        <div className="h-px w-full bg-gray-100" />

        {/* ── Description ──────────────────────────────────────── */}
        {event.description && (
          <>
            <section className="px-4 py-5 bg-white md:py-8">
              <div className="content-max md:px-6 lg:px-8 max-w-3xl">
              <h2 className="font-display font-bold text-lg md:text-xl text-[var(--color-text-primary)] mb-3">About this event</h2>
              <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
                <p>{showFullDescription ? event.description : event.description.slice(0, 200)}</p>
              </div>
              {event.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm font-semibold text-[var(--color-brand-600)] mt-2"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
              </div>
            </section>
            <div className="h-px w-full bg-gray-100" />
          </>
        )}

        {/* ── Announcements ────────────────────────────────────── */}
        {data.announcements && data.announcements.length > 0 && (
          <>
            <section className="px-4 py-5 bg-white">
              <h2 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-4">Updates</h2>
              {data.announcements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-gray-100 mb-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {a.authorDisplayName ?? a.authorName}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{a.message}</p>
                </div>
              ))}
            </section>
            <div className="h-px w-full bg-gray-100" />
          </>
        )}

        {/* ── Host Policies ────────────────────────────────────── */}
        <section className="px-4 py-5 bg-white space-y-6 md:py-8">
          <div className="content-max md:px-6 lg:px-8 max-w-3xl">
            <h2 className="font-display font-bold text-lg md:text-xl text-[var(--color-text-primary)] mb-4">Host Policies</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-gray-100 flex gap-3">
                <ShieldCheck size={18} className="text-[var(--color-brand-500)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Community Guidelines</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">This host enforces Clubd&apos;s standard community guidelines for safe and respectful events.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-gray-100 flex gap-3">
                <MessageCircle size={18} className="text-[var(--color-brand-500)] mt-0.5 shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Questions?</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">Message the host directly.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[var(--color-text-primary)] hover:bg-white transition-colors">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-4" />
      </main>

      {/* ── Sticky Bottom Actions ──────────────────────────────── */}
      <RsvpButton
        eventId={event.id}
        pricingType={event.pricingType as "free" | "free_with_upsell" | "paid"}
        userRsvpStatus={data.userRsvp?.status as "going" | "interested" | "attended" | "cancelled" | undefined}
        isAuthenticated={!!session?.user}
        isSaved={isSaved}
        onSaveToggle={handleSave}
      />
    </div>
  );
}
