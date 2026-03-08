"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, CalendarDays, Map, User, Flame } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/discover", label: "Discover", icon: Map },
  { href: "/activity", label: "Activity", icon: Flame },
  { href: "/events", label: "My Events", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-white border-t border-[var(--color-border-subtle)] pb-safe">
      <div className="mx-auto flex max-w-5xl items-center justify-around px-2 pt-2 pb-1 sm:justify-center sm:gap-12">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="tap-target relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 sm:flex-row sm:gap-2"
            >
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-[var(--color-primary)]" />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.6}
                className={`transition-colors duration-200 ${
                  active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 sm:text-xs ${
                  active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
