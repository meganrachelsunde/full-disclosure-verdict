import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Full Disclosure Verdict — Litigation Record Screening",
  description:
    "Record-integrity intelligence for any case type, any party. Full Disclosure Verdict reconstructs chronology, preserves contradiction and uncertainty, and keeps every material finding traceable to its source.",
  alternates: { canonical: "/litigation" },
};

// Service structured data. Wording stays within PROJECT_SCOPE.md:
// organizational screening only — no opinions or conclusions.
const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://fulldisclosure.agency/litigation#litigation-screening",
  name: "Pre-expert litigation record screening",
  serviceType: "Litigation record organization and screening",
  url: "https://fulldisclosure.agency/litigation",
  provider: { "@id": "https://fulldisclosure.agency/#organization" },
  audience: {
    "@type": "Audience",
    audienceType: "Attorneys and legal teams",
  },
  description:
    "Source-traceable record inventory, source-linked chronology, missing-document and gap detection, and contradiction preservation for complex record productions, prepared for attorney and licensed-expert handoff.",
};

export default function LitigationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      <LandingPage variant="litigation" />
    </>
  );
}
