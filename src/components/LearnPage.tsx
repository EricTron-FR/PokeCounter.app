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
  Star,
  Sun,
  CloudRain,
  Wind,
  Snowflake,
  Leaf,
  CloudFog,
  Flame,
  Moon,
  Droplet,
  Skull,
  RefreshCw,
  Bomb,
  Target,
  FlaskConical,
  TrendingDown,
  Trophy,
  CloudSun,
} from "lucide-react";

// Inline icon helper — keeps the emoji replacements terse.
const Inline = ({
  Icon,
  className = "",
}: {
  Icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <Icon className={cn("inline h-3 w-3 mx-0.5 align-text-bottom", className)} />
);

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
            <strong>Sun <Inline Icon={Sun} /></strong> — Fire +50 %, Water −50 %, Solar Beam no charge,
            Chlorophyll doubles Speed, Solar Power +50 % SpA but −1/8 HP/turn.
          </li>
          <li>
            <strong>Rain <Inline Icon={CloudRain} /></strong> — Water +50 %, Fire −50 %, Thunder 100 % accuracy, Swift
            Swim doubles Speed.
          </li>
          <li>
            <strong>Sandstorm <Inline Icon={Wind} /></strong> — Rock +50 % SpD, chip damage to non-Rock/Ground/
            Steel, Sand Rush doubles Speed.
          </li>
          <li>
            <strong>Snow <Inline Icon={Snowflake} /></strong> — Ice types get +50 % Defense, Slush Rush doubles Speed,
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
            <strong>Soleil <Inline Icon={Sun} /></strong> — Feu +50 %, Eau −50 %, Lance-Soleil sans charge,
            Chlorophylle double la Vitesse, Force Soleil +50 % AtkS mais −1/8 PV/tour.
          </li>
          <li>
            <strong>Pluie <Inline Icon={CloudRain} /></strong> — Eau +50 %, Feu −50 %, Fatal-Foudre 100 % de précision,
            Glissade double la Vitesse.
          </li>
          <li>
            <strong>Tempête de sable <Inline Icon={Wind} /></strong> — Roche +50 % DéfS, dégâts résiduels sauf
            Roche/Sol/Acier, Hâte Sable double la Vitesse.
          </li>
          <li>
            <strong>Neige <Inline Icon={Snowflake} /></strong> — Glace +50 % Défense, Hâte Neige double la Vitesse,
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
            <strong>Electric Terrain <Inline Icon={Zap} /></strong> — Electric moves +30 %, grounded mons can't
            be put to sleep.
          </li>
          <li>
            <strong>Grassy Terrain <Inline Icon={Leaf} /></strong> — Grass moves +30 %, grounded mons heal 1/16
            HP per turn, Earthquake/Bulldoze halved.
          </li>
          <li>
            <strong>Misty Terrain <Inline Icon={CloudFog} /></strong> — Dragon moves halved, grounded mons immune to
            status.
          </li>
          <li>
            <strong>Psychic Terrain <Inline Icon={Sparkles} /></strong> — Psychic moves +30 %, grounded mons immune to
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
            <strong>Champ Électrifié <Inline Icon={Zap} /></strong> — Attaques Élec +30 %, les mons au sol ne
            peuvent pas s'endormir.
          </li>
          <li>
            <strong>Champ Herbu <Inline Icon={Leaf} /></strong> — Attaques Plante +30 %, les mons au sol
            récupèrent 1/16 PV par tour, Séisme/Bulldozer divisés par 2.
          </li>
          <li>
            <strong>Champ Brumeux <Inline Icon={CloudFog} /></strong> — Attaques Dragon divisées par 2, les mons au
            sol immunisés aux statuts.
          </li>
          <li>
            <strong>Champ Psychique <Inline Icon={Sparkles} /></strong> — Attaques Psy +30 %, les mons au sol
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
          <li><strong>Burn <Inline Icon={Flame} /></strong> — halves physical attack, −1/16 HP per turn</li>
          <li><strong>Paralysis <Inline Icon={Zap} /></strong> — halves Speed, 25 % chance to skip turn</li>
          <li><strong>Sleep <Inline Icon={Moon} /></strong> — can't act for 1–3 turns (1 with Sleep Talk)</li>
          <li><strong>Freeze <Inline Icon={Snowflake} /></strong> — can't act, 20 % chance to thaw each turn</li>
          <li><strong>Poison <Inline Icon={Droplet} /></strong> — −1/8 HP per turn</li>
          <li><strong>Badly poisoned <Inline Icon={Skull} /></strong> — −1/16 HP first turn, then ramping up</li>
          <li><strong>Confusion</strong> — 33 % chance to hit yourself for ~50 % of own Attack</li>
        </ul>
      ),
      fr: (
        <ul className="space-y-2">
          <li><strong>Brûlure <Inline Icon={Flame} /></strong> — divise l'attaque physique par 2, −1/16 PV/tour</li>
          <li><strong>Paralysie <Inline Icon={Zap} /></strong> — divise la Vitesse par 2, 25 % de rater son tour</li>
          <li><strong>Sommeil <Inline Icon={Moon} /></strong> — ne peut pas agir pendant 1–3 tours (1 avec Blabla Dodo)</li>
          <li><strong>Gel <Inline Icon={Snowflake} /></strong> — ne peut pas agir, 20 % de dégeler par tour</li>
          <li><strong>Poison <Inline Icon={Droplet} /></strong> — −1/8 PV par tour</li>
          <li><strong>Poison grave <Inline Icon={Skull} /></strong> — −1/16 PV au début, augmente chaque tour</li>
          <li><strong>Confusion</strong> — 33 % de se taper soi-même pour ~50 % de sa propre Attaque</li>
        </ul>
      ),
    },
  },
  {
    id: "key-moves",
    icon: <Star className="h-4 w-4" />,
    title: { en: "30 key moves explained", fr: "30 attaques clés expliquées" },
    body: {
      en: (
        <div className="space-y-3">
          <MoveGroup
            title="Protection & anticipation"
            icon={Shield}
            moves={[
              { name: "Protect", body: "Doubles staple. Shield one mon while the partner kills a threat, or scout the opponent's set without taking damage." },
              { name: "Fake Out", body: "Priority flinch. Crucial to prevent an opponent from setting Trick Room or Tailwind on turn 1." },
              { name: "Wide Guard", body: "Unlike Protect, it can be used multiple times in a row. Vital against Rock Slide / Heat Wave spam." },
              { name: "Quick Guard", body: "Protects your side from all priority moves (Fake Out, ExtremeSpeed…). Less common but can save fragile setups." },
              { name: "Detect", body: "Same effect as Protect, but less common, which lets it bypass Cursed Body and similar gimmicks." },
            ]}
          />
          <MoveGroup
            title="Terrain control"
            icon={CloudSun}
            moves={[
              { name: "Sunny Day", body: "Mandatory on sun teams. Enables Chlorophyll (2× Speed) and lets Solar Beam fire in one turn." },
              { name: "Rain Dance", body: "Boosts Water moves and makes Hurricane and Thunder 100 % accurate." },
              { name: "Trick Room", body: "Inverts turn order for 5 turns — slow heavy hitters (Torkoal, Ursaring…) move first." },
              { name: "Aurora Veil", body: "Best protection in the game, combines Reflect + Light Screen, but requires active snow." },
            ]}
          />
          <MoveGroup
            title="Pivoting & momentum"
            icon={RefreshCw}
            moves={[
              { name: "Parting Shot", body: "Weakens the opponent and safely pivots out — you see their move before choosing yours." },
              { name: "U-turn", body: "Keeps momentum. If opponent switches, you attack then pivot to keep the type advantage." },
              { name: "Volt Switch", body: "Like U-turn, but fails vs Ground types (no switch out, stuck on field)." },
            ]}
          />
          <MoveGroup
            title="High-risk offense"
            icon={Bomb}
            moves={[
              { name: "Flare Blitz", body: "Devastating physical Fire move. Recoil hurts but often the only way to secure a clean KO." },
              { name: "Wave Crash", body: "Water equivalent of Flare Blitz. Under rain, KOs almost anything that doesn't resist." },
              { name: "Double-Edge", body: "Strong Normal physical. Often paired with boosting abilities on Mega Feraligatr-style sweepers." },
            ]}
          />
          <MoveGroup
            title="Targeting & item removal"
            icon={Target}
            moves={[
              { name: "Rage Powder", body: "Forces opponents to attack the user (bulky redirector like Amoonguss), freeing the partner to set up." },
              { name: "Follow Me", body: "Same role as Rage Powder, but not blocked by Grass types or Safety Goggles." },
              { name: "Knock Off", body: "Big damage AND removes the item (Berry, Life Orb, Eviolite). Can wreck an entire set." },
              { name: "Taunt", body: "Ultimate anti-support tool. Forces attacks, blocks heals / walls / Trick Room." },
            ]}
          />
          <MoveGroup
            title="Niche specials"
            icon={FlaskConical}
            moves={[
              { name: "Last Respects", body: "Scales with fainted teammates: from 50 BP at full team up to 200+ late-game. Terrifying." },
              { name: "Electro Shot", body: "Raikou / Raging Bolt signature. Boosts SpA and hits. One reason rain is so strong right now." },
              { name: "Sucker Punch", body: "Lets slow mons strike first, but fails if the opponent uses a status move. Very tactical." },
              { name: "Helping Hand", body: "+5 priority, +50 % to partner's next attack — great to guarantee a crucial KO." },
            ]}
          />
          <MoveGroup
            title="Stat control / debuffs"
            icon={TrendingDown}
            moves={[
              { name: "Thunder Wave", body: "Paralysis cuts Speed by 50 %. Alternative to Tailwind for controlling speed." },
              { name: "Will-O-Wisp", body: "Burn halves physical Attack — the worst nightmare for phys attackers." },
              { name: "Snarl", body: "Hits both opponents and drops their Special Attack. Great for mitigating special pressure." },
              { name: "Icy Wind", body: "Speed drop on both opponents. Unlike T-Wave, works on Electric and Ground types." },
              { name: "Electroweb", body: "Electric equivalent of Icy Wind. Decent damage on Flying / Water while dropping Speed." },
            ]}
          />
          <MoveGroup
            title="Setup & win conditions"
            icon={Trophy}
            moves={[
              { name: "Dragon Dance / Quiver Dance", body: "Turn a decent mon into a solo sweeper. Risky — they cost a turn of setup." },
              { name: "Perish Song", body: "Endgame tool. In the last 2v2, forces a win in 3 turns if you have the numerical advantage." },
            ]}
          />
        </div>
      ),
      fr: (
        <div className="space-y-3">
          <MoveGroup
            title="Protection et anticipation"
            icon={Shield}
            moves={[
              { name: "Abri (Protect)", body: "La base du combat double. Permet de protéger un Pokémon pendant que son partenaire élimine une menace, ou de scouter le set adverse sans prendre de dégâts." },
              { name: "Bluff (Fake Out)", body: "Attaque de priorité qui apeure la cible. Cruciale pour empêcher l'adversaire de poser une Distorsion ou un Vent Arrière au premier tour." },
              { name: "Garde Large (Wide Guard)", body: "Contrairement à Abri, peut être utilisée plusieurs fois d'affilée avec succès. Vitale contre les abus d'Éboulement ou Canicule." },
              { name: "Prio-Parade (Quick Guard)", body: "Protège votre camp contre toutes les attaques prioritaires (Bluff, Vitesse Extrême…). Moins jouée mais peut sauver une stratégie fragile." },
              { name: "Détection (Detect)", body: "Même effet qu'Abri, mais moins courante, ce qui permet de contourner la capacité Possessif." },
            ]}
          />
          <MoveGroup
            title="Contrôle du terrain"
            icon={CloudSun}
            moves={[
              { name: "Zénith (Sunny Day)", body: "Indispensable aux équipes Sun. Active Chlorophylle (×2 vitesse) et permet à Lance-Soleil de partir en un seul tour." },
              { name: "Danse Pluie (Rain Dance)", body: "Booste les attaques Eau et permet d'utiliser Vent Violent ou Fatal-Foudre sans risque de rater (100 % de précision)." },
              { name: "Distorsion (Trick Room)", body: "Retourne le jeu. Permet à des Pokémon très lents mais puissants (Chartor, Ursaking) d'attaquer avant les rapides." },
              { name: "Voile Aurore (Aurora Veil)", body: "La meilleure protection du jeu : cumule Protection et Mur Lumière. Nécessite cependant que la neige soit active." },
            ]}
          />
          <MoveGroup
            title="Pivot et mobilité"
            icon={RefreshCw}
            moves={[
              { name: "Dernier Mot (Parting Shot)", body: "Capacité de Pivot. Affaiblit l'adversaire et permet de placer un Pokémon en sécurité en voyant ce qu'a fait l'adversaire." },
              { name: "Demi-Tour (U-turn)", body: "Garde le momentum. Si l'adversaire change, tu attaques puis pivot pour reprendre l'avantage du type." },
              { name: "Change Éclair (Volt Switch)", body: "Similaire à Demi-Tour, mais attention : face à un type Sol, l'attaque échoue et ton Pokémon reste bloqué sur le terrain." },
            ]}
          />
          <MoveGroup
            title="Offensives à risque"
            icon={Bomb}
            moves={[
              { name: "Boutefeu (Flare Blitz)", body: "Attaque physique Feu dévastatrice. Le recul fait mal, mais souvent le seul moyen d'infliger un KO immédiat sur les cibles résistantes." },
              { name: "Aquatacle (Wave Crash)", body: "Équivalent Eau de Boutefeu. Particulièrement puissant sous la pluie, met presque n'importe quoi KO si pas de résistance." },
              { name: "Damoclès (Double-Edge)", body: "Attaque Normale très puissante. Souvent couplée à des talents boostant les attaques Normales, comme Méga-Aligatueur." },
            ]}
          />
          <MoveGroup
            title="Ciblage et objets"
            icon={Target}
            moves={[
              { name: "Poudre Fureur (Rage Powder)", body: "Force l'adversaire à attaquer le lanceur (souvent un tank comme Gaulet), laissant le partenaire libre d'attaquer ou se booster." },
              { name: "Par Ici (Follow Me)", body: "Même rôle que Poudre Fureur mais supérieur : pas bloquée par les Pokémon Plante ou les Lunettes Filtre." },
              { name: "Sabotage (Knock Off)", body: "En plus de retirer l'objet (Baie, Orbe Vie, Évoluroc), inflige des dégâts massifs. Peut complètement détruire une stratégie adverse." },
              { name: "Provoc (Taunt)", body: "L'arme ultime contre les Pokémon de support. Oblige à attaquer, empêche soins, murs et Distorsion." },
            ]}
          />
          <MoveGroup
            title="Capacités de niche"
            icon={FlaskConical}
            moves={[
              { name: "Hommage Postume (Last Respects)", body: "Devient terrifiante en fin de combat. Si 3 de tes Pokémon sont KO, la puissance passe de 50 à 200 — c'est colossal." },
              { name: "Fulgurayon (Electro Shot)", body: "Spécifique à Pondralugon. Augmente l'attaque spéciale en frappant. Une des raisons pour lesquelles la pluie est si forte actuellement." },
              { name: "Coup Bas (Sucker Punch)", body: "Très tactique. Permet à un Pokémon lent de frapper avant un rapide, mais échoue si l'adversaire utilise un statut." },
              { name: "Coup de Main (Helping Hand)", body: "Priorité +5 (plus rapide qu'Abri). Booste la puissance du partenaire de 50 %, idéal pour assurer un KO décisif." },
            ]}
          />
          <MoveGroup
            title="Contrôle des stats"
            icon={TrendingDown}
            moves={[
              { name: "Cage Éclair (Thunder Wave)", body: "La paralysie réduit la vitesse de 50 %. Excellent moyen de contrôler la vitesse sans Vent Arrière." },
              { name: "Feu Follet (Will-O-Wisp)", body: "La brûlure est le pire cauchemar des attaquants physiques. Réduit définitivement leur dangerosité." },
              { name: "Aboiement (Snarl)", body: "Attaque les deux adversaires et baisse leur Attaque Spéciale. Très utile pour mitiger les dégâts spéciaux." },
              { name: "Vent Glacé (Icy Wind)", body: "Baisse la vitesse des deux adversaires. Contrairement à Cage Éclair, fonctionne sur les Élec et Sol." },
              { name: "Toile Électrik (Electroweb)", body: "Équivalent électrique de Vent Glacé. Baisse la vitesse tout en infligeant des dégâts corrects aux Vol / Eau." },
            ]}
          />
          <MoveGroup
            title="Setup et conditions de victoire"
            icon={Trophy}
            moves={[
              { name: "Setup (Danse Draco / Papillodanse)", body: "Transforment un Pokémon moyen en monstre capable de finir le match seul. Risqués : ils demandent un tour de préparation." },
              { name: "Requiem (Perish Song)", body: "Utilisée en fin de match (quand il ne reste que 2 Pokémon de chaque côté) pour forcer la victoire en 3 tours si tu as l'avantage numérique." },
            ]}
          />
        </div>
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

function MoveGroup({
  title,
  icon: Icon,
  moves,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  moves: { name: string; body: string }[];
}) {
  return (
    <div>
      <div className="font-pixel text-[10px] uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
        <Icon className="h-3 w-3" />
        {title}
      </div>
      <ul className="space-y-1.5">
        {moves.map((m) => (
          <li
            key={m.name}
            className="rounded-sm border-2 border-border/60 bg-muted/20 p-2"
          >
            <div className="font-pixel text-[9px] uppercase tracking-wider text-foreground text-shadow-pixel">
              {m.name}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-1 leading-relaxed">
              {m.body}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LearnPage() {
  const { lang } = useLang();
  const [openId, setOpenId] = useState<string>(SECTIONS[0].id);
  const isFr = lang === "fr";

  return (
    <main className="container py-4 sm:py-8 max-w-4xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {isFr ? "Apprendre le VGC" : "Learn VGC"}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
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
                  <div className="text-xs text-muted-foreground leading-relaxed font-mono break-words">
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
