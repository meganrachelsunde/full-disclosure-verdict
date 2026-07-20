"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

type ExcerptId = "exam" | "radiograph" | "chart18" | "treatment19";

type Excerpt = {
  id: ExcerptId;
  doc: string;
  page: string;
  date: string;
  provider: string;
  sourceType: string;
  bodyPre: string;
  flag: string | null;
  bodyPost: string;
  conflictSide?: "a" | "b";
};

// The same four source fragments drive every control — nothing is
// re-fetched or swapped between them. Only their position (scattered vs.
// chronological), and how much cross-referencing is revealed about them,
// changes as the investigation deepens. Chronological order below also
// doubles as chronology position (index + 1 of 4).
const EXCERPTS: Excerpt[] = [
  {
    id: "exam",
    doc: "Doc 003",
    page: "p.1",
    date: "2021-03-04",
    provider: "Dr. A. Fictional, DDS",
    sourceType: "Clinical Exam",
    bodyPre:
      "Comprehensive oral exam completed. Full periodontal charting on file; patient reports no acute complaints.",
    flag: null,
    bodyPost: "",
  },
  {
    id: "radiograph",
    doc: "Doc 004",
    page: "p.1",
    date: "2021-03-04",
    provider: "Dr. A. Fictional, DDS",
    sourceType: "Radiograph",
    bodyPre:
      "Panoramic radiograph obtained same visit. No comparison notes filed against prior imaging.",
    flag: null,
    bodyPost: "",
  },
  {
    id: "chart18",
    doc: "Doc 003",
    page: "p.2",
    date: "2021-03-18",
    provider: "Dr. A. Fictional, DDS",
    sourceType: "Treatment Plan",
    bodyPre: "Treatment plan entry: ",
    flag: "tooth #18",
    bodyPost: " flagged for restorative follow-up at next available visit.",
    conflictSide: "b",
  },
  {
    id: "treatment19",
    doc: "Doc 007",
    page: "p.3",
    date: "2022-01-11",
    provider: "Dr. B. Sample, DMD",
    sourceType: "Treatment Note",
    bodyPre: "Restorative work performed — ",
    flag: "tooth #19",
    bodyPost: ". Composite restoration, occlusal surface.",
    conflictSide: "a",
  },
];

const COLUMN_ORDER: ExcerptId[] = ["exam", "radiograph", "chart18", "treatment19"];
// Cards run 150-190px tall depending on how their body text wraps; these
// spacings are sized for the tallest case so nothing overlaps.
const ROW_HEIGHT = 210;
const MAX_CARD_HEIGHT = 190;

// Horizontal placement (xPct/widthPct) is percentage-based so it scales
// with whatever width the stage actually has — a narrow mobile accordion
// panel or the wider desktop stage — with no breakpoint-specific layout
// table. Vertical placement and tilt stay in plain px/deg on `transform`,
// since neither needs to scale with width.
type Point = { xPct: number; widthPct: number; y: number; rotate: number };

// Loose, unsorted placement — four independent fragments with no implied
// relationship yet. Deliberately not grid-aligned (offset x/y) so it
// still reads as separate papers rather than a UI card grid, but each
// tile stays level rather than tilted.
const SCATTER_LAYOUT: Record<ExcerptId, Point> = {
  exam: { xPct: 0, widthPct: 47, y: 0, rotate: 0 },
  radiograph: { xPct: 51, widthPct: 47, y: 20, rotate: 0 },
  chart18: { xPct: 3, widthPct: 47, y: 222, rotate: 0 },
  treatment19: { xPct: 54, widthPct: 47, y: 202, rotate: 0 },
};

const COLUMN_LAYOUT: Record<ExcerptId, Point> = COLUMN_ORDER.reduce(
  (acc, id, i) => {
    acc[id] = { xPct: 2, widthPct: 92, y: i * ROW_HEIGHT, rotate: 0 };
    return acc;
  },
  {} as Record<ExcerptId, Point>
);

function layoutFor(step: number): Record<ExcerptId, Point> {
  return step === 1 ? SCATTER_LAYOUT : COLUMN_LAYOUT;
}

function stageHeightFor(step: number): number {
  return step === 1
    ? 222 + MAX_CARD_HEIGHT
    : (COLUMN_ORDER.length - 1) * ROW_HEIGHT + MAX_CARD_HEIGHT;
}

const CONTROLS = [
  { number: "01", label: "See the separate sources" },
  { number: "02", label: "Reconstruct what happened" },
  { number: "03", label: "Find what does not agree" },
  { number: "04", label: "Trace the finding to its source" },
  { number: "05", label: "See what remains unresolved" },
] as const;

function ExcerptCard({
  excerpt,
  step,
  conflictVisible,
  onRevealConflict,
}: {
  excerpt: Excerpt;
  step: number;
  conflictVisible: boolean;
  onRevealConflict: () => void;
}) {
  const layout = layoutFor(step)[excerpt.id];
  const interactive = step >= 3 && excerpt.flag;
  const highlighted = conflictVisible && excerpt.conflictSide;

  return (
    <div
      className="source-excerpt"
      data-highlighted={highlighted ? "true" : undefined}
      style={{
        left: `${layout.xPct}%`,
        width: `${layout.widthPct}%`,
        transform: `translateY(${layout.y}px) rotate(${layout.rotate}deg)`,
      }}
    >
      <div className="source-excerpt-header">
        <span>{excerpt.sourceType}</span>
        <span>{excerpt.date}</span>
      </div>
      <p className="source-excerpt-body">
        {excerpt.bodyPre}
        {excerpt.flag ? (
          interactive ? (
            <button
              type="button"
              className="excerpt-flag"
              aria-pressed={Boolean(conflictVisible)}
              aria-label={`Compare this against the conflicting entry for ${excerpt.flag}`}
              onMouseEnter={onRevealConflict}
              onFocus={onRevealConflict}
              onClick={onRevealConflict}
            >
              {excerpt.flag}
            </button>
          ) : (
            <span>{excerpt.flag}</span>
          )
        ) : null}
        {excerpt.bodyPost}
      </p>
      <p className="source-excerpt-meta">
        {excerpt.provider} · {excerpt.doc}, {excerpt.page}
      </p>
    </div>
  );
}

function InvestigationCanvas({
  step,
  conflictRevealed,
  onRevealConflict,
  liveLabel,
}: {
  step: number;
  conflictRevealed: boolean;
  onRevealConflict: () => void;
  liveLabel: string;
}) {
  const conflictVisible = conflictRevealed || step >= 4;
  const treatmentPosition = COLUMN_ORDER.indexOf("treatment19") + 1;

  return (
    <div className="investigation-stage">
      <p className="sr-only" aria-live="polite">
        Now showing: {liveLabel}.
      </p>

      <div
        className="source-excerpt-layer"
        style={{ height: stageHeightFor(step) }}
      >
        {EXCERPTS.map((excerpt) => (
          <ExcerptCard
            key={excerpt.id}
            excerpt={excerpt}
            step={step}
            conflictVisible={conflictVisible}
            onRevealConflict={onRevealConflict}
          />
        ))}
      </div>

      {step >= 3 && (
        <div className="conflict-panel stage-enter">
          {!conflictVisible ? (
            <p className="conflict-prompt">
              Two records cannot both be right. Find the conflict.
            </p>
          ) : (
            <>
              <dl className="conflict-comparison">
                <div>
                  <dt>Doc 007, p.3</dt>
                  <dd>Restorative work — tooth #19</dd>
                </div>
                <div>
                  <dt>Doc 003, p.2</dt>
                  <dd>Lists tooth #18 for the same procedure</dd>
                </div>
              </dl>
              <p className="conflict-verdict-line">
                Contradiction preserved — unresolved.
              </p>
            </>
          )}
        </div>
      )}

      {step >= 4 && conflictVisible && (
        <ol className="trace-breadcrumb stage-enter">
          {[
            "Finding",
            "“Restorative work — tooth #19”",
            "Doc 007",
            "p.3",
            `Position ${treatmentPosition} of ${COLUMN_ORDER.length}`,
          ].map((segment, i) => (
            <li key={segment} style={{ animationDelay: `${i * 90}ms` }}>
              {segment}
            </li>
          ))}
        </ol>
      )}

      {step === 5 && (
        <div className="verdict-panel stage-enter">
          <p className="verdict-heading">Qualified review required</p>
          <p className="verdict-body">
            The record establishes a conflict. It does not establish which
            entry is correct.
          </p>
        </div>
      )}
    </div>
  );
}

export function RecordInvestigation() {
  const [activeStep, setActiveStep] = useState(1);
  const [conflictRevealed, setConflictRevealed] = useState(false);
  const [offset, setOffset] = useState(0);

  const shellRef = useRef<HTMLDivElement>(null);
  const controlRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const revealConflict = useCallback(() => setConflictRevealed(true), []);

  useLayoutEffect(() => {
    function measure() {
      const shell = shellRef.current;
      const button = controlRefs.current[activeStep - 1];
      if (!shell || !button) return;
      const shellRect = shell.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setOffset(buttonRect.top - shellRect.top);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeStep]);

  const activeLabel = CONTROLS[activeStep - 1].label;

  return (
    <div ref={shellRef} className="investigation-shell">
      <div
        role="group"
        aria-label="Investigation controls"
        className="investigation-controls"
      >
        {CONTROLS.map((control, i) => {
          const n = i + 1;
          const active = activeStep === n;
          const panelId = `investigation-panel-mobile-${n}`;
          return (
            <div key={control.number}>
              <button
                type="button"
                ref={(el) => {
                  controlRefs.current[i] = el;
                }}
                aria-pressed={active}
                aria-expanded={active}
                aria-controls={panelId}
                onClick={() => setActiveStep(n)}
                className="ledger-tab"
              >
                <span className={`font-mono text-xs ${active ? "text-gold" : "text-smoke"}`}>
                  {control.number}
                </span>
                <span
                  className={`font-display text-base ${active ? "text-ivory" : "text-smoke"}`}
                >
                  {control.label}
                </span>
              </button>
              <div
                id={panelId}
                className={`investigation-mobile-panel evidence-detail lg:hidden ${
                  active ? "evidence-detail-open" : ""
                }`}
              >
                {active && (
                  <InvestigationCanvas
                    step={activeStep}
                    conflictRevealed={conflictRevealed}
                    onRevealConflict={revealConflict}
                    liveLabel={activeLabel}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="investigation-desktop-stage hidden lg:block"
        style={{ marginTop: offset }}
      >
        <InvestigationCanvas
          step={activeStep}
          conflictRevealed={conflictRevealed}
          onRevealConflict={revealConflict}
          liveLabel={activeLabel}
        />
      </div>
    </div>
  );
}
