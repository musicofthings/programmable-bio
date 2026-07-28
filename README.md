# Programmable Bio

**Validation infrastructure for AI-designed biology.**

Scientists order wet-lab validation online. Autonomous labs execute the protocol
and return structured, model-ready data in days — at an India-based cost structure
Western facilities cannot match.

Live site: [programmablebio.tech](https://programmablebio.tech)

## Positioning

The bottleneck in AI × Bio moved from algorithms to validation throughput. Design
capacity exploded; wet-lab capacity did not. The field keeps two ledgers —
*capability* (in silico, cheap, gameable) and *validity* (wet lab, expensive, slow) —
and only the second one gets paid for. We sell throughput on the second ledger.

**Customers:** academic and industry R&D scientists.
**Audience for investor materials:** early-stage VCs.

## Development

Built with [Eleventy](https://www.11ty.dev/) from templates in `src/` and shared
partials in `_includes/`.

```bash
npm install
npm run serve   # local preview at http://localhost:8080
npm run build   # output to _site/
npm run clean   # remove _site/
```

GitHub Actions (`.github/workflows/pages.yml`) builds `_site/` and deploys to
GitHub Pages on push to `main`.

## Site structure

Primary navigation (6 items, hamburger collapse on mobile):

| Page | Purpose |
|---|---|
| `index.html` | The validation-gap thesis, ordering flow, who it's for |
| `how-it-works.html` | Five-step ordering flow, assay catalog, data contract |
| `platform.html` | LabOS — protocol compiler, feasibility agent, scheduler, QC agent, provenance signer |
| `apollo.html` | Apollo clinical substrate and why it compounds |
| `landscape.html` | Honest competitive read: Ginkgo Cloud Lab, Emerald, Lila, Periodic, legacy CROs |
| `investors.html` | Investor materials — **ungated** |

`investor-deck.html` is a public 14-slide deck on its own `deck.njk` layout, with
keyboard navigation, an IntersectionObserver progress tracker, and a print
stylesheet for PDF export.

Supporting pages, linked from the footer:

| Page | Purpose |
|---|---|
| `apollo-partnership.html` | Partnership economics and data-access detail behind `apollo.html` |
| `biomarker-atlas.html` | The dataset the clinical substrate compounds into |
| `case-studies.html` | Worked end-to-end program scenarios |
| `glossary.html` | Terminology reference |
| `biohelix.html` | Singapore APAC node and the India–Singapore corridor |
| `thanks.html` | Form redirect target (noindex, excluded from sitemap) |

The 25 pages from the earlier "Strategic Blueprint" framing (`market`, `thesis`,
`offerings`, `ivd`, `pharmacovigilance`, `reference-programs`, `strategy`,
`competitive-moat`, …) were deleted in the July 2026 repositioning. They carried the
old Discovery-as-a-Service narrative and contradicted the current one. Recover any of
them from git history if needed.

## Analytics

The deck records per-slide dwell time and flushes once on exit via `sendBeacon`.
It is inert until `analyticsEndpoint` is set in `_data/site.json`; with no endpoint
configured it logs to the console and sends nothing. No cookies and no persistent
identifiers are used, so it stays outside consent-banner scope.

## Project layout

| Path | Purpose |
|---|---|
| `src/` | Page content + front matter |
| `_includes/` | Layout and partials (nav, footer, head, breadcrumb) |
| `_data/site.json` | Site metadata, form action, OG image, analytics endpoint |
| `assets/` | CSS, JS, favicon, OG cover image |
| `scripts/migrate.py` | One-time HTML → src migration helper |

## Disclaimer

Financial projections are indicative and scenario-based. Nothing on this site
constitutes an offer of securities.

## Contact

skannan@oncophenomics.com

---

&copy; 2026 Programmable Bio. All rights reserved.
