"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Player, Difficulty } from "@/lib/types";
import CareerTimeline from "@/components/CareerTimeline";
import PlayerSearch from "@/components/PlayerSearch";
import {
  computeScore,
  EXTRA_HINT_ORDER,
  extraHintLabel,
  extraHintValue,
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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct" | "revealed">("playing");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);

  const cap = maxHints ?? player.career.length - 1 + EXTRA_HINT_ORDER.length;

  const revealedSteps = Math.min(1 + hintsUsed, player.career.length);
  const extraRevealedCount = Math.max(0, Math.min(hintsUsed - (player.career.length - 1), EXTRA_HINT_ORDER.length));

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
      if (nextHints >= cap) {
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
            {revealedSteps} / {player.career.length} clubs révélés · score potentiel{" "}
            <span className="text-purple font-semibold">{potentialScore}</span>
          </p>
        </div>

        <CareerTimeline career={player.career} revealedCount={revealedSteps} />

        {extraRevealedCount > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {EXTRA_HINT_ORDER.slice(0, extraRevealedCount).map((type) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs border border-border rounded-full px-3 py-1.5 bg-surface"
              >
                <span className="text-text-secondary">{extraHintLabel(type)}: </span>
                <span className="font-semibold">{extraHintValue(player, type)}</span>
              </motion.div>
            ))}
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
                  Trouvé en {hintsUsed + 1} indice{hintsUsed + 1 > 1 ? "s" : ""}
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
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg bg-purple text-white font-semibold px-8 py-3.5 hover:bg-purple-dark transition-colors"
              autoFocus
            >
              Joueur suivant
            </button>
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
              <button
                type="button"
                onClick={handleHintRequest}
                disabled={hintsUsed >= cap}
                className="shrink-0 rounded-lg border border-border px-4 py-3.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-purple/40 disabled:opacity-40 disabled:hover:border-border"
              >
                Indice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
