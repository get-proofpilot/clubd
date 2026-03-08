import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Feed",
  description:
    "See what friends are doing — RSVPs, reviews, milestones, and trending events in your Southern California community.",
  openGraph: {
    title: "Activity Feed | Clubd",
    description:
      "See what friends are doing — RSVPs, reviews, and trending events near you.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
