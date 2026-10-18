import type { FiveCrownsGame } from '../../types';
import { FIVE_CROWNS_RANKS } from '../../games';
import { RoundHeader, ScoreInput } from './shared';

interface Props {
  game: FiveCrownsGame;
  update: (fn: (g: FiveCrownsGame) => FiveCrownsGame) => void;
}

export default function FiveCrownsCard({ game, update }: Props) {
  const setScore = (roundIdx: number, playerId: string, value: number | null) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) =>
        i === roundIdx ? { ...r, scores: { ...r.scores, [playerId]: value } } : r,
      ),
    }));

  const addRound = () =>
    update((g) => ({ ...g, rounds: [...g.rounds, { scores: {} }] }));

  const deleteRound = (idx: number) =>
    update((g) => ({ ...g, rounds: g.rounds.filter((_, i) => i !== idx) }));

  const total = (playerId: string) =>
    game.rounds.reduce((acc, r) => acc + (r.scores[playerId] ?? 0), 0);

  return (
    <section className="card">
      <div className="table-scroll">
        <table className="score-table">
          <thead>
            <tr>
              <th className="player-col">Player</th>
              {game.rounds.map((_, i) => (
                <RoundHeader
                  key={i}
                  index={i + 1}
                  label={
                    FIVE_CROWNS_RANKS[i]
                      ? `R${i + 1} · ${FIVE_CROWNS_RANKS[i]}s`
                      : `R${i + 1}`
                  }
                  onDelete={() => deleteRound(i)}
                />
              ))}
              <th className="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map((p) => (
              <tr key={p.id}>
                <th className="player-col" scope="row">
                  <span className="player-name">{p.name}</span>
                </th>
                {game.rounds.map((r, i) => (
                  <td key={i} className="round-col">
                    <ScoreInput
                      value={r.scores[p.id] ?? null}
                      onChange={(v) => setScore(i, p.id, v)}
                      ariaLabel={`${p.name}, round ${i + 1} score`}
                    />
                  </td>
                ))}
                <td className="total-col">{total(p.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-actions">
        <button className="btn primary" onClick={addRound}>
          + Add round
        </button>
        <p className="muted small-note">
          The round header shows the wild rank for that round (wild = cards
          dealt). Leftover points: numbers face value, J=11, Q=12, K=13, wild
          card = 20, Joker = 50.
        </p>
      </div>
    </section>
  );
}
