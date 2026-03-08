import type { Metadata, Viewport } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clubd - Find Your People",
  description:
    "Discover free local events, connect with friends, and find your next favorite thing to do in Southern California.",
  openGraph: {
    title: "Clubd - Find Your People",
    description:
      "Discover free local events, connect with friends, and find your next favorite thing to do.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F4EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
