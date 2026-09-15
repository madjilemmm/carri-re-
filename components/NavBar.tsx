"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/daily", label: "Daily" },
  { href: "/play", label: "Jouer" },
  { href: "/leaderboard", label: "Classement" },
  { href: "/profile", label: "Profil" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-border">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Carrière<span className="text-purple">.</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  active
                    ? "text-purple"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[21px] h-[2px] bg-purple rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-border">
        <Link href="/" className="text-base font-extrabold tracking-tight">
          Carrière<span className="text-purple">.</span>
        </Link>
      </header>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navigation principale"
      >
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 flex items-center justify-center min-h-[48px] text-center py-3 text-xs font-medium transition-colors ${
                active ? "text-purple" : "text-text-secondary"
              }`}
            >
              <span className={`inline-block ${active ? "font-semibold" : ""}`}>{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div
        className="md:hidden shrink-0"
        style={{ height: "calc(48px + env(safe-area-inset-bottom))" }}
        aria-hidden
      />
    </>
  );
}
