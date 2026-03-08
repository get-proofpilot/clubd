import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Events",
  description:
    "Browse free local events happening near you in Southern California — fitness, social, outdoor, creative, and more.",
  openGraph: {
    title: "Explore Events | Clubd",
    description:
      "Browse free local events happening near you in SoCal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
