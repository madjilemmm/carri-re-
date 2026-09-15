"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getDailyPlayer, getDailyIndex } from "@/data/players";
import GuessRound, { RoundResult } from "@/components/GuessRound";
import { useGameStore, todayKey } from "@/lib/store";

export default function DailyMode() {
  const player = useMemo(() => getDailyPlayer(), []);
  const dailyIndex = useMemo(() => getDailyIndex(new Date()), []);
  const dateKey = todayKey();

  const dailyResults = useGameStore((s) => s.dailyResults);
  const recordDaily = useGameStore((s) => s.recordDaily);
  const dailyStreak = useGameStore((s) => s.dailyStreak);

  const alreadyPlayed = dailyResults.find((d) => d.dateKey === dateKey);
  const [result, setResult] = useState<RoundResult | null>(null);

  function handleResult(r: RoundResult) {
    setResult(r);
    recordDaily({ index: dailyIndex, found: r.found, hintsUsed: r.hintsUsed, dateKey });
  }

  const finalResult = result ?? (alreadyPlayed
    ? { found: alreadyPlayed.found, hintsUsed: alreadyPlayed.hintsUsed, points: 0, timeSec: 0 }
    : null);

  if (finalResult) {
    const foundLabel =
      finalResult.hintsUsed === 0
        ? "Trouvé sans indice"
        : `Trouvé avec ${finalResult.hintsUsed} indice${finalResult.hintsUsed > 1 ? "s" : ""}`;
    const gridSize = Math.max(finalResult.hintsUsed, 4) + 1;
    const grid = Array.from({ length: gridSize })
      .map((_, i) => (i <= finalResult.hintsUsed ? "■" : "□"))
      .join("");
    const shareText = `Carrière #${dailyIndex}\n${
      finalResult.found ? foundLabel : "Non trouvé"
    }\n${grid}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center"
      >
        <div className="max-w-sm w-full">
          <p className="text-text-secondary text-sm font-medium">Career #{dailyIndex}</p>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            {finalResult.found ? "Bien joué !" : "Raté aujourd'hui"}
          </h1>
          <p className="text-text-secondary mt-2">
            {finalResult.found ? foundLabel : "Reviens demain pour une nouvelle carrière."}
          </p>
          <p className="text-2xl tracking-[0.3em] mt-6 text-purple">{grid}</p>
          <p className="text-sm text-text-secondary mt-4">
            Série quotidienne : <span className="font-semibold text-text-primary">{dailyStreak}</span>
          </p>
          <motion.button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareText)}
            whileTap={{ scale: 0.97 }}
            className="mt-8 rounded-lg border border-border font-semibold px-6 py-3 hover:border-purple/40 transition-colors"
          >
            Copier le résultat
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-4 md:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <span className="font-bold">Carrière<span className="text-purple">.</span> Daily</span>
          <span className="text-text-secondary tabular-nums">Career #{dailyIndex}</span>
        </div>
      </div>
      <GuessRound
        key={player.id}
        player={player}
        difficulty={player.difficulty}
        onResult={handleResult}
      />
    </div>
  );
}
