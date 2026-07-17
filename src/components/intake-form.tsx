"use client";

import { useState } from "react";

const CONTACT_EMAIL = "megannicolesunde@gmail.com";

type Fields = {
  name: string;
  firm: string;
  email: string;
  phone: string;
  caseType: string;
  description: string;
};

const INITIAL: Fields = {
  name: "",
  firm: "",
  email: "",
  phone: "",
  caseType: "",
  description: "",
};

function buildMailto(fields: Fields) {
  const subject = `Case screening request — ${fields.firm || fields.name}`;
  const body = [
    `Name: ${fields.name}`,
    `Firm: ${fields.firm}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.caseType ? `Case type: ${fields.caseType}` : null,
    "",
    "Description:",
    fields.description || "(none provided)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function inputClasses() {
  return "w-full rounded-md border border-white/15 bg-obsidian/40 px-3 py-2.5 text-sm text-ivory placeholder:text-smoke/60 transition-colors focus:border-gold/50 focus:outline-none";
}

export function IntakeForm() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.name || !fields.firm || !fields.email) return;
    window.location.href = buildMailto(fields);
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="intake-name" className="text-xs font-medium text-ivory">
            Name
          </label>
          <input
            id="intake-name"
            type="text"
            required
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            className={`mt-1.5 ${inputClasses()}`}
          />
        </div>
        <div>
          <label htmlFor="intake-firm" className="text-xs font-medium text-ivory">
            Firm / organization
          </label>
          <input
            id="intake-firm"
            type="text"
            required
            value={fields.firm}
            onChange={(e) => update("firm", e.target.value)}
            className={`mt-1.5 ${inputClasses()}`}
          />
        </div>
        <div>
          <label htmlFor="intake-email" className="text-xs font-medium text-ivory">
            Email
          </label>
          <input
            id="intake-email"
            type="email"
            required
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className={`mt-1.5 ${inputClasses()}`}
          />
        </div>
        <div>
          <label htmlFor="intake-phone" className="text-xs font-medium text-ivory">
            Phone <span className="text-smoke">(optional)</span>
          </label>
          <input
            id="intake-phone"
            type="tel"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={`mt-1.5 ${inputClasses()}`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="intake-case-type" className="text-xs font-medium text-ivory">
            Case type <span className="text-smoke">(optional)</span>
          </label>
          <input
            id="intake-case-type"
            type="text"
            placeholder="e.g., dental malpractice"
            value={fields.caseType}
            onChange={(e) => update("caseType", e.target.value)}
            className={`mt-1.5 ${inputClasses()}`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="intake-description" className="text-xs font-medium text-ivory">
            Brief description <span className="text-smoke">(optional)</span>
          </label>
          <textarea
            id="intake-description"
            rows={4}
            value={fields.description}
            onChange={(e) => update("description", e.target.value)}
            className={`mt-1.5 resize-none ${inputClasses()}`}
          />
          <p className="mt-1.5 text-xs text-smoke">
            No patient names or other identifying details, please — this
            form does not accept real records.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-ivory/90 sm:w-fit"
        >
          Request screening
        </button>
        <p className="text-xs text-smoke" aria-live="polite">
          {submitted
            ? "Opening your email client with these details now."
            : "Submitting opens your email client with these details pre-filled — nothing is transmitted automatically."}
        </p>
      </div>
    </form>
  );
}
