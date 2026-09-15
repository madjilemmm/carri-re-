"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty } from "@/lib/types";

interface DailyResult {
  index: number;
  found: boolean;
  hintsUsed: number;
  dateKey: string;
}

interface SessionSummary {
  score: number;
  totalPoints: number;
  bestStreak: number;
  averageTimeSec: number;
  difficulty: Difficulty;
}

interface ProfileState {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScorePercent: number;
  bestStreakEver: number;
  currentStreak: number;
  dailyStreak: number;
  lastDailyDateKey: string | null;
  difficultyCounts: Record<Difficulty, number>;
  lastSession: SessionSummary | null;
  dailyResults: DailyResult[];
}

interface GameStore extends ProfileState {
  recordSession: (summary: SessionSummary, correctCount: number, totalCount: number) => void;
  recordDaily: (result: DailyResult) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  favoriteDifficulty: () => Difficulty | null;
}

const emptyDifficultyCounts: Record<Difficulty, number> = {
  facile: 0,
  normal: 0,
  difficile: 0,
  expert: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gamesPlayed: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestScorePercent: 0,
      bestStreakEver: 0,
      currentStreak: 0,
      dailyStreak: 0,
      lastDailyDateKey: null,
      difficultyCounts: { ...emptyDifficultyCounts },
      lastSession: null,
      dailyResults: [],

      recordSession: (summary, correctCount, totalCount) => {
        const scorePercent = Math.round((correctCount / totalCount) * 100);
        set((state) => ({
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + totalCount,
          bestScorePercent: Math.max(state.bestScorePercent, scorePercent),
          bestStreakEver: Math.max(state.bestStreakEver, summary.bestStreak),
          difficultyCounts: {
            ...state.difficultyCounts,
            [summary.difficulty]: state.difficultyCounts[summary.difficulty] + 1,
          },
          lastSession: summary,
        }));
      },

      recordDaily: (result) => {
        set((state) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yKey = yesterday.toISOString().slice(0, 10);
          const continuesStreak = state.lastDailyDateKey === yKey;
          const newStreak = result.found ? (continuesStreak ? state.dailyStreak + 1 : 1) : 0;
          return {
            dailyResults: [...state.dailyResults.filter((d) => d.dateKey !== result.dateKey), result],
            dailyStreak: newStreak,
            lastDailyDateKey: result.found ? result.dateKey : state.lastDailyDateKey,
          };
        });
      },

      incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1, bestStreakEver: Math.max(state.bestStreakEver, state.currentStreak + 1) })),
      resetStreak: () => set({ currentStreak: 0 }),

      favoriteDifficulty: () => {
        const counts = get().difficultyCounts;
        const entries = Object.entries(counts) as [Difficulty, number][];
        const max = entries.reduce((a, b) => (b[1] > a[1] ? b : a), entries[0]);
        return max[1] > 0 ? max[0] : null;
      },
    }),
    { name: "carriere-game-store" }
  )
);

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
