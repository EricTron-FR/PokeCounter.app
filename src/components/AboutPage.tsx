import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Github,
  Bug,
  ExternalLink,
  Coffee,
  Code2,
} from "lucide-react";

export const GITHUB_REPO = "https://github.com/EricTron-FR/PokeCounter.app";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues/new`;

interface Props {
  onBack: () => void;
}

export function AboutPage({ onBack }: Props) {
  const { t, lang } = useLang();
  const isFr = lang === "fr";

  return (
    <main className="container py-6 sm:py-10 max-w-2xl">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-8">
        <ArrowLeft className="h-3 w-3" />
        {t("backToApp")}
      </Button>

      {/* Title */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {isFr ? "Qui c'est ce truc ?" : "What is this?"}
          </h1>
        </div>
      </header>

      {/* Personal intro */}
      <section className="mb-10">
        <div className="space-y-4 text-sm font-mono text-muted-foreground leading-relaxed">
          {isFr ? (
            <>
              <p>
                Salut. Je suis <strong className="text-foreground">Eric</strong>,
                dev indé, et PokeCounter est un projet de week-end qui a
                dégénéré. J'ai commencé à jouer à Pokémon Champions dès le
                lancement en avril 2026 et j'en avais marre de scroller trois
                sites pour comparer des matchups entre deux mons.
              </p>
              <p>
                Donc j'ai fait le mien. L'idée de base était simple : tu tapes
                ton adversaire, je te sors les 3 ou 4 Pokémon de ta team qui
                couvrent le mieux. Trois semaines plus tard, y'a un Pokédex
                complet, un simulateur de combats, un calculateur de dégâts, 9
                langues et un tier list qui croise les stats Smogon. J'ai pas
                vraiment su m'arrêter.
              </p>
              <p>
                Le site est gratuit, sans compte, sans pub, sans paywall et
                le restera. Si tu veux dire bonjour, signaler un bug ou
                proposer une feature, ouvre une issue sur GitHub (voir plus
                bas) — c'est l'endroit où je traîne.
              </p>
            </>
          ) : (
            <>
              <p>
                Hi, I'm <strong className="text-foreground">Eric</strong>, an
                indie dev, and PokeCounter is a weekend project that got
                completely out of hand. I started playing Pokémon Champions on
                launch day in April 2026 and I was tired of jumping between
                three different sites to compare matchups between two mons.
              </p>
              <p>
                So I built my own. The original idea was simple: type the
                opponent, I show you the 3 or 4 Pokémon on your team that
                cover it best. Three weeks later it has a full Pokédex, a
                battle simulator, a damage calculator, 9 languages and a tier
                list cross-referenced with Smogon usage stats. I kind of
                couldn't stop.
              </p>
              <p>
                The site is free, no account, no ads, no paywall, and it will
                stay that way. If you want to say hi, report a bug or suggest
                a feature, open a GitHub issue (see below) — that's where I
                hang out.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Other project — mockfast plug */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">01</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {isFr ? "Mon autre projet" : "My other project"}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <div className="space-y-3 text-sm font-mono text-muted-foreground leading-relaxed">
          {isFr ? (
            <p>
              Si tu es dev et que tu as besoin de mock des API rapidement
              pendant le dev sans spin-up un backend, jette un œil à{" "}
              <a
                href="https://mockfast.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
              >
                mockfast.io <ExternalLink className="h-3 w-3" />
              </a>
              . C'est mon outil pour créer des faux endpoints REST en quelques
              clics, avec du delay et des scénarios d'erreur. Gratuit à l'usage.
            </p>
          ) : (
            <p>
              If you're a dev and you need to mock APIs quickly during
              development without spinning up a backend, check out{" "}
              <a
                href="https://mockfast.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
              >
                mockfast.io <ExternalLink className="h-3 w-3" />
              </a>
              . It's my tool for spinning up fake REST endpoints in a few
              clicks, with delay and error scenarios. Free to use.
            </p>
          )}
        </div>
      </section>

      {/* Stack */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">02</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {isFr ? "Comment c'est fait" : "How it's built"}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <div className="text-sm font-mono text-muted-foreground leading-relaxed">
          {isFr ? (
            <p>
              Vite + React + TypeScript + Tailwind. Les données Pokémon
              viennent de <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-primary underline">PokéAPI</a>,
              les stats d'usage viennent de Smogon. Le site est 100 % statique,
              pas de backend, juste du HTML/JS servi par nginx. Les 268 pages
              landing Pokémon et type sont pré-rendues au build. Les teams
              sauvegardées vivent dans ton localStorage, je ne les vois jamais.
              Pour l'analytics j'utilise Umami self-hosted (pas de cookie).
              Le code est MIT et{" "}
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                sur GitHub
              </a>{" "}
              si tu veux forker.
            </p>
          ) : (
            <p>
              Vite + React + TypeScript + Tailwind. Pokémon data comes from{" "}
              <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-primary underline">PokéAPI</a>,
              usage stats from Smogon. The site is 100 % static, no backend,
              just HTML/JS served by nginx. The 268 Pokémon and type landing
              pages are pre-rendered at build time. Saved teams live in your
              localStorage — I never see them. Analytics is self-hosted Umami
              (no cookies). The code is MIT licensed and{" "}
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                on GitHub
              </a>{" "}
              if you want to fork it.
            </p>
          )}
        </div>
      </section>

      {/* Say hi */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">03</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {isFr ? "Dis bonjour" : "Say hi"}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-4">
          {isFr
            ? "Bug, idée, typo, traduction pourrie, tout est bienvenu. Le plus simple :"
            : "Bug, idea, typo, terrible translation — all welcome. The fastest way:"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-3 w-3" />
              {t("viewSource")}
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={GITHUB_ISSUES} target="_blank" rel="noopener noreferrer">
              <Bug className="h-3 w-3" />
              {t("reportBug")}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="https://mockfast.io" target="_blank" rel="noopener noreferrer">
              <Code2 className="h-3 w-3" />
              mockfast.io
            </a>
          </Button>
        </div>
      </section>

      {/* Thanks */}
      <section className="mb-6">
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-start gap-3">
          <Coffee className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {isFr
              ? "Merci à PokéAPI pour les données gratuites, à Smogon pour les stats d'usage, à Nintendo / Game Freak / The Pokémon Company pour les jeux qu'on adore, et à toi de lire jusqu'ici."
              : "Thanks to PokéAPI for the free data, to Smogon for the usage stats, to Nintendo / Game Freak / The Pokémon Company for the games we love, and to you for reading this far."}
          </p>
        </div>
      </section>
    </main>
  );
}
