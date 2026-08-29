import { DifferentiationToggle } from "@/components/differentiation-toggle";

export function LitigationExamination() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        The difference
      </p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
        The record is not read for what it holds. It is tested for what it
        can hold up.
      </h2>
      <p className="mt-6 text-lg leading-8 text-smoke">
        A summary tells you what is in the file. We examine the weight being
        put on it.
      </p>

      <DifferentiationToggle variant="litigation" />

      <div className="mt-8 space-y-1.5 text-base leading-7 text-smoke">
        <p>Every finding stays attached to its source.</p>
      </div>

      <p className="mt-10 text-lg leading-8 text-smoke">
        We do not supply the conclusion. We show where the record supports
        it, where that support runs out, and where certainty has outrun the
        evidence under it.
      </p>

      <p className="mt-6 border-l-2 border-gold/60 pl-6 font-display text-2xl leading-snug text-ivory">
        A conclusion cannot claim more from the record than the record can
        establish.
      </p>
    </>
  );
}
