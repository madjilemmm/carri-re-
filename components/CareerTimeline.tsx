"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CareerStep } from "@/lib/types";
import ClubBadge from "@/components/ClubBadge";

const transferLabels: Record<string, string> = {
  transfert: "Transfert",
  prêt: "Prêt",
  libre: "Libre",
  formation: "Formation",
};

export default function CareerTimeline({
  career,
  revealedCount,
}: {
  career: CareerStep[];
  revealedCount: number;
}) {
  return (
    <ol className="flex flex-col gap-0 md:flex-row md:gap-3 md:overflow-x-auto no-scrollbar">
      {career.map((step, i) => {
        const revealed = i < revealedCount;
        return (
          <li key={i} className="flex md:flex-col items-stretch">
            <div className="flex md:flex-col items-center gap-3 md:gap-2 py-3 md:py-0 md:min-w-[128px]">
              <div className="flex flex-col items-center gap-2 md:w-full">
                <ClubBadge label={step.clubShort} revealed={revealed} />
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-center hidden md:block"
                    >
                      <p className="text-xs font-semibold leading-tight">{step.club}</p>
                      <p className="text-[11px] text-text-secondary">
                        {step.startYear}–{step.endYear ?? "auj."}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-center hidden md:block">
                      <p className="text-xs font-semibold text-text-secondary">???</p>
                      <p className="text-[11px] text-text-secondary">—</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 md:hidden">
                {revealed ? (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-sm font-semibold leading-tight">{step.club}</p>
                    <p className="text-xs text-text-secondary">
                      {step.startYear}–{step.endYear ?? "auj."} · {transferLabels[step.transferType]} · {step.league}
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-text-secondary">Club inconnu</p>
                    <p className="text-xs text-text-secondary">—</p>
                  </div>
                )}
              </div>
            </div>
            {i < career.length - 1 && (
              <div className="hidden md:flex items-center px-1 text-text-secondary">→</div>
            )}
            {i < career.length - 1 && <div className="md:hidden border-b border-border ml-[22px]" />}
          </li>
        );
      })}
    </ol>
  );
}
