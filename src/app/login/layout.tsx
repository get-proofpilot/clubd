import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Sign in to Clubd to discover free local events and see what friends are up to.",
  openGraph: {
    title: "Log In | Clubd",
    description: "Sign in to discover free local events near you.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
