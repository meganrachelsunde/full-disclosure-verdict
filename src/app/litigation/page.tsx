import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Full Disclosure Verdict — Litigation Record Screening",
  description:
    "Record-integrity intelligence for any case type, any party. Full Disclosure Verdict reconstructs chronology, preserves contradiction and uncertainty, and keeps every material finding traceable to its source.",
};

export default function LitigationPage() {
  return <LandingPage variant="litigation" />;
}
