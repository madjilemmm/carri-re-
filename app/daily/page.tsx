"use client";

import { useMemo, useState } from "react";
import { getDailyPlayer, getDailyIndex } from "@/data/players";
import GuessRound, { RoundResult } from "@/components/GuessRound";
import { useGameStore, todayKey } from "@/lib/store";

const MAX_HINTS = 5;

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
    const grid = Array.from({ length: MAX_HINTS })
      .map((_, i) => (i < finalResult.hintsUsed + 1 ? (finalResult.found ? "■" : "■") : "□"))
      .join("");
    const shareText = `Carrière #${dailyIndex}\n${
      finalResult.found ? `Trouvé en ${finalResult.hintsUsed + 1} indice${finalResult.hintsUsed + 1 > 1 ? "s" : ""}` : "Non trouvé"
    }\n${grid}`;

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="max-w-sm w-full">
          <p className="text-text-secondary text-sm">Career #{dailyIndex}</p>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            {finalResult.found ? "Bien joué !" : "Raté aujourd'hui"}
          </h1>
          <p className="text-text-secondary mt-2">
            {finalResult.found
              ? `Trouvé en ${finalResult.hintsUsed + 1} indice${finalResult.hintsUsed + 1 > 1 ? "s" : ""}`
              : "Reviens demain pour une nouvelle carrière."}
          </p>
          <p className="text-2xl tracking-widest mt-6">{grid}</p>
          <p className="text-sm text-text-secondary mt-4">Série quotidienne : {dailyStreak}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareText)}
            className="mt-8 rounded-lg border border-border font-semibold px-6 py-3 hover:border-purple/40 transition-colors"
          >
            Copier le résultat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-4 md:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <span className="font-bold">Daily</span>
          <span className="text-text-secondary">Career #{dailyIndex}</span>
        </div>
      </div>
      <GuessRound
        key={player.id}
        player={player}
        difficulty={player.difficulty}
        maxHints={MAX_HINTS}
        onResult={handleResult}
      />
    </div>
  );
}
