"use client";

import { useState } from "react";

// Sends the visitor to Stripe's hosted Checkout page for the one-time
// Case screening fee. No card details are entered on this site.
export function PayButton({
  className = "",
  label = "Pay the screening fee",
}: {
  className?: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handlePay() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("checkout unavailable");
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("no url");
      window.location.href = url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90 disabled:opacity-60 sm:w-fit"
      >
        {status === "loading" ? "Redirecting to Stripe…" : label}
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs text-smoke" aria-live="polite">
          Payment is temporarily unavailable. Please try again shortly, or
          reach us directly at megannicolesunde@gmail.com.
        </p>
      )}
    </div>
  );
}
