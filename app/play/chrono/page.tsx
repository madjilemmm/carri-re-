"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { players as allPlayers } from "@/data/players";
import GuessRound, { RoundResult } from "@/components/GuessRound";
import SessionEnd from "@/components/SessionEnd";
import { springSnappy } from "@/lib/motion";

const DURATION = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ChronoMode() {
  const pool = useMemo(() => shuffle(allPlayers), []);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const done = started && timeLeft <= 0;

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, done]);

  function handleResult(result: RoundResult) {
    setResults((r) => [...r, result]);
    setIndex((i) => (i + 1) % pool.length);
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6"
      >
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-purple">
          60 secondes
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Mode Chrono</h1>
        <p className="text-text-secondary max-w-sm">
          Devine un maximum de joueurs avant la fin du chrono. Chaque bonne
          réponse rapporte des points, les indices en coûtent.
        </p>
        <motion.button
          type="button"
          onClick={() => setStarted(true)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -2 }}
          transition={springSnappy}
          className="rounded-lg bg-purple text-white font-semibold px-8 py-3.5 hover:bg-purple-dark transition-colors"
        >
          Démarrer
        </motion.button>
      </motion.div>
    );
  }

  if (done) {
    const correctCount = results.filter((r) => r.found).length;
    const totalPoints = results.reduce((s, r) => s + r.points, 0);
    const avg = results.length
      ? Math.round(results.reduce((s, r) => s + r.timeSec, 0) / results.length)
      : 0;
    return (
      <SessionEnd
        correctCount={correctCount}
        totalCount={results.length || 1}
        totalPoints={totalPoints}
        bestStreak={correctCount}
        averageTimeSec={avg}
        replayHref="/play/chrono"
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-4 md:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <span className="font-bold">Carrière<span className="text-purple">.</span> Chrono</span>
          <motion.span
            key={timeLeft <= 10 ? "urgent" : "normal"}
            animate={timeLeft <= 10 ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`font-semibold tabular-nums ${timeLeft <= 10 ? "text-error" : ""}`}
          >
            {timeLeft}s
          </motion.span>
        </div>
        <div className="max-w-3xl mx-auto mt-2 h-1 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? "bg-error" : "bg-purple"}`}
            style={{ width: `${(timeLeft / DURATION) * 100}%` }}
          />
        </div>
      </div>
      <GuessRound
        key={`${pool[index].id}-${index}`}
        player={pool[index]}
        difficulty={pool[index].difficulty}
        onResult={handleResult}
      />
    </div>
  );
}
