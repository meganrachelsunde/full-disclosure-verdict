import { DifferentiationToggle } from "@/components/differentiation-toggle";

const RECORD_CATEGORIES = [
  "Source",
  "Chronology",
  "Support",
  "Conflict",
  "Omission",
  "Assumption",
] as const;

export function LitigationExamination() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Full Disclosure Verdict
      </p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
        THE RECORD IS NOT REVIEWED FOR WHAT IT CONTAINS. IT IS TESTED FOR
        WHAT IT CAN SUSTAIN.
      </h2>
      <p className="mt-6 text-lg leading-8 text-smoke">
        A summary identifies the material. Full Disclosure Verdict
        examines the authority being drawn from it.
      </p>

      <DifferentiationToggle variant="litigation" />

      <div className="mt-8 space-y-1.5 text-base leading-7 text-smoke">
        <p>Every finding remains attached to its source.</p>
        <p>Support, conflict, omission, and assumption remain separate.</p>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-smoke">
        {RECORD_CATEGORIES.map((item, i) => (
          <li key={item} className="flex items-center gap-2">
            <span>{item}</span>
            {i !== RECORD_CATEGORIES.length - 1 && (
              <span aria-hidden="true" className="text-smoke/40">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-lg leading-8 text-smoke">
        Full Disclosure Verdict does not supply the conclusion. It
        determines where the record supports it, where support fails, and
        where certainty exceeds the evidence beneath it.
      </p>

      <p className="mt-6 border-l-2 border-gold/60 pl-6 font-display text-2xl leading-snug text-ivory">
        A conclusion cannot claim more from the record than the record can
        establish.
      </p>
    </>
  );
}
