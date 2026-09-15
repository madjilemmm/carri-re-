"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Difficulty } from "@/lib/types";
import { DIFFICULTY_LABELS, DIFFICULTY_DESCRIPTIONS } from "@/lib/game";
import { getPlayersByDifficulty } from "@/data/players";
import { randomSeed } from "@/lib/random";
import { springSnappy } from "@/lib/motion";

const difficulties: Difficulty[] = ["facile", "normal", "difficile", "expert"];

export default function PlaySelect() {
  const router = useRouter();

  function startSession(d: Difficulty) {
    router.push(`/play/${d}?seed=${randomSeed()}`);
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-14">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
          Choisis ta difficulté
        </h1>
        <p className="text-text-secondary text-center mt-2 mb-10">
          10 joueurs par session. Moins d&apos;indices, plus de points.
        </p>

        <ul className="flex flex-col gap-3">
          {difficulties.map((d, i) => (
            <motion.li
              key={d}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                type="button"
                onClick={() => startSession(d)}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2, borderColor: "var(--color-purple)" }}
                transition={springSnappy}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 hover:bg-purple/[0.03] transition-colors group text-left"
              >
                <div>
                  <p className="font-semibold text-lg">{DIFFICULTY_LABELS[d]}</p>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {DIFFICULTY_DESCRIPTIONS[d]}
                  </p>
                </div>
                <span className="text-text-secondary group-hover:text-purple group-hover:translate-x-0.5 transition-all text-sm shrink-0 ml-4 tabular-nums">
                  {getPlayersByDifficulty(d).length} joueurs →
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/play/chrono"
            className="text-sm font-medium text-text-secondary hover:text-purple transition-colors"
          >
            Mode Chrono (60 secondes) →
          </Link>
        </div>
      </div>
    </div>
  );
}
