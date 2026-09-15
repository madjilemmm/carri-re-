"use client";

import { useGameStore } from "@/lib/store";
import { DIFFICULTY_LABELS } from "@/lib/game";
import { Difficulty } from "@/lib/types";

export default function Leaderboard() {
  const difficultyCounts = useGameStore((s) => s.difficultyCounts);
  const bestScorePercent = useGameStore((s) => s.bestScorePercent);
  const bestStreakEver = useGameStore((s) => s.bestStreakEver);
  const lastSession = useGameStore((s) => s.lastSession);

  const difficulties: Difficulty[] = ["facile", "normal", "difficile", "expert"];

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-14">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold tracking-tight text-center">Classement</h1>
        <p className="text-text-secondary text-center mt-2 text-sm">
          Vos meilleurs résultats, enregistrés sur cet appareil.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <div className="flex items-center justify-between border border-border rounded-lg px-5 py-4 bg-surface">
            <span className="text-sm font-medium">Meilleur score</span>
            <span className="font-bold">{bestScorePercent}%</span>
          </div>
          <div className="flex items-center justify-between border border-border rounded-lg px-5 py-4 bg-surface">
            <span className="text-sm font-medium">Meilleure série</span>
            <span className="font-bold">{bestStreakEver}</span>
          </div>
          {lastSession && (
            <div className="flex items-center justify-between border border-border rounded-lg px-5 py-4 bg-surface">
              <span className="text-sm font-medium">Dernière session ({DIFFICULTY_LABELS[lastSession.difficulty]})</span>
              <span className="font-bold">{lastSession.totalPoints} pts</span>
            </div>
          )}
        </div>

        <h2 className="text-sm font-semibold text-text-secondary mt-10 mb-3">Parties par difficulté</h2>
        <div className="flex flex-col gap-2">
          {difficulties.map((d) => (
            <div key={d} className="flex items-center justify-between text-sm border-b border-border py-2">
              <span>{DIFFICULTY_LABELS[d]}</span>
              <span className="text-text-secondary">{difficultyCounts[d]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
