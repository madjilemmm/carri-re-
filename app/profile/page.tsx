"use client";

import { useGameStore } from "@/lib/store";
import { DIFFICULTY_LABELS } from "@/lib/game";

export default function Profile() {
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const totalCorrect = useGameStore((s) => s.totalCorrect);
  const totalQuestions = useGameStore((s) => s.totalQuestions);
  const bestScorePercent = useGameStore((s) => s.bestScorePercent);
  const bestStreakEver = useGameStore((s) => s.bestStreakEver);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const favoriteDifficulty = useGameStore((s) => s.favoriteDifficulty)();

  const winRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) : 0;

  const stats = [
    { label: "Parties jouées", value: gamesPlayed },
    { label: "Taux de réussite", value: `${winRate}%` },
    { label: "Meilleur score", value: `${bestScorePercent}%` },
    { label: "Score moyen", value: avgScore },
    { label: "Meilleure série", value: bestStreakEver },
    { label: "Série quotidienne", value: dailyStreak },
  ];

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-14">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold tracking-tight text-center">Profil</h1>
        <p className="text-text-secondary text-center mt-2">
          Difficulté favorite : {favoriteDifficulty ? DIFFICULTY_LABELS[favoriteDifficulty] : "—"}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-10">
          {stats.map((s) => (
            <div key={s.label} className="border border-border rounded-lg py-4 px-4 bg-surface">
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
