import type { Metadata } from "next";
import { events } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = events.find((e) => e.id === id);

  if (!event) {
    return { title: "Event Not Found" };
  }

  const description = `${event.title} — ${event.date} at ${event.location.name}. ${event.attendeeCount} going, ${event.interestedCount} interested. Free event on Clubd.`;

  return {
    title: event.title,
    description,
    openGraph: {
      title: `${event.title} | Clubd`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | Clubd`,
      description,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
