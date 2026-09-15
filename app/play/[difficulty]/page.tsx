"use client";

import { use, useMemo, useState } from "react";
import { Difficulty } from "@/lib/types";
import { getPlayersByDifficulty } from "@/data/players";
import { DIFFICULTY_LABELS } from "@/lib/game";
import GameHeader from "@/components/GameHeader";
import GuessRound, { RoundResult } from "@/components/GuessRound";
import SessionEnd from "@/components/SessionEnd";
import { useGameStore } from "@/lib/store";

const SESSION_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ClassicSession({
  params,
}: {
  params: Promise<{ difficulty: Difficulty }>;
}) {
  const { difficulty } = use(params);
  const recordSession = useGameStore((s) => s.recordSession);

  const sessionPlayers = useMemo(() => {
    const pool = getPlayersByDifficulty(difficulty);
    return shuffle(pool).slice(0, Math.min(SESSION_SIZE, pool.length));
  }, [difficulty]);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);

  if (sessionPlayers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center text-text-secondary">
        Aucun joueur disponible pour cette difficulté.
      </div>
    );
  }

  const totalCount = sessionPlayers.length;
  const score = results.reduce((sum, r) => sum + r.points, 0);

  function handleResult(result: RoundResult) {
    const newResults = [...results, result];
    setResults(newResults);
    const newStreak = result.found ? streak + 1 : 0;
    setStreak(newStreak);
    const newBest = Math.max(bestStreak, newStreak);
    setBestStreak(newBest);

    if (index + 1 >= totalCount) {
      const correctCount = newResults.filter((r) => r.found).length;
      const totalPoints = newResults.reduce((s, r) => s + r.points, 0);
      recordSession(
        {
          score: correctCount,
          totalPoints,
          bestStreak: newBest,
          averageTimeSec: Math.round(
            newResults.reduce((s, r) => s + r.timeSec, 0) / newResults.length
          ),
          difficulty,
        },
        correctCount,
        totalCount
      );
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  if (done) {
    const correctCount = results.filter((r) => r.found).length;
    const totalPoints = results.reduce((s, r) => s + r.points, 0);
    const averageTimeSec = Math.round(
      results.reduce((s, r) => s + r.timeSec, 0) / results.length
    );
    return (
      <SessionEnd
        correctCount={correctCount}
        totalCount={totalCount}
        totalPoints={totalPoints}
        bestStreak={bestStreak}
        averageTimeSec={averageTimeSec}
        replayHref={`/play/${difficulty}`}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <GameHeader
        levelLabel={DIFFICULTY_LABELS[difficulty]}
        questionIndex={index + 1}
        totalQuestions={totalCount}
        score={score}
        streak={streak}
      />
      <GuessRound
        key={sessionPlayers[index].id}
        player={sessionPlayers[index]}
        difficulty={difficulty}
        onResult={handleResult}
      />
    </div>
  );
}
