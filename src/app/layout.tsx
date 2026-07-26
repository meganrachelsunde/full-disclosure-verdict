import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fulldisclosure.agency"),
  title: {
    default: "Full Disclosure Verdict",
    template: "%s | Full Disclosure Verdict",
  },
  description:
    "Record-integrity intelligence for complex legal matters. Full Disclosure Verdict reconstructs chronology, preserves contradiction and uncertainty, and keeps every material finding traceable to its source.",
  openGraph: {
    type: "website",
    siteName: "Full Disclosure Verdict",
    url: "https://fulldisclosure.agency",
    title: "Full Disclosure Verdict",
    description:
      "Record-integrity intelligence for complex legal matters. Pre-expert record screening for plaintiff and defense counsel.",
  },
  twitter: {
    card: "summary",
    title: "Full Disclosure Verdict",
    description:
      "Record-integrity intelligence for complex legal matters. Pre-expert record screening for plaintiff and defense counsel.",
  },
  // Set GOOGLE_SITE_VERIFICATION in the environment to emit the
  // google-site-verification meta tag Search Console asks for. DNS
  // verification (a TXT record on the domain) works without this.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// Organization + WebSite structured data for Google rich results.
// Descriptions must stay within PROJECT_SCOPE.md: organizational
// screening work only — no opinions, diagnoses, or conclusions.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fulldisclosure.agency/#organization",
      name: "Full Disclosure Verdict",
      url: "https://fulldisclosure.agency",
      email: "megannicolesunde@gmail.com",
      description:
        "Pre-expert record screening for legal teams: source-traceable inventory, chronology, gap detection, and contradiction preservation for attorney and licensed-expert handoff.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Case screening intake",
        email: "megannicolesunde@gmail.com",
        url: "https://fulldisclosure.agency/#get-started",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://fulldisclosure.agency/#website",
      url: "https://fulldisclosure.agency",
      name: "Full Disclosure Verdict",
      publisher: { "@id": "https://fulldisclosure.agency/#organization" },
    },
  ],
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        <div className="bg-ambient" aria-hidden="true">
          <span className="bg-ambient-blob bg-ambient-blob-1" />
          <span className="bg-ambient-blob bg-ambient-blob-2" />
          <span className="bg-ambient-blob bg-ambient-blob-3" />
          <span className="bg-ambient-blob bg-ambient-blob-4" />
        </div>
        {children}
      </body>
    </html>
  );
}
