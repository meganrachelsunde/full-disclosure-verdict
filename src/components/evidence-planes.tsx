"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

type Status = "supported" | "contradicted" | "incomplete" | "unresolved";

type Plane = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  z: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
  scrollRate: number;
  detail: {
    record: string;
    source: string;
    chronologyPosition: string;
    status: Status;
  };
};

const STATUS_LABEL: Record<Status, string> = {
  supported: "Supported",
  contradicted: "Contradicted",
  incomplete: "Incomplete",
  unresolved: "Unresolved",
};

const STATUS_ORDER: Status[] = [
  "supported",
  "contradicted",
  "incomplete",
  "unresolved",
];

// Arranged as a single ascending staircase — bottom-left (raw intake) to
// top-right (verified, source-linked fact) — rather than a tilted cascade.
// No rotation on any plane: elevation comes from position, translateZ,
// scale, and opacity, not from angling the cards. Contradictions and
// omissions sit on the middle steps and go no higher — they hold at a
// plateau rather than reaching the summit, since they haven't been
// resolved into a verified fact.
const PLANES: Plane[] = [
  {
    id: "source-records",
    label: "Source Records",
    sub: "28 documents",
    x: -26,
    y: 36,
    z: 0,
    rotate: 0,
    scale: 0.86,
    opacity: 0.76,
    zIndex: 10,
    scrollRate: 4,
    detail: {
      record:
        "28 source documents logged on intake — origin and page count recorded for each.",
      source: "Docs 001–028, full production",
      chronologyPosition: "Precedes chronology — raw intake",
      status: "supported",
    },
  },
  {
    id: "contradictions",
    label: "Contradictions",
    sub: "2 unresolved",
    x: -13,
    y: 16,
    z: 28,
    rotate: 0,
    scale: 0.92,
    opacity: 0.83,
    zIndex: 20,
    scrollRate: 7,
    detail: {
      record:
        "A restorative entry lists tooth #19; the prior chart entry lists tooth #18.",
      source: "Doc 007, p.3 vs. Doc 003, p.2",
      chronologyPosition: "January 2022",
      status: "contradicted",
    },
  },
  {
    id: "omissions",
    label: "Omissions",
    sub: "1 flagged gap",
    x: 0,
    y: -4,
    z: 56,
    rotate: 0,
    scale: 0.98,
    opacity: 0.9,
    zIndex: 32,
    scrollRate: 9,
    detail: {
      record: "No record of the scheduled six-month recall visit.",
      source: "Expected — not found in production",
      chronologyPosition: "September 2021 (expected)",
      status: "incomplete",
    },
  },
  {
    id: "chronology",
    label: "Chronology",
    sub: "Reconstructed timeline",
    x: 13,
    y: -24,
    z: 80,
    rotate: 0,
    scale: 1.05,
    opacity: 0.97,
    zIndex: 45,
    scrollRate: 12,
    detail: {
      record:
        "Every entry sequenced into a single timeline, each one linked back to its source page.",
      source: "Compiled from Docs 001–028",
      chronologyPosition: "Full timeline — March 2021 to June 2022",
      status: "supported",
    },
  },
  {
    id: "verified-facts",
    label: "Verified Facts",
    sub: "Source-linked",
    x: 26,
    y: -42,
    z: 100,
    rotate: 0,
    scale: 1.12,
    opacity: 1,
    zIndex: 58,
    scrollRate: 15,
    detail: {
      record:
        "Initial exam and radiograph findings, cross-referenced across two documents.",
      source: "Docs 003–004, cross-referenced",
      chronologyPosition: "March 2021 — first entry",
      status: "supported",
    },
  },
];

export function EvidencePlanes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const planeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  const pinnedPlane = PLANES.find((p) => p.id === pinnedId) ?? null;

  const togglePlane = useCallback((id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  const explore = useCallback(() => {
    const first = PLANES[0];
    setPinnedId(first.id);
    planeRefs.current[0]?.focus();
  }, []);

  // Close on Escape or on a click/tap outside the stage and detail panel.
  useEffect(() => {
    if (!pinnedId) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPinnedId(null);
    }
    function handlePointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPinnedId(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [pinnedId]);

  // The stage is tall enough that the detail panel can open below the
  // visible viewport, making it look like nothing happened. Bring it into
  // view whenever a plane gets pinned.
  useEffect(() => {
    if (!pinnedId) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    detailRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [pinnedId]);

  // Cursor tilt (desktop, fine pointer only) and scroll parallax. Only ever
  // sets --tiltX/--tiltY (cluster) and --scrollY (per plane) as custom
  // properties — never touches `transform` directly, so it can't clobber
  // the plane-positioning transform declared in CSS.
  useEffect(() => {
    const stage = stageRef.current;
    const cluster = clusterRef.current;
    if (!stage || !cluster) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)"
    ).matches;
    if (reduceMotion || !isDesktop) return;

    let scrollFrame = 0;

    function handlePointerMove(e: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cluster!.style.setProperty("--tiltX", `${(py * -6).toFixed(2)}deg`);
      cluster!.style.setProperty("--tiltY", `${(px * 8).toFixed(2)}deg`);
    }

    function handlePointerLeave() {
      cluster!.style.setProperty("--tiltX", "0deg");
      cluster!.style.setProperty("--tiltY", "0deg");
    }

    function handleScroll() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const rect = stage!.getBoundingClientRect();
        const progress = Math.min(
          Math.max(1 - rect.top / window.innerHeight, 0),
          1.4
        );
        planeRefs.current.forEach((el, i) => {
          if (!el) return;
          const rate = PLANES[i].scrollRate;
          el.style.setProperty(
            "--scrollY",
            `${(progress * rate).toFixed(1)}px`
          );
        });
      });
    }

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-smoke">
          Five evidence planes — select one
        </p>
        <button
          type="button"
          onClick={explore}
          className="inline-flex items-center gap-2 rounded-md bg-ivory px-4 py-2 text-xs font-medium text-obsidian transition-colors hover:bg-ivory/90"
        >
          Explore the record
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div
        role="group"
        aria-label="Filter evidence planes by status"
        className="exhibit-tabs"
      >
        {STATUS_ORDER.map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() =>
                setStatusFilter((prev) => (prev === status ? null : status))
              }
              className="exhibit-tab"
            >
              {STATUS_LABEL[status]}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        className="evidence-stage"
        role="group"
        aria-label="Evidence planes — five record categories, activate one to view its detail"
      >
        <div ref={clusterRef} className="evidence-cluster">
          {PLANES.map((plane, i) => {
            const pinned = pinnedId === plane.id;
            const statusMatch =
              statusFilter !== null && plane.detail.status === statusFilter;
            const statusDim =
              statusFilter !== null && plane.detail.status !== statusFilter;
            return (
              <button
                key={plane.id}
                type="button"
                ref={(el) => {
                  planeRefs.current[i] = el;
                }}
                className="glass-plane evidence-plane"
                data-pinned={pinned ? "true" : undefined}
                data-status-match={statusMatch ? "true" : undefined}
                data-status-dim={statusDim ? "true" : undefined}
                aria-pressed={pinned}
                aria-label={`${plane.label} — ${plane.sub}. Status: ${STATUS_LABEL[plane.detail.status]}. View detail.`}
                onClick={() => togglePlane(plane.id)}
                style={
                  {
                    "--px": `${plane.x}%`,
                    "--py": `${plane.y}%`,
                    "--pz": `${plane.z}px`,
                    "--protate": `${plane.rotate}deg`,
                    "--pscale": plane.scale,
                    "--popacity": plane.opacity,
                    "--pzindex": plane.zIndex,
                  } as React.CSSProperties
                }
              >
                <span className="evidence-plane-label">{plane.label}</span>
                <span className="evidence-plane-sub">{plane.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={detailRef}
        aria-live="polite"
        className={`evidence-detail ${pinnedPlane ? "evidence-detail-open" : ""}`}
      >
        {pinnedPlane && (
          <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg text-ivory">
                {pinnedPlane.label}
              </h3>
              <button
                type="button"
                onClick={() => setPinnedId(null)}
                aria-label="Close detail"
                className="text-smoke transition-colors hover:text-ivory"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Record
                </dt>
                <dd className="mt-1 leading-6 text-ivory">
                  {pinnedPlane.detail.record}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Source
                </dt>
                <dd className="mt-1 font-mono text-xs text-ivory">
                  {pinnedPlane.detail.source}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Chronology position
                </dt>
                <dd className="mt-1 text-ivory">
                  {pinnedPlane.detail.chronologyPosition}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Status
                </dt>
                <dd className="mt-1 font-mono text-xs text-ivory">
                  {pinnedPlane.detail.status !== "supported" && (
                    <span className="mr-1.5 text-[#d98a7c]" aria-hidden="true">
                      —
                    </span>
                  )}
                  {STATUS_LABEL[pinnedPlane.detail.status]}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
