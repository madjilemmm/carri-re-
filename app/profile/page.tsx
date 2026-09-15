"use client";

import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-center">Profil</h1>
          <p className="text-text-secondary text-center mt-2">
            Difficulté favorite :{" "}
            <span className="font-semibold text-text-primary">
              {favoriteDifficulty ? DIFFICULTY_LABELS[favoriteDifficulty] : "—"}
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
              className="border border-border rounded-lg py-4 px-4 bg-surface hover:border-purple/30 transition-colors"
            >
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
