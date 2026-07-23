const COMPARISON_ROWS = [
  {
    conventional: "Reports the conclusion",
    fdv: "Preserves the conclusion and its basis",
  },
  {
    conventional: "Collapses competing entries",
    fdv: "Keeps the material conflict visible",
  },
  {
    conventional: "Separates the answer from its sources",
    fdv: "Attaches each material claim to its source",
  },
  {
    conventional: "Treats chronology as background",
    fdv: "Uses chronology to establish what changed",
  },
  {
    conventional: "Absorbs uncertainty into the result",
    fdv: "States uncertainty and unresolved questions",
  },
  {
    conventional: "Produces an answer to carry forward",
    fdv: "Produces a record that can be examined",
  },
] as const;

const LITIGATION_ROWS = [
  {
    label: "Output",
    typical: "A score. No source.",
    fdv: "Both entries. Document and page.",
  },
  {
    label: "The conflict",
    typical: "Resolved silently. One entry wins. Nobody saw the vote.",
    fdv: "Preserved. Named. Neither entry dies.",
  },
  {
    label: "Reasoning",
    typical: "A number. Arrived at nowhere.",
    fdv: "Source → chronology → path → conviction. The route is the proof.",
  },
  {
    label: "Where it lands",
    typical: "A verdict you carry.",
    fdv: "A record you hold.",
  },
] as const;

export function DifferentiationToggle({
  variant = "dental",
}: {
  variant?: "dental" | "litigation";
}) {
  if (variant === "litigation") {
    return (
      <div className="mt-8 flex flex-col gap-4">
        {LITIGATION_ROWS.map((row) => (
          <div key={row.label} className="glass-panel p-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
              {row.label}
            </p>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke">
                  Typical tools
                </dt>
                <dd className="mt-1 text-ivory">{row.typical}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-gold">
                  Full Disclosure Verdict
                </dt>
                <dd className="mt-1 text-ivory">{row.fdv}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Full Disclosure Verdict
      </p>
      <h3 className="mt-4 font-display text-3xl tracking-tight text-ivory">
        Resolution without disclosure is only selection.
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-7 text-smoke">
        A verdict should disclose more than what was decided. It should
        preserve the conflict that required a decision, identify the
        evidence that governed it, state what remains uncertain, and make
        the path to the conclusion available for review.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparison of conventional output against Full Disclosure
            Verdict
          </caption>
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th
                scope="col"
                className="py-3 pr-6 font-mono text-[0.65rem] uppercase tracking-wider text-smoke"
              >
                Conventional output
              </th>
              <th
                scope="col"
                className="py-3 font-mono text-[0.65rem] uppercase tracking-wider text-gold"
              >
                Full Disclosure Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr
                key={row.conventional}
                className="border-b border-white/[0.06]"
              >
                <td className="py-3 pr-6 align-top text-smoke">
                  {row.conventional}
                </td>
                <td className="py-3 align-top text-ivory">{row.fdv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 max-w-2xl text-base leading-7 text-smoke">
        Where evidence conflicts, selection alone cannot explain the
        result. A decision that cannot be examined cannot be meaningfully
        reviewed. Full Disclosure Verdict preserves the basis of that
        review.
      </p>

      <p className="mt-6 border-l-2 border-gold/60 pl-6 font-display text-2xl leading-snug text-ivory">
        The verdict may close the question. The record remains open to
        examination.
      </p>
    </div>
  );
}
