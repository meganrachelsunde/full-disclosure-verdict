import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Full Disclosure Verdict — Dental Record Screening",
  description:
    "Pre-expert dental record screening for plaintiff and defense counsel. Source-traceable inventory, chronology, gap detection, and contradiction preservation for attorney and licensed-expert handoff.",
  alternates: { canonical: "/" },
};

// Service structured data. Wording stays within PROJECT_SCOPE.md:
// organizational screening only — no opinions or conclusions.
const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://fulldisclosure.agency/#dental-screening",
  name: "Pre-expert dental record screening",
  serviceType: "Dental record organization and screening",
  url: "https://fulldisclosure.agency/",
  provider: { "@id": "https://fulldisclosure.agency/#organization" },
  audience: {
    "@type": "Audience",
    audienceType:
      "Attorneys, legal teams, and licensed dental experts",
  },
  description:
    "Source-traceable record inventory, source-linked chronology, missing-document and gap detection, and contradiction preservation for dental record productions, prepared for attorney and licensed-expert handoff.",
};

export default function Home() {
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
