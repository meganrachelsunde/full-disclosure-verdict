"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type DemoStatus = "supported" | "contradicted" | "missing-source" | "unresolved";

type DemoRecord = {
  id: string;
  date: string;
  provider: string;
  entry: string;
  source: string;
  status: DemoStatus;
};

const STATUS_LABEL: Record<DemoStatus, string> = {
  supported: "Supported",
  contradicted: "Contradicted",
  "missing-source": "Missing Source",
  unresolved: "Unresolved",
};

const DENTAL_DEMO_RECORDS: DemoRecord[] = [
  {
    id: "r1",
    date: "2021-03-04",
    provider: "Dr. A. Fictional, DDS",
    entry: "Initial comprehensive exam. Bitewing radiographs taken.",
    source: "Doc 003, p. 1–2",
    status: "supported",
  },
  {
    id: "r2",
    date: "2021-03-04",
    provider: "Dr. A. Fictional, DDS",
    entry: "Panoramic radiograph — no comparison notes filed.",
    source: "Doc 004, p. 1",
    status: "unresolved",
  },
  {
    id: "r3",
    date: "2021-09-17",
    provider: "Riverbend Dental Group (fictional)",
    entry: "No record of scheduled 6-month recall visit.",
    source: "Gap — expected, not found",
    status: "missing-source",
  },
  {
    id: "r4",
    date: "2022-01-11",
    provider: "Dr. B. Sample, DMD",
    entry:
      "Restorative work noted on tooth #19; prior chart entry lists tooth #18.",
    source: "Doc 007, p.3 vs. Doc 003, p.2",
    status: "contradicted",
  },
  {
    id: "r5",
    date: "2022-06-02",
    provider: "Dr. B. Sample, DMD",
    entry:
      'Follow-up note references "prior imaging" without specifying which study.',
    source: "Doc 009, p.2 — ambiguous reference",
    status: "unresolved",
  },
];

const LITIGATION_DEMO_RECORDS: DemoRecord[] = [
  {
    id: "r1",
    date: "2021-03-04",
    provider: "J. Reyes, Site Supervisor",
    entry: "Initial incident report filed. Photographs attached to file.",
    source: "Doc 003, p. 1–2",
    status: "supported",
  },
  {
    id: "r2",
    date: "2021-03-04",
    provider: "J. Reyes, Site Supervisor",
    entry: "Access log pulled same day — no comparison notes filed.",
    source: "Doc 004, p. 1",
    status: "unresolved",
  },
  {
    id: "r3",
    date: "2021-09-17",
    provider: "Northfield Logistics (fictional)",
    entry: "No record of the scheduled 30-day corrective-action review.",
    source: "Gap — expected, not found",
    status: "missing-source",
  },
  {
    id: "r4",
    date: "2022-01-11",
    provider: "R. Alvarez",
    entry:
      "Witness statement names Entity B as responsible; prior notice named Entity A.",
    source: "Doc 007, p.3 vs. Doc 003, p.2",
    status: "contradicted",
  },
  {
    id: "r5",
    date: "2022-06-02",
    provider: "R. Alvarez",
    entry:
      'Follow-up note references "the prior report" without specifying which one.',
    source: "Doc 009, p.2 — ambiguous reference",
    status: "unresolved",
  },
];

const FILTERS: { key: "all" | DemoStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "supported", label: "Supported" },
  { key: "contradicted", label: "Contradicted" },
  { key: "missing-source", label: "Missing Source" },
  { key: "unresolved", label: "Unresolved" },
];

export function DemonstrationExplorer({
  variant = "dental",
}: {
  variant?: "dental" | "litigation";
}) {
  const DEMO_RECORDS =
    variant === "litigation" ? LITIGATION_DEMO_RECORDS : DENTAL_DEMO_RECORDS;
  const [filter, setFilter] = useState<"all" | DemoStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rows =
    filter === "all"
      ? DEMO_RECORDS
      : DEMO_RECORDS.filter((r) => r.status === filter);

  const selected = DEMO_RECORDS.find((r) => r.id === selectedId) ?? null;
  const selectedPosition = selected
    ? DEMO_RECORDS.findIndex((r) => r.id === selected.id) + 1
    : null;

  useEffect(() => {
    if (!selectedId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    function handlePointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSelectedId(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [selectedId]);

  return (
    <div ref={containerRef}>
      <div
        role="group"
        aria-label="Filter records by status"
        className="exhibit-tabs"
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className="exhibit-tab"
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="glass-plane exhibit-panel overflow-x-auto relative z-10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">
            Fictional demonstration chronology with fabricated entries for
            illustration only. Select a record to view its source trace.
          </caption>
          <thead>
            <tr className="border-b border-white/[0.1]">
              <th scope="col" className="px-5 py-4 font-medium text-smoke">
                Date
              </th>
              <th scope="col" className="px-5 py-4 font-medium text-smoke">
                Provider
              </th>
              <th scope="col" className="px-5 py-4 font-medium text-smoke">
                Entry
              </th>
              <th scope="col" className="px-5 py-4 font-medium text-smoke">
                Status
              </th>
              <th scope="col" className="px-5 py-4 font-medium text-smoke">
                <span className="sr-only">Source trace</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={
                  i !== rows.length - 1 ? "border-b border-white/[0.06]" : ""
                }
              >
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-smoke">
                  {row.date}
                </td>
                <td className="px-5 py-4 text-ivory">{row.provider}</td>
                <td className="px-5 py-4 text-ivory">{row.entry}</td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`font-mono text-xs ${
                      row.status === "contradicted"
                        ? "text-[#d98a7c]"
                        : "text-smoke"
                    }`}
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <button
                    type="button"
                    aria-pressed={selectedId === row.id}
                    onClick={() =>
                      setSelectedId((prev) =>
                        prev === row.id ? null : row.id
                      )
                    }
                    className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-ivory transition-colors hover:bg-white/[0.06]"
                  >
                    View source trace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        aria-live="polite"
        className={`evidence-detail ${selected ? "evidence-detail-open" : ""}`}
      >
        {selected && (
          <div className="glass-panel mt-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg text-ivory">
                Source trace
              </h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close source trace"
                className="text-smoke transition-colors hover:text-ivory"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-ivory">
              {selected.entry}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-smoke">
              <span>{selected.source}</span>
              <span aria-hidden="true">→</span>
              <span>
                Position {selectedPosition} of {DEMO_RECORDS.length} in
                chronology
              </span>
              <span aria-hidden="true">→</span>
              <span
                className={
                  selected.status === "contradicted" ? "text-[#d98a7c]" : ""
                }
              >
                {STATUS_LABEL[selected.status]}
              </span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-smoke">
        Demonstration data only. This table does not represent any real
        individual, provider, or matter, and no document-upload
        functionality is active in this build.
      </p>
    </div>
  );
}
