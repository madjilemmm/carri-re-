"use client";

import { motion } from "framer-motion";
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
          {[
            { label: "Meilleur score", value: `${bestScorePercent}%` },
            { label: "Meilleure série", value: bestStreakEver },
            ...(lastSession
              ? [
                  {
                    label: `Dernière session (${DIFFICULTY_LABELS[lastSession.difficulty]})`,
                    value: `${lastSession.totalPoints} pts`,
                  },
                ]
              : []),
          ].map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center justify-between border border-border rounded-lg px-5 py-4 bg-surface"
            >
              <span className="text-sm font-medium">{row.label}</span>
              <span className="font-bold tabular-nums">{row.value}</span>
            </motion.div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-text-secondary mt-10 mb-3 tracking-wide uppercase">
          Parties par difficulté
        </h2>
        <div className="flex flex-col gap-2">
          {difficulties.map((d) => (
            <div
              key={d}
              className="flex items-center justify-between text-sm border-b border-border py-2.5"
            >
              <span className="font-medium">{DIFFICULTY_LABELS[d]}</span>
              <span className="text-text-secondary tabular-nums">{difficultyCounts[d]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
