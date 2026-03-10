'use client';

import { Eye, Users, Share2, TrendingUp, Loader2 } from 'lucide-react';
import { trpcReact } from '@/lib/trpc';

interface EventStatsProps {
  eventId: string;
}

export default function EventStats({ eventId }: EventStatsProps) {
  const { data, isLoading } = trpcReact.host.eventAnalytics.useQuery({
    eventId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

  const pageViews = data?.pageViews ?? 0;
  const rsvpCount = data?.rsvpCount ?? 0;
  const shareClicks = data?.shareClicks ?? 0;
  const conversionRate = data?.conversionRate ?? 0;
  const conversionDisplay =
    pageViews > 0 ? `${conversionRate.toFixed(1)}%` : '- -';

  const stats = [
    {
      label: 'Page Views',
      value: pageViews.toLocaleString(),
      icon: <Eye className="h-4 w-4" strokeWidth={1.8} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'RSVPs',
      value: rsvpCount.toLocaleString(),
      icon: <Users className="h-4 w-4" strokeWidth={1.8} />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Shares',
      value: shareClicks.toLocaleString(),
      icon: <Share2 className="h-4 w-4" strokeWidth={1.8} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Conversion',
      value: conversionDisplay,
      icon: <TrendingUp className="h-4 w-4" strokeWidth={1.8} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-card)] p-3.5"
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}
            >
              {stat.icon}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {stat.label}
            </span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-[var(--color-text-primary)]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
