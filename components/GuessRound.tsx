"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Player, Difficulty } from "@/lib/types";
import CareerTimeline from "@/components/CareerTimeline";
import PlayerSearch from "@/components/PlayerSearch";
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
      <div className="flex-1 flex flex-col gap-6 px-4 md:px-8 py-6 max-w-3xl w-full mx-auto">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Quel est ce joueur ?
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {hintsUsed} / {cap} indice{cap > 1 ? "s" : ""} utilisé{hintsUsed > 1 ? "s" : ""} · score potentiel{" "}
            <span className="text-purple font-semibold">{potentialScore}</span>
          </p>
        </div>

        <CareerTimeline career={player.career} showYears={yearsRevealed} />

        {factHints.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {factHints.map((type) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
          <AnimatePresence>
            {status === "playing" && feedback && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-error text-sm font-medium"
                role="status"
              >
                {feedback}
              </motion.p>
            )}
            {status === "correct" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
                role="status"
              >
                <p className="text-success font-bold text-xl">{player.knownAs}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {hintsUsed === 0
                    ? "Trouvé sans indice"
                    : `Trouvé avec ${hintsUsed} indice${hintsUsed > 1 ? "s" : ""}`}
                </p>
                <p className="text-purple font-semibold mt-1">+{computeScore(difficulty, hintsUsed)} pts</p>
              </motion.div>
            )}
            {status === "revealed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
                role="status"
              >
                <p className="text-error font-bold text-xl">{player.knownAs}</p>
                <p className="text-sm text-text-secondary mt-1">Plus d&apos;indices disponibles</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status !== "playing" && (
          <div className="flex justify-center pb-2">
            <motion.button
              type="button"
              onClick={handleContinue}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg bg-purple text-white font-semibold px-8 py-3.5 hover:bg-purple-dark transition-colors"
              autoFocus
            >
              Joueur suivant
            </motion.button>
          </div>
        )}
      </div>

      {status === "playing" && (
        <div className="sticky bottom-0 md:relative border-t border-border bg-background px-4 md:px-8 py-4">
          <div className="max-w-3xl w-full mx-auto flex flex-col gap-3">
            {wrongGuesses.length > 0 && (
              <p className="text-xs text-text-secondary text-center">
                Essais: {wrongGuesses.join(", ")}
              </p>
            )}
            <div className="flex gap-2">
              <PlayerSearch onGuess={handleGuess} />
              <motion.button
                type="button"
                onClick={handleHintRequest}
                disabled={hintsUsed >= cap}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 rounded-lg border border-border px-4 py-3.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-purple/40 disabled:opacity-40 disabled:hover:border-border transition-colors"
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
