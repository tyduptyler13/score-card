import type { GolfGame } from '../../types';
import { RoundHeader, ScoreInput } from './shared';

interface Props {
  game: GolfGame;
  update: (fn: (g: GolfGame) => GolfGame) => void;
}

export default function GolfCard({ game, update }: Props) {
  const setScore = (holeIdx: number, playerId: string, value: number | null) =>
    update((g) => ({
      ...g,
      holes: g.holes.map((h, i) =>
        i === holeIdx ? { ...h, [playerId]: value } : h,
      ),
    }));

  const total = (playerId: string) =>
    game.holes.reduce((acc, h) => acc + (h[playerId] ?? 0), 0);

  return (
    <section className="card">
      <div className="table-scroll">
        <table className="score-table">
          <thead>
            <tr>
              <th className="player-col">Player</th>
              {game.holes.map((_, i) => (
                <RoundHeader key={i} index={i + 1} label={`H${i + 1}`} />
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
                {game.holes.map((h, i) => (
                  <td key={i} className="round-col">
                    <ScoreInput
                      value={h[p.id] ?? null}
                      onChange={(v) => setScore(i, p.id, v)}
                      ariaLabel={`${p.name}, hole ${i + 1} score`}
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
        <p className="muted small-note">
          {game.holeCount} holes. Card values for reference: A = -1, 2–10 face
          value, J & Q = 10, K = 25, matched pair in a column = 0.
        </p>
      </div>
    </section>
  );
}
