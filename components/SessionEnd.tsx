"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SessionEnd({
  correctCount,
  totalCount,
  totalPoints,
  bestStreak,
  averageTimeSec,
  replayHref,
  shareText,
}: {
  correctCount: number;
  totalCount: number;
  totalPoints: number;
  bestStreak: number;
  averageTimeSec: number;
  replayHref: string;
  shareText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-14"
    >
      <div className="max-w-sm w-full text-center">
        <p className="text-text-secondary text-sm">Session terminée</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">
          {correctCount}/{totalCount}
        </h1>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="border border-border rounded-lg py-3">
            <p className="text-lg font-bold">{totalPoints}</p>
            <p className="text-xs text-text-secondary mt-1">Points</p>
          </div>
          <div className="border border-border rounded-lg py-3">
            <p className="text-lg font-bold">{bestStreak}</p>
            <p className="text-xs text-text-secondary mt-1">Meilleure série</p>
          </div>
          <div className="border border-border rounded-lg py-3">
            <p className="text-lg font-bold">{averageTimeSec}s</p>
            <p className="text-xs text-text-secondary mt-1">Temps moyen</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <Link
            href={replayHref}
            className="rounded-lg bg-purple text-white font-semibold py-3.5 hover:bg-purple-dark transition-colors"
          >
            Rejouer
          </Link>
          <Link
            href="/play"
            className="rounded-lg border border-border font-semibold py-3.5 hover:border-purple/40 transition-colors"
          >
            Changer de difficulté
          </Link>
          {shareText && (
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(shareText)}
              className="text-sm text-text-secondary hover:text-purple mt-1"
            >
              Copier le résultat
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
