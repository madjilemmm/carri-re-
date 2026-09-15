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
        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-purple"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
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
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex-1 text-center py-3 text-xs font-medium ${
              pathname === l.href ? "text-purple" : "text-text-secondary"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="md:hidden h-14" aria-hidden />
    </>
  );
}
