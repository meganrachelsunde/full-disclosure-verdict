import { DifferentiationToggle } from "@/components/differentiation-toggle";

export function LitigationExamination() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Full Disclosure Verdict
      </p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
        THE RECORD IS NOT REVIEWED FOR WHAT IT HOLDS. IT IS TESTED FOR
        WHAT IT CAN SUSTAIN.
      </h2>
      <p className="mt-6 text-lg leading-8 text-smoke">
        A summary identifies the material. Full Disclosure Verdict
        examines the authority being drawn from it.
      </p>

      <DifferentiationToggle variant="litigation" />

      <div className="mt-8 space-y-1.5 text-base leading-7 text-smoke">
        <p>Every finding remains attached to its source.</p>
      </div>

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
