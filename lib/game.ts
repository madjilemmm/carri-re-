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

export type ExtraHintType =
  | "position"
  | "nationality"
  | "birthYear"
  | "iconicNumber"
  | "years";

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
    case "years":
      return "Années";
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
    case "years":
      return "";
  }
}

// The full career (clubs + badges) is always visible from the start. Each
// difficulty tier controls how much *extra* info (years, nationality, etc.)
// is shown upfront — the rest becomes available as paid hints.
export const HINTS_HIDDEN_BY_DEFAULT: Record<Difficulty, ExtraHintType[]> = {
  facile: [],
  normal: ["iconicNumber"],
  difficile: ["years", "iconicNumber", "birthYear"],
  expert: ["years", "iconicNumber", "birthYear", "nationality", "position"],
};

// Ordered list of hints available for a given difficulty: whatever is hidden
// by default, revealed one at a time as the player spends hints.
export function hintOrderForDifficulty(difficulty: Difficulty): ExtraHintType[] {
  const hidden = HINTS_HIDDEN_BY_DEFAULT[difficulty];
  const order: ExtraHintType[] = ["years", ...EXTRA_HINT_ORDER];
  return order.filter((h) => hidden.includes(h));
}

// Each hint (club fact or extra fact) costs points.
export function computeScore(difficulty: Difficulty, hintsUsed: number): number {
  const base = BASE_POINTS[difficulty];
  const score = base - hintsUsed * HINT_PENALTY;
  return Math.max(score, 100);
}

export function maxHintsAvailable(difficulty: Difficulty): number {
  return hintOrderForDifficulty(difficulty).length;
}
