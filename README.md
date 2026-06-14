# Programmable Bio

**LabOS — the agentic operating system for distributed biology.**

AI × Bio platform venture orchestrating multiomics computation,
partner wet labs, and Apollo Hospitals' clinical biobank into closed-loop
discovery for India and APAC.

Live site: [programmablebio.tech](https://programmablebio.tech)

## Development

This site is built with [Eleventy](https://www.11ty.dev/) from templates in `src/` and shared partials in `_includes/`.

```bash
npm install
npm run serve   # local preview at http://localhost:8080
npm run build   # output to _site/
```

GitHub Actions (`.github/workflows/pages.yml`) builds `_site/` and deploys to GitHub Pages on push to `main`. Enable **GitHub Pages → Source: GitHub Actions** in the repository settings if not already configured.

## Pages

Top-level navigation hubs (7 items, with hamburger collapse on mobile):

- **Home** — cover + explore grid
- **Overview** — `market`, `thesis`
- **Platform** — `why-now`, `labos`, `lims`
- **Apollo Moat** — `apollo-partnership`, `competitive-moat`
- **Programs** — `reference-programs` (sub-hub), `offerings`, `customers`, `value-chain`
- **Strategy** — `fal`, `gtm`, `kpis`, `risks`
- **BioHelix** — Singapore APAC hub

Nested under **Reference Programs**:

| Sub-hub | Pages |
|---|---|
| `ivd` | IVD Companion Diagnostics |
| `pharma` (sub-sub-hub) | `target-discovery`, `drug-discovery`, `in-silico`, `preclinical`, `clinical` (teaser), `pharmacovigilance` |

Every topic page has a breadcrumb (`Home › Hub › Topic`) and prev/next nav.

## Project layout

| Path | Purpose |
|---|---|
| `src/` | Page content + front matter |
| `_includes/` | Layout and partials (nav, footer, head) |
| `_data/site.json` | Site-wide metadata |
| `assets/` | CSS, favicon |
| `scripts/migrate.py` | One-time HTML → src migration helper |

## Status

Strategic Blueprint dated April 2026.

## Disclaimer

Financial projections are indicative and scenario-based. Nothing on this site
constitutes an offer of securities.

## Contact

skannan@oncophenomics.com

---

&copy; 2026 Programmable Bio. All rights reserved.
