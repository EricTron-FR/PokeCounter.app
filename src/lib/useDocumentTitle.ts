import { useEffect } from "react";

const TITLES: Record<string, string> = {
  home: "PokeCounter — Pokémon Champions Counter & Type Coverage",
  pokedex: "Pokédex · PokeCounter",
  types: "Type Chart 18×18 · PokeCounter",
  compare: "Compare two Pokémon · PokeCounter",
  battle: "Battle Simulator · PokeCounter",
  learn: "Learn VGC · PokeCounter",
  about: "About · PokeCounter",
};

export function useDocumentTitle(view: string) {
  useEffect(() => {
    const title = TITLES[view] ?? TITLES.home;
    document.title = title;
  }, [view]);
}
