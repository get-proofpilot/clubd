"use client";

import BottomNav from "./BottomNav";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}

export default function MobileContainer({ children, className, hideNav }: MobileContainerProps) {
  return (
    <div className={`app-shell flex flex-col ${className ?? ""}`}>
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}
