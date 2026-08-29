import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Full Disclosure Verdict — Dental Record Screening",
  description:
    "Pre-expert dental record screening for plaintiff and defense counsel. Source-traceable inventory, chronology, gap detection, and contradiction preservation for attorney and licensed-expert handoff.",
  alternates: { canonical: "/dental" },
  // The root layout's Open Graph block describes the primary litigation
  // page, so override it here or a shared /dental link previews as
  // litigation.
  openGraph: {
    title: "Full Disclosure Verdict — Dental Record Screening",
    description:
      "Pre-expert dental record screening for plaintiff and defense counsel, by a dental professional with 15+ years of clinical practice.",
    url: "https://fulldisclosure.agency/dental",
  },
  twitter: {
    card: "summary",
    title: "Full Disclosure Verdict — Dental Record Screening",
    description:
      "Pre-expert dental record screening for plaintiff and defense counsel, by a dental professional with 15+ years of clinical practice.",
  },
};

// Service structured data. Wording stays within PROJECT_SCOPE.md:
// organizational screening only — no opinions or conclusions.
const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://fulldisclosure.agency/dental#dental-screening",
  name: "Pre-expert dental record screening",
  serviceType: "Dental record organization and screening",
  url: "https://fulldisclosure.agency/dental",
  provider: { "@id": "https://fulldisclosure.agency/#organization" },
  audience: {
    "@type": "Audience",
    audienceType: "Attorneys, legal teams, and licensed dental experts",
  },
  description:
    "Source-traceable record inventory, source-linked chronology, missing-document and gap detection, and contradiction preservation for dental record productions, prepared for attorney and licensed-expert handoff.",
};

export default function DentalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      <LandingPage variant="dental" />
    </>
  );
}
