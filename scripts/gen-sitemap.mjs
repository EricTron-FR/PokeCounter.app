#!/usr/bin/env node
// Generate a sitemap.xml covering all meaningful URLs:
//   / (home)
//   /?opp=<id> for every Pokémon (250 entries — makes each a distinct crawl target)
//   /#/pokedex, /#/compare, /#/types, /#/battle, /#/learn, /#/about
// Also emits hreflang alternates for the 9 supported languages.
//
// Usage: node scripts/gen-sitemap.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POKEMON_PATH = path.resolve(__dirname, "../src/data/pokemon.json");
const OUT_PATH = path.resolve(__dirname, "../public/sitemap.xml");

const BASE = "https://pokecounter.app";
const LANGS = ["en", "fr", "es", "de", "it", "ja", "ko", "zh-Hans", "zh-Hant"];
const TODAY = new Date().toISOString().slice(0, 10);

function urlEntry(loc, priority = 0.7, changefreq = "weekly") {
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc}"/>`,
  ).join("\n");
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
  </url>`;
}

function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_PATH, "utf8"));

  const urls = [];
  // Home + main sections
  urls.push(urlEntry(`${BASE}/`, 1.0, "daily"));
  urls.push(urlEntry(`${BASE}/#/pokedex`, 0.9));
  urls.push(urlEntry(`${BASE}/#/compare`, 0.8));
  urls.push(urlEntry(`${BASE}/#/types`, 0.8));
  urls.push(urlEntry(`${BASE}/#/battle`, 0.8));
  urls.push(urlEntry(`${BASE}/#/learn`, 0.7));
  urls.push(urlEntry(`${BASE}/#/about`, 0.4, "monthly"));

  // Per-Pokémon "counter" URLs — each is indexable as a distinct page
  for (const mon of pokemon) {
    urls.push(urlEntry(`${BASE}/?opp=${mon.id}`, 0.6));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync(OUT_PATH, xml);
  console.log(`Wrote ${urls.length} URLs to ${OUT_PATH}`);
}

main();
