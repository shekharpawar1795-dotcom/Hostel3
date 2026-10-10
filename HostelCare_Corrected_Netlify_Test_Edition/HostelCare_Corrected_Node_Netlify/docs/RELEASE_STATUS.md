# Release status — corrected Node/Netlify test edition

This edition ports the most important HostelCare pilot business policies from `HCMS_HostelCare_Working_Website` into the uploaded Express/EJS stack:

* five roles; student URN authentication and generated first-login secrets
* Rector and Dean hostel grants; staff access to historical assignments
* multiple hostels, rooms, capacity-limited allocations; hostel archiving rules
* complaint create/classify/assign/accept/start/hold/resume/complete
* escalation after 48 hours from the original/new work-cycle start, including late work starts, once per cycle
* eligible auto-closure 48 hours after repair, excluding emergency and escalated cases; 24-hour reminder; 7-day student auto-reopen window
* hashed session cookie, form CSRF, private evidence, admin audit trail and in-app notifications

## Verification

`node --check server.js` and `node --check rules.js` passed, `npm test` passed 8 policy tests, `npm run build` completed the static copy. **npm install and actual Netlify/Supabase integration could not be run in this environment** because npm registry DNS is unavailable. This project **has not been proven to deploy on Netlify**. See README for setup and risks. It is a pilot, not a certified production application.

## Outstanding

Normalized relational persistence, stronger concurrency/retry semantics, browser role-action tests, Supabase integration testing, actual upload round-trip and live scheduled-function verification, backup/restore, MFA, SMTP, malware scanning, monitoring and college IT approval.
