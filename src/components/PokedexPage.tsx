import { useMemo, useState } from "react";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { Pokemon, ALL_TYPES, PokemonType } from "@/lib/types";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { PokemonDetailModal } from "./PokemonDetailModal";

type MegaFilter = "all" | "mega" | "base";

export function PokedexPage() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [megaFilter, setMegaFilter] = useState<MegaFilter>("all");
  const [selected, setSelected] = useState<Pokemon | null>(null);

  const filtered = useMemo(() => {
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return POKEMON.filter((p) => {
      if (megaFilter === "mega" && !p.mega) return false;
      if (megaFilter === "base" && p.mega) return false;
      if (typeFilter && !p.types.includes(typeFilter)) return false;
      if (q) {
        const names = Object.values(p.names)
          .map((n) =>
            (n ?? "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
          )
          .join("|");
        if (!names.includes(q)) return false;
      }
      return true;
    });
  }, [query, typeFilter, megaFilter]);

  return (
    <main className="container py-4 sm:py-8">
      <header className="mb-6 text-center">
        <h1 className="font-pixel text-xl sm:text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-shadow-pixel">
          {t("pokedexTitle")}
        </h1>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-2">
          {t("pokedexCount", { n: filtered.length })}
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          <FilterPill
            active={megaFilter === "all"}
            onClick={() => setMegaFilter("all")}
          >
            {t("filterAll")}
          </FilterPill>
          <FilterPill
            active={megaFilter === "base"}
            onClick={() => setMegaFilter("base")}
          >
            {t("filterBase")}
          </FilterPill>
          <FilterPill
            active={megaFilter === "mega"}
            onClick={() => setMegaFilter("mega")}
          >
            {t("filterMega")}
          </FilterPill>
        </div>

        <div className="flex flex-wrap gap-1">
          {ALL_TYPES.map((tp) => {
            const active = typeFilter === tp;
            return (
              <button
                key={tp}
                type="button"
                onClick={() => setTypeFilter(active ? null : tp)}
                className={cn(
                  "transition-opacity",
                  active ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100",
                )}
              >
                <TypeBadge type={tp} />
              </button>
            );
          })}
          {typeFilter && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTypeFilter(null)}
              className="h-6 px-2 text-[8px]"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="group rounded-sm border-2 border-border bg-card/70 p-2 transition-all hover:border-primary/70 hover:shadow-[0_0_16px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-[8px] text-muted-foreground font-mono">
              <span>#{p.id}</span>
              {p.mega && (
                <span className="font-pixel text-primary">{t("mega")}</span>
              )}
            </div>
            <img
              src={spriteUrl(p)}
              alt={p.names.en ?? ""}
              className="pixelated h-16 w-16 sm:h-20 sm:w-20 mx-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <div className="mt-1 font-pixel text-[8px] uppercase text-center truncate text-shadow-pixel">
              {pokemonName(p, lang)}
            </div>
            <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
              {p.types.map((ty) => (
                <TypeBadge key={ty} type={ty} size="xs" />
              ))}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-sm border-2 border-dashed border-border/50 bg-muted/10 p-8 text-center mt-6">
          <p className="font-pixel text-[10px] uppercase text-muted-foreground">
            —
          </p>
        </div>
      )}

      {selected && (
        <PokemonDetailModal
          pokemon={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-sm border-2 font-pixel text-[9px] uppercase tracking-wider transition-colors",
        active
          ? "border-primary bg-primary/20 text-primary"
          : "border-border bg-muted/30 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

