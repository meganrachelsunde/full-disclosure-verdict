import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Study — Full Disclosure Verdict",
  description:
    "How a source-linked chronology, built with an autonomous agent under human oversight, caught record errors before they reached the case.",
  alternates: { canonical: "/case-study" },
  openGraph: {
    title: "Case Study — Full Disclosure Verdict",
    description:
      "Source-linked chronology with human-in-the-loop oversight: the catches that kept a live matter on solid ground.",
    url: "https://fulldisclosure.agency/case-study",
  },
};

// Anonymized by design: no names, jurisdiction, case number, or party
// details. Describes process and record catches only — no legal advice,
// no merit conclusions (see CLAUDE.md, Content integrity).

function Catch({
  label,
  heading,
  children,
}: {
  label: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-l border-smoke/30 pl-6">
      <p className="font-mono text-xs uppercase tracking-wider text-smoke">
        {label}
      </p>
      <h2 className="mt-2 font-display text-xl tracking-tight text-ivory">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-6 text-smoke">
        {children}
      </div>
    </section>
  );
}

const BOOK_HREF =
  "mailto:megannicolesunde@gmail.com?subject=Book%20a%20%24499%20Pilot%20Case";

function BookButton() {
  return (
    <a
      href={BOOK_HREF}
      className="inline-flex items-center justify-center rounded-md bg-ivory px-6 py-3 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90"
    >
      Book a $499 Pilot Case
    </a>
  );
}

export default function CaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Link href="/" className="text-sm text-smoke underline hover:text-ivory">
        ← Back to homepage
      </Link>
      <p className="mt-8 font-mono text-xs uppercase tracking-wider text-smoke">
        Case study · anonymized
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-ivory">
        A source-linked chronology that caught the errors before they cost
        anything.
      </h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-smoke">
        Human-in-the-loop | Source-linked | $499 per case or volume retainers
      </p>
      <div className="mt-8">
        <BookButton />
      </div>
      <p className="mt-8 text-sm leading-6 text-smoke">
        In a live family-court matter, an autonomous agent built and maintained
        a source-linked chronology across pleadings, disclosures, attendance
        records, and correspondence. Every entry kept its source reference
        (document and page). Every case-touching recommendation went through a
        human before anything was sent, filed, or served. The value was not
        speed — it was the errors that never reached the case.
      </p>

      <Catch
        label="Catch 01 · human review"
        heading="One inverted fact, fifteen documents, a false deadline"
      >
        <p>
          A single misread caption reversed who had requested disclosure from
          whom. The error spread through about fifteen working documents and
          grew into an urgent warning: serve now or lose key evidence. The
          operator knew what had actually arrived in the mail and challenged
          the premise. Re-checking the governing rule text showed no request
          had run to her, so no duty, no clock, no exclusion risk existed. A
          correction banner went onto every affected document, and an
          independent audit confirmed the fix and listed every place the error
          had spread.
        </p>
      </Catch>

      <Catch
        label="Catch 02 · human review"
        heading="Not asking a question the record had already answered"
      >
        <p>
          The agent drafted a records demand asking the other side to confirm
          that certain records did not exist. The operator stopped it. The
          opposing party&rsquo;s own sworn pleading already listed every step
          taken, and the missing step was not among them. Sending the demand
          risked inviting after-the-fact records that would turn a clean
          admission into a contested fact. A second review agreed: hold the
          demand and preserve the admission as written.
        </p>
      </Catch>

      <Catch
        label="Catch 03 · agent verification"
        heading="Fabricated citations stopped at the gate"
      >
        <p>
          Sub-agents asked to pressure-test strategy produced case citations
          that could not be verified, and one real citation attached to the
          wrong subject. None reached the client. The agent checked every
          authority against primary sources and discarded what failed. The
          rule that came out of it still holds: sub-agents propose, the primary
          source decides, and only verified law moves forward.
        </p>
      </Catch>

      <Catch
        label="Catch 04 · record discipline"
        heading="Numbers flagged before anyone relied on them"
      >
        <p>
          Cross-referencing coded attendance against the charged date window
          produced favorable totals. Before anyone relied on the numbers, the
          agent flagged the missing key: the other side&rsquo;s failure to
          produce, not the client&rsquo;s.
        </p>
      </Catch>

      <section className="mt-16 border-t border-smoke/30 pt-8 text-sm leading-6 text-smoke">
        <p>
          Every catch above is an observation tied to a source document. The
          decisions belonged to the client and counsel. Full Disclosure Verdict
          is not a law firm and does not provide legal advice.
        </p>
        <div className="mt-8">
          <BookButton />
        </div>
      </section>
    </main>
  );
}
