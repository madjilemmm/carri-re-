import { Player } from "@/lib/types";

export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[n];
}

function matchScore(query: string, candidate: string): number {
  const q = normalize(query);
  const c = normalize(candidate);
  if (!q) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 90;
  if (c.includes(q)) return 75;
  // token-level partial match
  const tokens = c.split(" ");
  for (const t of tokens) {
    if (t.startsWith(q)) return 70;
  }
  const dist = levenshtein(q, c);
  const maxLen = Math.max(q.length, c.length);
  const similarity = 1 - dist / maxLen;
  if (similarity > 0.6) return Math.round(similarity * 60);
  return 0;
}

export interface SearchResult {
  player: Player;
  score: number;
}

export function searchPlayers(query: string, pool: Player[], limit = 6): SearchResult[] {
  const q = query.trim();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const player of pool) {
    const candidates = [player.fullName, player.knownAs, ...player.aliases];
    let best = 0;
    for (const cand of candidates) {
      const s = matchScore(q, cand);
      if (s > best) best = s;
    }
    if (best > 0) results.push({ player, score: best });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function isCorrectGuess(query: string, player: Player): boolean {
  const candidates = [player.fullName, player.knownAs, ...player.aliases];
  const q = normalize(query);
  return candidates.some((c) => normalize(c) === q);
}
