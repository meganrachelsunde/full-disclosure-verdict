import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment canceled — Full Disclosure Verdict",
  robots: { index: false, follow: false },
};

export default function PaymentCancel() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="glass-panel max-w-lg p-8 text-center sm:p-10">
        <p className="font-mono text-xs uppercase tracking-wider text-smoke">
          Payment canceled
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ivory">
          No charge was made.
        </h1>
        <p className="mt-4 text-sm leading-6 text-smoke">
          You left Stripe before completing payment, so nothing was charged.
          You can try again whenever you are ready, or reach us directly at
          megannicolesunde@gmail.com with any questions.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#pricing"
            className="inline-flex w-full items-center justify-center rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90 sm:w-fit"
          >
            Back to pricing
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
