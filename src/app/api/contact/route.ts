import { NextResponse } from "next/server";

// Screening-request notifications only. No documents, no uploads, no
// patient or case records pass through here — the intake form collects
// contact details and a free-text description the user is explicitly
// warned to keep free of identifying information.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "megannicolesunde@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "intake@fulldisclosure.agency";

const MAX_FIELD = 500;
const MAX_DESCRIPTION = 5000;

type Payload = {
  name?: unknown;
  firm?: unknown;
  email?: unknown;
  phone?: unknown;
  caseType?: unknown;
  description?: unknown;
  variant?: unknown;
};

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!resendKey && !web3formsKey) {
    // Unconfigured: the client falls back to its mailto flow.
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const name = str(body.name, MAX_FIELD);
  const firm = str(body.firm, MAX_FIELD);
  const email = str(body.email, MAX_FIELD);
  const phone = str(body.phone, MAX_FIELD);
  const caseType = str(body.caseType, MAX_FIELD);
  const description = str(body.description, MAX_DESCRIPTION);
  const variant = body.variant === "litigation" ? "litigation" : "dental";

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const text = [
    `Name: ${name}`,
    firm ? `Firm: ${firm}` : null,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    caseType ? `Case type: ${caseType}` : null,
    `Practice area: ${variant}`,
    "",
    "Description:",
    description || "(none provided)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const subject = `Case screening request (${variant}) — ${firm || name}`;

  // Resend (verified domain) is preferred when configured; Web3Forms
  // needs no domain setup and delivers to the account's email.
  const res = resendKey
    ? await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Full Disclosure Verdict <${FROM_EMAIL}>`,
          to: [TO_EMAIL],
          reply_to: email,
          subject,
          text,
        }),
      })
    : await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: web3formsKey,
          from_name: "Full Disclosure Verdict",
          replyto: email,
          subject,
          message: text,
        }),
      });

  if (!res.ok) {
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
