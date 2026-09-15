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
  showYears = true,
}: {
  career: CareerStep[];
  showYears?: boolean;
}) {
  return (
    <ol className="flex flex-col gap-0 md:flex-row md:gap-0 md:overflow-x-auto no-scrollbar">
      {career.map((step, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="flex md:flex-col items-stretch"
        >
          <div className="flex md:flex-col items-center gap-3 md:gap-2.5 py-3 md:py-0 md:min-w-[132px]">
            <div className="flex flex-col items-center gap-2 md:w-full">
              <ClubBadge label={step.clubShort} />
              <div className="text-center hidden md:block w-full min-w-0">
                <p className="text-xs font-semibold leading-tight truncate">{step.club}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={showYears ? "years" : "hidden"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-text-secondary tabular-nums"
                  >
                    {showYears ? `${step.startYear}–${step.endYear ?? "auj."}` : "••••–••••"}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex-1 min-w-0 md:hidden">
              <p className="text-sm font-semibold leading-tight truncate">{step.club}</p>
              <p className="text-xs text-text-secondary truncate">
                {showYears ? `${step.startYear}–${step.endYear ?? "auj."}` : "••••–••••"} ·{" "}
                {transferLabels[step.transferType]} · {step.league}
              </p>
            </div>
          </div>
          {i < career.length - 1 && (
            <div className="hidden md:flex items-center px-1.5 text-border" aria-hidden>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M0 5H18M18 5L13 1M18 5L13 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {i < career.length - 1 && <div className="md:hidden border-b border-border ml-[22px]" />}
        </motion.li>
      ))}
    </ol>
  );
}
