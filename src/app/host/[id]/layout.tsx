import type { Metadata } from "next";
import { hosts, events } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const host = hosts.find((h) => h.id === id);

  if (!host) {
    return { title: "Host Not Found" };
  }

  const hostEvents = events.filter((e) => e.host.id === id);
  const description = `${host.name} — ${host.type} host on Clubd with ${hostEvents.length} events and ${host.followerCount} followers.`;

  return {
    title: host.name,
    description,
    openGraph: {
      title: `${host.name} | Clubd`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${host.name} | Clubd`,
      description,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
