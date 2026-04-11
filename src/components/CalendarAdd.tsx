'use client';

import { Calendar, Download } from 'lucide-react';

interface CalendarAddProps {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
}

function toICSDate(dateStr: string): string {
  return new Date(dateStr)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export default function CalendarAdd({
  title,
  description,
  location,
  startDate,
  endDate,
}: CalendarAddProps) {
  const end = endDate || new Date(new Date(startDate).getTime() + 2 * 60 * 60 * 1000).toISOString();

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${toICSDate(startDate)}/${toICSDate(end)}`;

  const handleIcsDownload = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${toICSDate(startDate)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-press flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] bg-[var(--color-card)] py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]"
      >
        <Calendar className="h-4 w-4" />
        Google Calendar
      </a>
      <button
        onClick={handleIcsDownload}
        className="btn-press flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] bg-[var(--color-card)] py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]"
      >
        <Download className="h-4 w-4" />
        Download .ics
      </button>
    </div>
  );
}
