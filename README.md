# Programmable Bio

**Autonomous experiments for programmable biology.**

Programmable Bio operates a compact, fully autonomous R&D lab in Hyderabad,
India. The public site explains the operational cell, the LabOS execution layer,
selected customer-pilot access, the scale-up plan, and investor materials.

Live site: [programmablebio.tech](https://programmablebio.tech)

## Current status

- The Hyderabad autonomous R&D cell is operational.
- Prospective academic and industry customers can submit an expression of
  interest for selected pilots.
- Public catalog prices and service levels are launch planning assumptions until
  each workflow is qualified and opened for ordering.
- The Apollo collaboration is proposed only. No MoU, data access, biospecimen
  access, patient access, exclusivity, or commercial agreement is signed.
- Investor-deck numbers labeled **Planning assumptions** are illustrative drafts,
  not historical performance or binding forecasts.

## Development

The site is built with [Eleventy](https://www.11ty.dev/) from templates in
`src/` and shared partials in `_includes/`.

```bash
npm install
npm run serve
npm run build
npm run check
npm run test:e2e
```

`npm run check` builds the site, validates generated HTML, checks internal links
and redirects, and rejects stale positioning terms or unfinished placeholders.
The Playwright suite runs accessibility and responsive smoke tests.

GitHub Actions builds, validates, tests, and deploys to GitHub Pages on pushes to
`main`.

## Public information architecture

| Page | Purpose |
|---|---|
| `/` | Operational status, programmable-biology narrative, customer CTA |
| `/how-it-works.html` | Pilot workflow, target launch prices, data contract |
| `/platform.html` | Hyderabad cell, LabOS, and scale-out path |
| `/apollo.html` | Explicitly proposed Apollo collaboration |
| `/landscape.html` | Current competitor facts with primary-source links |
| `/express-interest.html` | Customer EOI for academia and industry |
| `/investors.html` | Investor summary and enquiry form |
| `/investor-deck.html` | Public 14-slide deck |
| `/case-studies.html` | Clearly labeled illustrative pilot scenarios |
| `/biomarker-atlas.html` | Future Atlas concept, not a current asset |
| `/apollo-partnership.html` | Proposed collaboration principles and gates |
| `/biohelix.html` | Future APAC expansion concept |
| `/glossary.html` | Current terminology and status definitions |
| `/privacy.html` | Website forms, processors, retention, and analytics |
| `/404.html` | Custom not-found page |

The 25 URLs removed during the July 2026 repositioning are generated as
noindex redirect pages from `_data/redirects.json`.

## Forms and privacy

The investor and customer EOI forms use
[FormSubmit](https://formsubmit.co/) to forward submissions to
`skannan@oncophenomics.com`. FormSubmit uses Google reCAPTCHA by default and
documents a 30-day submission archive. The forms must
not be used for confidential sequences, patient data, regulated records, or
other sensitive project materials. See `/privacy.html`.

Before relying on the forms in production:

1. Submit each live form once and confirm FormSubmit's activation email in the
   receiving mailbox.
2. Verify the redirect to `https://programmablebio.tech/thanks.html` and confirm
   that replies target the submitter's `email` field.
3. Replace the email-address endpoint in `_data/site.json` with FormSubmit's
   confirmed random-string endpoint if hiding the receiving address is desired.

The form markup keeps reCAPTCHA enabled, supplies absolute `_next` and `_url`
values, uses FormSubmit's `table` template, and includes a CSS-hidden `_honey`
field.

## Analytics

Deck engagement analytics remain disabled while `analyticsEndpoint` is empty in
`_data/site.json`. If enabled, the deck records active per-slide dwell time,
deepest slide, referrer, and a per-visit random identifier without setting a
persistent browser identifier. The privacy notice must be kept aligned with the
configured endpoint and actual server-side handling.

## Project layout

| Path | Purpose |
|---|---|
| `src/` | Page content and generated redirect template |
| `_includes/` | Layouts and shared partials |
| `_data/site.json` | Site metadata, form action, analytics endpoint |
| `_data/redirects.json` | Legacy URL mapping |
| `assets/` | CSS, JavaScript, favicon, and social image |
| `scripts/check-site.mjs` | Local link, redirect, and content checks |
| `tests/` | Playwright accessibility and responsive smoke tests |

## Disclaimer

Financial projections and figures labeled as planning assumptions are
illustrative and scenario-based. Nothing on this site constitutes an offer of
securities.
