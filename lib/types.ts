export type Difficulty = "facile" | "normal" | "difficile" | "expert";

export type TransferType = "transfert" | "prêt" | "libre" | "formation";

export interface CareerStep {
  club: string;
  clubShort: string; // used for the badge initials
  startYear: number;
  endYear: number | null; // null = present
  transferType: TransferType;
  league: string;
}

export interface Player {
  id: string;
  fullName: string;
  knownAs: string;
  nationality: string;
  position: string;
  birthYear: number;
  iconicNumber?: number;
  career: CareerStep[];
  difficulty: Difficulty;
  aliases: string[];
}
