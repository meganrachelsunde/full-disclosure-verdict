import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment received — Full Disclosure Verdict",
  robots: { index: false, follow: false },
};

export default function PaymentSuccess() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="glass-panel max-w-lg p-8 text-center sm:p-10">
        <p className="font-mono text-xs uppercase tracking-wider text-smoke">
          Payment received
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ivory">
          Thank you — your screening fee is paid.
        </h1>
        <p className="mt-4 text-sm leading-6 text-smoke">
          A receipt is on its way to your email from Stripe. If you have not
          already submitted the case details, do that next and we will begin
          the screening — reviewed within one business day.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#get-started"
            className="inline-flex w-full items-center justify-center rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90 sm:w-fit"
          >
            Submit case details
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:border-gold/50 sm:w-fit"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
