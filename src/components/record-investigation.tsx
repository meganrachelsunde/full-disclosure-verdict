"use client";

import { useState } from "react";

type Excerpt = {
  id: string;
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

type ConflictEntry = { doc: string; summary: string };

type VariantContent = {
  excerpts: Excerpt[];
  conflictA: ConflictEntry;
  conflictB: ConflictEntry;
  findingDoc: string;
  findingPage: string;
  findingPosition: number;
};

// Excerpts are listed in chronological order. The two entries that
// conflict are flagged; selecting either one reveals the comparison and
// verdict below — the single interactive moment in this component.
const DENTAL_CONTENT: VariantContent = {
  excerpts: [
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
  ],
  conflictA: { doc: "Doc 007, p.3", summary: "Restorative work — tooth #19" },
  conflictB: {
    doc: "Doc 003, p.2",
    summary: "Lists tooth #18 for the same procedure",
  },
  findingDoc: "Doc 007",
  findingPage: "p.3",
  findingPosition: 4,
};

const LITIGATION_CONTENT: VariantContent = {
  excerpts: [
    {
      id: "report",
      doc: "Doc 003",
      page: "p.1",
      date: "2021-03-04",
      provider: "J. Reyes, Site Supervisor",
      sourceType: "Incident Report",
      bodyPre:
        "Incident logged same day. No witnesses identified at time of filing.",
      flag: null,
      bodyPost: "",
    },
    {
      id: "log",
      doc: "Doc 004",
      page: "p.1",
      date: "2021-03-04",
      provider: "J. Reyes, Site Supervisor",
      sourceType: "Access Log",
      bodyPre:
        "System access log pulled same day. No annotations comparing against prior entries.",
      flag: null,
      bodyPost: "",
    },
    {
      id: "notice",
      doc: "Doc 003",
      page: "p.2",
      date: "2021-03-18",
      provider: "J. Reyes, Site Supervisor",
      sourceType: "Follow-Up Notice",
      bodyPre: "Follow-up notice sent naming ",
      flag: "Entity A",
      bodyPost: " as the party responsible for corrective action.",
      conflictSide: "b",
    },
    {
      id: "statement",
      doc: "Doc 007",
      page: "p.3",
      date: "2022-01-11",
      provider: "R. Alvarez",
      sourceType: "Witness Statement",
      bodyPre: "Signed statement names ",
      flag: "Entity B",
      bodyPost: " as the party who completed the corrective action.",
      conflictSide: "a",
    },
  ],
  conflictA: {
    doc: "Doc 007, p.3",
    summary: "Witness statement — Entity B completed the corrective action",
  },
  conflictB: {
    doc: "Doc 003, p.2",
    summary: "Follow-up notice names Entity A for the same action",
  },
  findingDoc: "Doc 007",
  findingPage: "p.3",
  findingPosition: 4,
};

function ExcerptCard({
  excerpt,
  highlighted,
  onReveal,
}: {
  excerpt: Excerpt;
  highlighted: boolean;
  onReveal: () => void;
}) {
  return (
    <div
      className="source-excerpt-static glass-panel p-4"
      data-highlighted={highlighted ? "true" : undefined}
    >
      <div className="source-excerpt-header">
        <span>{excerpt.sourceType}</span>
        <span>{excerpt.date}</span>
      </div>
      <p className="source-excerpt-body">
        {excerpt.bodyPre}
        {excerpt.flag ? (
          <button
            type="button"
            className="excerpt-flag"
            aria-pressed={highlighted}
            aria-label={`Compare this against the conflicting entry for ${excerpt.flag}`}
            onMouseEnter={onReveal}
            onFocus={onReveal}
            onClick={onReveal}
          >
            {excerpt.flag}
          </button>
        ) : null}
        {excerpt.bodyPost}
      </p>
      <p className="source-excerpt-meta">
        {excerpt.provider} · {excerpt.doc}, {excerpt.page}
      </p>
    </div>
  );
}

export function RecordInvestigation({
  variant = "dental",
}: {
  variant?: "dental" | "litigation";
}) {
  const content =
    variant === "litigation" ? LITIGATION_CONTENT : DENTAL_CONTENT;
  const [revealed, setRevealed] = useState(false);
  const reveal = () => setRevealed(true);

  return (
    <div className="flex flex-col gap-3">
      {content.excerpts.map((excerpt) => (
        <ExcerptCard
          key={excerpt.id}
          excerpt={excerpt}
          highlighted={revealed && Boolean(excerpt.conflictSide)}
          onReveal={reveal}
        />
      ))}

      <div className="conflict-panel" aria-live="polite">
        {!revealed ? (
          <p className="conflict-prompt">
            Two records cannot both be right. Select the flagged entry to
            compare.
          </p>
        ) : (
          <>
            <dl className="conflict-comparison stage-enter">
              <div>
                <dt>{content.conflictA.doc}</dt>
                <dd>{content.conflictA.summary}</dd>
              </div>
              <div>
                <dt>{content.conflictB.doc}</dt>
                <dd>{content.conflictB.summary}</dd>
              </div>
            </dl>
            <p className="conflict-verdict-line stage-enter">
              Contradiction preserved — unresolved. Position{" "}
              {content.findingPosition} of {content.excerpts.length},{" "}
              {content.findingDoc}, {content.findingPage}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
