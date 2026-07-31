# Session Handover

_Updated: 31 July 2026_
_Branch: main_
_Last commit at update: b4fa625_

## Current narrative and status

Programmable Bio operates a compact, fully autonomous R&D lab in Hyderabad.
The cell is operational now; the company is raising capital to expand
instruments, assays, software, throughput, and customer capacity.

The site is now organized around **programmable biology**:

- academic and industry customers enter through a reviewed expression of
  interest;
- launch catalog prices and all deck financials are clearly labeled planning
  assumptions until replaced by measured data;
- Apollo is proposed only, with no signed MoU, clinical access, or endorsement;
- the Biomarker Atlas, APAC network, and case studies are future or illustrative,
  never presented as current assets or completed customer work.

## Work completed

- Rewrote the public pages, retained legacy content only where it could be
  honestly reframed, and generated redirects for 25 removed URLs.
- Added a customer EOI for academia and industry, plus accurate FormSubmit and
  reCAPTCHA disclosures and a privacy notice.
- Rebuilt the public 14-slide investor deck with explicit placeholder economics,
  market-sizing assumptions, roadmap targets, and use-of-funds numbers.
- Updated the competitive landscape and price benchmarks from primary public
  sources as verified on 31 July 2026.
- Fixed navigation semantics, keyboard behavior, mobile overflow, contrast,
  scrollable-table access, reduced-motion handling, and deck dwell analytics.
- Added Eleventy build checks, internal-link/redirect/content checks,
  html-validate, Playwright, axe, Dependabot, and a gated GitHub Pages workflow.

## Verification

```text
npm run check       PASS
npm run test:e2e    PASS: 25 passed, 1 desktop-only skip
npm run audit:ci    PASS: 0 production vulnerabilities
git diff --check    PASS
```

The full development dependency audit still reports four high-severity findings
through Eleventy's `@11ty/recursive-copy -> minimatch -> brace-expansion` chain.
Eleventy is already resolved to 3.1.6; no compatible upstream fix is currently
available. This affects the local/static build toolchain, not shipped browser
code. Dependabot is configured to surface a compatible update.

## Operational notes

- `analyticsEndpoint` in `_data/site.json` is intentionally empty; analytics are
  inert until an endpoint and matching retention policy are configured.
- Forms post to FormSubmit and should be tested with the receiving mailbox
  before launch.
- Reverify prices, competitor facts, Apollo figures, and every planning
  assumption immediately before external circulation.
- No commit or push was made during this update.
