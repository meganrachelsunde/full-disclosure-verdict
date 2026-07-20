import type { Metadata } from "next";
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
  title: "Full Disclosure Verdict",
  description:
    "Record-integrity intelligence for complex legal matters. Full Disclosure Verdict reconstructs chronology, preserves contradiction and uncertainty, and keeps every material finding traceable to its source.",
};

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
