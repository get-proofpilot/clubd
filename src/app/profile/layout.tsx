import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Your Clubd profile — event stats, badges, interests, and social connections.",
  openGraph: {
    title: "Profile | Clubd",
    description: "Your Clubd profile and event stats.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
