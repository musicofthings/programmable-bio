import fs from "node:fs";
import path from "node:path";

const root = path.resolve("_site");
const redirects = JSON.parse(
  fs.readFileSync(path.resolve("_data/redirects.json"), "utf8")
);
const failures = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function targetFor(urlPath) {
  const clean = urlPath.split(/[?#]/, 1)[0];
  if (clean === "/") return path.join(root, "index.html");
  const relative = clean.replace(/^\/+/, "");
  if (clean.endsWith("/")) return path.join(root, relative, "index.html");
  return path.join(root, relative);
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const redirectPaths = new Set(redirects.map((entry) => entry.from));
const banned = [
  /\bFILL\b/i,
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /Strategic Blueprint/i,
  /Discovery Sprint/i,
  /\bOmicsOS\b/i,
  /\bClinicalBridge\b/i,
  /Execution Broker/i
];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const urlPath = `/${path.relative(root, file).split(path.sep).join("/")}`;
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    failures.push(`${urlPath}: duplicate ids: ${[...new Set(duplicates)].join(", ")}`);
  }

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const target = targetFor(value);
    if (!fs.existsSync(target)) failures.push(`${urlPath}: missing internal target ${value}`);
  }

  if (!redirectPaths.has(urlPath) && urlPath !== "/404.html") {
    const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
    if (h1Count !== 1) failures.push(`${urlPath}: expected one h1, found ${h1Count}`);
    for (const pattern of banned) {
      if (pattern.test(html)) failures.push(`${urlPath}: banned unfinished or stale term ${pattern}`);
    }
  }
}

for (const entry of redirects) {
  const file = targetFor(entry.from);
  if (!fs.existsSync(file)) {
    failures.push(`redirect missing: ${entry.from}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(`url=${entry.to}`) || !html.includes(`href="${entry.to}"`)) {
    failures.push(`redirect mismatch: ${entry.from} -> ${entry.to}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML files, ${redirects.length} redirects, internal links, headings, ids, and stale-term rules.`
);
