import raw from "@/data/pokemon.json";
import { Pokemon } from "./types";

export const POKEMON: Pokemon[] = raw as unknown as Pokemon[];

export function spriteUrl(p: Pokemon): string {
  if (p.mega && p.base_id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/g, "");
}

/**
 * Search across all localized names so users can type in any supported
 * language (Romaji / kana / hanzi / hangul / Latin).
 */
export function searchPokemon(query: string, limit = 10): Pokemon[] {
  const q = normalize(query);
  if (!q) return [];
  const starts: Pokemon[] = [];
  const includes: Pokemon[] = [];
  for (const p of POKEMON) {
    const candidates = Object.values(p.names).map((n) => normalize(n ?? ""));
    let matched: "start" | "inc" | null = null;
    for (const c of candidates) {
      if (!c) continue;
      if (c.startsWith(q)) {
        matched = "start";
        break;
      }
      if (c.includes(q)) matched = "inc";
    }
    if (matched === "start") starts.push(p);
    else if (matched === "inc") includes.push(p);
    if (starts.length >= limit) break;
  }
  return [...starts, ...includes].slice(0, limit);
}
