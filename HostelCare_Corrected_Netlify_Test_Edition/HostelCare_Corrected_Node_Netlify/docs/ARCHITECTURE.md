# Architecture (Netlify pilot)

Source is Node.js ESM + Express + EJS (not React). `netlify/functions/app.js` wraps the Express app; UI HTML templates live under `views` and static assets copied from `public` to `dist/static`. Backend state is stored in `public.hcms_state` on Supabase PostgreSQL as one versioned JSONB snapshot. Storage bucket `complaint-photos` is **private** and every evidence download is gated by application complaint access control. `netlify/functions/maintenance.mjs` runs every five minutes on published deployments and performs two independent time-dependent workflows in `rules.js`.

Concurrency: each request loads a fresh snapshot. POST completion calls an atomic `hcms_state_commit` compare-and-swap SQL function; if version changed, result is HTTP 409 instead of silently overwriting another user's work. This is intentional for small demos and is not equivalent to normalized row transactions. Hosted instances REQUIRE Supabase configuration. Local development uses a `.local-hcms-data.json` file excluded from version control. No known default passwords or seeded student PII are shipped in this edition.

Known limitations: eventual in-app notification only (SMTP not configured), no production-grade PostgreSQL schema, uploads must be hardened, tests currently verify core policy module and source syntax rather than browser/serverless end-to-end integration.
