"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/store";

export default function Home() {
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const bestStreakEver = useGameStore((s) => s.bestStreakEver);
  const currentStreak = useGameStore((s) => s.currentStreak);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-10">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Reconnais le joueur à sa carrière.
        </h1>
        <p className="text-text-secondary text-base md:text-lg mt-4">
          Moins d&apos;indices. Plus de points.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/play"
          className="flex-1 text-center rounded-lg bg-purple text-white font-semibold py-3.5 px-6 hover:bg-purple-dark transition-colors"
        >
          Jouer
        </Link>
        <Link
          href="/daily"
          className="flex-1 text-center rounded-lg border border-border font-semibold py-3.5 px-6 hover:border-purple/40 transition-colors"
        >
          Daily
        </Link>
      </div>

      <div className="flex gap-8 text-center">
        <div>
          <p className="text-2xl font-extrabold">{currentStreak}</p>
          <p className="text-xs text-text-secondary mt-1">Série en cours</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-2xl font-extrabold">{bestStreakEver}</p>
          <p className="text-xs text-text-secondary mt-1">Meilleure série</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-2xl font-extrabold">{gamesPlayed}</p>
          <p className="text-xs text-text-secondary mt-1">Parties jouées</p>
        </div>
      </div>
    </div>
  );
}
