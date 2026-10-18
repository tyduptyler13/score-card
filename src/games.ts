import type {
  Game,
  GameSetup,
  GameType,
  Phase10Game,
  Player,
  Standing,
} from './types';

export const PHASES = [
  'Two sets of 3',
  'One set of 3 + one run of 4',
  'One set of 4 + one run of 4',
  'One run of 7',
  'One run of 8',
  'One run of 9',
  'Two sets of 4',
  'Seven cards of one color',
  'One set of 5 + one set of 2',
  'One set of 5 + one set of 3',
];

export const PHASE_EXAMPLES = [
  '5-5-5 and 9-9-9',
  '7-7-7 and 2-3-4-5',
  '6-6-6-6 and 8-9-10-11',
  '2-3-4-5-6-7-8',
  '1-2-3-4-5-6-7-8',
  '3-4-5-6-7-8-9-10-11',
  '4-4-4-4 and 10-10-10-10',
  'Seven red cards',
  '3-3-3-3-3 and 8-8',
  '2-2-2-2-2 and 11-11-11',
];

export const FIVE_CROWNS_ROUNDS = 11;
export const FIVE_CROWNS_RANKS = [
  '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
];

export const GAME_TYPE_INFO: Record<
  GameType,
  { name: string; blurb: string; rules: string[] }
> = {
  phase10: {
    name: 'Phase 10',
    blurb: 'Complete the 10 phases while keeping your leftover-card points low.',
    rules: [
      'Each round, mark whether each player completed their current phase (a failed phase means they stay on it next round).',
      'Enter the round penalty: points for cards left in hand.',
      'Card values: 1–9 face value, 10 & J = 10, Q & K = 20, Wild = 25, Skip = 15.',
      'The game ends once a player finishes Phase 10; lowest total points wins.',
    ],
  },
  fivecrowns: {
    name: 'Five Crowns',
    blurb: 'Eleven rounds of rummy-style sets and runs — lowest score wins.',
    rules: [
      'Play 11 rounds: round 1 deals 3 cards (3s wild), round 2 deals 4 cards (4s wild), all the way to round 11 with 13 cards (Kings go wild). Whatever your hand size is, that rank is wild.',
      'Jokers are always wild. A wild card left in your hand scores 20 points; a Joker scores 50.',
      'After each round, enter the points left in hand: numbers face value, J = 11, Q = 12, K = 13.',
      'Runs and books must be 3+ cards. Lowest total after 11 rounds wins.',
    ],
  },
  golf: {
    name: 'Golf',
    blurb: 'Card values per hole — lowest cumulative score wins.',
    rules: [
      'Pick a 9-hole or 18-hole game.',
      'Classic 6-card golf: a 2×3 grid per player; matching pairs in a column cancel for 0.',
      'Card values: A = -1, 2–10 face value, J & Q = 10, K = 25.',
      'Enter each player’s hole score (negative for aces!). Lowest total after all holes wins.',
    ],
  },
  custom: {
    name: 'Win Conditions',
    blurb: 'Agree on win conditions before the game starts — plain statements, no scoring.',
    rules: [
      'During setup, write the statements that decide who wins (e.g. "First to 5 wins", "Must win by 2") and assign each one to a player.',
      'The list is shown on the scorecard so everyone can check it during the game.',
      'No scores or rounds are tracked here — edit a statement any time if the table agrees to change it.',
    ],
  },
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createGame(type: GameType, setup: GameSetup): Game {
  const players: Player[] = [];
  const idByRawIdx: (string | null)[] = setup.names.map((raw) => {
    const name = raw.trim();
    if (!name) return null;
    const player: Player = { id: uid(), name };
    players.push(player);
    return player.id;
  });
  const now = Date.now();
  const base = { id: uid(), players, createdAt: now, updatedAt: now };
  switch (type) {
    case 'phase10':
      return { ...base, type, rounds: [] };
    case 'fivecrowns':
      return { ...base, type, rounds: [] };
    case 'golf':
      return {
        ...base,
        type,
        holes: Array.from({ length: setup.holeCount }, () => ({})),
        holeCount: setup.holeCount,
      };
    case 'custom': {
      const firstId =
        idByRawIdx.find((id): id is string => id != null) ?? null;
      return {
        ...base,
        type,
        conditions: setup.conditions.map((c) => ({
          playerId: idByRawIdx[c.playerIdx] ?? firstId,
          text: c.text,
        })),
      };
    }
  }
}

export function phaseOf(game: Phase10Game, playerId: string): number {
  let completed = 0;
  for (const round of game.rounds) {
    if (round.phaseCompleted.includes(playerId)) completed += 1;
  }
  return Math.min(completed + 1, 10);
}

export function standings(game: Game): Standing[] {
  if (game.type === 'custom') return [];
  return game.players.map((player) => {
    switch (game.type) {
      case 'phase10': {
        const value = game.rounds.reduce(
          (acc, r) => acc + (r.scores[player.id] ?? 0),
          0,
        );
        const completed = game.rounds.filter((r) =>
          r.phaseCompleted.includes(player.id),
        ).length;
        return {
          playerId: player.id,
          value,
          detail: completed >= 10 ? 'Phase 10 done' : `Phase ${completed + 1}`,
          finished: completed >= 10,
        };
      }
      case 'fivecrowns': {
        const scored = game.rounds.filter(
          (r) => r.scores[player.id] != null,
        ).length;
        return {
          playerId: player.id,
          value: game.rounds.reduce(
            (acc, r) => acc + (r.scores[player.id] ?? 0),
            0,
          ),
          detail: `${scored}/${FIVE_CROWNS_ROUNDS} rounds`,
          finished:
            scored >= FIVE_CROWNS_ROUNDS && scored >= game.rounds.length,
        };
      }
      case 'golf': {
        const scored = game.holes.filter((h) => h[player.id] != null).length;
        return {
          playerId: player.id,
          value: game.holes.reduce((acc, h) => acc + (h[player.id] ?? 0), 0),
          detail: `${scored}/${game.holeCount} holes`,
          finished: scored >= game.holeCount,
        };
      }
    }
  });
}

export function sortedStandings(game: Game): Standing[] {
  const list = standings(game);
  return list.sort(
    (a, b) => a.value - b.value || a.playerId.localeCompare(b.playerId),
  );
}

function hasAnyScore(game: Game): boolean {
  switch (game.type) {
    case 'phase10':
      return game.rounds.some((r) => Object.values(r.scores).some((v) => v != null));
    case 'fivecrowns':
      return game.rounds.some((r) => Object.values(r.scores).some((v) => v != null));
    case 'golf':
      return game.holes.some((h) => Object.values(h).some((v) => v != null));
    case 'custom':
      return false;
  }
}

export function winnerIds(game: Game): string[] | null {
  if (game.type === 'custom') return null;
  if (!hasAnyScore(game)) return null;
  const list = standings(game);
  const anyFinished = list.some((s) => s.finished);
  const allFinished = list.every((s) => s.finished);
  const ready =
    game.type === 'phase10' ? anyFinished : allFinished;
  if (!ready) return null;
  const min = Math.min(...list.map((s) => s.value));
  return list.filter((s) => s.value === min).map((s) => s.playerId);
}

export function playerName(game: Game, playerId: string): string {
  return game.players.find((p) => p.id === playerId)?.name ?? 'Unknown';
}

export function summary(game: Game): string {
  if (game.type === 'custom') {
    const n = game.conditions.filter((c) => c.text.trim()).length;
    return n === 0
      ? 'No win conditions yet'
      : `${n} win ${n === 1 ? 'condition' : 'conditions'}`;
  }
  if (!hasAnyScore(game)) return 'No scores yet';
  const list = sortedStandings(game);
  const top = list[0];
  const name = playerName(game, top.playerId);
  const tie = list.filter((s) => s.value === top.value).length > 1;
  if (game.type === 'phase10') {
    return tie ? `Tied at ${top.value} pts` : `${name} leads with ${top.value} pts`;
  }
  return tie ? `Tied at ${top.value}` : `${name} leads with ${top.value}`;
}
