import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
  description:
    "Create a new event on Clubd. Set up the details and publish to your community.",
  openGraph: {
    title: "Create Event | Clubd",
    description: "Create a new local event on Clubd.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
