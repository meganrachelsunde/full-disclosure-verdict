"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

type Status = "supported" | "contradicted" | "incomplete" | "unresolved";

type Plane = {
  id: string;
  label: string;
  sub: string;
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

// One quiet vertical column, most-resolved finding first — no diagonal
// staircase, no depth stacking. Order still carries the same reasoning
// as before (raw intake earns its way up to a verified fact); it's just
// expressed as a plain top-to-bottom list now.
const DENTAL_PLANES: Plane[] = [
  {
    id: "verified-facts",
    label: "Verified Facts",
    sub: "Source-linked",
    detail: {
      record:
        "Initial exam and radiograph findings, cross-referenced across two documents.",
      source: "Docs 003–004, cross-referenced",
      chronologyPosition: "March 2021 — first entry",
      status: "supported",
    },
  },
  {
    id: "chronology",
    label: "Chronology",
    sub: "Reconstructed timeline",
    detail: {
      record:
        "Every entry sequenced into a single timeline, each one linked back to its source page.",
      source: "Compiled from Docs 001–028",
      chronologyPosition: "Full timeline — March 2021 to June 2022",
      status: "supported",
    },
  },
  {
    id: "omissions",
    label: "Omissions",
    sub: "1 flagged gap",
    detail: {
      record: "No record of the scheduled six-month recall visit.",
      source: "Expected — not found in production",
      chronologyPosition: "September 2021 (expected)",
      status: "incomplete",
    },
  },
  {
    id: "contradictions",
    label: "Contradictions",
    sub: "2 unresolved",
    detail: {
      record:
        "A restorative entry lists tooth #19; the prior chart entry lists tooth #18.",
      source: "Doc 007, p.3 vs. Doc 003, p.2",
      chronologyPosition: "January 2022",
      status: "contradicted",
    },
  },
  {
    id: "source-records",
    label: "Source Records",
    sub: "28 documents",
    detail: {
      record:
        "28 source documents logged on intake — origin and page count recorded for each.",
      source: "Docs 001–028, full production",
      chronologyPosition: "Precedes chronology — raw intake",
      status: "supported",
    },
  },
];

const LITIGATION_PLANES: Plane[] = [
  {
    id: "verified-facts",
    label: "Verified Facts",
    sub: "Source-linked",
    detail: {
      record:
        "Incident report and access log findings, cross-referenced across two documents.",
      source: "Docs 003–004, cross-referenced",
      chronologyPosition: "March 2021 — first entry",
      status: "supported",
    },
  },
  {
    id: "chronology",
    label: "Chronology",
    sub: "Reconstructed timeline",
    detail: {
      record:
        "Every entry sequenced into a single timeline, each one linked back to its source page.",
      source: "Compiled from Docs 001–028",
      chronologyPosition: "Full timeline — March 2021 to January 2022",
      status: "supported",
    },
  },
  {
    id: "omissions",
    label: "Omissions",
    sub: "1 flagged gap",
    detail: {
      record: "No record of the scheduled 30-day corrective-action review.",
      source: "Expected — not found in production",
      chronologyPosition: "September 2021 (expected)",
      status: "incomplete",
    },
  },
  {
    id: "contradictions",
    label: "Contradictions",
    sub: "2 unresolved",
    detail: {
      record:
        "A witness statement names Entity B as the responsible party; the prior follow-up notice names Entity A.",
      source: "Doc 007, p.3 vs. Doc 003, p.2",
      chronologyPosition: "January 2022",
      status: "contradicted",
    },
  },
  {
    id: "source-records",
    label: "Source Records",
    sub: "28 documents",
    detail: {
      record:
        "28 source documents logged on intake — origin and page count recorded for each.",
      source: "Docs 001–028, full production",
      chronologyPosition: "Precedes chronology — raw intake",
      status: "supported",
    },
  },
];

export function EvidencePlanes({
  variant = "dental",
}: {
  variant?: "dental" | "litigation";
}) {
  const PLANES = variant === "litigation" ? LITIGATION_PLANES : DENTAL_PLANES;
  const containerRef = useRef<HTMLDivElement>(null);
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
  }, [PLANES]);

  // Close on Escape or on a click/tap outside the column and detail panel.
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

  // The column can open a detail panel below the visible viewport,
  // making it look like nothing happened. Bring it into view whenever a
  // plane gets pinned.
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
        className="evidence-stage"
        role="group"
        aria-label="Evidence planes — five record categories, activate one to view its detail"
      >
        <div className="evidence-cluster">
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
                className="evidence-plane"
                data-pinned={pinned ? "true" : undefined}
                data-status-match={statusMatch ? "true" : undefined}
                data-status-dim={statusDim ? "true" : undefined}
                aria-pressed={pinned}
                aria-label={`${plane.label} — ${plane.sub}. Status: ${STATUS_LABEL[plane.detail.status]}. View detail.`}
                onClick={() => togglePlane(plane.id)}
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
