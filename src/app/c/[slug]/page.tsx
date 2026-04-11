import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq, and, gte } from "drizzle-orm";
import { db } from "@/server/db";
import { communities, events, eventTickets, eventImages } from "@/server/db/schema";
import CommunityLanding from "./CommunityLanding";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCommunityData(slug: string) {
  const community = await db.query.communities.findFirst({
    where: eq(communities.slug, slug),
  });

  if (!community) return null;

  const now = new Date();
  const communityEvents = await db.query.events.findMany({
    where: and(
      eq(events.communityId, community.id),
      eq(events.status, "published"),
      gte(events.startsAt, now),
    ),
    orderBy: [events.startsAt],
  });

  return { community, events: communityEvents };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCommunityData(slug);

  if (!data) {
    return { title: "Not Found | clubd" };
  }

  const { community } = data;
  const title = `${community.name} | clubd`;
  const description =
    community.description ??
    `${community.name} on clubd — discover events and RSVP`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: community.coverImageUrl ? [community.coverImageUrl] : [],
      siteName: "clubd",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCommunityData(slug);

  if (!data) {
    notFound();
  }

  return (
    <CommunityLanding
      community={data.community}
      events={data.events}
    />
  );
}
