"use client";

import Link from "next/link";
import { users } from "@/lib/mock-data";

export default function FriendsRow() {
  return (
    <div
      className="scrollbar-hide flex gap-4 overflow-x-auto px-4"
      style={{ flexWrap: "nowrap" }}
    >
      {users.map((user, i) => {
        const firstName = user.name.split(" ")[0];
        const isActive = i < 3;

        return (
          <Link
            key={user.id}
            href="#"
            className="btn-press flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={`h-16 w-16 overflow-hidden rounded-full bg-[var(--color-surface-subtle)] ${
                isActive
                  ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]"
                  : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="max-w-[64px] truncate text-xs text-[var(--color-text-secondary)]">
              {firstName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
