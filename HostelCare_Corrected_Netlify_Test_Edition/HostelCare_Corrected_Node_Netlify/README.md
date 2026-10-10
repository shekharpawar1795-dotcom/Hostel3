# HostelCare — corrected Node/Express/EJS Netlify testing pilot

This is a revision of the **user-uploaded `hostel (1).zip`**, based on the workflows from the original `HCMS_HostelCare_Working_Website` reference. **This ZIP uses Node.js, Express and EJS—not React**. It reuses the supplied responsive UI; do not label it a React migration.

## Included technology

- **Frontend:** HTML, EJS templates, original responsive CSS and JavaScript
- **Server:** Node.js / Express, wrapped as a **Netlify Function**
- **State/database:** Supabase Postgres `hcms_state` JSONB row with version-based compare-and-swap writes
- **Private evidence:** Supabase Storage bucket (private); authenticated photo download
- **Background deadlines:** Netlify Scheduled Function (`*/5 * * * *`)
- **Authentication:** URN/login ID, scrypt (Node.js crypto), session cookies with hashed session token, first-login reset, form CSRF

This single-row JSONB store was chosen to preserve the uploaded program's Map-based route/UI structure while removing serverless-incompatible in-memory persistence. It **is not** a normalized relational schema, and concurrent updates can return HTTP 409 instead of silently losing data. Not recommended for a large cohort or college production. No institutional/production data until a security and privacy review.

## Run locally (Windows CMD)

1. Install Node.js **20 or newer** from https://nodejs.org.
2. Extract this ZIP, open the **`HostelCare_Corrected_Node_Netlify`** folder, click File Explorer's address bar, enter `cmd`, press Enter.
3. Run:

   ```cmd
   npm install
   copy .env.example .env
   ```
4. Open `.env` in Notepad; replace `SESSION_SECRET` with a long randomly generated string. To generate one, run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste it into `.env`.
5. Optional: leave Supabase settings blank for **local-only test data** saved in `.local-hcms-data.json`. For Netlify, Supabase settings are **mandatory**.
6. Run:

   ```cmd
   node scripts\bootstrap-admin.js
   npm run dev
   ```
7. Open **http://localhost:3000**. Sign in as `HCMSADMIN` using the randomly generated password printed at bootstrap. Change it at first login.
8. In a second CMD window run `node --env-file=.env scripts\local-worker.js` to exercise the 48-hour background rules during local testing.
9. Create fictional hostels, rooms, staff roles and student accounts. Do not use old demo passwords from the uploaded ZIP.

Local-only `.local-hcms-data.json` is created inside the project folder; **never upload it**. `npm test` runs the policy tests without starting the website.

## Netlify + Supabase (free-tier test; not production)

1. Create a Supabase Free project at https://supabase.com, and run **`sql/setup.sql`** in its SQL Editor.
2. Create a **private** Storage bucket named `complaint-photos` in Supabase. Do NOT make it public.
3. On your own computer, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the private `.env` file. You get these values from your own Supabase project settings; **do not send them in this chat or commit to Git**.
4. With `.env` configured, run `node scripts/bootstrap-admin.js` to initialize an administrator in your Supabase test database.
5. Push the project **source files** (not `.env`, `.local-hcms-data.json`, or `node_modules`) to a **private GitHub repository**.
6. Connect that repository in Netlify (https://app.netlify.com). Let it use the provided `netlify.toml` build configuration. Build command: `npm run build`, publish: `dist`, functions: `netlify/functions`.
7. In Netlify's Site configuration → Environment variables, add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET=complaint-photos`, `SESSION_SECRET` (strong random 48+ characters), and `NODE_ENV=production`.
8. Deploy, visit your `*.netlify.app` address and test all five roles using fictional accounts. In the Netlify Functions screen verify the scheduled `maintenance` function is present with the `Scheduled` label. It runs on the **published** deploy, not automatically in local Netlify Dev.
9. Confirm photos remain private when logged out; check account access is restricted to assigned hostels. Test deadlines through the included policy test suite before operational trials.

Netlify free tiers have credit/usage limits; Supabase Free may pause after inactivity. Their 5-minute cron is **best effort**, not an exact SLA. Email delivery is **not implemented** (in-app notifications only). Existing local SQLite data is **not migrated**. Admin/bootstrap account credentials are for fictional pilots only. Database state is one JSONB row and should ultimately migrate to normalized SQL for true multiuser reliability.

## Features & policies

Exactly five roles: STUDENT, RECTOR, MAINTENANCE_STAFF, DEAN, SYSTEM_ADMIN. URN login, mandatory first-login password change, independent role/hostel scope, assigned-room complaint creation, Rector task assignment, staff accept/start/progress/hold/resume/complete, student confirm/reopen, admin hostels/rooms/student import/allocations/scopes/password resets, in-app notices, private photo evidence. The current implementation includes:

- No-start escalation **48h after each work cycle started**, even if a technician starts after the deadline (records historical breach).
- Student repair confirmation **48h after completion** for ordinary non-escalated cases, with 24h reminder.
- Escalated/emergency cases require Rector verification rather than automatic closure.
- Eligible auto-closed complaints may be reopened during **7 days** after automatic closure, restarting the independent work cycle.

Important incomplete items: production security review, MFA, file malware scan, robust SMTP delivery, normalized transactional schema, multiuser load tests, off-site backups, monitoring, institution approvals. This package has not been publicly deployed or end-to-end browser-tested in this sandbox.

**Netlify test upload restriction:** up to 3 image files, each at most 1 MB (serverless request limits); a hosted college version would need direct authenticated-to-storage uploads for larger photos.
