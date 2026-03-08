import Link from "next/link";

interface TimeSectionProps {
  title: string;
  eventCount?: number;
  showSeeAll?: boolean;
  seeAllHref?: string;
  children?: React.ReactNode;
}

export default function TimeSection({
  title,
  eventCount,
  showSeeAll = false,
  seeAllHref = "#",
  children,
}: TimeSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="animate-slide-right flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
          {eventCount !== undefined && (
            <span className="text-[13px] font-medium text-[var(--color-text-muted)]">
              {eventCount} {eventCount === 1 ? "event" : "events"}
            </span>
          )}
        </div>
        {showSeeAll && (
          <Link
            href={seeAllHref}
            className="shrink-0 text-[13px] font-bold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)]"
          >
            See all
          </Link>
        )}
      </div>
      <div className="h-px bg-[var(--color-border-subtle)]" />
      {children && <div className="flex flex-col gap-4">{children}</div>}
    </section>
  );
}
