import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Events on the Map",
  description:
    "Explore free local events on an interactive map of Orange County and Los Angeles. Filter by category and find things to do near you.",
  openGraph: {
    title: "Discover Events on the Map | Clubd",
    description:
      "Explore free local events on an interactive map of SoCal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
