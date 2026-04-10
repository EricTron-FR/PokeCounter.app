import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Cloud,
  Sparkles,
  Zap,
  Shield,
  Swords,
  Clock,
  Layers,
} from "lucide-react";

interface Section {
  id: string;
  icon: React.ReactNode;
  title: { en: string; fr: string };
  body: { en: React.ReactNode; fr: React.ReactNode };
}

const SECTIONS: Section[] = [
  {
    id: "format",
    icon: <BookOpen className="h-4 w-4" />,
    title: { en: "Format basics", fr: "Bases du format" },
    body: {
      en: (
        <ul className="space-y-2">
          <li>
            <strong>Doubles 2v2</strong>: each player brings <strong>6 Pokémon</strong> and{" "}
            <strong>picks 4</strong> for the actual match. Both Pokémon battle simultaneously
            on each side.
          </li>
          <li>
            <strong>Level 50 auto</strong>: every Pokémon is level-set to 50 regardless of its
            actual level.
          </li>
          <li>
            <strong>Stat Points (SP)</strong>: instead of EVs/IVs, you have a budget of{" "}
            <strong>66 SP</strong> per Pokémon, capped at <strong>32 per stat</strong>. Easier
            tuning, less grind.
          </li>
          <li>
            <strong>No duplicates</strong>: no two Pokémon of the same species or two of the
            same held item on a team.
          </li>
          <li>
            <strong>Mega Evolution</strong> is allowed; one Mega per team and per battle.
          </li>
          <li>
            <strong>20-minute game timer</strong> with chess-clock-style turns.
          </li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li>
            <strong>Double 2v2</strong> : chaque joueur amène <strong>6 Pokémon</strong> et en{" "}
            <strong>choisit 4</strong> pour le match. Les deux Pokémon de chaque côté
            combattent en même temps.
          </li>
          <li>
            <strong>Niveau 50 auto</strong> : tous les Pokémon sont automatiquement mis au
            niveau 50, peu importe leur niveau réel.
          </li>
          <li>
            <strong>Stat Points (SP)</strong> : à la place des EVs/IVs, tu as un budget de{" "}
            <strong>66 SP</strong> par Pokémon, plafonné à <strong>32 par stat</strong>.
            Réglage plus simple, moins de grind.
          </li>
          <li>
            <strong>Pas de doublons</strong> : pas deux Pokémon de la même espèce ni deux
            objets identiques dans une team.
          </li>
          <li>
            <strong>Méga-Évolution</strong> autorisée ; une seule Méga par team et par match.
          </li>
          <li>
            <strong>Timer 20 minutes</strong> par partie, façon échecs.
          </li>
        </ul>
      ),
    },
  },
  {
    id: "speed",
    icon: <Clock className="h-4 w-4" />,
    title: { en: "Speed control", fr: "Contrôle de vitesse" },
    body: {
      en: (
        <ul className="space-y-2">
          <li>
            <strong>Tailwind</strong>: doubles your team's Speed for 4 turns. Cornerstone of
            offensive teams.
          </li>
          <li>
            <strong>Trick Room</strong>: reverses turn order for 5 turns — slowest moves
            first. Built around bulky slow attackers.
          </li>
          <li>
            <strong>Priority moves</strong>: Quick Attack, Bullet Punch, Sucker Punch, Aqua Jet,
            Extreme Speed, Fake Out — bypass speed entirely.
          </li>
          <li>
            <strong>Choice Scarf</strong>: 1.5× Speed but locks you into the first move you
            use.
          </li>
          <li>
            <strong>Speed ties</strong> are resolved by a coin flip — invest in 1 extra speed
            to break them.
          </li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li>
            <strong>Vent Arrière (Tailwind)</strong> : double la vitesse de ta team pendant 4
            tours. Pilier des équipes offensives.
          </li>
          <li>
            <strong>Distorsion (Trick Room)</strong> : inverse l'ordre des tours pendant 5
            tours, les plus lents jouent en premier. Construit autour d'attaquants lents et
            massifs.
          </li>
          <li>
            <strong>Attaques prioritaires</strong> : Vive-Attaque, Pisto-Poing, Coup d'Boule,
            Aqua-Jet, Vitesse Extrême, Bluff — passent outre la vitesse.
          </li>
          <li>
            <strong>Mouchoir Choix</strong> : ×1.5 Vitesse mais te lock sur la première
            attaque utilisée.
          </li>
          <li>
            <strong>Égalités de vitesse</strong> : résolues à pile ou face — investis 1 de
            vitesse en plus pour les casser.
          </li>
        </ul>
      ),
    },
  },
  {
    id: "weather",
    icon: <Cloud className="h-4 w-4" />,
    title: { en: "Weather", fr: "Météo" },
    body: {
      en: (
        <ul className="space-y-2">
          <li>
            <strong>Sun</strong> ☀️ — Fire +50 %, Water −50 %, Solar Beam no charge,
            Chlorophyll doubles Speed, Solar Power +50 % SpA but −1/8 HP/turn.
          </li>
          <li>
            <strong>Rain</strong> 🌧 — Water +50 %, Fire −50 %, Thunder 100 % accuracy, Swift
            Swim doubles Speed.
          </li>
          <li>
            <strong>Sandstorm</strong> 🏜 — Rock +50 % SpD, chip damage to non-Rock/Ground/
            Steel, Sand Rush doubles Speed.
          </li>
          <li>
            <strong>Snow</strong> ❄️ — Ice types get +50 % Defense, Slush Rush doubles Speed,
            Aurora Veil halves damage.
          </li>
          <li>
            Default duration is 5 turns, 8 turns with the corresponding weather rock
            (Heat Rock, Damp Rock, Smooth Rock, Icy Rock).
          </li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li>
            <strong>Soleil</strong> ☀️ — Feu +50 %, Eau −50 %, Lance-Soleil sans charge,
            Chlorophylle double la Vitesse, Force Soleil +50 % AtkS mais −1/8 PV/tour.
          </li>
          <li>
            <strong>Pluie</strong> 🌧 — Eau +50 %, Feu −50 %, Fatal-Foudre 100 % de précision,
            Glissade double la Vitesse.
          </li>
          <li>
            <strong>Tempête de sable</strong> 🏜 — Roche +50 % DéfS, dégâts résiduels sauf
            Roche/Sol/Acier, Hâte Sable double la Vitesse.
          </li>
          <li>
            <strong>Neige</strong> ❄️ — Glace +50 % Défense, Hâte Neige double la Vitesse,
            Voile Aurore divise les dégâts par 2.
          </li>
          <li>
            Durée par défaut 5 tours, 8 tours avec la pierre météo correspondante (Roche
            Chaude / Roche Humide / Roche Lisse / Roche Glace).
          </li>
        </ul>
      ),
    },
  },
  {
    id: "terrain",
    icon: <Layers className="h-4 w-4" />,
    title: { en: "Terrain", fr: "Champ" },
    body: {
      en: (
        <ul className="space-y-2">
          <li>
            <strong>Electric Terrain</strong> ⚡ — Electric moves +30 %, grounded mons can't
            be put to sleep.
          </li>
          <li>
            <strong>Grassy Terrain</strong> 🌿 — Grass moves +30 %, grounded mons heal 1/16
            HP per turn, Earthquake/Bulldoze halved.
          </li>
          <li>
            <strong>Misty Terrain</strong> 🌫 — Dragon moves halved, grounded mons immune to
            status.
          </li>
          <li>
            <strong>Psychic Terrain</strong> 🔮 — Psychic moves +30 %, grounded mons immune to
            priority.
          </li>
          <li>
            Terrain effects only apply to <em>grounded</em> Pokémon (not Flying types or
            those with Levitate / Air Balloon).
          </li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li>
            <strong>Champ Électrifié</strong> ⚡ — Attaques Élec +30 %, les mons au sol ne
            peuvent pas s'endormir.
          </li>
          <li>
            <strong>Champ Herbu</strong> 🌿 — Attaques Plante +30 %, les mons au sol
            récupèrent 1/16 PV par tour, Séisme/Bulldozer divisés par 2.
          </li>
          <li>
            <strong>Champ Brumeux</strong> 🌫 — Attaques Dragon divisées par 2, les mons au
            sol immunisés aux statuts.
          </li>
          <li>
            <strong>Champ Psychique</strong> 🔮 — Attaques Psy +30 %, les mons au sol
            immunisés aux attaques prioritaires.
          </li>
          <li>
            Les effets de champ s'appliquent uniquement aux Pokémon <em>au sol</em> (pas les
            Vol, Lévitation, ou Ballon).
          </li>
        </ul>
      ),
    },
  },
  {
    id: "items",
    icon: <Sparkles className="h-4 w-4" />,
    title: { en: "Common items", fr: "Objets courants" },
    body: {
      en: (
        <ul className="space-y-2">
          <li><strong>Choice Band/Specs/Scarf</strong> — ×1.5 Atk/SpA/Spe but locks the move</li>
          <li><strong>Life Orb</strong> — ×1.3 damage but −1/10 HP per attack</li>
          <li><strong>Focus Sash</strong> — survive any 1 hit at full HP with 1 HP</li>
          <li><strong>Assault Vest</strong> — ×1.5 SpD but no status moves</li>
          <li><strong>Leftovers</strong> — heal 1/16 HP per turn</li>
          <li><strong>Sitrus Berry</strong> — heal 1/4 max HP at 50 % HP</li>
          <li><strong>Rocky Helmet</strong> — contact attackers take 1/6 max HP</li>
          <li><strong>Booster Energy</strong> — Paradox mons boost their highest stat outside terrain/weather</li>
          <li><strong>Mental Herb</strong> — cure Taunt/Encore/Torment/Disable on use</li>
          <li><strong>Safety Goggles</strong> — immune to powder moves and weather damage</li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li><strong>Bandeau / Spécial / Mouchoir Choix</strong> — ×1.5 Atk/AtkS/Vit mais lock l'attaque</li>
          <li><strong>Orbe Vie</strong> — ×1.3 dégâts mais −1/10 PV par attaque</li>
          <li><strong>Ceinture Force</strong> — survit à un coup à 1 PV depuis 100 % PV</li>
          <li><strong>Veste de Combat</strong> — ×1.5 DéfS mais pas d'attaques de statut</li>
          <li><strong>Restes</strong> — récupère 1/16 PV par tour</li>
          <li><strong>Baie Sitrus</strong> — récupère 1/4 PV max à 50 % de PV</li>
          <li><strong>Casque Brut</strong> — l'attaquant au contact perd 1/6 PV max</li>
          <li><strong>Énergie Booster</strong> — les Paradoxe boostent leur meilleure stat hors météo/champ</li>
          <li><strong>Herbe Mental</strong> — soigne Provoc / Encore / Tourmente / Entrave à l'usage</li>
          <li><strong>Lunettes Filtre</strong> — immunité aux attaques poudre et aux dégâts météo</li>
        </ul>
      ),
    },
  },
  {
    id: "abilities",
    icon: <Zap className="h-4 w-4" />,
    title: { en: "Game-changing abilities", fr: "Talents qui changent tout" },
    body: {
      en: (
        <ul className="space-y-2">
          <li><strong>Intimidate</strong> — lowers opposing Pokémon's Attack on switch in</li>
          <li><strong>Drought / Drizzle / Sand Stream / Snow Warning</strong> — set weather on entry</li>
          <li><strong>Electric/Grassy/Misty/Psychic Surge</strong> — set terrain on entry</li>
          <li><strong>Beast Boost / Moxie</strong> — KO grants +1 to highest stat / Attack</li>
          <li><strong>Magic Bounce</strong> — bounces back status moves</li>
          <li><strong>Levitate</strong> — immune to Ground</li>
          <li><strong>Sturdy</strong> — survive any 1HKO from full HP</li>
          <li><strong>Multiscale / Ice Scales</strong> — halves damage at full HP / from special moves</li>
          <li><strong>Unaware</strong> — ignores enemy stat boosts</li>
          <li><strong>Speed Boost</strong> — +1 Speed every turn</li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li><strong>Intimidation</strong> — baisse l'Attaque adverse à l'entrée</li>
          <li><strong>Sécheresse / Crachin / Sable Volant / Alerte Neige</strong> — pose la météo à l'entrée</li>
          <li><strong>Surcharge / Herbe Folle / Brume Folle / Pouvoir Psychique</strong> — pose le champ à l'entrée</li>
          <li><strong>Boost Chimère / Arrogance</strong> — +1 meilleure stat / Attaque sur KO</li>
          <li><strong>Miroir Magik</strong> — renvoie les attaques de statut</li>
          <li><strong>Lévitation</strong> — immunité Sol</li>
          <li><strong>Fermeté</strong> — survit aux OHKO depuis 100 % PV</li>
          <li><strong>Multi-Écailles / Écailles Glacées</strong> — divise les dégâts par 2 à 100 % PV / depuis les attaques spéciales</li>
          <li><strong>Inconscient</strong> — ignore les boosts de stats adverses</li>
          <li><strong>Turbo</strong> — +1 Vitesse à chaque tour</li>
        </ul>
      ),
    },
  },
  {
    id: "status",
    icon: <Shield className="h-4 w-4" />,
    title: { en: "Status conditions", fr: "Statuts" },
    body: {
      en: (
        <ul className="space-y-2">
          <li><strong>Burn 🔥</strong> — halves physical attack, −1/16 HP per turn</li>
          <li><strong>Paralysis ⚡</strong> — halves Speed, 25 % chance to skip turn</li>
          <li><strong>Sleep 😴</strong> — can't act for 1–3 turns (1 with Sleep Talk)</li>
          <li><strong>Freeze ❄️</strong> — can't act, 20 % chance to thaw each turn</li>
          <li><strong>Poison 🟣</strong> — −1/8 HP per turn</li>
          <li><strong>Badly poisoned 🟪</strong> — −1/16 HP first turn, then ramping up</li>
          <li><strong>Confusion</strong> — 33 % chance to hit yourself for ~50 % of own Attack</li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li><strong>Brûlure 🔥</strong> — divise l'attaque physique par 2, −1/16 PV/tour</li>
          <li><strong>Paralysie ⚡</strong> — divise la Vitesse par 2, 25 % de rater son tour</li>
          <li><strong>Sommeil 😴</strong> — ne peut pas agir pendant 1–3 tours (1 avec Blabla Dodo)</li>
          <li><strong>Gel ❄️</strong> — ne peut pas agir, 20 % de dégeler par tour</li>
          <li><strong>Poison 🟣</strong> — −1/8 PV par tour</li>
          <li><strong>Poison grave 🟪</strong> — −1/16 PV au début, augmente chaque tour</li>
          <li><strong>Confusion</strong> — 33 % de se taper soi-même pour ~50 % de sa propre Attaque</li>
        </ul>
      ),
    },
  },
  {
    id: "tera",
    icon: <Swords className="h-4 w-4" />,
    title: { en: "Tera Type", fr: "Type Téracristal" },
    body: {
      en: (
        <p>
          Each Pokémon has a hidden <strong>Tera Type</strong> that you can activate{" "}
          <strong>once per battle</strong>. Terastallizing changes the Pokémon's type to its
          Tera Type, granting STAB on moves of that type and changing its weaknesses /
          resistances. A Pokémon's original-type moves keep STAB even after Terastallizing
          (if matching). Use Tera defensively to flip a matchup, or offensively to add
          unexpected coverage.
        </p>
      ),
      fr: (
        <p>
          Chaque Pokémon a un <strong>Type Téracristal</strong> caché qu'il peut activer{" "}
          <strong>une fois par combat</strong>. Le Téracristal change le type du Pokémon,
          octroie le STAB sur ce type, et modifie ses faiblesses/résistances. Les attaques
          du type original gardent le STAB même après Téracristal (si correspondance). Joue
          le Téra défensivement pour retourner un matchup, ou offensivement pour ajouter une
          couverture surprise.
        </p>
      ),
    },
  },
];

export function LearnPage() {
  const { lang } = useLang();
  const [openId, setOpenId] = useState<string>(SECTIONS[0].id);
  const isFr = lang === "fr";

  return (
    <main className="container py-4 sm:py-8 max-w-4xl">
      <header className="mb-6 text-center">
        <h1 className="font-pixel text-xl sm:text-2xl text-primary text-shadow-pixel">
          {isFr ? "Apprendre le VGC" : "Learn VGC"}
        </h1>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-2">
          {isFr
            ? "Les bases du compétitif Pokémon Champions"
            : "The fundamentals of competitive Pokémon Champions"}
        </p>
      </header>

      <div className="space-y-2">
        {SECTIONS.map((s) => {
          const open = openId === s.id;
          return (
            <Card
              key={s.id}
              className={cn(
                "transition-all",
                open && "border-primary/60",
              )}
            >
              <CardHeader
                onClick={() => setOpenId(open ? "" : s.id)}
                className="cursor-pointer select-none hover:bg-accent/5 transition-colors"
              >
                <CardTitle className="flex items-center gap-2">
                  {s.icon}
                  {isFr ? s.title.fr : s.title.en}
                  <span className="ml-auto text-muted-foreground text-xs">
                    {open ? "−" : "+"}
                  </span>
                </CardTitle>
              </CardHeader>
              {open && (
                <CardContent>
                  <div className="text-xs text-muted-foreground leading-relaxed font-mono">
                    {isFr ? s.body.fr : s.body.en}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
