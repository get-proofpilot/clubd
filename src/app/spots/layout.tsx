import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popular Spots",
  description:
    "Discover top-rated venues and popular spots for events across Southern California.",
  openGraph: {
    title: "Popular Spots | Clubd",
    description:
      "Top-rated venues and popular event spots in SoCal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
