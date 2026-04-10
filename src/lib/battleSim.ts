// Battle simulator — generates varied opposing teams and scores matchups
// against the user's team using a matchup heuristic (optimalSubset + speed
// tier + shared weaknesses). No full battle engine, just a fast "on paper"
// estimate — enough to surface weak matchups.

import { POKEMON } from "./pokemon";
import { Pokemon, PokemonType, ALL_TYPES } from "./types";
import { getTier, Tier } from "./tiers";
import { META_TEAMS } from "./metaTeams";
import { optimalSubset, bestStabMultiplier } from "./coverage";
import { analyzeTeam } from "./teamAnalysis";

// ------------- Random utils -------------

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted<T>(arr: T[], weightFn: (x: T) => number): T | undefined {
  const total = arr.reduce((s, x) => s + weightFn(x), 0);
  if (total <= 0) return undefined;
  let roll = Math.random() * total;
  for (const x of arr) {
    roll -= weightFn(x);
    if (roll <= 0) return x;
  }
  return arr[arr.length - 1];
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ------------- Pool helpers -------------

const TIER_WEIGHT: Record<Tier, number> = { S: 6, A: 4, B: 2, C: 1, D: 0.3 };

function tierWeightFor(p: Pokemon): number {
  const t = getTier(p.id);
  return t ? TIER_WEIGHT[t] : 0.5;
}

function monsByTag(predicate: (p: Pokemon) => boolean): Pokemon[] {
  return POKEMON.filter(predicate);
}

// ------------- Archetypes -------------

export type Archetype =
  | "random"
  | "balance"
  | "sun"
  | "rain"
  | "trick-room"
  | "tailwind"
  | "mono"
  | "hyper-offense"
  | "bulky"
  | "meta";

function pokemonHasAbility(p: Pokemon, names: string[]): boolean {
  if (!p.abilities) return false;
  return p.abilities.some((a) =>
    names.some(
      (n) => (a.names.en ?? "").toLowerCase() === n.toLowerCase(),
    ),
  );
}

function hasType(p: Pokemon, ...ts: PokemonType[]): boolean {
  return ts.some((t) => p.types.includes(t));
}

function avgStat(p: Pokemon, key: "hp" | "atk" | "def" | "spa" | "spd" | "spe"): number {
  return p.stats?.[key] ?? 0;
}

// ------------- Team generators -------------

function generateRandom(): Pokemon[] {
  const pool = POKEMON.filter((p) => tierWeightFor(p) > 0);
  const picked = new Set<number>();
  const result: Pokemon[] = [];
  let attempts = 0;
  while (result.length < 6 && attempts < 200) {
    attempts++;
    const p = pickWeighted(pool, tierWeightFor);
    if (!p || picked.has(p.id)) continue;
    picked.add(p.id);
    result.push(p);
  }
  return result;
}

function generateSun(): Pokemon[] {
  const setters = monsByTag((p) => pokemonHasAbility(p, ["Drought"]));
  const abusers = monsByTag(
    (p) =>
      pokemonHasAbility(p, ["Chlorophyll", "Solar Power"]) ||
      hasType(p, "Fire", "Grass"),
  );
  return assembleThemed(setters, abusers);
}

function generateRain(): Pokemon[] {
  const setters = monsByTag((p) => pokemonHasAbility(p, ["Drizzle"]));
  const abusers = monsByTag(
    (p) =>
      pokemonHasAbility(p, ["Swift Swim"]) ||
      hasType(p, "Water", "Electric"),
  );
  return assembleThemed(setters, abusers);
}

function generateTrickRoom(): Pokemon[] {
  // Slow heavy hitters
  const slows = POKEMON.filter((p) => avgStat(p, "spe") <= 55 && tierWeightFor(p) > 0);
  const picked = new Set<number>();
  const out: Pokemon[] = [];
  for (const p of shuffle(slows)) {
    if (out.length >= 6) break;
    if (picked.has(p.id)) continue;
    picked.add(p.id);
    out.push(p);
  }
  if (out.length < 6) {
    for (const p of shuffle(POKEMON)) {
      if (out.length >= 6) break;
      if (!picked.has(p.id)) {
        picked.add(p.id);
        out.push(p);
      }
    }
  }
  return out;
}

function generateTailwind(): Pokemon[] {
  const fast = POKEMON.filter((p) => avgStat(p, "spe") >= 85 && tierWeightFor(p) > 0);
  return shuffle(fast).slice(0, 6);
}

function generateMono(): Pokemon[] {
  const type = pickRandom(ALL_TYPES);
  const pool = POKEMON.filter((p) => p.types.includes(type) && tierWeightFor(p) > 0);
  return shuffle(pool).slice(0, 6);
}

function generateHyperOffense(): Pokemon[] {
  const pool = POKEMON.filter(
    (p) =>
      (avgStat(p, "atk") + avgStat(p, "spa")) / 2 >= 100 && tierWeightFor(p) > 0,
  );
  return shuffle(pool).slice(0, 6);
}

function generateBulky(): Pokemon[] {
  const pool = POKEMON.filter(
    (p) =>
      (avgStat(p, "hp") + avgStat(p, "def") + avgStat(p, "spd")) / 3 >= 85 &&
      tierWeightFor(p) > 0,
  );
  return shuffle(pool).slice(0, 6);
}

function generateBalance(): Pokemon[] {
  // One of each role
  const monById = new Map(POKEMON.map((p) => [p.id, p]));
  const used = new Set<number>();
  const tryPick = (pool: Pokemon[]) => {
    for (const p of shuffle(pool)) {
      if (!used.has(p.id)) {
        used.add(p.id);
        return p;
      }
    }
    return undefined;
  };
  const out: Pokemon[] = [];
  const phys = POKEMON.filter((p) => avgStat(p, "atk") >= 100 && tierWeightFor(p) > 0);
  const spec = POKEMON.filter((p) => avgStat(p, "spa") >= 100 && tierWeightFor(p) > 0);
  const fast = POKEMON.filter((p) => avgStat(p, "spe") >= 100 && tierWeightFor(p) > 0);
  const bulky = POKEMON.filter(
    (p) => avgStat(p, "hp") >= 90 && tierWeightFor(p) > 0,
  );
  const meta = POKEMON.filter((p) => getTier(p.id) === "S" || getTier(p.id) === "A");
  [phys, spec, fast, bulky, meta, meta].forEach((pool) => {
    const picked = tryPick(pool);
    if (picked) out.push(picked);
  });
  // Fill the remaining with randoms
  while (out.length < 6) {
    const p = pickWeighted(POKEMON, tierWeightFor);
    if (p && !used.has(p.id)) {
      used.add(p.id);
      out.push(p);
    }
  }
  void monById;
  return out;
}

function generateMetaTeam(): Pokemon[] {
  const tpl = pickRandom(META_TEAMS);
  const monById = new Map(POKEMON.map((p) => [p.id, p]));
  return tpl.pokemonIds
    .map((id) => monById.get(id))
    .filter((p): p is Pokemon => !!p);
}

function assembleThemed(setters: Pokemon[], abusers: Pokemon[]): Pokemon[] {
  const out: Pokemon[] = [];
  const used = new Set<number>();
  const takeFrom = (pool: Pokemon[], n: number) => {
    for (const p of shuffle(pool)) {
      if (out.length >= 6 || n <= 0) break;
      if (used.has(p.id)) continue;
      used.add(p.id);
      out.push(p);
      n--;
    }
  };
  takeFrom(setters, 1);
  takeFrom(abusers, 4);
  // Fill
  while (out.length < 6) {
    const p = pickWeighted(POKEMON, tierWeightFor);
    if (p && !used.has(p.id)) {
      used.add(p.id);
      out.push(p);
    }
  }
  return out;
}

// ------------- Matchup scoring -------------

export interface MatchupResult {
  archetype: Archetype;
  opponent: Pokemon[];
  /** Subset of opponent mons you'd bring (N=3 for 1v1, N=4 for 2v2) to cover best. */
  yourPicks: Pokemon[];
  /** Their likely N picks. Estimated using symmetric logic. */
  theirPicks: Pokemon[];
  /** 0-100 estimated win rate. */
  winRate: number;
  /** Additional metrics for breakdown display. */
  coverageRatio: number;
  speedAdvantage: number; // -100 .. +100
  threatsAgainstYou: number;
}

function computeMatchup(
  myTeam: Pokemon[],
  opponent: Pokemon[],
  bringN: number,
): MatchupResult {
  const mine = optimalSubset(myTeam, opponent, bringN);
  const theirs = optimalSubset(opponent, myTeam, bringN);

  const coverageRatio =
    opponent.length > 0 ? mine.covered / opponent.length : 0;

  // Speed advantage: my bring avg speed vs theirs
  const avgSpeed = (list: Pokemon[]) =>
    list.length === 0
      ? 0
      : list.reduce((s, p) => s + (p.stats?.spe ?? 0), 0) / list.length;
  const mySpeed = avgSpeed(mine.subset);
  const theirSpeed = avgSpeed(theirs.subset);
  const speedAdvantage = mySpeed - theirSpeed; // raw diff

  // How much of MY bring would they KO via SE?
  const threatsAgainstYou = mine.subset.reduce((count, mon) => {
    return (
      count +
      (theirs.subset.some((opp) => bestStabMultiplier(opp, mon) >= 2) ? 1 : 0)
    );
  }, 0);

  // Win rate estimation — start from coverage, adjust by speed + threats
  let winRate = 15 + coverageRatio * 60; // 15 % baseline → up to 75 %
  if (speedAdvantage > 15) winRate += 8;
  else if (speedAdvantage > 0) winRate += 4;
  else if (speedAdvantage < -15) winRate -= 8;
  else if (speedAdvantage < 0) winRate -= 4;

  // Penalty per threatened pick
  winRate -= threatsAgainstYou * 4;

  // Clamp
  winRate = Math.max(5, Math.min(95, Math.round(winRate)));

  return {
    archetype: "random",
    opponent,
    yourPicks: mine.subset,
    theirPicks: theirs.subset,
    winRate,
    coverageRatio,
    speedAdvantage,
    threatsAgainstYou,
  };
}

// ------------- Public API -------------

export interface SimulationConfig {
  count: number; // number of opposing teams
  bringN: number; // 3 or 4
  pool: Archetype | "mixed";
}

export interface SimulationResult {
  matchups: MatchupResult[];
  overallWinRate: number;
  bestMatchups: MatchupResult[]; // top 3
  worstMatchups: MatchupResult[]; // bottom 3
  analysisHint: string | null;
}

const MIXED_ROTATION: Archetype[] = [
  "random",
  "random",
  "random",
  "balance",
  "sun",
  "rain",
  "trick-room",
  "tailwind",
  "hyper-offense",
  "bulky",
  "mono",
  "meta",
];

function generate(archetype: Archetype): Pokemon[] {
  switch (archetype) {
    case "sun": return generateSun();
    case "rain": return generateRain();
    case "trick-room": return generateTrickRoom();
    case "tailwind": return generateTailwind();
    case "mono": return generateMono();
    case "hyper-offense": return generateHyperOffense();
    case "bulky": return generateBulky();
    case "balance": return generateBalance();
    case "meta": return generateMetaTeam();
    case "random":
    default: return generateRandom();
  }
}

export function runSimulation(
  myTeam: Pokemon[],
  config: SimulationConfig,
): SimulationResult {
  const matchups: MatchupResult[] = [];
  for (let i = 0; i < config.count; i++) {
    const archetype =
      config.pool === "mixed"
        ? MIXED_ROTATION[i % MIXED_ROTATION.length]
        : config.pool;
    const opp = generate(archetype);
    if (opp.length < 4) continue;
    const m = computeMatchup(myTeam, opp, config.bringN);
    m.archetype = archetype;
    matchups.push(m);
  }

  const overallWinRate =
    matchups.length > 0
      ? Math.round(
          matchups.reduce((s, m) => s + m.winRate, 0) / matchups.length,
        )
      : 0;

  const sorted = matchups.slice().sort((a, b) => b.winRate - a.winRate);
  const bestMatchups = sorted.slice(0, 3);
  const worstMatchups = sorted.slice(-3).reverse();

  // Derive a simple hint from the team analysis
  const analysis = analyzeTeam(myTeam);
  const topSuggestion = analysis.suggestions.find((s) => s.severity !== "info");
  const analysisHint = topSuggestion ? topSuggestion.text : null;

  return {
    matchups,
    overallWinRate,
    bestMatchups,
    worstMatchups,
    analysisHint,
  };
}
