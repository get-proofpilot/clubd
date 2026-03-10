import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host Dashboard",
  description:
    "Manage your events on Clubd. Create, publish, and track your local events.",
  openGraph: {
    title: "Host Dashboard | Clubd",
    description: "Manage your events on Clubd.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
