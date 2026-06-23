"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function sendTrack(data: Record<string, string>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

export function VisitTracker() {
  const pathname = usePathname();
  const tracked = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (tracked.current.has(pathname)) return;
    tracked.current.add(pathname);
    sendTrack({ page: pathname });
  }, [pathname]);

  return null;
}

// Call this from onClick handlers on important buttons
export function trackClick(event: string, page = "/") {
  sendTrack({ page, event });
}
