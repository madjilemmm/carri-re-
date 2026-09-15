"use client";

import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/components/CountUp";
import { springSoft, springPop } from "@/lib/motion";

export default function GameHeader({
  levelLabel,
  questionIndex,
  totalQuestions,
  score,
  streak,
}: {
  levelLabel: string;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
}) {
  const progress = (questionIndex / totalQuestions) * 100;
  return (
    <div className="border-b border-border px-4 md:px-8 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold">Carrière<span className="text-purple">.</span></span>
          <span className="text-text-secondary hidden sm:inline">{levelLabel}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary tabular-nums">
            {questionIndex}/{totalQuestions}
          </span>
          <span className="font-semibold tabular-nums">
            <CountUp value={score} suffix=" pts" />
          </span>
          <AnimatePresence>
            {streak > 1 && (
              <motion.span
                key="streak"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={springPop}
                className="text-purple font-semibold tabular-nums inline-block"
              >
                <motion.span
                  key={streak}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={springPop}
                  className="inline-block"
                >
                  Série {streak}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-2 h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={springSoft}
        />
      </div>
    </div>
  );
}
