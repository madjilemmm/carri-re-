"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Difficulty } from "@/lib/types";
import { getPlayersByDifficulty } from "@/data/players";
import { DIFFICULTY_LABELS } from "@/lib/game";
import GameHeader from "@/components/GameHeader";
import GuessRound, { RoundResult } from "@/components/GuessRound";
import SessionEnd from "@/components/SessionEnd";
import { useGameStore } from "@/lib/store";
import { randomSeed } from "@/lib/random";

const SESSION_SIZE = 10;

// Deterministic PRNG so the shuffle produces identical output on the
// server-rendered HTML and the client hydration pass (avoids a
// hydration mismatch that a Math.random()-based shuffle would cause).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ClassicSession({
  params,
  searchParams,
}: {
  params: Promise<{ difficulty: Difficulty }>;
  searchParams: Promise<{ seed?: string }>;
}) {
  const { difficulty } = use(params);
  const { seed: seedParam } = use(searchParams);
  const router = useRouter();
  const recordSession = useGameStore((s) => s.recordSession);

  // Falls back to a fixed seed (e.g. a hard refresh with no ?seed=) so
  // server and client always agree, at the cost of losing randomness
  // only in that edge case.
  const seed = seedParam ? Number(seedParam) : 1;

  const sessionPlayers = seededShuffle(getPlayersByDifficulty(difficulty), seed).slice(
    0,
    Math.min(SESSION_SIZE, getPlayersByDifficulty(difficulty).length)
  );

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);

  function replay() {
    router.push(`/play/${difficulty}?seed=${randomSeed()}`);
    setIndex(0);
    setResults([]);
    setStreak(0);
    setBestStreak(0);
    setDone(false);
  }

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
        onReplay={replay}
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
