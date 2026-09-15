"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Player, Difficulty } from "@/lib/types";
import CareerTimeline from "@/components/CareerTimeline";
import PlayerSearch from "@/components/PlayerSearch";
import CountUp from "@/components/CountUp";
import { springPop, springSnappy, shakeX } from "@/lib/motion";
import {
  computeScore,
  extraHintLabel,
  extraHintValue,
  hintOrderForDifficulty,
} from "@/lib/game";
import { isCorrectGuess } from "@/lib/search";

export interface RoundResult {
  found: boolean;
  hintsUsed: number;
  points: number;
  timeSec: number;
}

export default function GuessRound({
  player,
  difficulty,
  maxHints,
  onResult,
}: {
  player: Player;
  difficulty: Difficulty;
  maxHints?: number;
  onResult: (result: RoundResult) => void;
}) {
  const hintOrder = useMemo(() => hintOrderForDifficulty(difficulty), [difficulty]);
  const cap = Math.min(maxHints ?? hintOrder.length, hintOrder.length);
  // Minimum wrong guesses tolerated even when no extra hints remain, so a
  // round never ends after a single mistake just because everything visible
  // was already shown upfront (e.g. Facile).
  const maxAttempts = Math.max(cap, 3);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct" | "revealed">("playing");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);

  const revealedHints = hintOrder.slice(0, hintsUsed);
  const yearsRevealed = !hintOrder.includes("years") || revealedHints.includes("years");
  const factHints = revealedHints.filter((h) => h !== "years");

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 1400);
    return () => clearTimeout(t);
  }, [feedback]);

  function finish(found: boolean) {
    setStatus(found ? "correct" : "revealed");
  }

  function handleContinue() {
    const timeSec = Math.round((Date.now() - startTime) / 1000);
    const found = status === "correct";
    const points = found ? computeScore(difficulty, hintsUsed) : 0;
    onResult({ found, hintsUsed, points, timeSec });
  }

  function handleGuess(guessed: Player) {
    if (status !== "playing") return;
    if (isCorrectGuess(guessed.fullName, player) || guessed.id === player.id) {
      finish(true);
    } else {
      setWrongGuesses((w) => [guessed.knownAs, ...w].slice(0, 3));
      setFeedback("Pas lui.");
      setShakeKey((k) => k + 1);
      const nextHints = Math.min(hintsUsed + 1, cap);
      setHintsUsed(nextHints);
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      if (nextWrong >= maxAttempts) {
        setTimeout(() => finish(false), 900);
      }
    }
  }

  function handleHintRequest() {
    if (status !== "playing") return;
    if (hintsUsed >= cap) return;
    setHintsUsed((h) => h + 1);
  }

  const potentialScore = useMemo(
    () => computeScore(difficulty, hintsUsed),
    [difficulty, hintsUsed]
  );

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        className="flex-1 flex flex-col gap-6 px-4 md:px-8 py-6 max-w-3xl w-full mx-auto border-2 border-transparent rounded-lg"
        animate={
          status === "correct"
            ? { borderColor: "var(--color-success)" }
            : status === "revealed"
            ? { borderColor: "var(--color-error)" }
            : { borderColor: "transparent" }
        }
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Quel est ce joueur ?
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {hintsUsed} / {cap} indice{cap > 1 ? "s" : ""} utilisé{hintsUsed > 1 ? "s" : ""} · score potentiel{" "}
            <span className="text-purple font-semibold">
              <CountUp value={potentialScore} stiffness={300} damping={24} />
            </span>
          </p>
        </div>

        <motion.div
          animate={
            status === "correct"
              ? { scale: [1, 1.015, 1] }
              : {}
          }
          transition={{ duration: 0.4 }}
        >
          <CareerTimeline career={player.career} showYears={yearsRevealed} />
        </motion.div>

        {factHints.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {factHints.map((type) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={springPop}
                  className="text-xs border border-border rounded-md px-3 py-1.5 bg-surface"
                >
                  <span className="text-text-secondary">{extraHintLabel(type)}: </span>
                  <span className="font-semibold">{extraHintValue(player, type)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="flex-1 flex items-end justify-center">
          <AnimatePresence mode="wait">
            {status === "playing" && feedback && (
              <motion.p
                key={`feedback-${shakeKey}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, x: shakeX.x }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.15 }, y: { duration: 0.15 }, x: shakeX.transition }}
                className="text-error text-sm font-medium"
                role="status"
              >
                {feedback}
              </motion.p>
            )}
            {status === "correct" && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={springPop}
                className="text-center"
                role="status"
              >
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springSnappy, delay: 0.05 }}
                  className="text-success font-bold text-xl"
                >
                  {player.knownAs}
                </motion.p>
                <p className="text-sm text-text-secondary mt-1">
                  {hintsUsed === 0
                    ? "Trouvé sans indice"
                    : `Trouvé avec ${hintsUsed} indice${hintsUsed > 1 ? "s" : ""}`}
                </p>
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, ...springSnappy }}
                  className="text-purple font-semibold mt-1"
                >
                  +<CountUp value={computeScore(difficulty, hintsUsed)} stiffness={260} damping={22} /> pts
                </motion.p>
              </motion.div>
            )}
            {status === "revealed" && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springPop}
                className="text-center"
                role="status"
              >
                <p className="text-error font-bold text-xl">{player.knownAs}</p>
                <p className="text-sm text-text-secondary mt-1">Plus d&apos;indices disponibles</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {status !== "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={springSnappy}
              className="flex justify-center pb-2"
            >
              <motion.button
                type="button"
                onClick={handleContinue}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
                transition={springSnappy}
                className="rounded-lg bg-purple text-white font-semibold px-8 py-3.5 hover:bg-purple-dark transition-colors"
                autoFocus
              >
                Joueur suivant
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {status === "playing" && (
        <div
          className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] md:relative md:bottom-auto border-t border-border bg-background px-4 md:px-8 pt-4 z-20"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-3xl w-full mx-auto flex flex-col gap-3">
            {wrongGuesses.length > 0 && (
              <p className="text-xs text-text-secondary text-center">
                Essais: {wrongGuesses.join(", ")}
              </p>
            )}
            <div className="flex gap-2">
              <PlayerSearch onGuess={handleGuess} shakeSignal={shakeKey} />
              <motion.button
                type="button"
                onClick={handleHintRequest}
                disabled={hintsUsed >= cap}
                whileTap={{ scale: 0.93 }}
                whileHover={hintsUsed >= cap ? {} : { y: -2, borderColor: "var(--color-purple)" }}
                transition={springSnappy}
                className="shrink-0 rounded-lg border border-border px-4 py-3.5 text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
              >
                Indice
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
