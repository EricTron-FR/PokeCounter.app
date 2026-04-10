import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Pokemon } from "@/lib/types";
import { POKEMON } from "@/lib/pokemon";
import { PokemonSearch } from "@/components/PokemonSearch";
import { TeamSlot } from "@/components/TeamSlot";
import { BestPicks, BattleFormat, BRING_COUNT } from "@/components/BestPicks";
import { FormatToggle } from "@/components/FormatToggle";
import { TypeCoverageGrid } from "@/components/TypeCoverageGrid";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { SavedTeamsPanel } from "@/components/SavedTeamsPanel";
import { SeasonBanner } from "@/components/SeasonBanner";
import { BuildSlot } from "@/lib/types";

// Lazy-loaded views — keep moves.json + heavy components out of the initial bundle
const AboutPage = lazy(() =>
  import("@/components/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const PokedexPage = lazy(() =>
  import("@/components/PokedexPage").then((m) => ({ default: m.PokedexPage })),
);
const ComparePage = lazy(() =>
  import("@/components/ComparePage").then((m) => ({ default: m.ComparePage })),
);
const TypeChartPage = lazy(() =>
  import("@/components/TypeChartPage").then((m) => ({ default: m.TypeChartPage })),
);
const LearnPage = lazy(() =>
  import("@/components/LearnPage").then((m) => ({ default: m.LearnPage })),
);
const AdvancedTeamBuilder = lazy(() =>
  import("@/components/AdvancedTeamBuilder").then((m) => ({
    default: m.AdvancedTeamBuilder,
  })),
);
import { Info, Home as HomeIcon, BookOpen, Settings, Zap, Scale, Grid3x3, GraduationCap } from "lucide-react";
import {
  loadSavedTeams,
  writeSavedTeams,
  newTeamId,
  SavedTeam,
} from "@/lib/savedTeams";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Swords, Shield, Share2, Check, Star, Github, Bug } from "lucide-react";
import { useLang } from "@/lib/i18n";

const MAX_TEAM = 6;
const STORAGE_KEY = "pokecounter.myteam.v1";
const FORMAT_KEY = "pokecounter.format.v1";

function idsFromUrl(): number[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("opp");
  if (!raw) return [];
  return raw
    .split(",")
    .map((x) => parseInt(x, 10))
    .filter((n) => Number.isFinite(n));
}

function loadMyTeam(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((n) => typeof n === "number");
  } catch {
    return [];
  }
}

function toPokemon(ids: number[]): Pokemon[] {
  const map = new Map(POKEMON.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is Pokemon => !!p);
}

export default function App() {
  const { t } = useLang();
  const [opponentIds, setOpponentIds] = useState<number[]>(() => idsFromUrl());
  const [myTeamIds, setMyTeamIds] = useState<number[]>(() => loadMyTeam());
  const [format, setFormat] = useState<BattleFormat>(() => {
    const raw = localStorage.getItem(FORMAT_KEY);
    return raw === "2v2" ? "2v2" : "1v1";
  });
  const [copied, setCopied] = useState(false);
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>(() =>
    loadSavedTeams(),
  );
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(() => {
    return localStorage.getItem("pokecounter.advanced.v1") === "1";
  });
  const [advancedSlots, setAdvancedSlots] = useState<BuildSlot[]>(() => {
    try {
      const raw = localStorage.getItem("pokecounter.advanced.slots.v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pokecounter.advanced.v1", advancedMode ? "1" : "0");
  }, [advancedMode]);
  useEffect(() => {
    localStorage.setItem(
      "pokecounter.advanced.slots.v1",
      JSON.stringify(advancedSlots),
    );
  }, [advancedSlots]);

  // Sync advanced slots → simple team ids so coverage / picks still work
  useEffect(() => {
    if (advancedMode) {
      const ids = advancedSlots.map((s) => s.pokemonId);
      setMyTeamIds(ids);
    }
  }, [advancedMode, advancedSlots]);
  function viewFromHash(): "home" | "about" | "pokedex" | "compare" | "types" | "learn" {
    const h = window.location.hash;
    if (h === "#/about") return "about";
    if (h === "#/pokedex") return "pokedex";
    if (h === "#/compare") return "compare";
    if (h === "#/types") return "types";
    if (h === "#/learn") return "learn";
    return "home";
  }
  const [view, setView] = useState<"home" | "about" | "pokedex" | "compare" | "types" | "learn">(
    () => viewFromHash(),
  );

  useEffect(() => {
    function onHash() {
      setView(viewFromHash());
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goAbout = useCallback(() => {
    window.location.hash = "#/about";
  }, []);
  const goPokedex = useCallback(() => {
    window.location.hash = "#/pokedex";
  }, []);
  const goCompare = useCallback(() => {
    window.location.hash = "#/compare";
  }, []);
  const goTypes = useCallback(() => {
    window.location.hash = "#/types";
  }, []);
  const goLearn = useCallback(() => {
    window.location.hash = "#/learn";
  }, []);
  const goHome = useCallback(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setView("home");
  }, []);

  useEffect(() => {
    localStorage.setItem(FORMAT_KEY, format);
  }, [format]);

  // Auto-save my team on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myTeamIds));
    } catch {
      /* noop */
    }
  }, [myTeamIds]);

  const opponents = useMemo(() => toPokemon(opponentIds), [opponentIds]);
  const myTeam = useMemo(() => toPokemon(myTeamIds), [myTeamIds]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (opponentIds.length > 0) {
      url.searchParams.set("opp", opponentIds.join(","));
    } else {
      url.searchParams.delete("opp");
    }
    window.history.replaceState({}, "", url.toString());
  }, [opponentIds]);

  const addOpponent = useCallback((p: Pokemon) => {
    setOpponentIds((prev) =>
      prev.length >= MAX_TEAM || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }, []);

  const removeOpponent = useCallback((id: number) => {
    setOpponentIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const addMine = useCallback((p: Pokemon) => {
    setMyTeamIds((prev) =>
      prev.length >= MAX_TEAM || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }, []);

  const removeMine = useCallback((id: number) => {
    setMyTeamIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const resetMyTeam = useCallback(() => {
    setMyTeamIds([]);
    setActiveTeamId(null);
  }, []);

  const saveCurrentAs = useCallback(
    (name: string) => {
      const team: SavedTeam = {
        id: newTeamId(),
        name,
        pokemonIds: myTeamIds,
        createdAt: Date.now(),
      };
      const next = [team, ...savedTeams];
      setSavedTeams(next);
      writeSavedTeams(next);
      setActiveTeamId(team.id);
    },
    [myTeamIds, savedTeams],
  );

  const loadTeam = useCallback((team: SavedTeam) => {
    setMyTeamIds(team.pokemonIds);
    setActiveTeamId(team.id);
  }, []);

  const deleteTeam = useCallback(
    (id: string) => {
      const next = savedTeams.filter((t) => t.id !== id);
      setSavedTeams(next);
      writeSavedTeams(next);
      if (activeTeamId === id) setActiveTeamId(null);
    },
    [savedTeams, activeTeamId],
  );

  const updateTeamNotes = useCallback(
    (id: string, notes: string) => {
      const next = savedTeams.map((t) =>
        t.id === id ? { ...t, notes } : t,
      );
      setSavedTeams(next);
      writeSavedTeams(next);
    },
    [savedTeams],
  );

  const loadTemplate = useCallback((ids: number[]) => {
    setMyTeamIds(ids);
    setActiveTeamId(null);
  }, []);

  const resetOpponents = useCallback(() => {
    setOpponentIds([]);
  }, []);

  const shareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b-2 border-border/60 bg-background/80 backdrop-blur">
        <div className="container py-3 sm:py-5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/pokeball.svg"
              alt=""
              className="pixelated h-8 w-8 sm:h-10 sm:w-10 animate-glow-pulse shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-pixel text-sm sm:text-xl text-shadow-pixel text-primary truncate">
                POKECOUNTER
              </h1>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground font-pixel uppercase tracking-wider mt-0.5 sm:mt-1 truncate hidden sm:block">
                {t("tagline")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {view === "home" && (
              <Button
                variant="outline"
                size="sm"
                onClick={shareUrl}
                disabled={opponentIds.length === 0}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> {t("copied")}
                  </>
                ) : (
                  <>
                    <Share2 className="h-3 w-3" /> {t("share")}
                  </>
                )}
              </Button>
            )}
            {view !== "home" && (
              <Button variant="outline" size="sm" onClick={goHome}>
                <HomeIcon className="h-3 w-3" />
                <span className="hidden sm:inline">{t("navHome")}</span>
              </Button>
            )}
            {view !== "pokedex" && (
              <Button variant="outline" size="sm" onClick={goPokedex}>
                <BookOpen className="h-3 w-3" />
                <span className="hidden sm:inline">{t("navPokedex")}</span>
              </Button>
            )}
            {view !== "types" && (
              <Button variant="outline" size="sm" onClick={goTypes}>
                <Grid3x3 className="h-3 w-3" />
                <span className="hidden md:inline">Types</span>
              </Button>
            )}
            {view !== "compare" && (
              <Button variant="outline" size="sm" onClick={goCompare}>
                <Scale className="h-3 w-3" />
                <span className="hidden md:inline">{t("navCompare")}</span>
              </Button>
            )}
            {view !== "learn" && (
              <Button variant="outline" size="sm" onClick={goLearn}>
                <GraduationCap className="h-3 w-3" />
                <span className="hidden md:inline">Learn</span>
              </Button>
            )}
            {view !== "about" && (
              <Button variant="outline" size="sm" onClick={goAbout}>
                <Info className="h-3 w-3" />
                <span className="hidden lg:inline">{t("navAbout")}</span>
              </Button>
            )}
            <LanguageDropdown />
          </div>
        </div>
      </header>

      {view === "about" && (
        <Suspense fallback={<LazyFallback />}>
          <AboutPage onBack={goHome} />
        </Suspense>
      )}
      {view === "pokedex" && (
        <Suspense fallback={<LazyFallback />}>
          <PokedexPage />
        </Suspense>
      )}
      {view === "compare" && (
        <Suspense fallback={<LazyFallback />}>
          <ComparePage />
        </Suspense>
      )}
      {view === "types" && (
        <Suspense fallback={<LazyFallback />}>
          <TypeChartPage />
        </Suspense>
      )}
      {view === "learn" && (
        <Suspense fallback={<LazyFallback />}>
          <LearnPage />
        </Suspense>
      )}
      {view === "home" && (
      <>
      <div className="container pt-4 sm:pt-8">
        <SeasonBanner />
      </div>
      <main className="container py-4 sm:py-8 grid gap-4 sm:gap-6 items-start lg:grid-cols-[1fr_1fr_1.1fr]">
        {/* Opponent team */}
        <Card className="shadow-[0_6px_0_0_hsl(var(--destructive)/0.4)] border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Swords className="h-4 w-4" />
              {t("opponentTeam")}
              <span className="ml-auto text-[10px] text-muted-foreground">
                {opponents.length}/{MAX_TEAM}
              </span>
              {opponents.length > 0 && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={resetOpponents}
                  className="h-7 w-7 hover:border-destructive hover:text-destructive"
                  title={t("reset")}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PokemonSearch
              onSelect={addOpponent}
              excludeIds={opponentIds}
              disabled={opponentIds.length >= MAX_TEAM}
              placeholder={t("searchOpponent")}
            />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: MAX_TEAM }).map((_, i) => (
                <TeamSlot
                  key={i}
                  pokemon={opponents[i]}
                  onRemove={
                    opponents[i]
                      ? () => removeOpponent(opponents[i].id)
                      : undefined
                  }
                  accent="opponent"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My team */}
        <Card className="shadow-[0_6px_0_0_hsl(var(--primary)/0.4)] border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" />
              {t("myTeam")}
              <span className="ml-auto text-[10px] text-muted-foreground">
                {myTeam.length}/{MAX_TEAM}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simple / Advanced mode toggle */}
            <div className="grid grid-cols-2 gap-1 rounded-sm border-2 border-border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setAdvancedMode(false)}
                className={`flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 transition-all ${!advancedMode ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_hsl(var(--primary)/0.5)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Zap className="h-3 w-3" />
                <span className="font-pixel text-[9px] uppercase tracking-wider">Simple</span>
              </button>
              <button
                type="button"
                onClick={() => setAdvancedMode(true)}
                className={`flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 transition-all ${advancedMode ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_hsl(var(--primary)/0.5)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Settings className="h-3 w-3" />
                <span className="font-pixel text-[9px] uppercase tracking-wider">Advanced</span>
              </button>
            </div>

            {!advancedMode && (
              <>
                <PokemonSearch
                  onSelect={addMine}
                  excludeIds={myTeamIds}
                  disabled={myTeamIds.length >= MAX_TEAM}
                  placeholder={t("searchMine")}
                />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: MAX_TEAM }).map((_, i) => (
                    <TeamSlot
                      key={i}
                      pokemon={myTeam[i]}
                      onRemove={
                        myTeam[i] ? () => removeMine(myTeam[i].id) : undefined
                      }
                      accent="me"
                    />
                  ))}
                </div>
              </>
            )}

            {advancedMode && (
              <Suspense fallback={<LazyFallback />}>
                <AdvancedTeamBuilder
                  slots={advancedSlots}
                  onChange={setAdvancedSlots}
                  maxSlots={MAX_TEAM}
                  externalTargets={opponentIds}
                />
              </Suspense>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1 text-[8px] font-pixel uppercase tracking-wider text-muted-foreground">
                <Check className="h-3 w-3 text-primary" />
                {t("autoSaved")}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={resetMyTeam}
                disabled={myTeamIds.length === 0}
              >
                <RotateCcw className="h-3 w-3" /> {t("reset")}
              </Button>
            </div>
            {myTeam.length > 0 && (
              <div className="space-y-2 pt-2 border-t-2 border-border/40">
                <div className="text-[9px] font-pixel uppercase text-muted-foreground tracking-wider">
                  {t("offensiveCoverage")}
                </div>
                <TypeCoverageGrid myTeam={myTeam} />
              </div>
            )}
            <SavedTeamsPanel
              currentTeamIds={myTeamIds}
              savedTeams={savedTeams}
              onSave={saveCurrentAs}
              onLoad={loadTeam}
              onDelete={deleteTeam}
              onUpdateNotes={updateTeamNotes}
              onLoadTemplate={loadTemplate}
              activeTeamId={activeTeamId}
            />
          </CardContent>
        </Card>

        {/* Best picks */}
        <Card className="shadow-[0_6px_0_0_hsl(var(--accent)/0.5)] border-accent/40 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Star className="h-4 w-4" />
              {t("bestPicks")}
              <span className="ml-auto text-[9px] text-muted-foreground lowercase">
                {t("bring")} {BRING_COUNT[format]}/{MAX_TEAM}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormatToggle value={format} onChange={setFormat} />
            <BestPicks
              opponents={opponents}
              myTeam={myTeam}
              format={format}
            />
          </CardContent>
        </Card>
      </main>
      </>
      )}

      <footer className="container pb-10 pt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/EricTron-FR/PokeCounter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-card/60 px-3 py-1.5 text-[9px] font-pixel uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
          >
            <Github className="h-3 w-3" />
            {t("viewSource")}
          </a>
          <a
            href="https://github.com/EricTron-FR/PokeCounter.app/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border-2 border-destructive/40 bg-destructive/10 px-3 py-1.5 text-[9px] font-pixel uppercase tracking-wider text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Bug className="h-3 w-3" />
            {t("reportBug")}
          </a>
        </div>
        <p className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground/60">
          {t("footer")}
        </p>
      </footer>
    </div>
  );
}

function LazyFallback() {
  return (
    <div className="container py-12 text-center">
      <div className="inline-block h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
