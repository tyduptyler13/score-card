import type { Game } from './types';

const KEY = 'score-card.games.v1';

export function loadGames(): Game[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const games = parsed.filter(
      (g): g is Game =>
        !!g &&
        typeof g === 'object' &&
        'id' in g &&
        'type' in g &&
        Array.isArray((g as Game).players),
    );
    return games.map((g) => {
      if (g.type === 'custom') {
        if (!Array.isArray(g.conditions)) return { ...g, conditions: [] };
        const fixed = g.conditions.map((c: any) => ({
          playerId: typeof c.playerId === 'string' ? c.playerId : null,
          text: typeof c.text === 'string' ? c.text : String(c),
        }));
        return { ...g, conditions: fixed };
      }
      return g;
    });
  } catch {
    return [];
  }
}

export function saveGames(games: Game[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(games));
  } catch {
    // storage unavailable; app still works in-session
  }
}
