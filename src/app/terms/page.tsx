import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Refund Policy — Full Disclosure Verdict",
  description:
    "Scope of the case screening engagement, refund policy, turnaround, and the limits of what a screening is and is not.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "July 26, 2026";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl tracking-tight text-ivory">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-6 text-smoke">
        {children}
      </div>
    </section>
  );
}

export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-wider text-smoke">
        Terms and refund policy
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-ivory">
        What a screening is, and what it owes you.
      </h1>
      <p className="mt-6 text-sm leading-6 text-smoke">
        Last updated {UPDATED}. These terms govern the case screening service
        offered at fulldisclosure.agency.
      </p>

      <Section heading="What the screening fee buys">
        <p>
          A case screening is a fixed-fee engagement of $499 per case, one
          pass. It produces four things from the records you provide: a record
          inventory, a source-linked chronology, flags marking gaps and
          apparent contradictions, and a source trace connecting every entry
          back to the document it came from.
        </p>
        <p>
          Every entry is an observation tied to a source document. A screening
          organizes and traces the record; it does not characterize it.
        </p>
      </Section>

      <Section heading="What it is not">
        <p>
          Full Disclosure Verdict is not a law firm and does not provide legal
          advice. A screening is not a medical or dental diagnosis, not a
          standard-of-care opinion, not a causation opinion, not a damages
          calculation, and not a conclusion about the merits of a case.
        </p>
        <p>
          Nothing produced here substitutes for a retained licensed expert or
          for the judgment of counsel. The work product is prepared for
          attorney and licensed-expert handoff, and the decisions that follow
          from it remain yours.
        </p>
        <p>
          No attorney-client relationship is formed by requesting a screening,
          paying the fee, or receiving the work product.
        </p>
      </Section>

      <Section heading="Turnaround">
        <p>
          Screening requests are reviewed within one business day. Turnaround
          for the screening itself depends on the volume of records and is
          confirmed in writing before work begins. If a stated turnaround
          cannot be met, you will be told before the deadline rather than
          after it.
        </p>
      </Section>

      <Section heading="Refunds">
        <p>
          <span className="text-ivory">Before work begins — full refund.</span>{" "}
          If a case is declined after payment, or you withdraw before the
          screening starts, the fee is refunded in full. Some cases are
          declined for conflict, subject matter, or record volume; that
          decision is never a judgment about the case itself.
        </p>
        <p>
          <span className="text-ivory">After work begins — case by case.</span>{" "}
          Once a screening is underway, the fee reflects work already
          performed. If the delivered screening does not include the four
          components described above, or if a stated turnaround is missed, the
          fee is refunded in full.
        </p>
        <p>
          <span className="text-ivory">
            What a refund does not cover — findings.
          </span>{" "}
          A completed screening is not refundable because of what it found or
          did not find. A screening that surfaces no gaps and no
          contradictions is a completed screening; the absence of gaps is not
          a failure of the work, and it is frequently the most useful result.
        </p>
        <p>
          Refunds are issued to the original payment method. Requests should
          go to the contact address below.
        </p>
      </Section>

      <Section heading="Records and confidentiality">
        <p>
          Records shared for a screening are treated as confidential and are
          used only to perform that screening. They are not sold, published,
          or shared with third parties.
        </p>
        <p>
          The intake form is for contact details and a general description
          only. Do not send protected health information, privileged
          material, or identifying case details through it. Record transmittal
          is arranged separately once an engagement is confirmed.
        </p>
      </Section>

      <Section heading="Payment">
        <p>
          Payment is processed by Stripe. Card details are entered on
          Stripe&rsquo;s own hosted page and are never entered on, transmitted
          to, or stored by this site. Charges appear on your statement under
          the descriptor shown at checkout.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms, an engagement, or a refund:{" "}
          <a
            href="mailto:megannicolesunde@gmail.com"
            className="text-ivory underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-gold"
          >
            megannicolesunde@gmail.com
          </a>
        </p>
      </Section>

      <div className="mt-16 border-t border-white/[0.06] pt-8">
        <Link
          href="/"
          className="text-sm text-smoke transition-colors hover:text-ivory"
        >
          ← Back to Full Disclosure Verdict
        </Link>
      </div>
    </main>
  );
}
