import Link from "next/link";
import {
  FileStack,
  GitCommitVertical,
  SearchX,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EvidencePlanes } from "@/components/evidence-planes";
import { PayButton } from "@/components/pay-button";
import { HeroBookVideo } from "@/components/hero-book-video";
import { ProcessBookVideo } from "@/components/process-book-video";
import { Reveal } from "@/components/reveal";
import { DemonstrationExplorer } from "@/components/demonstration-explorer";
import { DifferentiationToggle } from "@/components/differentiation-toggle";
import { IntakeForm } from "@/components/intake-form";
import { PracticeAreaTabs } from "@/components/practice-area-tabs";
import { LitigationExamination } from "@/components/litigation-examination";

export type PracticeAreaVariant = "dental" | "litigation";

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
  {
    label: "Source",
    description:
      "Every finding is traceable back to the specific document and page it came from — nothing is asserted without a citation into the record.",
  },
  {
    label: "Chronology",
    description:
      "Findings are placed in sequence, so what happened before and after a given entry is never lost or reordered to fit a narrative.",
  },
  {
    label: "Reasoning path",
    description:
      "The steps from source document to conclusion are preserved and visible, not collapsed into an unexplained result.",
  },
  {
    label: "Confidence level",
    description:
      "Each finding is marked by how well the record actually supports it — supported, contradicted, incomplete, or unresolved — never flattened into a single verdict.",
  },
  {
    label: "Unresolved conflicts",
    description:
      "Contradictions between sources are preserved side by side for review, not silently resolved in either direction.",
  },
];

const content: Record<
  PracticeAreaVariant,
  {
    heroSubline: string;
    nextStepParagraph: string;
    getStartedStep3: string;
    caseTypePlaceholder: string;
    identifyingDetailsWarning: string;
    outOfScope: string[];
    demoBadge: string;
    demoDisclaimer: string;
  }
> = {
  dental: {
    heroSubline:
      "Pre-expert dental record screening for plaintiff and defense counsel.",
    nextStepParagraph:
      "Full Disclosure Verdict does not replace an expert witness — it gives counsel a source-linked record assessment to inform the decision whether to retain a licensed expert. When the record identifies questions requiring evaluation by a licensed dental expert, we can connect you directly with a vetted dental expert witness for formal engagement.",
    getStartedStep3:
      "Results, plus an expert witness introduction when the record identifies questions requiring evaluation by a licensed dental expert.",
    caseTypePlaceholder: "e.g., dental malpractice",
    identifyingDetailsWarning:
      "No patient names or other identifying details, please — do not enter real records here or in the email this opens.",
    outOfScope: ["Provide legal advice", "Diagnose patients"],
    demoBadge: "Fictional demonstration — no patient information",
    demoDisclaimer:
      "Every name, date, and entry below is fabricated for illustration only. No real patient, provider, or case information appears anywhere in this demonstration.",
  },
  litigation: {
    heroSubline:
      "Pre-expert record screening for plaintiff and defense counsel — any case type, any party.",
    nextStepParagraph:
      "Full Disclosure Verdict does not replace an expert witness — it gives counsel a source-linked record assessment to inform the decision whether to retain a licensed expert. When the record identifies questions requiring evaluation by a licensed expert in the relevant field, we can connect you directly with a vetted expert witness for formal engagement.",
    getStartedStep3:
      "Results, plus an expert witness introduction when the record identifies questions requiring evaluation by a licensed expert in the relevant field.",
    caseTypePlaceholder: "e.g., personal injury, medical malpractice, contract dispute",
    identifyingDetailsWarning:
      "No client, party, or other identifying details, please — do not enter real records here or in the email this opens.",
    outOfScope: [
      "Provide legal advice",
      "Provide diagnostic or clinical opinions",
    ],
    demoBadge: "Fictional demonstration — no real party information",
    demoDisclaimer:
      "Every name, date, and entry below is fabricated for illustration only. No real party, provider, or case information appears anywhere in this demonstration.",
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
      {children}
    </p>
  );
}

export function LandingPage({ variant }: { variant: PracticeAreaVariant }) {
  const copy = content[variant];

  // Card payment is offered only once a live Stripe key is present. A test
  // key would send a real client to a Checkout page that rejects their card,
  // so until then the pricing card routes to intake instead. Swapping the
  // key in the environment turns the pay button back on by itself.
  const paymentsLive =
    process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false;

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
                href="#accountability"
                className="transition-colors hover:text-ivory"
              >
                Accountability
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
        <div className="border-t border-white/[0.06] bg-obsidian/40">
          <div className="mx-auto flex max-w-6xl px-6 py-2.5">
            <PracticeAreaTabs active={variant} />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex flex-col">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden border-b border-white/[0.06]">
          <HeroBookVideo />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(200,169,104,0.08),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
            <div className="hero-glass-panel max-w-xl p-8 sm:p-10 lg:p-12">
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
              <p className="mt-4 max-w-xl text-sm text-smoke">
                {copy.heroSubline}
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
          </div>
        </section>

        {/* Process + Accountability — one continuous filmed backdrop,
            no divider between them so the footage reads as a single
            band behind both. */}
        <div className="relative overflow-hidden border-b border-white/[0.06]">
          <ProcessBookVideo />

          {/* Process */}
          <section id="process">
            <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>The record</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                The absence of gaps is not the presence of proof.
              </h2>
              <p className="mt-4 text-smoke">
                A record can be complete and still unexamined. Screening
                establishes what it supports, where it conflicts, and what
                remains unresolved.
              </p>
            </Reveal>
            </div>
          </section>

          {/* Accountability */}
          <section id="accountability">
            <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
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
              <Accordion multiple className="mt-8 border-t border-white/[0.08]">
                {accountabilityTags.map((tag) => (
                  <AccordionItem
                    key={tag.label}
                    value={tag.label}
                    className="border-white/[0.08]"
                  >
                    <AccordionTrigger className="font-mono text-xs uppercase tracking-wider text-smoke hover:text-ivory">
                      {tag.label}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-smoke">
                      {tag.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-12 border-l-2 border-gold/60 pl-6 font-display text-2xl leading-snug text-ivory">
                Full Disclosure Verdict does not replace legal expertise. It
                preserves the evidentiary distinctions legal expertise
                depends on.
              </p>
            </Reveal>
            </div>
          </section>
        </div>

        {/* Differentiation */}
        <section className="border-b border-white/[0.06] bg-charcoal/18">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              {variant === "litigation" ? (
                <LitigationExamination />
              ) : (
                <>
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
                </>
              )}
            </Reveal>
          </div>
        </section>

        {/* Neutrality */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Same discipline</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                Evidence owes nothing to the side that offers it.
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
                A finding is only as defensible as the path between source
                and conclusion.
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
                The record does not testify until it is examined.
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
                {copy.demoBadge}
              </Badge>
              <h2 className="font-display text-3xl tracking-tight text-ivory">
                Illustrative demonstration
              </h2>
              <p className="mt-4 text-smoke">{copy.demoDisclaimer}</p>
            </Reveal>

            <Reveal className="mt-14">
              <div className="glass-panel p-6 sm:p-8">
                <EvidencePlanes variant={variant} />
              </div>
            </Reveal>

            <div className="my-14 border-t border-white/[0.06]" aria-hidden="true" />

            <Reveal>
              <h3 className="font-display text-xl tracking-tight text-ivory">
                Chronology table
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-smoke">
                The same kind of record, laid out as a filterable,
                source-linked timeline.
              </p>
              <div className="mt-6">
                <DemonstrationExplorer variant={variant} />
              </div>
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
                  {paymentsLive ? (
                    <PayButton className="mt-6" label="Pay the screening fee" />
                  ) : (
                    <a
                      href="#get-started"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90 sm:w-fit"
                    >
                      Request screening
                    </a>
                  )}
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
          </div>
        </section>

        {/* Next step: expert witness referral */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow>Next step</Eyebrow>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ivory">
                We do not supply the opinion. We supply the expert.
              </h2>
              <p className="mt-4 text-smoke">{copy.nextStepParagraph}</p>
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
                    description: copy.getStartedStep3,
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
              <IntakeForm
                caseTypePlaceholder={copy.caseTypePlaceholder}
                identifyingDetailsWarning={copy.identifyingDetailsWarning}
                variant={variant}
              />
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
              {copy.outOfScope.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <span>{item}</span>
                  {i !== copy.outOfScope.length - 1 && (
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
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-smoke">
            <Link
              href="#scope"
              className="underline underline-offset-4 hover:text-ivory"
            >
              Full scope statement
            </Link>
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-ivory"
            >
              Terms and refund policy
            </Link>
            <a
              href="mailto:megannicolesunde@gmail.com"
              className="underline underline-offset-4 hover:text-ivory"
            >
              megannicolesunde@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
