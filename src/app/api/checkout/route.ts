import { NextResponse } from "next/server";
import Stripe from "stripe";

// One-time Case screening fee. No product catalog and no stored payment
// data — a single fixed-price hosted Checkout Session, created on demand
// and paid on Stripe's own page. Nothing here touches patient or case
// records; it only collects the screening fee.
const AMOUNT_CENTS = 49900; // $499.00 — matches the published Screening price
const PRODUCT_NAME = "Case screening";
const PRODUCT_DESCRIPTION =
  "Record inventory, source-linked chronology, gap and contradiction flags, " +
  "and source trace for one case, one pass.";

export const dynamic = "force-dynamic";

function siteOrigin(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Unconfigured (e.g. no Stripe env vars pulled): fail closed.
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  // Instantiated per-request rather than at module scope so a missing key
  // never throws at build/import time.
  const stripe = new Stripe(secretKey);
  const origin = siteOrigin(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
            },
            unit_amount: AMOUNT_CENTS,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay/cancel`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "no session url" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Server log only — the client gets a generic message. Stripe redacts the
    // key in its own error text, so this is safe to record.
    console.error(
      "Stripe checkout session failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: "checkout failed" }, { status: 502 });
  }
}
