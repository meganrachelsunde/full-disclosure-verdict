# Security — Full Disclosure Verdict

## Current status

This build contains **no document-upload functionality** and **no
handling of real patient or case data**. There is no data-processing
pipeline, authentication system, or storage layer to secure yet.

The only content in this build is:

- Static marketing/informational pages
- A clearly marked fictional demonstration area with fabricated,
  non-real data

## Before real records are handled

Real dental records are sensitive personal and medical information.
Before any upload, storage, or processing of real records is built,
the following must be reviewed and explicitly approved:

- Data classification and handling policy
- Encryption at rest and in transit
- Access control and authentication model
- Retention and deletion policy
- Audit logging
- Legal and regulatory review (including applicable health-privacy
  law)
- Third-party service review for any processor that would touch real
  records

No document-upload or real-record-handling feature will be
implemented until this review is complete and approved.

## Secrets

- No API keys, credentials, or secrets are present in this
  repository.
- `.env.example` lists required environment variable **names only**,
  with no values.
- Real values must never be committed. `.env*` files (other than
  `.env.example`) are excluded via `.gitignore`.

## Reporting

This is an early-stage internal project. Security concerns should be
raised directly with the project owner before any external disclosure.
