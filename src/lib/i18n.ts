import {
  createContext,
  createElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pokemon, PokemonType } from "./types";

export type Lang =
  | "fr"
  | "en"
  | "es"
  | "de"
  | "it"
  | "ja"
  | "ko"
  | "zh-Hans"
  | "zh-Hant";

export const SUPPORTED_LANGS: Lang[] = [
  "en",
  "fr",
  "es",
  "de",
  "it",
  "ja",
  "ko",
  "zh-Hans",
  "zh-Hant",
];

export const LANG_META: Record<
  Lang,
  { label: string; native: string; flag: string }
> = {
  en: { label: "English", native: "English", flag: "EN" },
  fr: { label: "French", native: "Français", flag: "FR" },
  es: { label: "Spanish", native: "Español", flag: "ES" },
  de: { label: "German", native: "Deutsch", flag: "DE" },
  it: { label: "Italian", native: "Italiano", flag: "IT" },
  ja: { label: "Japanese", native: "日本語", flag: "JA" },
  ko: { label: "Korean", native: "한국어", flag: "KO" },
  "zh-Hans": { label: "Chinese (Simplified)", native: "简体中文", flag: "ZH" },
  "zh-Hant": { label: "Chinese (Traditional)", native: "繁體中文", flag: "ZH" },
};

const LANG_KEY = "pokecounter.lang.v1";

export function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((l) => l.toLowerCase());

  for (const c of candidates) {
    if (c.startsWith("zh")) {
      if (c.includes("tw") || c.includes("hk") || c.includes("hant"))
        return "zh-Hant";
      return "zh-Hans";
    }
    if (c.startsWith("fr")) return "fr";
    if (c.startsWith("es")) return "es";
    if (c.startsWith("de")) return "de";
    if (c.startsWith("it")) return "it";
    if (c.startsWith("ja")) return "ja";
    if (c.startsWith("ko")) return "ko";
    if (c.startsWith("en")) return "en";
  }
  return "en";
}

function loadLang(): Lang {
  try {
    const raw = localStorage.getItem(LANG_KEY);
    if (raw && SUPPORTED_LANGS.includes(raw as Lang)) return raw as Lang;
  } catch {
    /* noop */
  }
  return detectBrowserLang();
}

type Dict = {
  tagline: string;
  share: string;
  copied: string;
  opponentTeam: string;
  myTeam: string;
  bestPicks: string;
  bring: string;
  searchOpponent: string;
  searchMine: string;
  reset: string;
  autoSaved: string;
  offensiveCoverage: string;
  empty: string;
  selectOpponent: string;
  buildTeamFirst: string;
  toBring: string;
  bench: string;
  pick: string;
  covers: string;
  opponentsCovered: string;
  uncovered: string;
  notEnough: string;
  score: string;
  simple: string;
  double: string;
  formatPick: string;
  language: string;
  mega: string;
  search: string;
  footer: string;
  strongVs: string;
  weakVs: string;
  savedTeams: string;
  teamNamePlaceholder: string;
  saveTeam: string;
  loadTeam: string;
  deleteTeam: string;
  noSavedTeams: string;
  confirmDeleteTeam: string;
  navHome: string;
  navAbout: string;
  navPokedex: string;
  navTypes: string;
  navLearn: string;
  pokedexTitle: string;
  pokedexCount: string;
  filterAll: string;
  filterMega: string;
  filterBase: string;
  abilities: string;
  hiddenAbility: string;
  baseStats: string;
  totalStats: string;
  height: string;
  weight: string;
  moves: string;
  loadingMoves: string;
  noMovesData: string;
  statHp: string;
  statAtk: string;
  statDef: string;
  statSpa: string;
  statSpd: string;
  statSpe: string;
  weaknesses: string;
  resistances: string;
  immunities: string;
  addToOpponent: string;
  addToMyTeam: string;
  close: string;
  alphaBadge: string;
  alphaMessage: string;
  aboutTitle: string;
  aboutSubtitle: string;
  whyTitle: string;
  whyBody: string;
  factAlphaTitle: string;
  factAlphaBody: string;
  factOssTitle: string;
  factOssBody: string;
  factFreeTitle: string;
  factFreeBody: string;
  factCommunityTitle: string;
  factCommunityBody: string;
  creditsTitle: string;
  creditsBody: string;
  contributeTitle: string;
  contributeBody: string;
  backToApp: string;
  reportBug: string;
  viewSource: string;
  currentSeason: string;
  seasonActive: string;
  seasonUpcoming: string;
  seasonEnded: string;
  daysLeft: string;
  daysIn: string;
  startsIn: string;
  rules: string;
  format: string;
  exportShowdown: string;
  importShowdown: string;
  pasteShowdown: string;
  importDone: string;
  notesPlaceholder: string;
  applySet: string;
  loadTemplate: string;
  templates: string;
  navCompare: string;
  compareTitle: string;
  pickFirst: string;
  pickSecond: string;
  damageCalc: string;
  noDamageData: string;
  ko: string;
  installApp: string;
  analyzeTeam: string;
  overallScore: string;
  avgSpeed: string;
  avgBulk: string;
  physicalAttackers: string;
  specialAttackers: string;
  offensiveCov: string;
  covered: string;
  notCovered: string;
  sharedWeak: string;
  suggestions: string;
};

const DICT: { en: Dict } & { [K in Exclude<Lang, "en">]: Partial<Dict> } = {
  en: {
    tagline: "Pokémon Champions · Type Coverage",
    share: "Share",
    copied: "Copied",
    opponentTeam: "Opponent Team",
    myTeam: "My Team",
    bestPicks: "Best Picks",
    bring: "bring",
    searchOpponent: "Add an opponent...",
    searchMine: "Add to your team...",
    reset: "Reset",
    autoSaved: "Auto-saved",
    offensiveCoverage: "Offensive coverage",
    empty: "Empty",
    selectOpponent: "Select at least 1 opposing Pokémon",
    buildTeamFirst: "Build your team first\nto see which mons to bring",
    toBring: "To bring",
    bench: "Bench",
    pick: "Pick",
    covers: "Covers",
    opponentsCovered: "opponents",
    uncovered: "Uncovered",
    notEnough: "Your team only has {n} Pokémon · need {k}",
    score: "score",
    simple: "Singles",
    double: "Doubles",
    formatPick: "pick",
    language: "Language",
    mega: "MEGA",
    search: "Search (EN or FR)...",
    footer: "Sprites · PokeAPI · Made with pixels & love",
    strongVs: "Strong vs",
    weakVs: "Weak vs",
    savedTeams: "Saved teams",
    teamNamePlaceholder: "Team name...",
    saveTeam: "Save",
    loadTeam: "Load",
    deleteTeam: "Delete",
    noSavedTeams: "No saved teams yet",
    confirmDeleteTeam: "Delete this team?",
    navHome: "Home",
    navAbout: "About",
    navPokedex: "Pokédex",
    navTypes: "Types",
    navLearn: "Learn",
    pokedexTitle: "Pokédex",
    pokedexCount: "{n} Pokémon",
    filterAll: "All",
    filterMega: "Mega only",
    filterBase: "Base only",
    abilities: "Abilities",
    hiddenAbility: "Hidden",
    baseStats: "Base stats",
    totalStats: "Total",
    height: "Height",
    weight: "Weight",
    moves: "Moves",
    loadingMoves: "Loading moves...",
    noMovesData: "No move data",
    statHp: "HP",
    statAtk: "Atk",
    statDef: "Def",
    statSpa: "SpA",
    statSpd: "SpD",
    statSpe: "Spe",
    weaknesses: "Weak to (≥2x)",
    resistances: "Resists",
    immunities: "Immune",
    addToOpponent: "Add to opponent",
    addToMyTeam: "Add to my team",
    close: "Close",
    alphaBadge: "Alpha",
    alphaMessage:
      "This project is in active development. Things may break or change. It's 100% free — no sign-up, no ads, no paywalls.",
    aboutTitle: "About Us",
    aboutSubtitle: "The people behind PokeCounter",
    whyTitle: "Why we built this",
    whyBody:
      "We believe competitive Pokémon tools should be free and accessible to everyone. PokeCounter was born from wanting a fast, clean, zero-friction way to pick the right counters for any Pokémon Champions matchup. No sign-up, no ads, no paywalls — just type your opponent and get instant suggestions.",
    factAlphaTitle: "Alpha",
    factAlphaBody: "In active development",
    factOssTitle: "Open source",
    factOssBody: "MIT licensed, hack away",
    factFreeTitle: "100% Free",
    factFreeBody: "No ads, no paywalls, forever",
    factCommunityTitle: "Community",
    factCommunityBody: "Built by fans, for fans",
    creditsTitle: "Credits & thanks",
    creditsBody:
      "All data — sprites, localized names, base stats, abilities, movepools and move details — come from PokéAPI. The type chart is Gen 6+ standard. Thanks to the entire competitive Pokémon community for keeping this hobby alive, and to Nintendo / Game Freak / The Pokémon Company for making the games we love.",
    contributeTitle: "Want to help?",
    contributeBody:
      "Spot a bug, missing Pokémon or mistranslation? Want to add a feature? Any feedback is welcome — reach out and we'll make it happen.",
    backToApp: "Back to app",
    reportBug: "Report a bug",
    viewSource: "View source",
    currentSeason: "Current Season",
    seasonActive: "Active",
    seasonUpcoming: "Upcoming",
    seasonEnded: "Ended",
    daysLeft: "{n} days left",
    daysIn: "Day {n}",
    startsIn: "Starts in {n} days",
    rules: "Rules",
    format: "Format",
    exportShowdown: "Export to Showdown",
    importShowdown: "Import from Showdown",
    pasteShowdown: "Paste a Pokémon Showdown team here...",
    importDone: "Imported",
    notesPlaceholder: "Notes for this team...",
    applySet: "Apply set",
    loadTemplate: "Load template",
    templates: "Team templates",
    navCompare: "Compare",
    compareTitle: "Compare two Pokémon",
    pickFirst: "Pick first",
    pickSecond: "Pick second",
    damageCalc: "Damage vs",
    noDamageData: "Configure attacker moves to see damage",
    ko: "KO",
    installApp: "Install app",
    analyzeTeam: "Analyze team",
    overallScore: "Overall score",
    avgSpeed: "Avg Speed",
    avgBulk: "Avg Bulk",
    physicalAttackers: "Physical",
    specialAttackers: "Special",
    offensiveCov: "Offensive coverage",
    covered: "Covered",
    notCovered: "Not covered",
    sharedWeak: "Shared weaknesses",
    suggestions: "Suggestions",
  },
  fr: {
    tagline: "Pokémon Champions · Couverture de types",
    share: "Partager",
    copied: "Copié",
    opponentTeam: "Team adverse",
    myTeam: "Ma team",
    bestPicks: "Meilleurs picks",
    bring: "amener",
    searchOpponent: "Ajouter un adversaire...",
    searchMine: "Ajouter à ta team...",
    reset: "Reset",
    autoSaved: "Auto-sauvée",
    offensiveCoverage: "Couverture offensive",
    empty: "Vide",
    selectOpponent: "Sélectionne au moins 1 Pokémon adverse",
    buildTeamFirst: "Construis d'abord ta team\npour voir quels Pokémon amener",
    toBring: "À amener",
    bench: "Banc",
    pick: "Pick",
    covers: "Couvre",
    opponentsCovered: "adversaires",
    uncovered: "Non couvert",
    notEnough: "Ta team n'a que {n} Pokémon · il en faut {k}",
    score: "score",
    simple: "Simple",
    double: "Double",
    formatPick: "pick",
    language: "Langue",
    mega: "MEGA",
    search: "Rechercher (EN ou FR)...",
    footer: "Sprites · PokeAPI · Made with pixels & love",
    strongVs: "Fort contre",
    weakVs: "Faible contre",
    savedTeams: "Teams sauvées",
    teamNamePlaceholder: "Nom de la team...",
    saveTeam: "Sauver",
    loadTeam: "Charger",
    deleteTeam: "Supprimer",
    noSavedTeams: "Aucune team sauvée",
    confirmDeleteTeam: "Supprimer cette team ?",
    navHome: "Accueil",
    navAbout: "À propos",
    navPokedex: "Pokédex",
    navTypes: "Types",
    navLearn: "Apprendre",
    pokedexTitle: "Pokédex",
    pokedexCount: "{n} Pokémon",
    filterAll: "Tous",
    filterMega: "Méga uniquement",
    filterBase: "Base uniquement",
    abilities: "Talents",
    hiddenAbility: "Caché",
    baseStats: "Stats de base",
    totalStats: "Total",
    height: "Taille",
    weight: "Poids",
    moves: "Attaques",
    loadingMoves: "Chargement des attaques...",
    noMovesData: "Pas de données d'attaques",
    statHp: "PV",
    statAtk: "Atk",
    statDef: "Déf",
    statSpa: "AtkS",
    statSpd: "DéfS",
    statSpe: "Vit",
    weaknesses: "Faible (≥2x)",
    resistances: "Résiste",
    immunities: "Immun.",
    addToOpponent: "Ajouter à l'adverse",
    addToMyTeam: "Ajouter à ma team",
    close: "Fermer",
    alphaBadge: "Alpha",
    alphaMessage:
      "Ce projet est en développement actif. Des choses peuvent casser ou changer. 100 % gratuit — sans inscription, sans pub, sans paywall.",
    aboutTitle: "À propos",
    aboutSubtitle: "Les gens derrière PokeCounter",
    whyTitle: "Pourquoi on a construit ça",
    whyBody:
      "On pense que les outils compétitifs Pokémon devraient être gratuits et accessibles à tout le monde. PokeCounter est né de l'envie d'avoir un moyen rapide, clair, sans friction, pour choisir les bons counters dans n'importe quel matchup Pokémon Champions. Aucune inscription, aucune pub, aucun paywall — tu tapes ton adversaire, tu vois les suggestions instantanément.",
    factAlphaTitle: "Alpha",
    factAlphaBody: "En développement actif",
    factOssTitle: "Open source",
    factOssBody: "Licence MIT, sers-toi",
    factFreeTitle: "100 % gratuit",
    factFreeBody: "Aucune pub, aucun paywall, pour toujours",
    factCommunityTitle: "Communauté",
    factCommunityBody: "Fait par des fans, pour des fans",
    creditsTitle: "Crédits & remerciements",
    creditsBody:
      "Toutes les données — sprites, noms localisés, stats de base, talents, movepools et détails d'attaques — viennent de PokéAPI. La table de types est celle de Gen 6+. Merci à toute la communauté compétitive Pokémon de garder ce hobby vivant, et à Nintendo / Game Freak / The Pokémon Company pour les jeux qu'on adore.",
    contributeTitle: "Envie d'aider ?",
    contributeBody:
      "Un bug, un Pokémon manquant, une traduction à corriger ? Une feature à ajouter ? Tous les retours sont bienvenus — contacte-nous et on fait le nécessaire.",
    backToApp: "Retour à l'app",
    reportBug: "Signaler un bug",
    viewSource: "Voir le code",
    currentSeason: "Saison en cours",
    seasonActive: "En cours",
    seasonUpcoming: "À venir",
    seasonEnded: "Terminée",
    daysLeft: "{n} jours restants",
    daysIn: "Jour {n}",
    startsIn: "Commence dans {n} jours",
    rules: "Règles",
    format: "Format",
    exportShowdown: "Exporter vers Showdown",
    importShowdown: "Importer depuis Showdown",
    pasteShowdown: "Colle ici une team Pokémon Showdown...",
    importDone: "Importée",
    notesPlaceholder: "Notes pour cette team...",
    applySet: "Appliquer set",
    loadTemplate: "Charger template",
    templates: "Templates de teams",
    navCompare: "Comparer",
    compareTitle: "Comparer deux Pokémon",
    pickFirst: "Choisir le 1er",
    pickSecond: "Choisir le 2nd",
    damageCalc: "Dégâts vs",
    noDamageData: "Configure les attaques pour voir les dégâts",
    ko: "KO",
    installApp: "Installer l'app",
    analyzeTeam: "Analyser la team",
    overallScore: "Score global",
    avgSpeed: "Vitesse moy.",
    avgBulk: "Bulk moy.",
    physicalAttackers: "Physiques",
    specialAttackers: "Spéciaux",
    offensiveCov: "Couverture offensive",
    covered: "Couverts",
    notCovered: "Non couverts",
    sharedWeak: "Faiblesses partagées",
    suggestions: "Suggestions",
  },
  es: {
    tagline: "Pokémon Campeones · Cobertura de tipos",
    share: "Compartir",
    copied: "Copiado",
    opponentTeam: "Equipo rival",
    myTeam: "Mi equipo",
    bestPicks: "Mejores picks",
    bring: "llevar",
    searchOpponent: "Añadir un rival...",
    searchMine: "Añadir a tu equipo...",
    reset: "Reiniciar",
    autoSaved: "Auto-guardado",
    offensiveCoverage: "Cobertura ofensiva",
    empty: "Vacío",
    selectOpponent: "Selecciona al menos 1 Pokémon rival",
    buildTeamFirst: "Crea primero tu equipo\npara ver qué Pokémon llevar",
    toBring: "A llevar",
    bench: "Banquillo",
    pick: "Pick",
    covers: "Cubre",
    opponentsCovered: "rivales",
    uncovered: "Sin cubrir",
    notEnough: "Tu equipo solo tiene {n} Pokémon · necesitas {k}",
    score: "puntos",
    simple: "Individual",
    double: "Dobles",
    formatPick: "elige",
    language: "Idioma",
    mega: "MEGA",
    search: "Buscar (EN o FR)...",
    footer: "Sprites · PokeAPI · Hecho con píxeles y amor",
    strongVs: "Fuerte contra",
    weakVs: "Débil contra",
    savedTeams: "Equipos guardados",
    teamNamePlaceholder: "Nombre del equipo...",
    saveTeam: "Guardar",
    loadTeam: "Cargar",
    deleteTeam: "Eliminar",
    noSavedTeams: "Aún no hay equipos guardados",
    confirmDeleteTeam: "¿Eliminar este equipo?",
    navHome: "Inicio",
    navAbout: "Acerca de",
    navPokedex: "Pokédex",
    navTypes: "Tipos",
    navLearn: "Aprender",
    pokedexTitle: "Pokédex",
    pokedexCount: "{n} Pokémon",
    filterAll: "Todos",
    filterMega: "Solo Mega",
    filterBase: "Solo base",
    abilities: "Habilidades",
    hiddenAbility: "Oculta",
    baseStats: "Estadísticas base",
    totalStats: "Total",
    height: "Altura",
    weight: "Peso",
    moves: "Movimientos",
    loadingMoves: "Cargando movimientos...",
    noMovesData: "Sin datos de movimientos",
    statHp: "PS",
    statAtk: "Atq",
    statDef: "Def",
    statSpa: "AtE",
    statSpd: "DefE",
    statSpe: "Vel",
    weaknesses: "Débil a (≥2x)",
    resistances: "Resiste",
    immunities: "Inmune",
    addToOpponent: "Añadir al rival",
    addToMyTeam: "Añadir a mi equipo",
    close: "Cerrar",
    alphaBadge: "Alpha",
    alphaMessage:
      "Este proyecto está en desarrollo activo. Algunas cosas pueden cambiar o fallar. Es 100 % gratis y comunitario.",
    aboutTitle: "Acerca de nosotros",
    aboutSubtitle: "Las personas detrás de PokeCounter",
    whyTitle: "Por qué lo creamos",
    whyBody:
      "Creemos que las herramientas competitivas de Pokémon deberían ser gratis y accesibles para todo el mundo. PokeCounter nació del deseo de tener una forma rápida, limpia y sin fricción de elegir los mejores counters en cualquier enfrentamiento de Pokémon Champions. Sin registro, sin anuncios, sin paywalls — escribe a tu rival y obtén sugerencias al instante.",
    factAlphaTitle: "Alpha",
    factAlphaBody: "En desarrollo activo",
    factOssTitle: "Código abierto",
    factOssBody: "Licencia MIT, úsalo",
    factFreeTitle: "100 % Gratis",
    factFreeBody: "Sin anuncios, sin paywalls, para siempre",
    factCommunityTitle: "Comunidad",
    factCommunityBody: "Hecho por fans, para fans",
    creditsTitle: "Créditos y agradecimientos",
    creditsBody:
      "Los sprites y nombres de Pokémon vienen de PokéAPI. La tabla de tipos es la estándar Gen 6+. Gracias a toda la comunidad competitiva de Pokémon por mantener vivo este hobby, y a Nintendo / Game Freak / The Pokémon Company por los juegos que amamos.",
    contributeTitle: "¿Quieres ayudar?",
    contributeBody:
      "¿Un bug, un Pokémon que falta, una traducción incorrecta? ¿Quieres añadir una función? Cualquier feedback es bienvenido — escríbenos.",
    backToApp: "Volver a la app",
    reportBug: "Reportar un bug",
    viewSource: "Ver el código",
    currentSeason: "Temporada actual",
    seasonActive: "Activa",
    seasonUpcoming: "Próxima",
    seasonEnded: "Terminada",
    daysLeft: "{n} días restantes",
    daysIn: "Día {n}",
    startsIn: "Empieza en {n} días",
    rules: "Reglas",
    format: "Formato",
    exportShowdown: "Exportar a Showdown",
    importShowdown: "Importar de Showdown",
    pasteShowdown: "Pega aquí un equipo Pokémon Showdown...",
    importDone: "Importado",
    notesPlaceholder: "Notas para este equipo...",
    applySet: "Aplicar set",
    loadTemplate: "Cargar plantilla",
    templates: "Plantillas",
    navCompare: "Comparar",
    compareTitle: "Comparar dos Pokémon",
    pickFirst: "Elegir primero",
    pickSecond: "Elegir segundo",
    damageCalc: "Daño vs",
    noDamageData: "Configura ataques para ver el daño",
    ko: "KO",
    installApp: "Instalar app",
  },
  de: {
    tagline: "Pokémon Champions · Typen-Abdeckung",
    share: "Teilen",
    copied: "Kopiert",
    opponentTeam: "Gegnerisches Team",
    myTeam: "Mein Team",
    bestPicks: "Beste Picks",
    bring: "mitnehmen",
    searchOpponent: "Gegner hinzufügen...",
    searchMine: "Zum Team hinzufügen...",
    reset: "Zurücksetzen",
    autoSaved: "Auto-gespeichert",
    offensiveCoverage: "Offensiv-Abdeckung",
    empty: "Leer",
    selectOpponent: "Wähle mindestens 1 gegnerisches Pokémon",
    buildTeamFirst:
      "Erstelle zuerst dein Team,\num zu sehen welche Pokémon du mitnehmen sollst",
    toBring: "Mitnehmen",
    bench: "Bank",
    pick: "Pick",
    covers: "Deckt",
    opponentsCovered: "Gegner ab",
    uncovered: "Ungedeckt",
    notEnough: "Dein Team hat nur {n} Pokémon · du brauchst {k}",
    score: "Punkte",
    simple: "Einzel",
    double: "Doppel",
    formatPick: "wähle",
    language: "Sprache",
    mega: "MEGA",
    search: "Suchen (EN oder FR)...",
    footer: "Sprites · PokeAPI · Mit Pixeln & Liebe erstellt",
    strongVs: "Stark gegen",
    weakVs: "Schwach gegen",
    savedTeams: "Gespeicherte Teams",
    teamNamePlaceholder: "Team-Name...",
    saveTeam: "Speichern",
    loadTeam: "Laden",
    deleteTeam: "Löschen",
    noSavedTeams: "Noch keine gespeicherten Teams",
    confirmDeleteTeam: "Dieses Team löschen?",
    navHome: "Startseite",
    navAbout: "Über uns",
    navPokedex: "Pokédex",
    navTypes: "Typen",
    navLearn: "Lernen",
    pokedexTitle: "Pokédex",
    pokedexCount: "{n} Pokémon",
    filterAll: "Alle",
    filterMega: "Nur Mega",
    filterBase: "Nur Basis",
    abilities: "Fähigkeiten",
    hiddenAbility: "Versteckt",
    baseStats: "Basiswerte",
    totalStats: "Gesamt",
    height: "Größe",
    weight: "Gewicht",
    moves: "Attacken",
    loadingMoves: "Lade Attacken...",
    noMovesData: "Keine Attackendaten",
    statHp: "KP",
    statAtk: "Ang",
    statDef: "Vert",
    statSpa: "SpA",
    statSpd: "SpV",
    statSpe: "Init",
    weaknesses: "Schwach (≥2x)",
    resistances: "Resistent",
    immunities: "Immun",
    addToOpponent: "Zum Gegner hinzufügen",
    addToMyTeam: "Zum Team hinzufügen",
    close: "Schließen",
    alphaBadge: "Alpha",
    alphaMessage:
      "Dieses Projekt ist in aktiver Entwicklung. Dinge können sich ändern oder kaputtgehen. Es ist 100 % kostenlos und community-getrieben.",
    aboutTitle: "Über uns",
    aboutSubtitle: "Die Leute hinter PokeCounter",
    whyTitle: "Warum wir das gebaut haben",
    whyBody:
      "Wir glauben, dass kompetitive Pokémon-Tools kostenlos und für alle zugänglich sein sollten. PokeCounter entstand aus dem Wunsch nach einer schnellen, sauberen und reibungslosen Möglichkeit, die richtigen Counter für jedes Pokémon-Champions-Matchup zu finden. Keine Anmeldung, keine Werbung, keine Paywalls — tippe deinen Gegner ein und erhalte sofort Vorschläge.",
    factAlphaTitle: "Alpha",
    factAlphaBody: "In aktiver Entwicklung",
    factOssTitle: "Open Source",
    factOssBody: "MIT-lizenziert",
    factFreeTitle: "100 % Kostenlos",
    factFreeBody: "Keine Werbung, keine Paywalls, für immer",
    factCommunityTitle: "Community",
    factCommunityBody: "Von Fans, für Fans",
    creditsTitle: "Credits & Danksagungen",
    creditsBody:
      "Sprites und Pokémon-Namen stammen von PokéAPI. Die Typentabelle ist der Gen 6+ Standard. Danke an die gesamte kompetitive Pokémon-Community für das Leben dieses Hobbys und an Nintendo / Game Freak / The Pokémon Company für die Spiele, die wir lieben.",
    contributeTitle: "Willst du helfen?",
    contributeBody:
      "Einen Bug gefunden, ein fehlendes Pokémon oder eine Fehlübersetzung? Willst du ein Feature hinzufügen? Jedes Feedback ist willkommen — melde dich bei uns.",
    backToApp: "Zurück zur App",
    reportBug: "Bug melden",
    viewSource: "Quellcode",
    currentSeason: "Aktuelle Saison",
    seasonActive: "Aktiv",
    seasonUpcoming: "Bevorstehend",
    seasonEnded: "Beendet",
    daysLeft: "Noch {n} Tage",
    daysIn: "Tag {n}",
    startsIn: "Beginnt in {n} Tagen",
    rules: "Regeln",
    format: "Format",
    exportShowdown: "Zu Showdown exportieren",
    importShowdown: "Von Showdown importieren",
    pasteShowdown: "Füge hier ein Pokémon Showdown Team ein...",
    importDone: "Importiert",
    notesPlaceholder: "Notizen für dieses Team...",
    applySet: "Set anwenden",
    loadTemplate: "Vorlage laden",
    templates: "Team-Vorlagen",
    navCompare: "Vergleichen",
    compareTitle: "Zwei Pokémon vergleichen",
    pickFirst: "Erstes wählen",
    pickSecond: "Zweites wählen",
    damageCalc: "Schaden vs",
    noDamageData: "Attacken konfigurieren um Schaden zu sehen",
    ko: "KO",
    installApp: "App installieren",
  },
  it: {
    tagline: "Pokémon Campioni · Copertura di tipo",
    share: "Condividi",
    copied: "Copiato",
    opponentTeam: "Squadra avversaria",
    myTeam: "La mia squadra",
    bestPicks: "Migliori scelte",
    bring: "portare",
    searchOpponent: "Aggiungi un avversario...",
    searchMine: "Aggiungi alla tua squadra...",
    reset: "Reset",
    autoSaved: "Auto-salvata",
    offensiveCoverage: "Copertura offensiva",
    empty: "Vuoto",
    selectOpponent: "Seleziona almeno 1 Pokémon avversario",
    buildTeamFirst:
      "Costruisci prima la tua squadra\nper vedere quali Pokémon portare",
    toBring: "Da portare",
    bench: "Panchina",
    pick: "Pick",
    covers: "Copre",
    opponentsCovered: "avversari",
    uncovered: "Non coperto",
    notEnough: "La tua squadra ha solo {n} Pokémon · ne servono {k}",
    score: "punti",
    simple: "Singolo",
    double: "Doppio",
    formatPick: "scegli",
    language: "Lingua",
    mega: "MEGA",
    search: "Cerca (EN o FR)...",
    footer: "Sprites · PokeAPI · Fatto con pixel e amore",
    strongVs: "Forte contro",
    weakVs: "Debole contro",
    savedTeams: "Squadre salvate",
    teamNamePlaceholder: "Nome della squadra...",
    saveTeam: "Salva",
    loadTeam: "Carica",
    deleteTeam: "Elimina",
    noSavedTeams: "Nessuna squadra salvata",
    confirmDeleteTeam: "Eliminare questa squadra?",
    navHome: "Home",
    navAbout: "Chi siamo",
    navPokedex: "Pokédex",
    navTypes: "Tipi",
    navLearn: "Impara",
    pokedexTitle: "Pokédex",
    pokedexCount: "{n} Pokémon",
    filterAll: "Tutti",
    filterMega: "Solo Mega",
    filterBase: "Solo base",
    abilities: "Abilità",
    hiddenAbility: "Nascosta",
    baseStats: "Statistiche base",
    totalStats: "Totale",
    height: "Altezza",
    weight: "Peso",
    moves: "Mosse",
    loadingMoves: "Caricamento mosse...",
    noMovesData: "Nessun dato sulle mosse",
    statHp: "PS",
    statAtk: "Att",
    statDef: "Dif",
    statSpa: "AttSp",
    statSpd: "DifSp",
    statSpe: "Vel",
    weaknesses: "Debole (≥2x)",
    resistances: "Resiste",
    immunities: "Immune",
    addToOpponent: "Aggiungi all'avversario",
    addToMyTeam: "Aggiungi alla mia squadra",
    close: "Chiudi",
    alphaBadge: "Alpha",
    alphaMessage:
      "Questo progetto è in sviluppo attivo. Le cose possono cambiare o rompersi. È 100 % gratuito e guidato dalla community.",
    aboutTitle: "Chi siamo",
    aboutSubtitle: "Le persone dietro PokeCounter",
    whyTitle: "Perché lo abbiamo creato",
    whyBody:
      "Crediamo che gli strumenti competitivi per Pokémon debbano essere gratuiti e accessibili a tutti. PokeCounter è nato dal desiderio di avere un modo rapido, pulito e senza attriti per scegliere i counter giusti in qualsiasi matchup di Pokémon Campioni. Niente registrazione, niente pubblicità, niente paywall — digita il tuo avversario e ottieni suggerimenti istantanei.",
    factAlphaTitle: "Alpha",
    factAlphaBody: "In sviluppo attivo",
    factOssTitle: "Open source",
    factOssBody: "Licenza MIT",
    factFreeTitle: "100 % Gratis",
    factFreeBody: "Niente pub, niente paywall, per sempre",
    factCommunityTitle: "Community",
    factCommunityBody: "Fatto dai fan, per i fan",
    creditsTitle: "Crediti e ringraziamenti",
    creditsBody:
      "Gli sprite e i nomi dei Pokémon vengono da PokéAPI. La tabella dei tipi è lo standard Gen 6+. Grazie a tutta la community competitiva Pokémon per tenere vivo questo hobby, e a Nintendo / Game Freak / The Pokémon Company per i giochi che amiamo.",
    contributeTitle: "Vuoi aiutare?",
    contributeBody:
      "Hai trovato un bug, un Pokémon mancante, una traduzione sbagliata? Vuoi aggiungere una funzione? Qualsiasi feedback è benvenuto — contattaci.",
    backToApp: "Torna all'app",
    reportBug: "Segnala un bug",
    viewSource: "Codice sorgente",
    currentSeason: "Stagione attuale",
    seasonActive: "In corso",
    seasonUpcoming: "Prossima",
    seasonEnded: "Conclusa",
    daysLeft: "{n} giorni rimasti",
    daysIn: "Giorno {n}",
    startsIn: "Inizia tra {n} giorni",
    rules: "Regole",
    format: "Formato",
    exportShowdown: "Esporta su Showdown",
    importShowdown: "Importa da Showdown",
    pasteShowdown: "Incolla qui un team Pokémon Showdown...",
    importDone: "Importata",
    notesPlaceholder: "Note per questa squadra...",
    applySet: "Applica set",
    loadTemplate: "Carica template",
    templates: "Template di squadra",
    navCompare: "Confronta",
    compareTitle: "Confronta due Pokémon",
    pickFirst: "Scegli il primo",
    pickSecond: "Scegli il secondo",
    damageCalc: "Danno vs",
    noDamageData: "Configura le mosse per vedere i danni",
    ko: "KO",
    installApp: "Installa l'app",
  },
  ja: {
    tagline: "ポケモンチャンピオンズ · タイプ相性",
    share: "共有",
    copied: "コピー済み",
    opponentTeam: "相手チーム",
    myTeam: "マイチーム",
    bestPicks: "おすすめピック",
    bring: "選出",
    searchOpponent: "相手を追加...",
    searchMine: "マイチームに追加...",
    reset: "リセット",
    autoSaved: "自動保存",
    offensiveCoverage: "攻撃カバー範囲",
    empty: "空",
    selectOpponent: "相手ポケモンを1体以上選択してください",
    buildTeamFirst:
      "まずマイチームを作成して\nどのポケモンを持っていくか見よう",
    toBring: "選出ポケモン",
    bench: "ベンチ",
    pick: "ピック",
    covers: "カバー",
    opponentsCovered: "相手",
    uncovered: "未カバー",
    notEnough: "マイチームは{n}体のみ · {k}体必要です",
    score: "スコア",
    simple: "シングル",
    double: "ダブル",
    formatPick: "選出",
    language: "言語",
    mega: "メガ",
    search: "検索 (ENまたはFR)...",
    footer: "Sprites · PokeAPI · ピクセルと愛で作成",
    strongVs: "有利",
    weakVs: "不利",
    savedTeams: "保存されたチーム",
    teamNamePlaceholder: "チーム名...",
    saveTeam: "保存",
    loadTeam: "読込",
    deleteTeam: "削除",
    noSavedTeams: "保存されたチームはありません",
    confirmDeleteTeam: "このチームを削除しますか？",
    navHome: "ホーム",
    navAbout: "概要",
    navPokedex: "図鑑",
    navTypes: "タイプ",
    navLearn: "学ぶ",
    pokedexTitle: "ポケモン図鑑",
    pokedexCount: "{n}匹",
    filterAll: "すべて",
    filterMega: "メガのみ",
    filterBase: "基本のみ",
    abilities: "特性",
    hiddenAbility: "隠れ",
    baseStats: "種族値",
    totalStats: "合計",
    height: "高さ",
    weight: "重さ",
    moves: "わざ",
    loadingMoves: "わざを読み込み中...",
    noMovesData: "わざデータなし",
    statHp: "HP",
    statAtk: "攻撃",
    statDef: "防御",
    statSpa: "特攻",
    statSpd: "特防",
    statSpe: "素早",
    weaknesses: "弱点 (≥2倍)",
    resistances: "耐性",
    immunities: "無効",
    addToOpponent: "相手に追加",
    addToMyTeam: "マイチームに追加",
    close: "閉じる",
    alphaBadge: "アルファ",
    alphaMessage:
      "このプロジェクトは積極的に開発中です。動作が変更されたり壊れたりする可能性があります。100%無料でコミュニティ主導です。",
    aboutTitle: "概要",
    aboutSubtitle: "PokeCounterを作った人たち",
    whyTitle: "なぜ作ったか",
    whyBody:
      "競技ポケモンのツールは誰にとっても無料でアクセス可能であるべきだと信じています。PokeCounterは、ポケモンチャンピオンズのどの対戦でも素早く、シンプルに、摩擦なく最適な対策を選びたいという思いから生まれました。登録不要、広告なし、有料プランなし — 相手を入力するだけで即座に提案が得られます。",
    factAlphaTitle: "アルファ",
    factAlphaBody: "開発中",
    factOssTitle: "オープンソース",
    factOssBody: "MITライセンス",
    factFreeTitle: "100%無料",
    factFreeBody: "広告なし、有料化なし、永遠に",
    factCommunityTitle: "コミュニティ",
    factCommunityBody: "ファンによる、ファンのためのもの",
    creditsTitle: "クレジットと謝辞",
    creditsBody:
      "スプライトとポケモン名はPokéAPIからです。タイプ相性表は第6世代以降の標準です。この趣味を生かし続けてくれる競技ポケモンコミュニティ全体、そして私たちが愛するゲームを作ってくれたNintendo / Game Freak / The Pokémon Companyに感謝します。",
    contributeTitle: "手伝いたい？",
    contributeBody:
      "バグ、欠けているポケモン、翻訳の間違いを見つけましたか？機能を追加したいですか？どんなフィードバックも歓迎です — ご連絡ください。",
    backToApp: "アプリに戻る",
    reportBug: "バグを報告",
    viewSource: "ソースを見る",
    currentSeason: "現在のシーズン",
    seasonActive: "開催中",
    seasonUpcoming: "予定",
    seasonEnded: "終了",
    daysLeft: "残り{n}日",
    daysIn: "{n}日目",
    startsIn: "{n}日後に開始",
    rules: "ルール",
    format: "フォーマット",
    exportShowdown: "Showdownへエクスポート",
    importShowdown: "Showdownからインポート",
    pasteShowdown: "Pokémon Showdownのチームをここに貼り付け...",
    importDone: "インポート済み",
    notesPlaceholder: "このチームのメモ...",
    applySet: "セット適用",
    loadTemplate: "テンプレート読込",
    templates: "チームテンプレート",
    navCompare: "比較",
    compareTitle: "2匹のポケモンを比較",
    pickFirst: "1番目を選択",
    pickSecond: "2番目を選択",
    damageCalc: "ダメージ vs",
    noDamageData: "ダメージを見るには技を設定してください",
    ko: "KO",
    installApp: "アプリをインストール",
  },
  ko: {
    tagline: "포켓몬 챔피언스 · 타입 커버리지",
    share: "공유",
    copied: "복사됨",
    opponentTeam: "상대 팀",
    myTeam: "내 팀",
    bestPicks: "최고의 픽",
    bring: "데려가기",
    searchOpponent: "상대 추가...",
    searchMine: "내 팀에 추가...",
    reset: "초기화",
    autoSaved: "자동 저장됨",
    offensiveCoverage: "공격 커버리지",
    empty: "비어 있음",
    selectOpponent: "상대 포켓몬을 최소 1마리 선택하세요",
    buildTeamFirst:
      "먼저 팀을 만들어\n어떤 포켓몬을 데려갈지 확인하세요",
    toBring: "데려갈 포켓몬",
    bench: "벤치",
    pick: "픽",
    covers: "커버",
    opponentsCovered: "상대",
    uncovered: "커버되지 않음",
    notEnough: "팀에 포켓몬이 {n}마리뿐 · {k}마리 필요",
    score: "점수",
    simple: "싱글",
    double: "더블",
    formatPick: "선택",
    language: "언어",
    mega: "메가",
    search: "검색 (EN 또는 FR)...",
    footer: "Sprites · PokeAPI · 픽셀과 사랑으로 제작",
    strongVs: "강한 상대",
    weakVs: "약한 상대",
    savedTeams: "저장된 팀",
    teamNamePlaceholder: "팀 이름...",
    saveTeam: "저장",
    loadTeam: "불러오기",
    deleteTeam: "삭제",
    noSavedTeams: "저장된 팀이 없습니다",
    confirmDeleteTeam: "이 팀을 삭제하시겠습니까?",
    navHome: "홈",
    navAbout: "소개",
    navPokedex: "도감",
    navTypes: "타입",
    navLearn: "배우기",
    pokedexTitle: "포켓몬 도감",
    pokedexCount: "{n}마리",
    filterAll: "전체",
    filterMega: "메가만",
    filterBase: "기본만",
    abilities: "특성",
    hiddenAbility: "숨겨진",
    baseStats: "종족값",
    totalStats: "합계",
    height: "키",
    weight: "몸무게",
    moves: "기술",
    loadingMoves: "기술 불러오는 중...",
    noMovesData: "기술 데이터 없음",
    statHp: "HP",
    statAtk: "공격",
    statDef: "방어",
    statSpa: "특공",
    statSpd: "특방",
    statSpe: "스피드",
    weaknesses: "약점 (≥2배)",
    resistances: "내성",
    immunities: "무효",
    addToOpponent: "상대에 추가",
    addToMyTeam: "내 팀에 추가",
    close: "닫기",
    alphaBadge: "알파",
    alphaMessage:
      "이 프로젝트는 활발히 개발 중입니다. 변경되거나 깨질 수 있습니다. 100% 무료이며 커뮤니티 기반입니다.",
    aboutTitle: "소개",
    aboutSubtitle: "PokeCounter를 만든 사람들",
    whyTitle: "왜 만들었나요",
    whyBody:
      "경쟁 포켓몬 도구는 누구에게나 무료이고 접근 가능해야 한다고 믿습니다. PokeCounter는 포켓몬 챔피언스의 어떤 매치업에서도 빠르고 깔끔하게, 마찰 없이 적절한 카운터를 선택할 수 있는 방법을 원하는 마음에서 시작되었습니다. 가입 없음, 광고 없음, 유료 없음 — 상대를 입력하기만 하면 즉시 제안을 받을 수 있습니다.",
    factAlphaTitle: "알파",
    factAlphaBody: "활발히 개발 중",
    factOssTitle: "오픈 소스",
    factOssBody: "MIT 라이선스",
    factFreeTitle: "100% 무료",
    factFreeBody: "광고 없음, 유료 없음, 영원히",
    factCommunityTitle: "커뮤니티",
    factCommunityBody: "팬이 팬을 위해 만듦",
    creditsTitle: "크레딧 및 감사",
    creditsBody:
      "스프라이트와 포켓몬 이름은 PokéAPI에서 가져옵니다. 타입 상성표는 6세대 이상 표준입니다. 이 취미를 살아있게 해준 전체 경쟁 포켓몬 커뮤니티와 우리가 사랑하는 게임을 만들어준 Nintendo / Game Freak / The Pokémon Company에 감사드립니다.",
    contributeTitle: "도움을 주고 싶으신가요?",
    contributeBody:
      "버그, 누락된 포켓몬, 번역 오류를 발견하셨나요? 기능을 추가하고 싶으신가요? 모든 피드백을 환영합니다 — 저희에게 연락해 주세요.",
    backToApp: "앱으로 돌아가기",
    reportBug: "버그 신고",
    viewSource: "소스 보기",
    currentSeason: "현재 시즌",
    seasonActive: "진행 중",
    seasonUpcoming: "예정",
    seasonEnded: "종료",
    daysLeft: "{n}일 남음",
    daysIn: "{n}일째",
    startsIn: "{n}일 후 시작",
    rules: "규칙",
    format: "포맷",
    exportShowdown: "Showdown으로 내보내기",
    importShowdown: "Showdown에서 가져오기",
    pasteShowdown: "Pokémon Showdown 팀을 여기에 붙여넣기...",
    importDone: "가져옴",
    notesPlaceholder: "이 팀에 대한 메모...",
    applySet: "세트 적용",
    loadTemplate: "템플릿 불러오기",
    templates: "팀 템플릿",
    navCompare: "비교",
    compareTitle: "두 포켓몬 비교",
    pickFirst: "첫 번째 선택",
    pickSecond: "두 번째 선택",
    damageCalc: "데미지 vs",
    noDamageData: "데미지를 보려면 기술을 설정하세요",
    ko: "KO",
    installApp: "앱 설치",
  },
  "zh-Hans": {
    tagline: "宝可梦冠军赛 · 属性克制",
    share: "分享",
    copied: "已复制",
    opponentTeam: "对手队伍",
    myTeam: "我的队伍",
    bestPicks: "最佳选择",
    bring: "带上",
    searchOpponent: "添加对手...",
    searchMine: "添加到你的队伍...",
    reset: "重置",
    autoSaved: "已自动保存",
    offensiveCoverage: "攻击覆盖",
    empty: "空",
    selectOpponent: "请至少选择1只对手宝可梦",
    buildTeamFirst: "先组建你的队伍\n查看该带哪些宝可梦",
    toBring: "带上",
    bench: "替补",
    pick: "选择",
    covers: "覆盖",
    opponentsCovered: "对手",
    uncovered: "未覆盖",
    notEnough: "你的队伍只有{n}只宝可梦 · 需要{k}只",
    score: "分数",
    simple: "单打",
    double: "双打",
    formatPick: "选",
    language: "语言",
    mega: "超级",
    search: "搜索（EN 或 FR）...",
    footer: "Sprites · PokeAPI · 用像素与爱制作",
    strongVs: "克制",
    weakVs: "被克制",
    savedTeams: "已保存的队伍",
    teamNamePlaceholder: "队伍名称...",
    saveTeam: "保存",
    loadTeam: "加载",
    deleteTeam: "删除",
    noSavedTeams: "暂无已保存的队伍",
    confirmDeleteTeam: "删除此队伍？",
    navHome: "首页",
    navAbout: "关于",
    navPokedex: "图鉴",
    navTypes: "属性",
    navLearn: "学习",
    pokedexTitle: "宝可梦图鉴",
    pokedexCount: "{n}只宝可梦",
    filterAll: "全部",
    filterMega: "仅超级",
    filterBase: "仅基础",
    abilities: "特性",
    hiddenAbility: "隐藏",
    baseStats: "种族值",
    totalStats: "总和",
    height: "身高",
    weight: "体重",
    moves: "招式",
    loadingMoves: "招式加载中...",
    noMovesData: "无招式数据",
    statHp: "HP",
    statAtk: "攻击",
    statDef: "防御",
    statSpa: "特攻",
    statSpd: "特防",
    statSpe: "速度",
    weaknesses: "弱点 (≥2倍)",
    resistances: "抵抗",
    immunities: "免疫",
    addToOpponent: "添加到对手",
    addToMyTeam: "添加到我的队伍",
    close: "关闭",
    alphaBadge: "Alpha",
    alphaMessage:
      "本项目正在积极开发中，功能可能会发生变化或出现问题。100% 免费，由社区驱动。",
    aboutTitle: "关于我们",
    aboutSubtitle: "PokeCounter 背后的团队",
    whyTitle: "为什么做这个",
    whyBody:
      "我们相信竞技宝可梦工具应当对所有人免费且易于使用。PokeCounter 诞生于对快速、简洁、零摩擦地为任何宝可梦冠军赛对局选择合适克制的渴望。无需注册、无广告、无付费墙 — 输入对手即可立即获得建议。",
    factAlphaTitle: "Alpha",
    factAlphaBody: "积极开发中",
    factOssTitle: "开源",
    factOssBody: "MIT 许可证",
    factFreeTitle: "100% 免费",
    factFreeBody: "无广告，无付费墙，永远",
    factCommunityTitle: "社区",
    factCommunityBody: "粉丝为粉丝而做",
    creditsTitle: "致谢",
    creditsBody:
      "图像和宝可梦名称来自 PokéAPI。属性相克表为第 6 代及以后的标准。感谢整个竞技宝可梦社区让这项爱好保持活力，感谢 Nintendo / Game Freak / The Pokémon Company 为我们带来喜爱的游戏。",
    contributeTitle: "想帮忙？",
    contributeBody:
      "发现 bug、缺失的宝可梦或翻译错误？想添加功能？欢迎任何反馈 — 请联系我们。",
    backToApp: "返回应用",
    reportBug: "报告 bug",
    viewSource: "查看源代码",
    currentSeason: "当前赛季",
    seasonActive: "进行中",
    seasonUpcoming: "即将到来",
    seasonEnded: "已结束",
    daysLeft: "剩余 {n} 天",
    daysIn: "第 {n} 天",
    startsIn: "{n} 天后开始",
    rules: "规则",
    format: "格式",
    exportShowdown: "导出到 Showdown",
    importShowdown: "从 Showdown 导入",
    pasteShowdown: "在此粘贴 Pokémon Showdown 队伍...",
    importDone: "已导入",
    notesPlaceholder: "此队伍的备注...",
    applySet: "应用配置",
    loadTemplate: "加载模板",
    templates: "队伍模板",
    navCompare: "对比",
    compareTitle: "对比两只宝可梦",
    pickFirst: "选择第一只",
    pickSecond: "选择第二只",
    damageCalc: "伤害 vs",
    noDamageData: "配置招式以查看伤害",
    ko: "KO",
    installApp: "安装应用",
  },
  "zh-Hant": {
    tagline: "寶可夢冠軍賽 · 屬性克制",
    share: "分享",
    copied: "已複製",
    opponentTeam: "對手隊伍",
    myTeam: "我的隊伍",
    bestPicks: "最佳選擇",
    bring: "帶上",
    searchOpponent: "新增對手...",
    searchMine: "新增到你的隊伍...",
    reset: "重置",
    autoSaved: "已自動儲存",
    offensiveCoverage: "攻擊覆蓋",
    empty: "空",
    selectOpponent: "請至少選擇1隻對手寶可夢",
    buildTeamFirst: "先組建你的隊伍\n查看該帶哪些寶可夢",
    toBring: "帶上",
    bench: "替補",
    pick: "選擇",
    covers: "覆蓋",
    opponentsCovered: "對手",
    uncovered: "未覆蓋",
    notEnough: "你的隊伍只有{n}隻寶可夢 · 需要{k}隻",
    score: "分數",
    simple: "單打",
    double: "雙打",
    formatPick: "選",
    language: "語言",
    mega: "超級",
    search: "搜尋（EN 或 FR）...",
    footer: "Sprites · PokeAPI · 用像素與愛製作",
    strongVs: "剋制",
    weakVs: "被剋制",
    savedTeams: "已儲存的隊伍",
    teamNamePlaceholder: "隊伍名稱...",
    saveTeam: "儲存",
    loadTeam: "載入",
    deleteTeam: "刪除",
    noSavedTeams: "尚無已儲存的隊伍",
    confirmDeleteTeam: "刪除此隊伍？",
    navHome: "首頁",
    navAbout: "關於",
    navPokedex: "圖鑑",
    navTypes: "屬性",
    navLearn: "學習",
    pokedexTitle: "寶可夢圖鑑",
    pokedexCount: "{n}隻寶可夢",
    filterAll: "全部",
    filterMega: "僅超級",
    filterBase: "僅基礎",
    abilities: "特性",
    hiddenAbility: "隱藏",
    baseStats: "種族值",
    totalStats: "總和",
    height: "身高",
    weight: "體重",
    moves: "招式",
    loadingMoves: "招式載入中...",
    noMovesData: "無招式資料",
    statHp: "HP",
    statAtk: "攻擊",
    statDef: "防禦",
    statSpa: "特攻",
    statSpd: "特防",
    statSpe: "速度",
    weaknesses: "弱點 (≥2倍)",
    resistances: "抵抗",
    immunities: "免疫",
    addToOpponent: "加入對手",
    addToMyTeam: "加入我的隊伍",
    close: "關閉",
    alphaBadge: "Alpha",
    alphaMessage:
      "本專案正在積極開發中，功能可能會變更或出現問題。100% 免費，由社群驅動。",
    aboutTitle: "關於我們",
    aboutSubtitle: "PokeCounter 背後的團隊",
    whyTitle: "為什麼做這個",
    whyBody:
      "我們相信競技寶可夢工具應當對所有人免費且易於使用。PokeCounter 誕生於對快速、簡潔、零摩擦地為任何寶可夢冠軍賽對局選擇合適剋制的渴望。無需註冊、無廣告、無付費牆 — 輸入對手即可立即獲得建議。",
    factAlphaTitle: "Alpha",
    factAlphaBody: "積極開發中",
    factOssTitle: "開源",
    factOssBody: "MIT 授權",
    factFreeTitle: "100% 免費",
    factFreeBody: "無廣告，無付費牆，永遠",
    factCommunityTitle: "社群",
    factCommunityBody: "粉絲為粉絲而做",
    creditsTitle: "致謝",
    creditsBody:
      "圖像和寶可夢名稱來自 PokéAPI。屬性相剋表為第 6 代及以後的標準。感謝整個競技寶可夢社群讓這項愛好保持活力，感謝 Nintendo / Game Freak / The Pokémon Company 為我們帶來喜愛的遊戲。",
    contributeTitle: "想幫忙？",
    contributeBody:
      "發現 bug、缺失的寶可夢或翻譯錯誤？想新增功能？歡迎任何回饋 — 請聯絡我們。",
    backToApp: "返回應用",
    reportBug: "回報 bug",
    viewSource: "查看原始碼",
    currentSeason: "目前賽季",
    seasonActive: "進行中",
    seasonUpcoming: "即將到來",
    seasonEnded: "已結束",
    daysLeft: "剩餘 {n} 天",
    daysIn: "第 {n} 天",
    startsIn: "{n} 天後開始",
    rules: "規則",
    format: "格式",
    exportShowdown: "匯出至 Showdown",
    importShowdown: "從 Showdown 匯入",
    pasteShowdown: "在此貼上 Pokémon Showdown 隊伍...",
    importDone: "已匯入",
    notesPlaceholder: "此隊伍的備註...",
    applySet: "套用配置",
    loadTemplate: "載入模板",
    templates: "隊伍模板",
    navCompare: "比較",
    compareTitle: "比較兩隻寶可夢",
    pickFirst: "選擇第一隻",
    pickSecond: "選擇第二隻",
    damageCalc: "傷害 vs",
    noDamageData: "設定招式以查看傷害",
    ko: "KO",
    installApp: "安裝應用",
  },
};

const TYPE_I18N: Record<PokemonType, Record<Lang, string>> = {
  Normal: {
    en: "Normal", fr: "Normal", es: "Normal", de: "Normal", it: "Normale",
    ja: "ノーマル", ko: "노말", "zh-Hans": "一般", "zh-Hant": "一般",
  },
  Fire: {
    en: "Fire", fr: "Feu", es: "Fuego", de: "Feuer", it: "Fuoco",
    ja: "ほのお", ko: "불꽃", "zh-Hans": "火", "zh-Hant": "火",
  },
  Water: {
    en: "Water", fr: "Eau", es: "Agua", de: "Wasser", it: "Acqua",
    ja: "みず", ko: "물", "zh-Hans": "水", "zh-Hant": "水",
  },
  Electric: {
    en: "Electric", fr: "Élec", es: "Eléctrico", de: "Elektro", it: "Elettro",
    ja: "でんき", ko: "전기", "zh-Hans": "电", "zh-Hant": "電",
  },
  Grass: {
    en: "Grass", fr: "Plante", es: "Planta", de: "Pflanze", it: "Erba",
    ja: "くさ", ko: "풀", "zh-Hans": "草", "zh-Hant": "草",
  },
  Ice: {
    en: "Ice", fr: "Glace", es: "Hielo", de: "Eis", it: "Ghiaccio",
    ja: "こおり", ko: "얼음", "zh-Hans": "冰", "zh-Hant": "冰",
  },
  Fighting: {
    en: "Fighting", fr: "Combat", es: "Lucha", de: "Kampf", it: "Lotta",
    ja: "かくとう", ko: "격투", "zh-Hans": "格斗", "zh-Hant": "格鬥",
  },
  Poison: {
    en: "Poison", fr: "Poison", es: "Veneno", de: "Gift", it: "Veleno",
    ja: "どく", ko: "독", "zh-Hans": "毒", "zh-Hant": "毒",
  },
  Ground: {
    en: "Ground", fr: "Sol", es: "Tierra", de: "Boden", it: "Terra",
    ja: "じめん", ko: "땅", "zh-Hans": "地面", "zh-Hant": "地面",
  },
  Flying: {
    en: "Flying", fr: "Vol", es: "Volador", de: "Flug", it: "Volante",
    ja: "ひこう", ko: "비행", "zh-Hans": "飞行", "zh-Hant": "飛行",
  },
  Psychic: {
    en: "Psychic", fr: "Psy", es: "Psíquico", de: "Psycho", it: "Psico",
    ja: "エスパー", ko: "에스퍼", "zh-Hans": "超能力", "zh-Hant": "超能力",
  },
  Bug: {
    en: "Bug", fr: "Insecte", es: "Bicho", de: "Käfer", it: "Coleottero",
    ja: "むし", ko: "벌레", "zh-Hans": "虫", "zh-Hant": "蟲",
  },
  Rock: {
    en: "Rock", fr: "Roche", es: "Roca", de: "Gestein", it: "Roccia",
    ja: "いわ", ko: "바위", "zh-Hans": "岩石", "zh-Hant": "岩石",
  },
  Ghost: {
    en: "Ghost", fr: "Spectre", es: "Fantasma", de: "Geist", it: "Spettro",
    ja: "ゴースト", ko: "고스트", "zh-Hans": "幽灵", "zh-Hant": "幽靈",
  },
  Dragon: {
    en: "Dragon", fr: "Dragon", es: "Dragón", de: "Drache", it: "Drago",
    ja: "ドラゴン", ko: "드래곤", "zh-Hans": "龙", "zh-Hant": "龍",
  },
  Dark: {
    en: "Dark", fr: "Ténèbres", es: "Siniestro", de: "Unlicht", it: "Buio",
    ja: "あく", ko: "악", "zh-Hans": "恶", "zh-Hant": "惡",
  },
  Steel: {
    en: "Steel", fr: "Acier", es: "Acero", de: "Stahl", it: "Acciaio",
    ja: "はがね", ko: "강철", "zh-Hans": "钢", "zh-Hant": "鋼",
  },
  Fairy: {
    en: "Fairy", fr: "Fée", es: "Hada", de: "Fee", it: "Folletto",
    ja: "フェアリー", ko: "페어리", "zh-Hans": "妖精", "zh-Hant": "妖精",
  },
};

export function typeLabel(type: PokemonType, lang: Lang): string {
  return TYPE_I18N[type][lang] ?? TYPE_I18N[type].en;
}

/**
 * Pokemon display name localized to the requested language, with
 * graceful fallback (requested → en → fr → id).
 */
export function pokemonName(p: Pokemon, lang: Lang): string {
  return (
    p.names[lang] ??
    p.names.en ??
    p.names.fr ??
    `#${p.id}`
  );
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadLang());

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* noop */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangCtx>(() => {
    const t = (key: keyof Dict, vars?: Record<string, string | number>) => {
      let s = DICT[lang][key] ?? DICT.en[key] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(`{${k}}`, String(v));
        }
      }
      return s;
    };
    return { lang, setLang: setLangState, t };
  }, [lang]);

  return createElement(LangContext.Provider, { value }, children);
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
