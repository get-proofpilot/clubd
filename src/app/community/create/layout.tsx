import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Community",
  description:
    "Create a new community, studio, or brand profile on Clubd.",
  openGraph: {
    title: "Create Community | Clubd",
    description: "Create a new community profile on Clubd.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
