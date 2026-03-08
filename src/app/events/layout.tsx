import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events",
  description:
    "Manage your upcoming events, past experiences, and saved events — all in one place.",
  openGraph: {
    title: "My Events | Clubd",
    description: "Your upcoming, past, and saved events on Clubd.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
