import { ALL_TYPES, Pokemon, PokemonType, TYPE_CHART } from "./types";

export function effectiveness(
  attackType: PokemonType,
  defenderTypes: PokemonType[],
): number {
  return defenderTypes.reduce(
    (mult, t) => mult * TYPE_CHART[attackType][t],
    1,
  );
}

/** Best STAB multiplier an attacker has against the defender. */
export function bestStabMultiplier(
  attacker: Pokemon,
  defender: Pokemon,
): number {
  return Math.max(
    ...attacker.types.map((t) => effectiveness(t, defender.types)),
  );
}

export interface CoverageResult {
  pokemon: Pokemon;
  score: number;
  superEffectiveCount: number;
  doubleSuperCount: number;
  breakdown: { defender: Pokemon; multiplier: number }[];
}

export function computeCoverage(
  roster: Pokemon[],
  opposing: Pokemon[],
): CoverageResult[] {
  if (opposing.length === 0) return [];
  const results: CoverageResult[] = roster.map((mon) => {
    let score = 0;
    let se = 0;
    let dse = 0;
    const breakdown = opposing.map((def) => {
      const mult = bestStabMultiplier(mon, def);
      if (mult >= 2) {
        score += 1;
        se += 1;
      }
      if (mult >= 4) {
        score += 1;
        dse += 1;
      }
      return { defender: def, multiplier: mult };
    });
    return {
      pokemon: mon,
      score,
      superEffectiveCount: se,
      doubleSuperCount: dse,
      breakdown,
    };
  });
  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || (a.pokemon.names.en ?? "").localeCompare(b.pokemon.names.en ?? ""));
}

/** Which opposing types are NOT covered super-effectively by any current team pick. */
export function uncoveredOpponents(
  myTeam: Pokemon[],
  opposing: Pokemon[],
): Pokemon[] {
  return opposing.filter((def) => {
    return !myTeam.some((att) => bestStabMultiplier(att, def) >= 2);
  });
}

function* combinations<T>(arr: T[], k: number): Generator<T[]> {
  const n = arr.length;
  if (k > n || k < 0) return;
  if (k === 0) {
    yield [];
    return;
  }
  const idx = Array.from({ length: k }, (_, i) => i);
  while (true) {
    yield idx.map((i) => arr[i]);
    let i = k - 1;
    while (i >= 0 && idx[i] === i + n - k) i--;
    if (i < 0) return;
    idx[i]++;
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
  }
}

export interface SubsetPick {
  subset: Pokemon[];
  covered: number; // number of opposing mons covered ≥2x by at least one picker
  uncovered: Pokemon[];
  totalScore: number; // sum of coverage scores across picks (bonus for x4)
}

/**
 * Pick the optimal subset of `size` Pokémon from `myTeam` that maximises
 * the number of opposing Pokémon hit ≥2x. Ties broken by total coverage score.
 */
export function optimalSubset(
  myTeam: Pokemon[],
  opposing: Pokemon[],
  size: number,
): SubsetPick {
  const k = Math.min(size, myTeam.length);
  let best: SubsetPick = {
    subset: myTeam.slice(0, k),
    covered: -1,
    uncovered: opposing,
    totalScore: -1,
  };

  if (opposing.length === 0 || myTeam.length === 0) {
    return {
      subset: myTeam.slice(0, k),
      covered: 0,
      uncovered: [],
      totalScore: 0,
    };
  }

  for (const combo of combinations(myTeam, k)) {
    const uncovered = opposing.filter(
      (def) => !combo.some((att) => bestStabMultiplier(att, def) >= 2),
    );
    const covered = opposing.length - uncovered.length;
    let totalScore = 0;
    for (const att of combo) {
      totalScore += pickScore(att, opposing);
    }
    if (
      covered > best.covered ||
      (covered === best.covered && totalScore > best.totalScore)
    ) {
      best = { subset: combo, covered, uncovered, totalScore };
    }
  }
  return best;
}

/**
 * Defensive matchup map for a single Pokémon: for each of the 18 attacker
 * types, compute the multiplier dealt to this Pokémon.
 */
export function defensiveMatchups(
  defender: Pokemon,
): { weak: { type: PokemonType; mult: number }[]; resist: { type: PokemonType; mult: number }[]; immune: PokemonType[] } {
  const weak: { type: PokemonType; mult: number }[] = [];
  const resist: { type: PokemonType; mult: number }[] = [];
  const immune: PokemonType[] = [];
  for (const t of ALL_TYPES) {
    const m = effectiveness(t, defender.types);
    if (m === 0) immune.push(t);
    else if (m >= 2) weak.push({ type: t, mult: m });
    else if (m < 1) resist.push({ type: t, mult: m });
  }
  return { weak, resist, immune };
}

/**
 * Score an individual attacker against a full opposing team, accounting for
 * BOTH offensive coverage and defensive safety:
 *
 *   +1 per opponent the attacker hits ≥2× (super-effective)
 *   +1 bonus per opponent the attacker hits ≥4× (quad-effective)
 *   +0.5 "clean hit" bonus — for each SE hit where the opponent can't hit you ≥2×
 *   +1   "immune pivot" bonus — per opponent you are immune to (×0)
 *  −0.5 per opponent that threatens you ≥2×
 *  −0.5 extra per opponent that threatens you ≥4×
 *
 * A pick that hits 3 SE without any threat back scores 3 + 1.5 = 4.5, whereas
 * a pick that hits 3 SE but trades with 3 mutual threats scores 3 − 1.5 = 1.5.
 */
export function pickScore(attacker: Pokemon, opposing: Pokemon[]): number {
  let s = 0;
  for (const def of opposing) {
    const off = bestStabMultiplier(attacker, def);
    const inc = bestStabMultiplier(def, attacker);

    // Offense
    if (off >= 2) s += 1;
    if (off >= 4) s += 1;

    // Defense
    if (inc === 0) s += 1;              // you are immune to them
    else if (inc >= 4) s -= 1;          // quad-threatened
    else if (inc >= 2) s -= 0.5;        // threatened

    // Clean-hit synergy bonus
    if (off >= 2 && inc < 2) s += 0.5;
  }
  return s;
}
