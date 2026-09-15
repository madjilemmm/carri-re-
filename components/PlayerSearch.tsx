"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@/lib/types";
import { searchPlayers } from "@/lib/search";
import { players as allPlayers } from "@/data/players";

export default function PlayerSearch({
  onGuess,
  disabled,
  excludeIds = [],
}: {
  onGuess: (player: Player) => void;
  disabled?: boolean;
  excludeIds?: string[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pool = useMemo(
    () => allPlayers.filter((p) => !excludeIds.includes(p.id)),
    [excludeIds]
  );

  const results = useMemo(() => searchPlayers(query, pool, 6), [query, pool]);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
    setOpen(true);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submitGuess(player: Player) {
    onGuess(player);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitGuess(results[activeIndex].player);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute bottom-full mb-2 left-0 right-0 bg-surface border border-border rounded-lg shadow-none overflow-hidden max-h-72 overflow-y-auto z-30"
        >
          {results.map((r, i) => (
            <li key={r.player.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  submitGuess(r.player);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-b-0 ${
                  i === activeIndex ? "bg-purple/10" : ""
                }`}
              >
                <div className="w-9 h-9 shrink-0 rounded-full border border-border bg-background flex items-center justify-center text-xs font-bold">
                  {r.player.knownAs
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{r.player.knownAs}</p>
                  <p className="text-xs text-text-secondary truncate">
                    {r.player.nationality} · {r.player.position}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={disabled}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Rechercher un joueur…"
        aria-label="Rechercher un joueur"
        aria-autocomplete="list"
        className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-base placeholder:text-text-secondary disabled:opacity-50 focus:border-purple"
      />
    </div>
  );
}
