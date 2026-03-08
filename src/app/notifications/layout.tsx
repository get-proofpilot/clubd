import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Stay updated on friend activity, event reminders, and community highlights.",
  openGraph: {
    title: "Notifications | Clubd",
    description: "Your latest Clubd notifications.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
