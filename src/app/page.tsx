import Link from "next/link";
import {
  FileStack,
  GitCommitVertical,
  SearchX,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EvidencePlanes } from "@/components/evidence-planes";
import { Reveal } from "@/components/reveal";
import { RecordReconstruction } from "@/components/record-reconstruction";
import { DemonstrationExplorer } from "@/components/demonstration-explorer";
import { DifferentiationToggle } from "@/components/differentiation-toggle";
import { IntakeForm } from "@/components/intake-form";

const discernmentPoints = [
  "Evidence remains separate from assertion.",
  "Inference remains separate from fact.",
  "Contradiction is preserved rather than silently resolved.",
  "Missing evidence is not converted into proof.",
  "Uncertainty remains visible until a qualified human resolves it.",
  "Favorable and unfavorable conclusions receive the same scrutiny.",
];

const capabilities = [
  {
    icon: FileStack,
    title: "Record Inventory",
    description:
      "A complete, source-traceable index of every document received — origin, date range, and page count — so nothing in the file is unaccounted for.",
  },
  {
    icon: GitCommitVertical,
    title: "Source-Linked Chronology",
    description:
      "Material events arranged in chronological order, with every entry traceable back to the specific document and page it came from.",
  },
  {
    icon: SearchX,
    title: "Missing-Document & Gap Detection",
    description:
      "Systematic screening for expected-but-absent records and unexplained gaps in the record's timeline, flagged for follow-up.",
  },
  {
    icon: ShieldAlert,
    title: "Contradiction Preservation",
    description:
      "Conflicting entries across sources or dates are surfaced and preserved side by side — not resolved or interpreted — for expert review.",
  },
  {
    icon: Users,
    title: "Attorney & Licensed-Expert Handoff",
    description:
      "Organized, citation-ready materials structured for efficient attorney review and clean referral into licensed-expert analysis.",
  },
];

const accountabilityTags = [
  "Source",
  "Chronology",
  "Reasoning path",
  "Confidence level",
  "Unresolved conflicts",
];

const outOfScope = ["Provide legal advice", "Diagnose patients"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="glass-chrome sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-sm tracking-tight text-ivory sm:text-base">
            Full Disclosure Verdict
          </span>
          <div className="flex items-center gap-6">
            <nav
              aria-label="Primary"
              className="hidden gap-8 text-sm text-smoke sm:flex"
            >
              <a href="#process" className="transition-colors hover:text-ivory">
                Process
              </a>
              <a
                href="#capabilities"
                className="transition-colors hover:text-ivory"
              >
                Capabilities
              </a>
              <a
                href="#demonstration"
                className="transition-colors hover:text-ivory"
              >
                Demonstration
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-ivory"
              >
                Pricing
              </a>
              <a href="#scope" className="transition-colors hover:text-ivory">
                Scope
              </a>
            </nav>
            <a
              href="#get-started"
              className="rounded-md bg-ivory px-4 py-1.5 text-xs font-medium text-obsidian transition-colors hover:bg-ivory/90"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex flex-col">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(200,169,104,0.08),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
            <div>
              <Eyebrow>Record-integrity intelligence</Eyebrow>
              <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.15] tracking-tight text-ivory sm:text-5xl">
                The conclusion is only as defensible as the record that
                produced it.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-smoke">
                Full Disclosure Verdict is record-integrity intelligence for
                complex legal matters. It reconstructs chronology, preserves
                contradiction and uncertainty, and makes every material
                finding answerable to its source—before legal expertise
                turns evidence into strategy.
              </p>
              <div className="mt-10">
                <a
                  href="#scope"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-white/[0.06]"
                >
                  Read the scope statement
                </a>
              </div>
            </div>
            <EvidencePlanes />
          </div>
        </section>

        {/* Process */}
        <section id="process" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-[88rem] px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Reconstruct first. Interpret second.
              </h2>
              <p className="mt-4 text-smoke">
                Separate records retain their source, sequence, conflict, and
                uncertainty. Legal or expert judgment enters only after the
                factual foundation can be inspected.
              </p>
            </Reveal>
            <Reveal className="mt-12">
              <RecordReconstruction />
            </Reveal>
          </div>
        </section>

        {/* Differentiation */}
        <section className="border-b border-white/[0.06] bg-charcoal/18">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>The difference</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Legal tools work from the record. Full Disclosure Verdict
                works on it.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-8 text-smoke">
                <p>
                  Research, drafting, and strategy all depend on the same
                  assumption: that the underlying record is sound.
                </p>
                <p>
                  Full Disclosure Verdict tests that assumption. It
                  reconstructs sequence, preserves contradiction, identifies
                  what is missing, and keeps every material finding tied to
                  its source.
                </p>
              </div>
              <DifferentiationToggle />
            </Reveal>
          </div>
        </section>

        {/* Neutrality */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Same discipline</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                It does not know which side retained it.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-8 text-smoke">
                <p>
                  Plaintiff or defense, the system does not optimize for a
                  preferred conclusion. It shows what the record supports,
                  what it contradicts, and what it cannot yet establish.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Discernment */}
        <section className="border-b border-white/[0.06] bg-charcoal/18">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Discernment</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                A finding is only as credible as its distance from opinion.
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {discernmentPoints.map((point) => (
                <Reveal key={point}>
                  <li className="flex gap-4 border-b border-white/[0.08] pb-5 text-base leading-7 text-ivory">
                    <span
                      className="mt-1 text-gold"
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{point}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>What it organizes</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Five categories of work product.
              </h2>
              <p className="mt-4 text-smoke">
                Each traceable back to the original source documents.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <Reveal key={title}>
                  <div className="glass-panel h-full p-6">
                    <Icon
                      className="size-6 text-gold"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-4 font-display text-lg text-ivory">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-smoke">
                      {description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Fictional demonstration */}
        <section
          id="demonstration"
          className="border-b border-white/[0.06] bg-charcoal/18"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 border-gold/40 text-gold"
              >
                Fictional demonstration — no patient information
              </Badge>
              <h2 className="font-display text-3xl tracking-tight text-ivory">
                Illustrative chronology
              </h2>
              <p className="mt-4 text-smoke">
                Every name, date, and entry below is fabricated for
                illustration only. No real patient, provider, or case
                information appears anywhere in this demonstration.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <DemonstrationExplorer />
            </Reveal>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-b border-white/[0.06] bg-charcoal/18">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Priced below the decision it informs.
              </h2>
              <p className="mt-4 text-smoke">
                A single case screening costs a small fraction of a single
                expert retainer — enough to find out before committing to
                the larger spend.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <Reveal>
                <div className="glass-panel h-full p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-smoke">
                    Screening
                  </p>
                  <p className="mt-3 font-display text-3xl text-ivory">
                    $499
                    <span className="ml-1 text-sm font-sans text-smoke">
                      / case
                    </span>
                  </p>
                  <p className="mt-4 text-sm leading-6 text-smoke">
                    Record inventory, source-linked chronology, gap and
                    contradiction flags, and source trace for one case, one
                    pass — the read before deciding whether to retain an
                    expert.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <div className="glass-panel h-full p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-smoke">
                    Firm / Volume
                  </p>
                  <p className="mt-3 font-display text-3xl text-ivory">
                    Custom
                  </p>
                  <p className="mt-4 text-sm leading-6 text-smoke">
                    For firms screening cases on a recurring basis. Priced
                    per case at volume — contact us for a firm rate.
                  </p>
                </div>
              </Reveal>
            </div>
            <p className="mt-6 max-w-2xl text-xs text-smoke">
              Attorneys and firms who refer other attorneys or firms are
              eligible for a referral credit — ask when you contact us.
            </p>
          </div>
        </section>

        {/* Next step: expert witness referral */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Next step</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Screening tells you whether to make the call. We can make
                the introduction.
              </h2>
              <p className="mt-4 text-smoke">
                Full Disclosure Verdict does not replace an expert
                witness — it determines whether retaining one is
                justified. When a case screens as viable, we can connect
                you directly with a vetted dental expert witness for
                formal engagement.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Get started */}
        <section id="get-started" className="border-b border-white/[0.06] bg-charcoal/18">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Get started</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Submit a case for screening.
              </h2>
              <p className="mt-4 text-smoke">
                A few details are enough to begin. No documents are
                uploaded here — this starts the conversation.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ol className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    number: "01",
                    title: "Submit",
                    description:
                      "A few details about the case — no records required yet.",
                  },
                  {
                    number: "02",
                    title: "Screening",
                    description: "Reviewed within one business day.",
                  },
                  {
                    number: "03",
                    title: "Response",
                    description:
                      "Results, plus an expert witness introduction if the case screens as viable.",
                  },
                ].map((step) => (
                  <li key={step.number} className="glass-flat p-5">
                    <span className="font-mono text-xs text-smoke">
                      {step.number}
                    </span>
                    <p className="mt-2 font-display text-base text-ivory">
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-smoke">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-10">
              <IntakeForm />
            </Reveal>
          </div>
        </section>

        {/* Accountability */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Accountability</Eyebrow>
              <h2 className="mt-4 font-display text-2xl leading-snug tracking-tight text-ivory sm:text-3xl">
                Most systems organize the record. Full Disclosure Verdict
                tests the conclusion against it.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-8 text-smoke">
                <p>
                  It does not stop at collection, chronology, or summary.
                  Each material finding is examined against its source,
                  sequence, conflicts, omissions, and inferential
                  steps—with the reasoning preserved beside the result.
                </p>
                <p className="text-ivory">
                  Organization improves access. Discernment determines what
                  the record can support.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {accountabilityTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white/15 font-mono text-[0.65rem] uppercase tracking-wider text-smoke"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-12 border-l-2 border-gold/60 pl-6 font-display text-2xl leading-snug text-ivory">
                Full Disclosure Verdict does not replace legal expertise. It
                preserves the evidentiary distinctions legal expertise
                depends on.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Scope */}
        <section id="scope" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <div className="max-w-2xl">
              <Eyebrow>Scope</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                This work ends where licensed opinion begins.
              </h2>
              <p className="mt-4 text-smoke">
                Full Disclosure Verdict identifies what the record supports,
                where it conflicts, what is absent, and what remains
                unresolved. It does not determine standard of care,
                causation, damages, or case merit.
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-smoke">
              {outOfScope.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <span>{item}</span>
                  {i !== outOfScope.length - 1 && (
                    <span aria-hidden="true" className="text-smoke/40">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="glass-chrome border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-display text-sm text-ivory">
            Full Disclosure Verdict
          </p>
          <p className="mt-1.5 text-xs text-smoke">
            Megan Sunde · Minnesota Licensed Dental Assistant · 15+ Years
            Clinical Practice · National DANB Credentialing
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-smoke">
            Full Disclosure Verdict organizes records for pre-expert review.
            It does not provide legal advice, diagnose patients, or
            determine standard of care, causation, damages, or case merit.
            No document-upload functionality is active in this build.
          </p>
          <p className="mt-4 text-xs text-smoke">
            <Link
              href="#scope"
              className="underline underline-offset-4 hover:text-ivory"
            >
              Full scope statement
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
