"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Users, CircleUser, Bell } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  isFab?: boolean;
}

const navItems: NavItem[] = [
  { href: "/explore", label: "Home", icon: Home },
  { href: "/discover", label: "Explore", icon: Search },
  { href: "/host/create", label: "Create", icon: Plus, isFab: true },
  { href: "/activity", label: "Friends", icon: Users },
  { href: "/profile", label: "Profile", icon: CircleUser },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/explore") return pathname === "/explore" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Desktop Top Nav (hidden on mobile) ─────────────────── */}
      <nav className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="content-max flex items-center justify-between px-6 lg:px-8 h-16">
          {/* Logo */}
          <Link href="/explore" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <span className="font-display text-sm font-bold text-white">C</span>
            </div>
            <span className="font-display text-xl font-bold text-[var(--color-text-primary)]">Clubd</span>
          </Link>

          {/* Center Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.filter(i => !i.isFab).map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-brand-50)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2 : 1.6} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/host/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Event
            </Link>
            <Link
              href="/notifications"
              className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={18} strokeWidth={1.6} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav (hidden on desktop) ──────────────── */}
      <nav className="md:hidden sticky bottom-0 z-50 bg-white border-t border-gray-100 px-4 pt-2 pb-[max(env(safe-area-inset-bottom,8px),8px)]">
        <ul className="flex justify-around items-end">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            if (item.isFab) {
              return (
                <li key={item.href} className="relative -top-4 mx-1">
                  <Link
                    href={item.href}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 border-[3px] border-white hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-3 transition-colors group ${
                    active
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <div className="relative">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.2 : 1.6}
                      className="transition-transform group-hover:scale-105"
                    />
                    {active && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full" />
                    )}
                  </div>
                  <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
