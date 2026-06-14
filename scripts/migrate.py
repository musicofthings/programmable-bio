#!/usr/bin/env python3
"""One-time migration: extract page bodies from root HTML into src/ with Eleventy front matter."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PAGE_META: dict[str, dict] = {
    "index.html": {
        "title": "Strategic Blueprint",
        "description": "LabOS — the agentic operating system for distributed biology. India's agentic lab OS for multiomics, partner wet labs, and Apollo clinical biobank.",
        "navActive": "home",
        "permalink": "/",
    },
    "overview.html": {
        "title": "Overview",
        "description": "Market context and core strategic thesis for Programmable Bio's Discovery-as-a-Service platform.",
        "navActive": "overview",
        "hub": True,
    },
    "market.html": {
        "title": "Market Context",
        "description": "The 2026 autonomous lab revolution — commercial takeoff, competitive landscape, and India/APAC opportunity.",
        "navActive": "overview",
        "breadcrumb": [
            {"label": "Overview", "url": "overview.html"},
            {"label": "Market Context"},
        ],
        "next": {"title": "Strategic Thesis", "url": "thesis.html"},
        "pageNavHub": {"label": "All Overview topics", "url": "overview.html"},
    },
    "thesis.html": {
        "title": "Strategic Thesis",
        "description": "Discovery-as-a-Service — orchestrating multiomics computation, partner wet labs, and Apollo's clinical biobank.",
        "navActive": "overview",
        "breadcrumb": [
            {"label": "Overview", "url": "overview.html"},
            {"label": "Strategic Thesis"},
        ],
        "prev": {"title": "Market Context", "url": "market.html"},
        "pageNavHub": {"label": "All Overview topics", "url": "overview.html"},
    },
    "platform.html": {
        "title": "Platform",
        "description": "How LabOS works — the agentic operating system, why it is buildable now, and LIMS integration.",
        "navActive": "platform",
        "hub": True,
    },
    "why-now.html": {
        "title": "Why Now",
        "description": "The 2026 step-change — four waves converge into a buildable window for agentic lab infrastructure.",
        "navActive": "platform",
        "breadcrumb": [
            {"label": "Platform", "url": "platform.html"},
            {"label": "Why Now"},
        ],
        "next": {"title": "LabOS Agentic Architecture", "url": "labos.html"},
        "pageNavHub": {"label": "All Platform topics", "url": "platform.html"},
    },
    "labos.html": {
        "title": "LabOS Agentic Architecture",
        "description": "The five-agent mesh whose product is the experimental graph — hypothesis, design, execution, QC, and learning.",
        "navActive": "platform",
        "breadcrumb": [
            {"label": "Platform", "url": "platform.html"},
            {"label": "LabOS Agentic Architecture"},
        ],
        "prev": {"title": "Why Now", "url": "why-now.html"},
        "next": {"title": "LIMS Integration", "url": "lims.html"},
        "pageNavHub": {"label": "All Platform topics", "url": "platform.html"},
    },
    "lims.html": {
        "title": "LIMS Integration",
        "description": "The quiet wedge — sit beside STARLIMS with no validation re-certification burden.",
        "navActive": "platform",
        "breadcrumb": [
            {"label": "Platform", "url": "platform.html"},
            {"label": "LIMS Integration"},
        ],
        "prev": {"title": "LabOS Agentic Architecture", "url": "labos.html"},
        "pageNavHub": {"label": "All Platform topics", "url": "platform.html"},
    },
    "apollo.html": {
        "title": "Apollo Moat",
        "description": "Apollo Hospitals partnership and competitive moat analysis for India-first discovery infrastructure.",
        "navActive": "apollo",
        "hub": True,
    },
    "apollo-partnership.html": {
        "title": "Apollo Partnership",
        "description": "Apollo Hospitals as proprietary clinical substrate — biobank, EHR, and pan-India patient access.",
        "navActive": "apollo",
        "breadcrumb": [
            {"label": "Apollo Moat", "url": "apollo.html"},
            {"label": "Apollo Partnership"},
        ],
        "next": {"title": "Competitive Moat", "url": "competitive-moat.html"},
        "pageNavHub": {"label": "All Apollo Moat topics", "url": "apollo.html"},
    },
    "competitive-moat.html": {
        "title": "Competitive Moat",
        "description": "Structural advantages vs global autonomous lab and CRO competitors in India and APAC.",
        "navActive": "apollo",
        "breadcrumb": [
            {"label": "Apollo Moat", "url": "apollo.html"},
            {"label": "Competitive Moat"},
        ],
        "prev": {"title": "Apollo Partnership", "url": "apollo-partnership.html"},
        "pageNavHub": {"label": "All Apollo Moat topics", "url": "apollo.html"},
    },
    "programs.html": {
        "title": "Programs",
        "description": "Reference programs, offerings, customer segments, and value chain across the drug-development lifecycle.",
        "navActive": "programs",
        "hub": True,
    },
    "reference-programs.html": {
        "title": "Reference Programs",
        "description": "Flagship reference programs: IVD companion diagnostics and the full pharma R&D lifecycle.",
        "navActive": "programs",
        "hub": True,
    },
    "ivd.html": {
        "title": "IVD Companion Diagnostics",
        "description": "Companion diagnostic development pathway — 18 months / $5M vs $30–50M traditional.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "IVD Companion Diagnostics"},
        ],
        "prev": {"title": "Reference Programs", "url": "reference-programs.html"},
        "next": {"title": "Pharma R&D", "url": "pharma.html"},
        "pageNavHub": {"label": "All Reference Programs topics", "url": "reference-programs.html"},
    },
    "pharma.html": {
        "title": "Pharma R&D",
        "description": "Serving pharma across the full R&D lifecycle from target discovery to pharmacovigilance.",
        "navActive": "programs",
        "hub": True,
    },
    "target-discovery.html": {
        "title": "Target Discovery",
        "description": "Novel druggable targets from Apollo multi-omics, prioritized by India-specific genetics.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "Target Discovery"},
        ],
        "next": {"title": "Drug Discovery", "url": "drug-discovery.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "drug-discovery.html": {
        "title": "Drug Discovery",
        "description": "Hit ID to lead optimization via closed-loop DBTL through LabOS.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "Drug Discovery"},
        ],
        "prev": {"title": "Target Discovery", "url": "target-discovery.html"},
        "next": {"title": "In Silico Approaches", "url": "in-silico.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "in-silico.html": {
        "title": "In Silico Approaches",
        "description": "AlphaFold3, ESM3, generative chemistry — closed-loop with wet-lab validation.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "In Silico Approaches"},
        ],
        "prev": {"title": "Drug Discovery", "url": "drug-discovery.html"},
        "next": {"title": "Pre-clinical — Organoids & 3D", "url": "preclinical.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "preclinical.html": {
        "title": "Pre-clinical — Organoids & 3D",
        "description": "Apollo-derived organoids and 3D cultures replacing animal testing (NAMs).",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "Pre-clinical — Organoids & 3D"},
        ],
        "prev": {"title": "In Silico Approaches", "url": "in-silico.html"},
        "next": {"title": "Clinical Platform", "url": "clinical.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "clinical.html": {
        "title": "Clinical Platform",
        "description": "Patient enrollment and biomarker-guided stratification — coming Q3 2026.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "Clinical Platform"},
        ],
        "prev": {"title": "Pre-clinical — Organoids & 3D", "url": "preclinical.html"},
        "next": {"title": "Phase 4 / Pharmacovigilance", "url": "pharmacovigilance.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "pharmacovigilance.html": {
        "title": "Phase 4 / Pharmacovigilance",
        "description": "Real-world evidence and India-specific PGx signal detection — $2.5M/yr recurring.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Reference Programs", "url": "reference-programs.html"},
            {"label": "Pharma R&D", "url": "pharma.html"},
            {"label": "Phase 4 / Pharmacovigilance"},
        ],
        "prev": {"title": "Clinical Platform", "url": "clinical.html"},
        "pageNavHub": {"label": "All Pharma R&D topics", "url": "pharma.html"},
    },
    "offerings.html": {
        "title": "Offerings & USP",
        "description": "LabOS as flagship plus five differentiated USPs across platform, data, and services.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Offerings & USP"},
        ],
        "prev": {"title": "Pharma R&D", "url": "pharma.html"},
        "next": {"title": "Customer Segments", "url": "customers.html"},
        "pageNavHub": {"label": "All Programs topics", "url": "programs.html"},
    },
    "customers.html": {
        "title": "Customer Segments",
        "description": "Six buyer personas with distinct pains and segment-specific value propositions.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Customer Segments"},
        ],
        "prev": {"title": "Offerings & USP", "url": "offerings.html"},
        "next": {"title": "Value Chain Map", "url": "value-chain.html"},
        "pageNavHub": {"label": "All Programs topics", "url": "programs.html"},
    },
    "value-chain.html": {
        "title": "Value Chain Map",
        "description": "Where Programmable Bio intervenes across target ID, hit discovery, and lead optimization.",
        "navActive": "programs",
        "breadcrumb": [
            {"label": "Programs", "url": "programs.html"},
            {"label": "Value Chain Map"},
        ],
        "prev": {"title": "Customer Segments", "url": "customers.html"},
        "pageNavHub": {"label": "All Programs topics", "url": "programs.html"},
    },
    "strategy.html": {
        "title": "Strategy",
        "description": "Build-vs-partner, go-to-market, KPIs, and agentic-lab risk mitigation.",
        "navActive": "strategy",
        "hub": True,
    },
    "fal.html": {
        "title": "Build vs Partner",
        "description": "Frontier Autonomous Lab strategy — build vs partner decisions for wet-lab infrastructure.",
        "navActive": "strategy",
        "breadcrumb": [
            {"label": "Strategy", "url": "strategy.html"},
            {"label": "Build vs Partner"},
        ],
        "next": {"title": "Go-to-Market", "url": "gtm.html"},
        "pageNavHub": {"label": "All Strategy topics", "url": "strategy.html"},
    },
    "gtm.html": {
        "title": "Go-to-Market",
        "description": "Go-to-market phases, customer acquisition, and partnership-led growth in India and APAC.",
        "navActive": "strategy",
        "breadcrumb": [
            {"label": "Strategy", "url": "strategy.html"},
            {"label": "Go-to-Market"},
        ],
        "prev": {"title": "Build vs Partner", "url": "fal.html"},
        "next": {"title": "North Star & KPIs", "url": "kpis.html"},
        "pageNavHub": {"label": "All Strategy topics", "url": "strategy.html"},
    },
    "kpis.html": {
        "title": "North Star & KPIs",
        "description": "North star metrics and KPI framework for platform, programs, and partnership growth.",
        "navActive": "strategy",
        "breadcrumb": [
            {"label": "Strategy", "url": "strategy.html"},
            {"label": "North Star & KPIs"},
        ],
        "prev": {"title": "Go-to-Market", "url": "gtm.html"},
        "next": {"title": "Risks & Mitigation", "url": "risks.html"},
        "pageNavHub": {"label": "All Strategy topics", "url": "strategy.html"},
    },
    "risks.html": {
        "title": "Risks & Mitigation",
        "description": "Agentic-lab risk plan — technical, regulatory, commercial, and operational mitigations.",
        "navActive": "strategy",
        "breadcrumb": [
            {"label": "Strategy", "url": "strategy.html"},
            {"label": "Risks & Mitigation"},
        ],
        "prev": {"title": "North Star & KPIs", "url": "kpis.html"},
        "pageNavHub": {"label": "All Strategy topics", "url": "strategy.html"},
    },
    "biohelix.html": {
        "title": "BioHelix — Singapore Hub",
        "description": "Singapore APAC hub — MiRXES partnership, Biopolis ecosystem, and the India–Singapore discovery corridor.",
        "navActive": "biohelix",
        "extraCss": "biohelix.css",
        "breadcrumb": [{"label": "BioHelix"}],
        "prev": {"title": "Home", "url": ""},
        "pageNavHub": {"label": "Strategic Blueprint", "url": ""},
    },
}


def yaml_value(value) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, dict):
        lines = []
        for key, val in value.items():
            lines.append(f"  {key}: {yaml_scalar(val)}")
        return "\n" + "\n".join(lines)
    if isinstance(value, list):
        if not value:
            return "[]"
        if isinstance(value[0], dict):
            parts = []
            for item in value:
                parts.append("  - " + yaml_dict_item(item))
            return "\n" + "\n".join(parts)
        return str(value)
    return yaml_scalar(value)


def yaml_scalar(value) -> str:
    text = str(value).replace('"', '\\"')
    return f'"{text}"'


def yaml_dict_item(item: dict) -> str:
    parts = []
    for idx, (key, val) in enumerate(item.items()):
        prefix = "    " if idx else ""
        parts.append(f"{prefix}{key}: {yaml_scalar(val)}")
    return "\n".join(parts) if len(parts) > 1 else parts[0]


def extract_body(html: str) -> str:
    html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)
    nav_end = re.search(r"</nav>", html, re.IGNORECASE)
    footer_start = re.search(r"<footer\b", html, re.IGNORECASE)
    page_nav = re.search(r'<div class="page-nav">.*?</div>\s*(?=<footer)', html, re.DOTALL)
    if not nav_end or not footer_start:
        raise ValueError("Could not locate nav/footer boundaries")
    body = html[nav_end.end() : footer_start.start()]
    if page_nav:
        body = body.replace(page_nav.group(0), "")
    breadcrumb = re.search(r'<div class="breadcrumb">.*?</div>\s*', body, re.DOTALL)
    if breadcrumb:
        body = body.replace(breadcrumb.group(0), "")
    body = body.strip()
    body = re.sub(r'\s*style="padding-top:\s*16px;"', ' class="section section--hub"', body, count=1)
    body = re.sub(
        r'<p style="font-size:\s*16px;\s*color:\s*var\(--ink-secondary\);\s*max-width:\s*720px;">',
        '<p class="lead">',
        body,
    )
    body = re.sub(
        r'<div class="card-grid" style="margin-top:\s*32px;">',
        '<div class="card-grid card-grid--spaced">',
        body,
    )
    body = re.sub(
        r'<div class="card-grid" style="margin-top:\s*24px;">',
        '<div class="card-grid card-grid--spaced">',
        body,
    )
    body = re.sub(r"<table>", '<div class="table-scroll"><table>', body)
    body = re.sub(r"</table>", "</table></div>", body)
    return body


def front_matter(meta: dict, filename: str) -> str:
    lines = ["---", "layout: layouts/base.njk"]
    if filename == "index.html":
        lines.append('permalink: "/"')
    else:
        lines.append(f"permalink: {filename}")
    order = [
        "title",
        "description",
        "navActive",
        "hub",
        "extraCss",
        "breadcrumb",
        "prev",
        "next",
        "pageNavHub",
    ]
    for key in order:
        if key not in meta:
            continue
        val = meta[key]
        if isinstance(val, (dict, list)):
            lines.append(f"{key}:{yaml_value(val)}")
        else:
            lines.append(f"{key}: {yaml_scalar(val)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def main() -> None:
    SRC.mkdir(exist_ok=True)
    for filename, meta in PAGE_META.items():
        source = ROOT / filename
        if not source.exists():
            raise FileNotFoundError(source)
        body = extract_body(source.read_text(encoding="utf-8"))
        if filename == "biohelix.html":
            body = f'<div class="biohelix-page">\n{body}\n</div>'
        out = SRC / filename
        out.write_text(front_matter(meta, filename) + body + "\n", encoding="utf-8")
        print(f"migrated {filename}")


if __name__ == "__main__":
    main()
