# Feature checklist versus original HCMS_HostelCare_Working_Website

This review is based on the uploaded Node/EJS implementation and the original working Python reference. The checkboxes indicate **source code paths**, not confirmed browser / deployed test coverage.

| Requirement | Corrected Node pilot status | Caveat |
|---|---|---|
| Exactly 5 roles | Implemented | No full browser test yet |
| URN student sign-in, first-time password reset | Implemented | New accounts; no import of old Python password hashes |
| Student name and phone editable, URN admin-controlled | Implemented | Local form |
| Multiple hostels/rooms and role scope | Implemented | CAS snapshot storage is demo-scale |
| Delete only unused hostel; archive after resolving/transferring | Implemented | Audit record retained |
| Student filing from assigned active room | Implemented | Max 3 photos of 1 MB each for Netlify |
| Rector review/classify/assign/reject/reopen/verify | Implemented | Input/state checks tightened |
| Staff accept/start/hold/resume/progress/complete | Implemented | Must record real work and notes |
| Student confirmation, feedback, eligible reopens | Implemented | Risky cases await Rector verification |
| Dean 48h no-start escalation per work cycle | Policy tests passed | Scheduled function needs live deploy test |
| Separate 48h auto-close after completion | Policy tests passed | Emergency/escalated exceptions |
| 24h reminder and seven-day auto-reopen | Policy tests passed | In-app notification only |
| Private photo viewing | Implemented | Requires private Supabase Storage bucket and live test |
| Distinct initial passwords and admin reset | Implemented | scrypt + forced first-login change |
| Admin audit/history, notifications | Implemented | No outgoing SMTP |
| Production-grade relational schema, MFA, backups, load testing | Not included | Do not use for real college deployment |
| Actual React frontend | **Not included** | Uploaded ZIP uses Express/EJS; a separate UI rewrite would be required |

**Testing performed:** `node --check`, `npm test` (9 tests), static build. **Not performed:** npm dependency installation, end-to-end HTTP/browser tests, Netlify deployment and Supabase upload. A network-isolated environment prevented npm package download. See `docs/RELEASE_STATUS.md`.
