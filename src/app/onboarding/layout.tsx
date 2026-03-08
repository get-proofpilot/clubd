import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Set up your Clubd profile — pick your interests, find friends, and start discovering events.",
  openGraph: {
    title: "Get Started | Clubd",
    description: "Set up your profile and start discovering events.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
