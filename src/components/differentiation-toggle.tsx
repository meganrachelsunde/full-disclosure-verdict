"use client";

import { useState } from "react";

const WORKFLOWS = {
  typical: {
    label: "Typical legal tools",
    steps: ["Summarize the file", "Draft the argument"],
  },
  fdv: {
    label: "Full Disclosure Verdict",
    steps: [
      "Reconstruct the sequence",
      "Preserve the conflict",
      "Trace each finding",
      "Keep uncertainty visible",
    ],
  },
} as const;

type ViewKey = keyof typeof WORKFLOWS;

export function DifferentiationToggle() {
  const [view, setView] = useState<ViewKey>("fdv");
  const workflow = WORKFLOWS[view];

  return (
    <div className="mt-10">
      <div role="group" aria-label="Compare workflow" className="exhibit-tabs">
        {(Object.keys(WORKFLOWS) as ViewKey[]).map((key) => {
          const active = view === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setView(key)}
              className="exhibit-tab"
            >
              {WORKFLOWS[key].label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="glass-panel exhibit-panel p-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
          {workflow.label} workflow
        </p>
        <ol className="mt-4 flex flex-col gap-3">
          {workflow.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-ivory">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
