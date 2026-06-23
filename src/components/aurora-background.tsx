"use client";

// Light-mode only: animated aurora gradient blobs (fixed full-page)
// Hidden in dark mode via `dark:opacity-0`

export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:opacity-0 transition-opacity duration-700"
    >
      {/* Blob 1 — top-left, indigo */}
      <div
        className="absolute rounded-full"
        style={{
          width: "70vw",
          height: "70vw",
          top: "-25%",
          left: "-20%",
          background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 68%)",
          filter: "blur(48px)",
          animation: "aurora-1 14s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 2 — top-right, violet */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-15%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 68%)",
          filter: "blur(55px)",
          animation: "aurora-2 17s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 3 — center, sky blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "50vw",
          top: "25%",
          left: "25%",
          background: "radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 65%)",
          filter: "blur(64px)",
          animation: "aurora-3 20s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 4 — bottom-left, rose */}
      <div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          bottom: "-25%",
          left: "-5%",
          background: "radial-gradient(circle, rgba(244,114,182,0.13) 0%, transparent 65%)",
          filter: "blur(72px)",
          animation: "aurora-4 22s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 5 — bottom-right, teal */}
      <div
        className="absolute rounded-full"
        style={{
          width: "48vw",
          height: "48vw",
          bottom: "-15%",
          right: "-8%",
          background: "radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 65%)",
          filter: "blur(58px)",
          animation: "aurora-5 16s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 6 — mid-right, amber accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: "35vw",
          height: "35vw",
          top: "50%",
          right: "5%",
          background: "radial-gradient(circle, rgba(251,191,36,0.09) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "aurora-6 19s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
