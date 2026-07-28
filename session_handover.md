# Session Handover
_Generated: 2026-07-28T00:05:00Z_
_Branch: main_
_Trigger: user request (usage limit reached) | Context at compact: n/a_
_Compact count this project: 1_

---

## 🎯 Active Task
**What we're building/fixing:**
Repositioned the Programmable Bio site from the old "Strategic Blueprint / Discovery-as-a-Service"
framing to a July-2026 SOTA product narrative: **R&D scientists (academia + industry) order wet-lab
validation online; autonomous labs deliver validation for their in-silico projects.** Investor
materials are aimed at early-stage VCs. Also implemented the four phases from the code review.

**Phase:** Phase 1–4 complete (gate removal, content reposition, deck rewrite, analytics/OG/perf/hygiene)
**Next action:** Decide the fate of the 29 legacy pages that still carry the old positioning — rewrite or delete. Nothing is committed yet.

---

## ✅ Completed This Session
- [x] **Code review** of the gated investor section — found the gate was cosmetic (verified live: `curl` returned HTTP 200 + full deck, no session)
- [x] **Phase 1** — deleted `investor-gate.js` + `investor-access.html`; deck is now public and indexed; removed "Confidential" marking
- [x] **Competitive research** (July 2026): Ginkgo Cloud Lab (launched Mar 2026), Emerald Cloud Lab, Lila Sciences ($350M Series A), Periodic Labs ($300M seed), Autoscience, Automata
- [x] **Rewrote `index.html`** around the validation-gap thesis ("Design got cheap. Proof didn't.")
- [x] **New `how-it-works.html`** — 5-step ordering flow, assay catalog, data contract
- [x] **New `landscape.html`** — honest competitive positioning incl. Ginkgo
- [x] **Rewrote `platform.html`** — LabOS as the layer between model and bench (5 components)
- [x] **Rewrote `investor-deck.html`** — 14 slides for early-stage VCs
- [x] **Rewrote `investors.html`** — ungated, deck linked directly; **captcha re-enabled**
- [x] **New `thanks.html`** — form redirect target
- [x] Reframed `apollo.html` toward validation substrate
- [x] **Phase 2** — deck engagement analytics (per-slide dwell, `sendBeacon` on exit, inert until endpoint set)
- [x] **Phase 3** — OG cover image (1200×630, brand palette) + `summary_large_image` on all pages; PDF export via print stylesheet + "Save as PDF" button
- [x] **Phase 4** — `IntersectionObserver` replaces layout-thrashing scroll handler; nav/footer restructured; README rewritten
- [x] **Bug fix** — 2 stray `</div>` in `src/biohelix.html` (pre-existing); all 40 built pages now well-formed
- [x] Verified: clean build, zero broken internal links, zero malformed HTML

---

## 🔄 In Progress (Exact Resume Point)
**Branch:** `main`
**Last commit:** `3b8c20c Add gated investor section with pitch deck and access form.`
**Next immediate action:** Nothing is committed. Review the working tree, then commit. `git rm` has already staged the two gate-file deletions.

---

## 📋 Remaining Work
1. **Fill the 4 `FILL` markers in the deck** — grep `badge badge-red`: pricing/margin (slide 11), bottom-up TAM (slide 12), roadmap dates + live pilots (slide 13), team bios + raise amount (slide 14). A VC will ask what is running today; slide 13 must answer it.
2. **Publish per-assay pricing** in `how-it-works.html` (also a `FILL` marker) — transparent pricing is the core differentiator vs both legacy CROs and Ginkgo; leaving it blank forfeits the advantage.
3. ~~Decide on the legacy pages~~ **DONE** — 25 deleted (`market`, `thesis`, `overview`, `why-now`, `labos`, `lims`, `programs`, `reference-programs`, `offerings`, `customers`, `value-chain`, `ivd`, `pharma`, `target-discovery`, `drug-discovery`, `in-silico`, `preclinical`, `clinical`, `pharmacovigilance`, `strategy`, `fal`, `gtm`, `kpis`, `risks`, `competitive-moat`). Kept 4 content assets: `glossary`, `biomarker-atlas`, `case-studies`, `apollo-partnership`. Site is now 13 pages.
4. **Set `analyticsEndpoint`** in `_data/site.json` to activate deck analytics (needs a Cloudflare Worker or similar `sendBeacon` sink).
5. Optional: visual QA in a browser — the Chrome extension could not render `localhost` this session (site permission).

---

## 🏗 Architecture Decisions Made
| Decision | Rationale | Date |
|----------|-----------|------|
| Remove the investor gate entirely rather than build a real one | User chose "no restrictions". A static GitHub Pages site cannot enforce auth; the old gate was cosmetic and the "Confidential" marking asserted protection that did not exist | 2026-07-27 |
| Position *against* Ginkgo openly on a dedicated `landscape.html` | Ginkgo Cloud Lab launched Mar 2026 with a near-identical model. Claiming "first" would fail VC scrutiny in seconds; naming it and stating a real wedge is more credible | 2026-07-27 |
| Wedge = cost structure + underserved academic buyer + Apollo clinical substrate | Cost advantages get competed away; the clinical data moat compounds. Ginkgo is defending on price (US ADME launch vs Chinese vendors), which signals price is the battleground | 2026-07-27 |
| Analytics inert until endpoint configured | Avoids shipping a tracker by default; no cookies/persistent IDs keeps it outside consent-banner scope | 2026-07-27 |
| Keep legacy pages rather than delete them | Deleting 29 pages of user-authored content is the user's call, not a routine judgment call | 2026-07-27 |
| No fabricated traction/financials | Deck uses explicit `FILL` badges instead of invented numbers | 2026-07-27 |

---

## 🔧 Commands to Resume
```bash
# On any machine after git pull:
git pull origin main
bash scripts/session_sync.sh --load

# Build / preview:
npm run build
npm run serve   # http://localhost:8080

# Find the placeholders that still need real data:
grep -rn "badge badge-red" src/

# In Claude Code:
# /context-health     — verify hooks are wired
# /handover           — review this file
# /token-status       — check context usage
```

---

## 📁 Files Modified This Session
| File | Status |
|------|--------|
| `README.md` | modified |
| `_data/site.json` | modified |
| `_includes/layouts/deck.njk` | modified |
| `_includes/partials/footer.njk` | modified |
| `_includes/partials/head.njk` | modified |
| `_includes/partials/nav.njk` | modified |
| `assets/investor-deck.css` | modified |
| `assets/investor-deck.js` | rewritten |
| `assets/investor-gate.js` | **deleted (staged)** |
| `assets/og-cover.png` | new |
| `assets/og-cover.svg` | new |
| `src/apollo.html` | modified |
| `src/biohelix.html` | modified (bug fix) |
| `src/index.html` | rewritten |
| `src/investor-access.html` | **deleted (staged)** |
| `src/investor-deck.html` | rewritten |
| `src/investors.html` | rewritten |
| `src/platform.html` | rewritten |
| `src/how-it-works.html` | new |
| `src/landscape.html` | new |
| `src/thanks.html` | new |

---

## 🌿 Git Context
```
Branch  : main
Commit  : 3b8c20c Add gated investor section with pitch deck and access form.
Status  : dirty (nothing committed this session)
```

Recent commits:
```
3b8c20c Add gated investor section with pitch deck and access form.
8343818 Expand site content and add glossary, Atlas, and case study pages.
5a91995 Refactor site to Eleventy with shared layouts and deployment workflow.
8a35b72 Remove confidential investor content from public site
c09c407 Split Reference Programs into Pharma sub-tree; move Market+Thesis off home into Overview hub
```

---

## ⚠️ Critical Rules
- Never commit secrets or API keys
- Run /handover before switching devices
- Deploy is automatic: pushing to `main` publishes to GitHub Pages via `.github/workflows/pages.yml`. **The deck is public — anything committed goes live.**

---

## 🧬 Bioinformatics Context (if applicable)
- Not configured for this project (marketing/venture site, no pipelines)

---
_Auto-updated by `pre-compact.sh` hook and `/handover` skill._
_Read this at the start of every session. Update with `/handover`._
