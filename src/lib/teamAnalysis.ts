// Measurable analysis of a 6-Pokémon team.

import { ALL_TYPES, Pokemon, PokemonType } from "./types";
import { effectiveness } from "./coverage";
import { MOVES } from "./moves";

export interface TypeCount {
  type: PokemonType;
  count: number;
  mons: number[]; // ids of mons contributing
}

export interface AnalysisResult {
  teamSize: number;
  /** Types the team can hit ≥2× with STAB + movepool (if provided). */
  offensiveCoverage: PokemonType[];
  /** Types the team CANNOT hit ≥2× — holes in coverage. */
  coverageHoles: PokemonType[];
  /** Types that hit ≥2 members of the team ≥2× — shared weaknesses. */
  sharedWeaknesses: TypeCount[];
  /** Average speed stat across the team. */
  averageSpeed: number;
  /** Split of physical vs special attackers (based on higher of atk/spa). */
  physicalAttackers: number;
  specialAttackers: number;
  /** Average bulk (HP + (def+spd)/2). */
  averageBulk: number;
  /** Actionable suggestions derived from the metrics. */
  suggestions: { severity: "info" | "warn" | "critical"; text: string }[];
  /** Overall 0-100 score combining coverage, safety and balance. */
  overallScore: number;
}

/** Compute the set of attacking types a Pokémon actually has access to. */
function attackingTypesFor(
  mon: Pokemon,
  movepool?: string[],
): PokemonType[] {
  const set = new Set<PokemonType>(mon.types);
  if (movepool) {
    for (const mname of movepool) {
      const m = MOVES[mname];
      if (m && m.power && m.power >= 60 && m.category !== "status") {
        set.add(m.type);
      }
    }
  }
  return [...set];
}

export function analyzeTeam(
  team: Pokemon[],
  movepools?: Record<number, string[]>,
): AnalysisResult {
  const teamSize = team.length;
  const suggestions: AnalysisResult["suggestions"] = [];

  // 1. Offensive coverage: for each defender type, can anyone hit it ≥2×?
  const offensiveCoverage: PokemonType[] = [];
  const coverageHoles: PokemonType[] = [];
  for (const defType of ALL_TYPES) {
    let hitBySomeone = false;
    for (const mon of team) {
      const atkTypes = attackingTypesFor(mon, movepools?.[mon.id]);
      for (const atk of atkTypes) {
        if (effectiveness(atk, [defType]) >= 2) {
          hitBySomeone = true;
          break;
        }
      }
      if (hitBySomeone) break;
    }
    if (hitBySomeone) offensiveCoverage.push(defType);
    else coverageHoles.push(defType);
  }

  // 2. Shared weaknesses: for each attacker type, count how many mons it hits ≥2×
  const weaknessMap: TypeCount[] = [];
  for (const atkType of ALL_TYPES) {
    const monsHit: number[] = [];
    for (const mon of team) {
      if (effectiveness(atkType, mon.types) >= 2) {
        monsHit.push(mon.id);
      }
    }
    if (monsHit.length >= 2) {
      weaknessMap.push({ type: atkType, count: monsHit.length, mons: monsHit });
    }
  }
  weaknessMap.sort((a, b) => b.count - a.count);

  // 3. Speed + role distribution
  let totalSpeed = 0;
  let physicalAttackers = 0;
  let specialAttackers = 0;
  let totalBulk = 0;
  for (const mon of team) {
    const s = mon.stats;
    if (!s) continue;
    totalSpeed += s.spe;
    totalBulk += s.hp + (s.def + s.spd) / 2;
    if (s.atk >= s.spa) physicalAttackers++;
    else specialAttackers++;
  }
  const averageSpeed = teamSize > 0 ? Math.round(totalSpeed / teamSize) : 0;
  const averageBulk = teamSize > 0 ? Math.round(totalBulk / teamSize) : 0;

  // 4. Generate suggestions
  if (teamSize < 6) {
    suggestions.push({
      severity: "info",
      text: `Team is ${teamSize}/6 — add ${6 - teamSize} more mon${6 - teamSize > 1 ? "s" : ""} to complete.`,
    });
  }

  if (coverageHoles.length > 0) {
    suggestions.push({
      severity: coverageHoles.length >= 5 ? "critical" : coverageHoles.length >= 3 ? "warn" : "info",
      text: `No super-effective coverage vs ${coverageHoles.length} type${coverageHoles.length > 1 ? "s" : ""}: ${coverageHoles.join(", ")}.`,
    });
  }

  for (const w of weaknessMap) {
    if (w.count >= 4) {
      suggestions.push({
        severity: "critical",
        text: `${w.count}/${teamSize} mons are weak to ${w.type} — a single ${w.type} attack can wipe most of your team.`,
      });
    } else if (w.count >= 3) {
      suggestions.push({
        severity: "warn",
        text: `${w.count} mons share a ${w.type} weakness.`,
      });
    }
  }

  if (teamSize >= 4) {
    if (averageSpeed < 70) {
      suggestions.push({
        severity: "warn",
        text: `Team is slow (avg Speed ${averageSpeed}). Consider Tailwind, Trick Room, or Choice Scarf.`,
      });
    } else if (averageSpeed > 110) {
      suggestions.push({
        severity: "info",
        text: `Team is very fast (avg Speed ${averageSpeed}). Vulnerable to Trick Room / priority moves.`,
      });
    }
    if (Math.abs(physicalAttackers - specialAttackers) >= 5) {
      suggestions.push({
        severity: "warn",
        text: `Imbalanced — ${physicalAttackers} physical vs ${specialAttackers} special attacker${specialAttackers > 1 ? "s" : ""}. A single Intimidate/burn/wall will shut down most of your damage.`,
      });
    }
  }

  // 5. Overall score 0-100
  // Weights: coverage 40 %, defensive safety 35 %, balance 25 %
  const coverageScore = (offensiveCoverage.length / ALL_TYPES.length) * 40;
  const shareWeakPenalty = weaknessMap.reduce(
    (acc, w) => acc + (w.count >= 4 ? 10 : w.count >= 3 ? 5 : 2),
    0,
  );
  const defensiveScore = Math.max(0, 35 - shareWeakPenalty);
  const balanceScore =
    teamSize >= 4
      ? 25 - Math.min(15, Math.abs(physicalAttackers - specialAttackers) * 3)
      : (teamSize / 6) * 25;
  const overallScore = Math.round(
    coverageScore + defensiveScore + balanceScore,
  );

  return {
    teamSize,
    offensiveCoverage,
    coverageHoles,
    sharedWeaknesses: weaknessMap,
    averageSpeed,
    physicalAttackers,
    specialAttackers,
    averageBulk,
    suggestions,
    overallScore: Math.max(0, Math.min(100, overallScore)),
  };
}
