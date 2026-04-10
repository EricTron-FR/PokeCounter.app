import { useEffect, useState } from "react";
import { ALL_TYPES, Pokemon, PokemonType } from "@/lib/types";
import { spriteUrl } from "@/lib/pokemon";
import { defensiveMatchups } from "@/lib/coverage";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";

interface Props {
  pokemon: Pokemon;
  onClose: () => void;
}

interface MoveEntry {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  damageClass: string;
  pp: number | null;
}

type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe";
type StatLabel = "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe";

const STATS: Array<{ key: StatKey; label: StatLabel }> = [
  { key: "hp", label: "statHp" },
  { key: "atk", label: "statAtk" },
  { key: "def", label: "statDef" },
  { key: "spa", label: "statSpa" },
  { key: "spd", label: "statSpd" },
  { key: "spe", label: "statSpe" },
];

function normalizeType(t: string): PokemonType | null {
  const cap = (t[0]?.toUpperCase() ?? "") + t.slice(1);
  return (ALL_TYPES as readonly string[]).includes(cap) ? (cap as PokemonType) : null;
}

const STAT_COLOR = (v: number) => {
  if (v >= 130) return "bg-emerald-500";
  if (v >= 100) return "bg-lime-500";
  if (v >= 80) return "bg-yellow-500";
  if (v >= 60) return "bg-orange-500";
  return "bg-red-500";
};

export function PokemonDetailModal({ pokemon, onClose }: Props) {
  const { t, lang } = useLang();
  const [moves, setMoves] = useState<MoveEntry[] | null>(null);
  const [movesLoading, setMovesLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Lazy fetch moves from PokeAPI
  useEffect(() => {
    let cancelled = false;
    setMoves(null);
    setMovesLoading(true);
    const fetchId = pokemon.mega && pokemon.base_id ? pokemon.base_id : pokemon.id;
    fetch(`https://pokeapi.co/api/v2/pokemon/${fetchId}`)
      .then((r) => r.json())
      .then(async (poke) => {
        if (cancelled) return;
        // Pick the most recent version-group's level-up + machine moves.
        const targetVG = "scarlet-violet";
        const fallbackVG = "sword-shield";
        const seen = new Set<string>();
        const list: MoveEntry[] = [];
        const moveDataPromises: Promise<void>[] = [];
        for (const m of poke.moves as Array<{
          move: { name: string; url: string };
          version_group_details: Array<{
            level_learned_at: number;
            move_learn_method: { name: string };
            version_group: { name: string };
          }>;
        }>) {
          const matched =
            m.version_group_details.find((d) => d.version_group.name === targetVG) ??
            m.version_group_details.find((d) => d.version_group.name === fallbackVG);
          if (!matched) continue;
          if (seen.has(m.move.name)) continue;
          seen.add(m.move.name);
          // Fetch move details (type, power, etc.)
          moveDataPromises.push(
            fetch(m.move.url)
              .then((r) => r.json())
              .then((md) => {
                list.push({
                  name: md.name,
                  type: md.type?.name ?? "normal",
                  power: md.power,
                  accuracy: md.accuracy,
                  damageClass: md.damage_class?.name ?? "status",
                  pp: md.pp,
                });
              })
              .catch(() => {
                /* noop */
              }),
          );
        }
        await Promise.all(moveDataPromises);
        if (cancelled) return;
        list.sort((a, b) => (b.power ?? -1) - (a.power ?? -1));
        setMoves(list);
        setMovesLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setMovesLoading(false);
          setMoves([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pokemon.id, pokemon.mega, pokemon.base_id]);

  const matchups = defensiveMatchups(pokemon);
  const totalStats = pokemon.stats
    ? Object.values(pokemon.stats).reduce((a, b) => a + b, 0)
    : 0;
  const heightM = pokemon.height ? (pokemon.height / 10).toFixed(1) : "—";
  const weightKg = pokemon.weight ? (pokemon.weight / 10).toFixed(1) : "—";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-soft-lg"
      >
        {/* Header with sprite */}
        <div className="relative p-4 border-b border-border/60 bg-primary/5">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onClose}
            className="absolute right-3 top-3 h-8 w-8"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <img
              src={spriteUrl(pokemon)}
              alt={pokemon.names.en ?? ""}
              className="pixelated h-24 w-24 sm:h-28 sm:w-28 shrink-0 drop-shadow-[0_4px_10px_rgba(60,40,20,0.25)]"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <div className="min-w-0">
              <div className="font-mono text-xs text-muted-foreground">
                #{pokemon.id}
              </div>
              <h2 className="font-pixel text-base sm:text-lg uppercase text-shadow-pixel truncate">
                {pokemonName(pokemon, lang)}
              </h2>
              {pokemon.mega && (
                <div className="text-[8px] font-pixel uppercase text-primary mt-0.5">
                  {t("mega")}
                </div>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {pokemon.types.map((ty) => (
                  <TypeBadge key={ty} type={ty} />
                ))}
              </div>
              <div className="flex gap-3 mt-2 text-[9px] font-pixel uppercase text-muted-foreground">
                <span>{t("height")}: {heightM}m</span>
                <span>{t("weight")}: {weightKg}kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Stats */}
          {pokemon.stats && (
            <section>
              <h3 className="font-pixel text-[10px] uppercase tracking-wider text-primary mb-2">
                {t("baseStats")} · {totalStats}
              </h3>
              <div className="space-y-1.5">
                {STATS.map((s) => {
                  const v = pokemon.stats![s.key];
                  const pct = Math.min(100, (v / 200) * 100);
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className="w-10 text-[9px] font-pixel uppercase text-muted-foreground shrink-0">
                        {t(s.label)}
                      </div>
                      <div className="w-8 text-right font-mono text-xs text-foreground shrink-0">
                        {v}
                      </div>
                      <div className="flex-1 h-2 bg-muted/60 rounded-sm overflow-hidden">
                        <div
                          className={cn("h-full transition-[width]", STAT_COLOR(v))}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <section>
              <h3 className="font-pixel text-[10px] uppercase tracking-wider text-primary mb-2">
                {t("abilities")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-sm border-2 px-2 py-1.5 bg-card/60",
                      a.hidden ? "border-accent/60" : "border-border",
                    )}
                  >
                    <div className="font-mono text-xs">
                      {a.names[lang] ?? a.names.en ?? "?"}
                    </div>
                    {a.hidden && (
                      <div className="text-[7px] font-pixel uppercase text-accent mt-0.5">
                        {t("hiddenAbility")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Defensive matchups */}
          <section className="space-y-2">
            <h3 className="font-pixel text-[10px] uppercase tracking-wider text-primary">
              {t("weaknesses")}
            </h3>
            <div className="flex flex-wrap gap-1">
              {matchups.weak.length === 0 && (
                <span className="text-[10px] text-muted-foreground">—</span>
              )}
              {matchups.weak.map((w) => (
                <div key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-600">
                    ×{w.mult}
                  </span>
                </div>
              ))}
            </div>
            {matchups.resist.length > 0 && (
              <>
                <h3 className="font-pixel text-[10px] uppercase tracking-wider text-emerald-600 mt-3">
                  {t("resistances")}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {matchups.resist.map((r) => (
                    <div key={r.type} className="flex items-center gap-1">
                      <TypeBadge type={r.type} size="xs" />
                      <span className="text-[8px] font-pixel text-emerald-600">
                        ×{r.mult}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {matchups.immune.length > 0 && (
              <>
                <h3 className="font-pixel text-[10px] uppercase tracking-wider text-sky-600 mt-3">
                  {t("immunities")}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {matchups.immune.map((i) => (
                    <TypeBadge key={i} type={i} size="xs" />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Moves */}
          <section>
            <h3 className="font-pixel text-[10px] uppercase tracking-wider text-primary mb-2">
              {t("moves")}
              {moves && (
                <span className="ml-2 text-muted-foreground">
                  · {moves.length}
                </span>
              )}
            </h3>
            {movesLoading && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t("loadingMoves")}
              </div>
            )}
            {!movesLoading && (!moves || moves.length === 0) && (
              <div className="text-[10px] text-muted-foreground">
                {t("noMovesData")}
              </div>
            )}
            {moves && moves.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {moves.map((m) => {
                  const ty = normalizeType(m.type);
                  return (
                  <div
                    key={m.name}
                    className="rounded-sm border border-border/70 bg-card/40 px-2 py-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] truncate capitalize">
                        {m.name.replace(/-/g, " ")}
                      </span>
                      {ty && <TypeBadge type={ty} size="xs" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[8px] font-mono text-muted-foreground">
                      {m.power != null && <span>P {m.power}</span>}
                      {m.accuracy != null && <span>A {m.accuracy}</span>}
                      {m.pp != null && <span>PP {m.pp}</span>}
                      <span className="capitalize ml-auto">{m.damageClass}</span>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
