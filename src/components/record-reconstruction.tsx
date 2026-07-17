"use client";

import { useEffect, useRef, useState } from "react";
import { Info, X } from "lucide-react";

type Status = "supported" | "contradicted" | "missing" | "unresolved";

type DocRecord = {
  id: string;
  sourceType: string;
  date: string;
  title: string;
  docId: string | null;
  page: string | null;
  status: Status;
  conflictsWithId?: string;
  conflictNote?: string;
};

// Chronological order — this same array drives every one of the five
// states. Nothing is re-fetched or re-labeled between steps; only the
// arrangement and the information revealed about each record changes.
const RECORDS: DocRecord[] = [
  {
    id: "r1",
    sourceType: "Clinical Exam",
    date: "2021-03-04",
    title: "Initial comprehensive exam",
    docId: "Doc 003",
    page: "p.1",
    status: "supported",
  },
  {
    id: "r2",
    sourceType: "Radiograph",
    date: "2021-03-04",
    title: "Panoramic radiograph — no comparison notes filed",
    docId: "Doc 004",
    page: "p.1",
    status: "unresolved",
  },
  {
    id: "r3",
    sourceType: "Recall Schedule",
    date: "2021-09-17",
    title: "Six-month recall visit",
    docId: null,
    page: null,
    status: "missing",
  },
  {
    id: "r4",
    sourceType: "Treatment Note",
    date: "2022-01-11",
    title: "Restorative work — tooth #19",
    docId: "Doc 007",
    page: "p.3",
    status: "contradicted",
    conflictsWithId: "r1",
    conflictNote: "Doc 003, p.2 lists tooth #18 for the same procedure",
  },
  {
    id: "r5",
    sourceType: "Follow-up Note",
    date: "2022-06-02",
    title: 'References "prior imaging" — study unspecified',
    docId: "Doc 009",
    page: "p.2",
    status: "unresolved",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  supported: "Supported",
  contradicted: "Contradicted",
  missing: "Missing Source",
  unresolved: "Unresolved",
};

const REVIEW_PRIORITY: Record<Status, number> = {
  contradicted: 0,
  missing: 1,
  unresolved: 2,
  supported: 3,
};

const ACTIONS = [
  "Confirmed by Source",
  "Requires Expert Review",
  "Remains Unresolved",
] as const;

const ENTRY_OFFSET: Record<string, number> = {
  r1: -14,
  r2: 18,
  r4: -6,
  r5: 24,
};

const STEPS = [
  {
    number: "01",
    title: "Separate source records enter.",
    description:
      "Records arrive independently, each retaining its own identity — no merging, no editorializing.",
  },
  {
    number: "02",
    title: "Chronology assembles.",
    description:
      "The same records are sequenced onto a single dated timeline.",
  },
  {
    number: "03",
    title: "Contradictions and omissions remain visible.",
    description:
      "Conflicting entries are cross-referenced and a missing record is held open, not hidden.",
  },
  {
    number: "04",
    title: "Findings connect back to their sources.",
    description:
      "Every record traces back to its exact source document and position in the chronology.",
  },
  {
    number: "05",
    title: "A qualified human reviews what remains unresolved.",
    description:
      "Open items are queued for a reviewer's disposition — the tool does not resolve them itself.",
  },
] as const;

function position(id: string) {
  return RECORDS.findIndex((r) => r.id === id) + 1;
}

function RecordCard({
  record,
  showStatus,
  showTrace,
  selected,
  onSelect,
  entryOffset,
  reviewMode,
  reviewAction,
  onSetReviewAction,
}: {
  record: DocRecord;
  showStatus: boolean;
  showTrace: boolean;
  selected: boolean;
  onSelect: () => void;
  entryOffset?: number;
  reviewMode: boolean;
  reviewAction: string | null;
  onSetReviewAction: (action: string) => void;
}) {
  if (record.status === "missing") {
    return (
      <div className="glass-flat w-full max-w-xs border-dashed p-5 opacity-75">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
          {record.sourceType}
        </p>
        <p className="mt-2 font-display text-base text-smoke">
          {record.title}
        </p>
        <p className="mt-3 font-mono text-xs text-smoke">
          {record.date} (expected)
        </p>
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-[#d98a7c]">
          Missing Source
        </p>
        {showTrace && (
          <p className="mt-3 border-t border-white/10 pt-3 font-mono text-[0.65rem] text-smoke">
            Position {position(record.id)} of {RECORDS.length} — no source to
            trace
          </p>
        )}
      </div>
    );
  }

  const reciprocal = RECORDS.find((r) => r.conflictsWithId === record.id);
  const flagged = record.status === "contradicted" || record.status === "unresolved";
  const emphasize = showStatus && (record.conflictNote || reciprocal);

  return (
    <div
      className={`glass-panel w-full max-w-xs p-5 transition-all duration-500 ${
        emphasize ? "ring-1 ring-[#d98a7c]/50" : ""
      } ${selected ? "border-gold/40" : ""}`}
      style={entryOffset ? { transform: `translateY(${entryOffset}px)` } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
          {record.sourceType}
        </p>
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`View source detail for ${record.title}`}
          className="shrink-0 text-smoke transition-colors hover:text-ivory"
        >
          <Info className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 font-display text-base text-ivory">{record.title}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-smoke">
        <span>{record.date}</span>
        <span aria-hidden="true">·</span>
        <span>
          {record.docId}
          {record.page ? `, ${record.page}` : ""}
        </span>
      </div>
      {showStatus && (
        <p
          className={`mt-3 font-mono text-[0.65rem] uppercase tracking-wider ${
            flagged ? "text-[#d98a7c]" : "text-smoke"
          }`}
        >
          {STATUS_LABEL[record.status]}
        </p>
      )}
      {showStatus && record.conflictNote && (
        <p className="mt-2 text-xs leading-5 text-[#d98a7c]">
          <span aria-hidden="true">⟷ </span>
          Conflicts with {RECORDS.find((r) => r.id === record.conflictsWithId)?.docId} —{" "}
          {record.conflictNote}
        </p>
      )}
      {showStatus && reciprocal && (
        <p className="mt-2 text-xs leading-5 text-[#d98a7c]">
          <span aria-hidden="true">⟷ </span>
          Conflicted by {reciprocal.docId}
        </p>
      )}
      {showTrace && (
        <p className="mt-3 border-t border-white/10 pt-3 font-mono text-[0.65rem] text-smoke">
          Source traced <span aria-hidden="true">→</span> position{" "}
          {position(record.id)} of {RECORDS.length} in chronology
        </p>
      )}
      {reviewMode && record.status !== "supported" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              aria-pressed={reviewAction === action}
              onClick={() => onSetReviewAction(action)}
              className={`rounded-md border px-2.5 py-1.5 text-[0.62rem] font-mono uppercase tracking-wide transition-colors ${
                reviewAction === action
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-white/15 text-smoke hover:text-ivory"
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      )}
      {reviewMode && record.status === "supported" && (
        <p className="mt-4 border-t border-white/10 pt-4 text-xs text-smoke">
          No action needed — supported by source.
        </p>
      )}
    </div>
  );
}

export function RecordReconstruction() {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewActions, setReviewActions] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = RECORDS.find((r) => r.id === selectedId) ?? null;
  const visibleRecords =
    step <= 2 ? RECORDS.filter((r) => r.status !== "missing") : RECORDS;
  const showStatus = step >= 3;
  const showTrace = step >= 4;
  const reviewMode = step === 5;

  const reviewQueue = reviewMode
    ? [...RECORDS].sort((a, b) => REVIEW_PRIORITY[a.status] - REVIEW_PRIORITY[b.status])
    : RECORDS;

  useEffect(() => {
    if (!selectedId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  function selectStep(n: number) {
    setStep(n);
    setSelectedId(null);
  }

  function toggleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div ref={containerRef} className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-start lg:gap-10">
      <div
        role="group"
        aria-label="Reconstruction steps"
        className="flex flex-col gap-2 lg:sticky lg:top-24"
      >
        {STEPS.map((s, i) => {
          const n = i + 1;
          const active = step === n;
          return (
            <button
              key={s.number}
              type="button"
              aria-pressed={active}
              onClick={() => selectStep(n)}
              className="ledger-tab"
            >
              <span className={`font-mono text-xs ${active ? "text-gold" : "text-smoke"}`}>
                {s.number}
              </span>
              <span>
                <span
                  className={`block font-display text-base ${active ? "text-ivory" : "text-smoke"}`}
                >
                  {s.title}
                </span>
                {active && (
                  <span className="mt-1.5 block text-sm leading-6 text-smoke">
                    {s.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="glass-plane relative min-h-[32rem] p-6 sm:p-8">
        <p className="sr-only" aria-live="polite">
          Step {step} of 5: {STEPS[step - 1].title}
        </p>

        <div key={step} className="stage-enter">
          {step === 1 && (
            <div className="flex flex-wrap items-start gap-6">
              {visibleRecords.map((r) => (
                <RecordCard
                  key={r.id}
                  record={r}
                  showStatus={false}
                  showTrace={false}
                  selected={selectedId === r.id}
                  onSelect={() => toggleSelect(r.id)}
                  entryOffset={ENTRY_OFFSET[r.id]}
                  reviewMode={false}
                  reviewAction={null}
                  onSetReviewAction={() => {}}
                />
              ))}
            </div>
          )}

          {step >= 2 && step <= 4 && (
            <ol className="relative flex flex-col gap-7 border-l border-white/15 pl-8">
              {visibleRecords.map((r) => (
                <li key={r.id} className="relative">
                  <span
                    className="absolute -left-[2.05rem] top-1.5 size-2.5 rounded-full border border-gold/60 bg-obsidian"
                    aria-hidden="true"
                  />
                  <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-wider text-gold">
                    {r.date}
                    {r.status === "missing" ? " (expected)" : ""}
                  </span>
                  <RecordCard
                    record={r}
                    showStatus={showStatus}
                    showTrace={showTrace}
                    selected={selectedId === r.id}
                    onSelect={() => toggleSelect(r.id)}
                    reviewMode={false}
                    reviewAction={null}
                    onSetReviewAction={() => {}}
                  />
                </li>
              ))}
            </ol>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-smoke">
                Illustrative reviewer actions — selecting one records a
                disposition for this demonstration only; it is not a legal
                or clinical determination.
              </p>
              {reviewQueue.map((r) => (
                <RecordCard
                  key={r.id}
                  record={r}
                  showStatus
                  showTrace={false}
                  selected={selectedId === r.id}
                  onSelect={() => toggleSelect(r.id)}
                  reviewMode
                  reviewAction={reviewActions[r.id] ?? null}
                  onSetReviewAction={(action) =>
                    setReviewActions((prev) => ({ ...prev, [r.id]: action }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        aria-live="polite"
        className={`lg:col-start-2 evidence-detail ${selected ? "evidence-detail-open" : ""}`}
      >
        {selected && (
          <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg text-ivory">{selected.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close source detail"
                className="text-smoke transition-colors hover:text-ivory"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Source type
                </dt>
                <dd className="mt-1 text-ivory">{selected.sourceType}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Date
                </dt>
                <dd className="mt-1 font-mono text-xs text-ivory">{selected.date}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Document
                </dt>
                <dd className="mt-1 font-mono text-xs text-ivory">
                  {selected.docId ? `${selected.docId}${selected.page ? `, ${selected.page}` : ""}` : "Not found in production"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Chronology position
                </dt>
                <dd className="mt-1 text-ivory">
                  {position(selected.id)} of {RECORDS.length}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Status
                </dt>
                <dd className="mt-1 font-mono text-xs text-ivory">
                  {STATUS_LABEL[selected.status]}
                </dd>
              </div>
              {selected.conflictNote && (
                <div>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                    Conflict
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-[#d98a7c]">
                    {selected.conflictNote}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
