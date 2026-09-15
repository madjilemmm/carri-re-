"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { springSnappy } from "@/lib/motion";

const stats = [
  { key: "currentStreak", label: "Série en cours" },
  { key: "bestStreakEver", label: "Meilleure série" },
  { key: "gamesPlayed", label: "Parties jouées" },
] as const;

export default function Home() {
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const bestStreakEver = useGameStore((s) => s.bestStreakEver);
  const currentStreak = useGameStore((s) => s.currentStreak);

  const values: Record<(typeof stats)[number]["key"], number> = {
    currentStreak,
    bestStreakEver,
    gamesPlayed,
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-xl"
      >
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-purple mb-3">
          Football · Carrières
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Reconnais le joueur à sa carrière.
        </h1>
        <p className="text-text-secondary text-base md:text-lg mt-4">
          Le parcours club par club est sous tes yeux. Moins d&apos;indices, plus de points.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Link href="/play" className="flex-1">
          <motion.span
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            transition={springSnappy}
            className="block text-center rounded-lg bg-purple text-white font-semibold py-3.5 px-6 hover:bg-purple-dark transition-colors"
          >
            Jouer
          </motion.span>
        </Link>
        <Link href="/daily" className="flex-1">
          <motion.span
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2, borderColor: "var(--color-purple)" }}
            transition={springSnappy}
            className="block text-center rounded-lg border border-border font-semibold py-3.5 px-6 hover:border-purple/50 hover:text-purple transition-colors"
          >
            Daily
          </motion.span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-8 sm:gap-12 text-center"
      >
        {stats.map((s, i) => (
          <div key={s.key} className="flex items-center gap-8 sm:gap-12">
            {i > 0 && <div className="w-px h-8 bg-border" aria-hidden />}
            <div>
              <p className="text-2xl font-extrabold tabular-nums">{values[s.key]}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
