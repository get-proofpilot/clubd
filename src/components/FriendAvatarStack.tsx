"use client";

import type { User } from "@/lib/types";

interface FriendAvatarStackProps {
  users: User[];
  label: "going" | "interested";
  maxShow?: number;
  size?: "sm" | "lg";
}

export default function FriendAvatarStack({
  users,
  label,
  maxShow = 3,
  size = "sm",
}: FriendAvatarStackProps) {
  if (users.length === 0) return null;

  const visible = users.slice(0, maxShow);
  const remaining = users.length - maxShow;

  const avatarSize = size === "sm" ? "w-6 h-6" : "w-9 h-9";
  const overlap = size === "sm" ? "-ml-2" : "-ml-3";
  const borderWidth = size === "sm" ? "border-[1.5px]" : "border-2";
  const remainingSize = size === "sm" ? "w-6 h-6 text-[9px]" : "w-9 h-9 text-xs";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const friendNames = users.slice(0, 2).map((u) => u.name.split(" ")[0]);
  let friendText: string;

  if (users.length === 1) {
    friendText = `${friendNames[0]} is ${label}`;
  } else if (users.length === 2) {
    friendText = `${friendNames[0]}, ${friendNames[1]} are ${label}`;
  } else {
    friendText = `${friendNames[0]}, ${friendNames[1]} +${users.length - 2} more are ${label}`;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {visible.map((user, i) => (
          <div
            key={user.id}
            className={`relative ${avatarSize} shrink-0 overflow-hidden rounded-full ${borderWidth} border-[var(--color-card)] bg-[var(--color-surface-subtle)] ${
              i > 0 ? overlap : ""
            }`}
            style={{ zIndex: maxShow - i }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {remaining > 0 && (
          <div
            className={`relative ${remainingSize} ${overlap} flex shrink-0 items-center justify-center rounded-full ${borderWidth} border-[var(--color-card)] bg-[var(--color-surface-subtle)] font-semibold text-[var(--color-text-secondary)]`}
            style={{ zIndex: 0 }}
          >
            +{remaining}
          </div>
        )}
      </div>
      <span className={`${textSize} text-[var(--color-text-secondary)] leading-tight`}>
        {friendText}
      </span>
    </div>
  );
}
