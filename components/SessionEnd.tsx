"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { springPop, springSnappy } from "@/lib/motion";

export default function SessionEnd({
  correctCount,
  totalCount,
  totalPoints,
  bestStreak,
  averageTimeSec,
  replayHref,
  onReplay,
  shareText,
}: {
  correctCount: number;
  totalCount: number;
  totalPoints: number;
  bestStreak: number;
  averageTimeSec: number;
  replayHref: string;
  onReplay?: () => void;
  shareText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-14"
    >
      <div className="max-w-sm w-full text-center">
        <p className="text-text-secondary text-sm font-medium tracking-wide">Session terminée</p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, ...springPop }}
          className="text-5xl font-extrabold tracking-tight mt-2 tabular-nums"
        >
          <CountUp value={correctCount} stiffness={200} damping={20} />
          <span className="text-text-secondary">/{totalCount}</span>
        </motion.h1>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { value: totalPoints, label: "Points" },
            { value: bestStreak, label: "Meilleure série" },
            { value: averageTimeSec, label: "Temps moyen", suffix: "s" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.06, ...springPop }}
              className="border border-border rounded-lg py-3 bg-surface"
            >
              <p className="text-lg font-bold tabular-nums">
                <CountUp value={stat.value} suffix={stat.suffix ?? ""} stiffness={200} damping={22} />
              </p>
              <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-10">
          {onReplay ? (
            <motion.button
              type="button"
              onClick={onReplay}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              transition={springSnappy}
              className="rounded-lg bg-purple text-white font-semibold py-3.5 hover:bg-purple-dark transition-colors"
            >
              Rejouer
            </motion.button>
          ) : (
            <Link href={replayHref}>
              <motion.span
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                transition={springSnappy}
                className="block rounded-lg bg-purple text-white font-semibold py-3.5 hover:bg-purple-dark transition-colors"
              >
                Rejouer
              </motion.span>
            </Link>
          )}
          <Link href="/play">
            <motion.span
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2, borderColor: "var(--color-purple)" }}
              transition={springSnappy}
              className="block rounded-lg border border-border font-semibold py-3.5 hover:border-purple/40 transition-colors"
            >
              Changer de difficulté
            </motion.span>
          </Link>
          {shareText && (
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(shareText)}
              className="text-sm text-text-secondary hover:text-purple mt-1 transition-colors"
            >
              Copier le résultat
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
