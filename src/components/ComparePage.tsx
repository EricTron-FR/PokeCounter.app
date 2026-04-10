import { useState } from "react";
import { Pokemon, PokemonStats } from "@/lib/types";
import { spriteUrl, searchPokemon } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { defensiveMatchups, bestStabMultiplier } from "@/lib/coverage";
import { TypeBadge } from "./TypeBadge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search, ArrowRight, X } from "lucide-react";

const STATS: Array<{ key: keyof PokemonStats; label: "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe" }> = [
  { key: "hp", label: "statHp" },
  { key: "atk", label: "statAtk" },
  { key: "def", label: "statDef" },
  { key: "spa", label: "statSpa" },
  { key: "spd", label: "statSpd" },
  { key: "spe", label: "statSpe" },
];

export function ComparePage() {
  const { t, lang } = useLang();
  const [a, setA] = useState<Pokemon | null>(null);
  const [b, setB] = useState<Pokemon | null>(null);

  return (
    <main className="container py-4 sm:py-8 max-w-4xl">
      <header className="mb-6 text-center">
        <h1 className="font-pixel text-xl sm:text-2xl text-primary text-shadow-pixel">
          {t("compareTitle")}
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PokemonPicker value={a} onChange={setA} placeholder={t("pickFirst")} />
        <PokemonPicker value={b} onChange={setB} placeholder={t("pickSecond")} />
      </div>

      {a && b && <ComparisonTable a={a} b={b} t={t} lang={lang} />}
    </main>
  );
}

function PokemonPicker({
  value,
  onChange,
  placeholder,
}: {
  value: Pokemon | null;
  onChange: (p: Pokemon | null) => void;
  placeholder: string;
}) {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const results = query ? searchPokemon(query, 8) : [];

  if (value) {
    return (
      <div className="rounded-sm border-2 border-primary/50 bg-card/80 p-3 relative">
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 h-6 w-6 rounded-sm border-2 border-border bg-destructive text-destructive-foreground flex items-center justify-center"
          aria-label="Clear"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={spriteUrl(value)}
            alt={value.names.en ?? ""}
            className="pixelated h-20 w-20 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[8px] font-mono text-muted-foreground">#{value.id}</div>
            <div className="font-pixel text-sm uppercase text-shadow-pixel truncate">
              {pokemonName(value, lang)}
            </div>
            <div className="flex gap-1 mt-1">
              {value.types.map((tp) => (
                <TypeBadge key={tp} type={tp} size="xs" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border-2 border-dashed border-border bg-muted/10 p-3 space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {results.length > 0 && (
        <div className="max-h-60 overflow-auto space-y-1">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p);
                setQuery("");
              }}
              className="w-full flex items-center gap-2 p-1.5 rounded-sm hover:bg-accent/20 text-left"
            >
              <img src={spriteUrl(p)} alt={p.names.en ?? ""} className="pixelated h-8 w-8" />
              <span className="font-pixel text-[10px] uppercase truncate">
                {pokemonName(p, lang)}
              </span>
              <div className="flex gap-0.5 ml-auto">
                {p.types.map((tp) => (
                  <TypeBadge key={tp} type={tp} size="xs" />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonTable({
  a,
  b,
  t,
  lang,
}: {
  a: Pokemon;
  b: Pokemon;
  t: ReturnType<typeof useLang>["t"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const aMatchups = defensiveMatchups(a);
  const bMatchups = defensiveMatchups(b);

  const aVsB = bestStabMultiplier(a, b);
  const bVsA = bestStabMultiplier(b, a);

  return (
    <div className="mt-6 space-y-4">
      {/* Stats compare */}
      <Card>
        <CardHeader>
          <CardTitle>{t("baseStats")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {STATS.map(({ key, label }) => {
            const av = a.stats?.[key] ?? 0;
            const bv = b.stats?.[key] ?? 0;
            const max = Math.max(av, bv, 1);
            return (
              <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex items-center justify-end gap-2">
                  <span className={cn("font-mono text-xs", av > bv && "text-emerald-400 font-bold")}>{av}</span>
                  <div className="flex-1 h-2 bg-muted/60 rounded-sm overflow-hidden">
                    <div
                      className={cn("h-full ml-auto", av >= bv ? "bg-emerald-500" : "bg-muted-foreground/40")}
                      style={{ width: `${(av / max) * 100}%`, marginLeft: "auto" }}
                    />
                  </div>
                </div>
                <div className="font-pixel text-[9px] uppercase text-muted-foreground w-10 text-center">
                  {t(label)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted/60 rounded-sm overflow-hidden">
                    <div
                      className={cn("h-full", bv >= av ? "bg-emerald-500" : "bg-muted-foreground/40")}
                      style={{ width: `${(bv / max) * 100}%` }}
                    />
                  </div>
                  <span className={cn("font-mono text-xs", bv > av && "text-emerald-400 font-bold")}>{bv}</span>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-2 border-t border-border/40">
            <div className="text-right font-mono text-xs">
              {Object.values(a.stats ?? {}).reduce((s, v) => s + v, 0)}
            </div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground text-center">
              {t("totalStats")}
            </div>
            <div className="text-left font-mono text-xs">
              {Object.values(b.stats ?? {}).reduce((s, v) => s + v, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Head to head */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Head to head
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-1">
                {pokemonName(a, lang)} →
              </div>
              <div className={cn("font-pixel text-2xl text-shadow-pixel", aVsB >= 2 ? "text-emerald-400" : aVsB <= 0.5 ? "text-red-400" : "text-foreground")}>
                ×{aVsB}
              </div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-1">
                ← {pokemonName(b, lang)}
              </div>
              <div className={cn("font-pixel text-2xl text-shadow-pixel", bVsA >= 2 ? "text-emerald-400" : bVsA <= 0.5 ? "text-red-400" : "text-foreground")}>
                ×{bVsA}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Defensive matchups */}
      <Card>
        <CardHeader>
          <CardTitle>{t("weaknesses")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-2">
              {pokemonName(a, lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {aMatchups.weak.map((w) => (
                <div key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-400">×{w.mult}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-2">
              {pokemonName(b, lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {bMatchups.weak.map((w) => (
                <div key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-400">×{w.mult}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

