import { useEffect, useMemo, useState } from "react";
import { Pokemon } from "@/lib/types";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import {
  runSimulation,
  SimulationResult,
  MatchupResult,
  Archetype,
} from "@/lib/battleSim";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Swords, Sparkles, AlertTriangle, Trophy, X } from "lucide-react";
import { PokemonSearch } from "./PokemonSearch";

const STORAGE_KEY = "pokecounter.myteam.v1";

function loadMyTeamIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

function saveMyTeamIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* noop */
  }
}

const POOL_OPTIONS: { key: Archetype | "mixed"; label: string; emoji: string }[] = [
  { key: "mixed", label: "Mixed", emoji: "🎲" },
  { key: "random", label: "Random", emoji: "❓" },
  { key: "meta", label: "Meta", emoji: "⭐" },
  { key: "sun", label: "Sun", emoji: "☀️" },
  { key: "rain", label: "Rain", emoji: "🌧" },
  { key: "trick-room", label: "Trick Room", emoji: "🔄" },
  { key: "tailwind", label: "Tailwind", emoji: "💨" },
  { key: "hyper-offense", label: "Hyper Offense", emoji: "💥" },
  { key: "bulky", label: "Bulky", emoji: "🛡" },
  { key: "mono", label: "Mono-type", emoji: "🎨" },
];

const COUNT_OPTIONS = [10, 30, 50, 100];

export function BattleSimPage() {
  const { lang } = useLang();
  const monById = useMemo(() => new Map(POKEMON.map((p) => [p.id, p])), []);
  const [myTeamIds, setMyTeamIds] = useState<number[]>(() => loadMyTeamIds());
  const [pool, setPool] = useState<Archetype | "mixed">("mixed");
  const [count, setCount] = useState(30);
  const [bringN, setBringN] = useState<3 | 4>(4);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const myTeam = useMemo(
    () => myTeamIds.map((id) => monById.get(id)).filter((p): p is Pokemon => !!p),
    [myTeamIds, monById],
  );

  // Persist every change
  useEffect(() => {
    saveMyTeamIds(myTeamIds);
  }, [myTeamIds]);

  function addToTeam(p: Pokemon) {
    setMyTeamIds((prev) =>
      prev.length >= 6 || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }
  function removeFromTeam(id: number) {
    setMyTeamIds((prev) => prev.filter((x) => x !== id));
  }
  function resetTeam() {
    setMyTeamIds([]);
  }

  function handleRun() {
    if (myTeam.length < 4) return;
    setRunning(true);
    // Defer so the "Running..." state renders before we block on compute
    setTimeout(() => {
      const r = runSimulation(myTeam, { count, pool, bringN });
      setResult(r);
      setRunning(false);
    }, 50);
  }

  return (
    <main className="container py-6 sm:py-10 max-w-4xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            Battle Simulator
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          Test your team against varied opposing teams
        </p>
      </header>

      {/* Team editor — always live, no edit toggle */}
      <section className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-2xl text-primary tabular-nums">
            01
          </span>
          <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
            Your team
          </h2>
          <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
            {myTeam.length}/6
          </span>
          {myTeamIds.length > 0 && (
            <button
              type="button"
              onClick={resetTeam}
              className="font-pixel text-[9px] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
              title="Reset team"
            >
              ↺
            </button>
          )}
        </div>
        <div className="h-[3px] bg-foreground mb-4" />

        <div className="mb-3">
          <PokemonSearch
            onSelect={addToTeam}
            excludeIds={myTeamIds}
            disabled={myTeamIds.length >= 6}
            placeholder="Add a Pokémon..."
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const p = myTeam[i];
            if (!p) {
              return (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/40 flex items-center justify-center text-muted-foreground text-xl"
                >
                  +
                </div>
              );
            }
            return (
              <div
                key={p.id}
                className="relative flex flex-col items-center group"
              >
                <img
                  src={spriteUrl(p)}
                  alt={p.names.en ?? ""}
                  className="pixelated h-16 w-16"
                />
                <span className="font-pixel text-[8px] uppercase truncate max-w-full">
                  {pokemonName(p, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromTeam(p.id)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full border border-destructive/30 bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Config */}
      <section className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-2xl text-primary tabular-nums">
            02
          </span>
          <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
            Configuration
          </h2>
        </div>
        <div className="h-[3px] bg-foreground mb-4" />

        <div className="space-y-4">
          {/* Format */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              Format
            </div>
            <div className="flex gap-2">
              {[3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBringN(n as 3 | 4)}
                  className={cn(
                    "px-4 py-2 rounded-lg border font-pixel text-[10px] uppercase tracking-wider transition-all",
                    bringN === n
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted shadow-soft",
                  )}
                >
                  {n === 3 ? "1v1 · Bring 3" : "2v2 · Bring 4"}
                </button>
              ))}
            </div>
          </div>

          {/* Pool */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              Opponent pool
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POOL_OPTIONS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPool(p.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border font-pixel text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5",
                    pool === p.key
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              Battles to simulate
            </div>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={cn(
                    "px-4 py-2 rounded-lg border font-pixel text-[10px] uppercase tracking-wider transition-all tabular-nums",
                    count === n
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted shadow-soft",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleRun}
            disabled={running || myTeam.length < 4}
            className="w-full"
          >
            <Swords className="h-4 w-4" />
            {running ? "Running..." : "Run simulation"}
          </Button>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-pixel text-2xl text-primary tabular-nums">
              03
            </span>
            <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
              Results
            </h2>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
              {result.matchups.length} battles
            </span>
          </div>
          <div className="h-[3px] bg-foreground mb-4" />

          {/* Big win rate */}
          <div className="mb-6 text-center">
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground">
              Estimated win rate
            </div>
            <div
              className={cn(
                "font-pixel text-6xl sm:text-7xl mt-2 tabular-nums",
                result.overallWinRate >= 65
                  ? "text-emerald-600"
                  : result.overallWinRate >= 45
                    ? "text-yellow-600"
                    : "text-red-600",
              )}
            >
              {result.overallWinRate}
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
          </div>

          {result.analysisHint && (
            <div className="mb-6 rounded-lg border border-accent/50 bg-accent/10 p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-accent-foreground" />
              <span className="text-[10px] font-mono leading-relaxed text-accent-foreground">
                <strong className="font-pixel text-[9px] uppercase">Insight:</strong>{" "}
                {result.analysisHint}
              </span>
            </div>
          )}

          {/* Best matchups */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-emerald-600" />
              <span className="font-pixel text-[10px] uppercase tracking-wider text-emerald-600">
                Best matchups
              </span>
            </div>
            <div className="space-y-1.5">
              {result.bestMatchups.map((m, i) => (
                <MatchupRow key={i} m={m} lang={lang} />
              ))}
            </div>
          </div>

          {/* Worst matchups */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-pixel text-[10px] uppercase tracking-wider text-red-600">
                Worst matchups
              </span>
            </div>
            <div className="space-y-1.5">
              {result.worstMatchups.map((m, i) => (
                <MatchupRow key={i} m={m} lang={lang} />
              ))}
            </div>
          </div>

          {/* Full list (collapsible) */}
          <details className="mt-4">
            <summary className="cursor-pointer font-pixel text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground select-none">
              All {result.matchups.length} battles
            </summary>
            <div className="mt-3 space-y-1">
              {result.matchups
                .slice()
                .sort((a, b) => b.winRate - a.winRate)
                .map((m, i) => (
                  <MatchupRow key={i} m={m} lang={lang} compact />
                ))}
            </div>
          </details>
        </section>
      )}
    </main>
  );
}

function MatchupRow({
  m,
  lang,
  compact,
}: {
  m: MatchupResult;
  lang: ReturnType<typeof useLang>["lang"];
  compact?: boolean;
}) {
  const tone =
    m.winRate >= 65
      ? "border-emerald-500/40 bg-emerald-500/5"
      : m.winRate >= 45
        ? "border-yellow-500/40 bg-yellow-500/5"
        : "border-red-500/40 bg-red-500/5";
  const textColor =
    m.winRate >= 65
      ? "text-emerald-600"
      : m.winRate >= 45
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 rounded-lg border px-2 py-1.5",
        tone,
      )}
    >
      <div className={cn("font-pixel text-sm tabular-nums w-10", textColor)}>
        {m.winRate}%
      </div>
      <div className="font-pixel text-[8px] uppercase tracking-wider text-muted-foreground w-16 shrink-0 truncate">
        {m.archetype}
      </div>
      <div className="flex items-center gap-0.5 flex-1 flex-wrap">
        {(compact ? m.opponent.slice(0, 6) : m.opponent).map((p) => (
          <img
            key={p.id}
            src={spriteUrl(p)}
            alt={pokemonName(p, lang)}
            title={pokemonName(p, lang)}
            className="pixelated h-8 w-8"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
