import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Host Profile",
  description:
    "Set up your host profile on Clubd to start creating and promoting free local events.",
  openGraph: {
    title: "Create a Host Profile | Clubd",
    description: "Start hosting free local events on Clubd.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
