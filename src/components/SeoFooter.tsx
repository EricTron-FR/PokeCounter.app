import { POKEMON } from "@/lib/pokemon";
import { ALL_TYPES, PokemonType } from "@/lib/types";
import { getTier } from "@/lib/tiers";
import { pokemonName, useLang, SUPPORTED_LANGS, LANG_META, typeLabel } from "@/lib/i18n";
import { Github, Bug } from "lucide-react";
import { TypeBadge } from "./TypeBadge";

const GITHUB = "https://github.com/EricTron-FR/PokeCounter.app";
const ISSUES = `${GITHUB}/issues/new`;

function popularMons() {
  // S + top A tier for "Counter for X" links — capped at ~32
  return POKEMON.filter((p) => {
    const t = getTier(p.id);
    return t === "S" || t === "A";
  }).slice(0, 32);
}

export function SeoFooter() {
  const { t, lang, setLang } = useLang();
  const popular = popularMons();

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="container py-10 space-y-10">
        {/* Row 1: prose + meta links */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
              <span className="font-pixel text-sm text-foreground">POKECOUNTER</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed font-mono">
              Free Pokémon Champions counter picker. Type in any of 9 languages,
              get the best picks from your 6-mon team instantly. Supports 1v1 and
              2v2 VGC-style formats, full 250-mon Champions roster, damage calc,
              type chart, team analyzer and battle simulator. No account, no ads,
              no paywalls.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-pixel uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                <Github className="h-3 w-3" />
                {t("viewSource")}
              </a>
              <a
                href={ISSUES}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-pixel uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                <Bug className="h-3 w-3" />
                {t("reportBug")}
              </a>
            </div>
          </div>

          <div>
            <div className="font-pixel text-[9px] uppercase tracking-wider text-primary mb-3">
              Tools
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li><a className="hover:text-primary text-muted-foreground" href="#/pokedex">Pokédex</a></li>
              <li><a className="hover:text-primary text-muted-foreground" href="#/compare">Compare Pokémon</a></li>
              <li><a className="hover:text-primary text-muted-foreground" href="#/types">Type chart 18×18</a></li>
              <li><a className="hover:text-primary text-muted-foreground" href="#/battle">Battle simulator</a></li>
              <li><a className="hover:text-primary text-muted-foreground" href="#/learn">Learn VGC</a></li>
              <li><a className="hover:text-primary text-muted-foreground" href="#/about">About</a></li>
            </ul>
          </div>

          <div>
            <div className="font-pixel text-[9px] uppercase tracking-wider text-primary mb-3">
              {t("language")}
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              {SUPPORTED_LANGS.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    className={
                      l === lang
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-primary"
                    }
                  >
                    {LANG_META[l].native}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 2: type pages */}
        <div>
          <div className="font-pixel text-[9px] uppercase tracking-wider text-primary mb-3">
            Counters by type
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map((tp: PokemonType) => (
              <a
                key={tp}
                href={`#/pokedex?type=${tp}`}
                className="transition-opacity hover:opacity-100 opacity-80"
                aria-label={`Counters for ${tp} type`}
              >
                <TypeBadge type={tp} />
                <span className="sr-only">
                  Best {typeLabel(tp, lang)} counters
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Row 3: popular counters — dense long-tail SEO links, no sprites */}
        <div>
          <div className="font-pixel text-[9px] uppercase tracking-wider text-primary mb-3">
            Popular counters
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono leading-relaxed text-muted-foreground">
            {popular.map((p) => (
              <a
                key={p.id}
                href={`/?opp=${p.id}`}
                className="hover:text-primary whitespace-nowrap"
                title={`Best counters for ${pokemonName(p, lang)}`}
              >
                {pokemonName(p, lang)}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[9px] font-pixel uppercase tracking-wider text-muted-foreground/70">
          <div>
            © 2026 PokeCounter · MIT
          </div>
          <div>
            Pokémon © Nintendo · Game Freak · The Pokémon Company
          </div>
        </div>
      </div>
    </footer>
  );
}
