<div align="center">

# 🎮 PokeCounter

### *Free type-coverage counter for **Pokémon Champions** (2026)*

**Pick the opponent. Get the perfect counter. Win the match.**

[![Live](https://img.shields.io/badge/live-pokecounter.app-ff3d8b?style=for-the-badge)](https://pokecounter.app)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)
[![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[**🌐 pokecounter.app**](https://pokecounter.app) · [**📖 Pokédex**](https://pokecounter.app/#/pokedex) · [**ℹ️ About**](https://pokecounter.app/#/about) · [**⭐ GitHub**](https://github.com/EricTron-FR/PokeCounter.app)

</div>

---

## ✨ What is it?

**PokeCounter** is a single-page web app that takes the friction out of counter-picking
in **Pokémon Champions**. Drop the opposing team into the left column, your own team
into the middle, and instantly see which subset of your team to bring to win the
matchup.

Type the name in **any of 9 languages**, get the optimal pick in **one click**, and
share the matchup with a teammate via a copy-pasteable URL. No sign-up, no ads,
no paywalls, no tracking.

```
┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐
│ Team adverse │  │   Ma team    │  │   Meilleurs picks   │
│              │  │              │  │  (3 for 1v1 ·       │
│ ⚔ 6 slots    │  │ 🛡 6 slots   │  │   4 for 2v2)        │
│              │  │              │  │                     │
│              │  │              │  │  ⭐ Pick 1 — 8 pts  │
│              │  │              │  │  ⭐ Pick 2 — 6 pts  │
└──────────────┘  └──────────────┘  └─────────────────────┘
```

## 🚀 Features

### 🧠 The smart counter picker

- **Optimal subset finder** — brute-force across all `C(6, N)` subsets to find the
  combination of `N` Pokémon that covers the most opposing mons super-effectively.
  `N` is **3** for **1v1 (Singles)** and **4** for **2v2 (Doubles)**.
- **Per-pick matchup explanation** — every pick shows a green chip-list of opponents
  it hits ≥2× and a red chip-list of opponents that threaten it.
- **18-type offensive coverage grid** — see exactly which types your team can hit
  super-effectively, in one glance.
- **URL sharing** — your opponent team is encoded in `?opp=...` so you can hand a
  matchup to a teammate by sending one link.

### 📚 Full Champions Pokédex

- **267 entries** covering the **205 base + 62 Mega** Pokémon Champions Season 1 roster
- **Per-Pokémon detail modal**: stats with colored bars, abilities (with hidden flag),
  height/weight, full defensive matchup table (weak / resist / immune), and the
  **complete movepool** lazy-loaded from PokéAPI on demand.
- **Multi-language search**: type `Glurak`, `리자몽`, `リザードン`, `喷火龙` or
  `Charizard` — they all find the same Pokémon.
- **Filter by type, base form / Mega form**, and free-text search.

### 🛠 Advanced Team Builder

A second mode for the team column lets you fully configure each Pokémon ChampionsLab-style:

| Field | What it does |
| --- | --- |
| **Ability** | Dropdown localized in your language, with hidden ability marker |
| **4 moves** | Searchable selectors filtered to the Pokémon's actual movepool, with type badges and base power |
| **Nature** | All 25 natures with `+stat / -stat` indicators |
| **Tera Type** | All 18 types |
| **Item** | Free-text input |
| **Stat Points** | Champions SP system: **66 SP total · 32 max per stat**, with progress bars and ± buttons |

The Best Picks column re-syncs automatically as you tweak your team in either mode.

### 💾 Saved Teams

- **Unlimited named team slots**, persisted in `localStorage`
- One-click load / delete
- Active team is highlighted with a primary outline
- Mini-sprites preview of all 6 mons per saved team

### 🌍 9 Official Pokémon Languages

Every UI string, every Pokémon name, every type label is localized in:

| | | | |
| --- | --- | --- | --- |
| 🇬🇧 English | 🇫🇷 Français | 🇪🇸 Español | 🇩🇪 Deutsch |
| 🇮🇹 Italiano | 🇯🇵 日本語 | 🇰🇷 한국어 | 🇨🇳 简体中文 |
| 🇹🇼 繁體中文 | | | |

The browser language is auto-detected on first visit. Pixel-art SVG flags in the
language dropdown for that authentic Game Boy feel.

### 🎨 Pixel-Art Design

- **Press Start 2P** typography with `text-shadow` for that CRT-shaded look
- Dark "night battle" background gradient with **scanlines**
- **Pixel-perfect SVGs** rendered with `shape-rendering: crispEdges`
- **Type-colored badges** matching the official Pokémon palette
- **Hover glows** and **pressable button shadows** that pop on click
- Fully **responsive** from 320 px phones to ultrawide monitors

## 🛠 Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | **Vite 5** | Sub-second HMR, ESM-first |
| UI | **React 18 + TypeScript 5** | Strict mode, lazy loading via `React.lazy` |
| Styling | **Tailwind CSS 3** | Custom theme with type colors + pixel utilities |
| Components | **shadcn/ui primitives** | `Button` / `Card` / `Input` / `Badge` copied into the repo |
| Icons | **lucide-react** | Tree-shakeable |
| Data | **Static JSON** | Bundled with code-splitting via dynamic imports |
| Analytics | **Umami (self-hosted)** | Privacy-respecting page views, no cookies |
| Hosting | **Nginx** + **Let's Encrypt** | Static SPA, gzip + cache headers |

**No backend. No database. No login.** Just static files and `localStorage`.

## ⚡ Performance

```
Initial JS bundle    │ 133 KB gzip
Lazy: Pokédex        │   4 KB gzip  (loaded on /#/pokedex)
Lazy: AboutPage      │   2 KB gzip  (loaded on /#/about)
Lazy: TeamBuilder    │  33 KB gzip  (loaded when toggling Advanced mode)
Lazy: pokemon-moves  │  30 KB gzip  (loaded with TeamBuilder)
```

Heavy components are dynamically imported so the first paint stays snappy.

## 🚀 Quick start

```bash
git clone https://github.com/EricTron-FR/PokeCounter.app.git
cd PokeCounter.app
npm install
npm run dev          # → http://localhost:5173
```

That's it. No env vars, no API keys, no database to spin up.

### Production build

```bash
npm run build        # → dist/
npm run preview      # serve dist/ locally
```

### Deploying to a static host

The output of `npm run build` is a plain `dist/` folder. Drop it on Vercel, Netlify,
GitHub Pages, Cloudflare Pages, or any boring nginx server. The included
`nginx.conf` snippet (see [DEPLOY.md](#deploying-to-your-own-nginx)) handles SPA
routing, gzip and cache headers.

## 📂 Project structure

```
pokecounter/
├── index.html                       # SEO meta + JSON-LD + Umami snippet
├── LICENSE                          # MIT
├── package.json
├── tailwind.config.js               # custom theme + type palette
├── vite.config.ts
│
├── public/
│   ├── pokeball.svg                 # favicon (pixel-art SVG)
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/                         # one-shot data fetchers (run with node)
│   ├── fetch-names.mjs              # localized Pokémon names from PokéAPI
│   ├── fetch-details.mjs            # base stats + abilities from PokéAPI
│   └── regen-from-pokeapi.mjs       # rebuild moves + ability descriptions
│
└── src/
    ├── main.tsx
    ├── App.tsx                      # router (hash-based) + state
    ├── index.css                    # pixel theme + scanlines
    │
    ├── data/
    │   ├── pokemon.json             # 267 entries (no movepools — kept light)
    │   ├── moves.json               # 654 unique moves (lazy-loaded)
    │   └── pokemon-moves.json       # id → string[] (lazy-loaded)
    │
    ├── lib/
    │   ├── types.ts                 # core TS types
    │   ├── coverage.ts              # subset optimisation + matchups
    │   ├── pokemon.ts               # data loader + multilingual search
    │   ├── pokemonMoves.ts          # lazy movepool loader
    │   ├── moves.ts                 # move database accessor
    │   ├── natures.ts               # 25 natures + common items
    │   ├── i18n.ts                  # 9-language UI dictionary + helpers
    │   ├── savedTeams.ts            # named team save/load
    │   └── buildStore.ts            # advanced build storage
    │
    └── components/
        ├── ui/                      # shadcn primitives (button/card/input/badge)
        ├── PokemonSearch.tsx        # multi-language autocomplete
        ├── TeamSlot.tsx             # individual team slot card
        ├── BestPicks.tsx            # subset finder + per-pick matchup
        ├── FormatToggle.tsx         # 1v1 / 2v2 segmented control
        ├── TypeBadge.tsx            # colored pill, localized label
        ├── TypeCoverageGrid.tsx     # 18-type offensive coverage grid
        ├── SavedTeamsPanel.tsx      # named save / load / delete UI
        ├── LanguageDropdown.tsx     # 9-flag language picker
        ├── Flag.tsx                 # 9 hand-drawn pixel-art SVG flags
        ├── PokedexPage.tsx          # full Pokédex with filters
        ├── PokemonDetailModal.tsx   # detail modal with stats / abilities / moves
        ├── AdvancedTeamBuilder.tsx  # per-Pokémon configurator
        └── AboutPage.tsx            # /#/about
```

## 🧮 The scoring formula

For every Pokémon `mon` in your team, against every Pokémon `def` in the opponent's
team:

```js
mult = max( effectiveness(my_type, def.types) for my_type in mon.types )

if (mult >= 2) score += 1   // super-effective hit
if (mult >= 4) score += 1   // bonus for double-super-effective (x4)
```

We assume each Pokémon attacks with its **own STAB types** — same simplification as
most fast counter-finders. From there we **brute-force every subset of size N**
(3 for 1v1, 4 for 2v2) and pick the one that covers the most opposing Pokémon at
≥2×, tiebroken by total score. With `C(6, 4) = 15` subsets max it's effectively
instant.

The weakness/resistance computation uses the standard **Gen 6+ 18-type chart**
(included Fairy, with the post-Gen-6 changes to Steel and Ghost).

## 🔄 Updating the data

The full dataset is regenerable from PokéAPI alone — no third-party scraping.

```bash
node scripts/regen-from-pokeapi.mjs
```

This rewrites:

- `src/data/pokemon.json` — base entries (no movepools, kept light)
- `src/data/pokemon-moves.json` — id → move name array (lazy-loaded)
- `src/data/moves.json` — full move DB with type / category / power / accuracy / PP / description

Localized Pokémon names can be refreshed independently with:

```bash
node scripts/fetch-names.mjs
```

All scripts are **idempotent** — re-running them is safe and cheap.

## 🌍 Adding a new language

1. Add the language code to the `Lang` union in `src/lib/i18n.ts`
2. Add the metadata entry in `LANG_META`
3. Add the full translation block in `DICT[lang]`
4. Add the type translations in `TYPE_I18N`
5. Update `detectBrowserLang()` if you want auto-detection
6. Add a pixel-art SVG flag in `src/components/Flag.tsx`
7. Re-run `node scripts/fetch-names.mjs` to populate Pokémon names if PokéAPI
   supports the language

## 🤝 Contributing

PRs welcome! A few rules of thumb:

- 🪶 **Keep the bundle slim.** Lazy-load anything that isn't needed on the first paint.
  The current main bundle target is **< 150 KB gzipped**.
- 🛡 **Privacy first.** No third-party tracking, no analytics other than the existing
  self-hosted Umami instance.
- 🌐 **All UI strings must exist in all 9 languages.** If you don't speak a language,
  use a machine translation and tag the key with `// FIXME translation` so a native
  speaker can fix it later.
- 🧪 **Write a test for critical logic.** Coverage scoring, subset optimisation, build
  storage — these are pure functions, they should have Vitest unit tests.
- 🎨 **Stay pixel-art.** New components should use the established theme: pixel font
  for headings, dark cards with `border-2`, subtle shadows, no rounded-2xl.

## 🙏 Credits

| Source | What it provides | License |
| --- | --- | --- |
| [**PokéAPI**](https://pokeapi.co/) | Sprites, localized names, base stats, abilities, movepools, move metadata | MIT |
| [**Press Start 2P**](https://fonts.google.com/specimen/Press+Start+2P) | Pixel font (Google Fonts) | OFL |
| [**JetBrains Mono**](https://www.jetbrains.com/lp/mono/) | Monospace font (Google Fonts) | OFL |
| [**Tailwind CSS**](https://tailwindcss.com) | Styling | MIT |
| [**shadcn/ui**](https://ui.shadcn.com) | Component primitives | MIT |
| [**lucide-react**](https://lucide.dev) | Icons | ISC |

Thanks to the entire **competitive Pokémon community** for keeping this hobby alive,
and to **Nintendo / Game Freak / The Pokémon Company** for making the games we all
love.

## 📜 License

[**MIT**](./LICENSE) — fork it, improve it, sell it (please don't), break it,
fix it, learn from it.

Pokémon, Pokémon character names, and related properties are trademarks of
**Nintendo / Game Freak / The Pokémon Company**. PokeCounter is a fan-made tool
and is **not affiliated with, endorsed, sponsored, or specifically approved by**
any of those entities.

---

<div align="center">

Made with 🩷 and **a lot of pixels**

<sub>If PokeCounter helps you win a match, drop a ⭐ on the repo</sub>

</div>
