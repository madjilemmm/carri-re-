import { Difficulty, Player } from "@/lib/types";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facile: "Facile",
  normal: "Normal",
  difficile: "Difficile",
  expert: "Expert",
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  facile: "Superstars mondiales, carrières connues de tous.",
  normal: "Joueurs confirmés, un peu plus de recherche.",
  difficile: "Carrières denses, transferts moins connus.",
  expert: "Joueurs de niche, prêts et clubs obscurs.",
};

export const BASE_POINTS: Record<Difficulty, number> = {
  facile: 600,
  normal: 800,
  difficile: 1000,
  expert: 1300,
};

export const HINT_PENALTY = 90;

export type ExtraHintType = "nationality" | "position" | "birthYear" | "iconicNumber";

export const EXTRA_HINT_ORDER: ExtraHintType[] = [
  "position",
  "nationality",
  "birthYear",
  "iconicNumber",
];

export function extraHintLabel(type: ExtraHintType): string {
  switch (type) {
    case "nationality":
      return "Nationalité";
    case "position":
      return "Poste";
    case "birthYear":
      return "Année de naissance";
    case "iconicNumber":
      return "Numéro emblématique";
  }
}

export function extraHintValue(player: Player, type: ExtraHintType): string {
  switch (type) {
    case "nationality":
      return player.nationality;
    case "position":
      return player.position;
    case "birthYear":
      return String(player.birthYear);
    case "iconicNumber":
      return player.iconicNumber ? `#${player.iconicNumber}` : "Inconnu";
  }
}

// Total hint "budget": 1 club revealed for free, then each additional hint
// (either a new club or an extra fact) costs points.
export function computeScore(difficulty: Difficulty, hintsUsed: number): number {
  const base = BASE_POINTS[difficulty];
  const score = base - hintsUsed * HINT_PENALTY;
  return Math.max(score, 100);
}

export function maxHintsAvailable(player: Player): number {
  // club reveals beyond the first + extra facts
  return player.career.length - 1 + EXTRA_HINT_ORDER.length;
}
