import type { Rummy500Game } from '../../types';
import { rummyRoundNet } from '../../games';
import { RoundHeader, ScoreInput } from './shared';

interface Props {
  game: Rummy500Game;
  update: (fn: (g: Rummy500Game) => Rummy500Game) => void;
}

export default function Rummy500Card({ game, update }: Props) {
  const setMeld = (roundIdx: number, playerId: string, value: number | null) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) =>
        i === roundIdx
          ? { ...r, melds: { ...r.melds, [playerId]: value } }
          : r,
      ),
    }));

  const setHand = (roundIdx: number, playerId: string, value: number | null) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) =>
        i === roundIdx
          ? { ...r, hands: { ...r.hands, [playerId]: value } }
          : r,
      ),
    }));

  const toggleWentOut = (roundIdx: number, playerId: string) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const out = r.wentOut.includes(playerId);
        return {
          ...r,
          wentOut: out
            ? r.wentOut.filter((id) => id !== playerId)
            : [...r.wentOut, playerId],
          hands: out ? r.hands : { ...r.hands, [playerId]: null },
        };
      }),
    }));

  const addRound = () =>
    update((g) => ({
      ...g,
      rounds: [...g.rounds, { melds: {}, hands: {}, wentOut: [] }],
    }));

  const deleteRound = (idx: number) =>
    update((g) => ({ ...g, rounds: g.rounds.filter((_, i) => i !== idx) }));

  const total = (playerId: string) =>
    game.rounds.reduce(
      (acc, r) => acc + (rummyRoundNet(r, playerId) ?? 0),
      0,
    );

  return (
    <section className="card">
      <div className="table-scroll">
        <table className="score-table rummy-table">
          <thead>
            <tr>
              <th className="player-col">Player</th>
              {game.rounds.map((_, i) => (
                <RoundHeader
                  key={i}
                  index={i + 1}
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
                {game.rounds.map((r, i) => {
                  const net = rummyRoundNet(r, p.id);
                  return (
                    <td key={i} className="round-col rummy-cell">
                      <div className="rummy-inputs">
                        <label className="rummy-field">
                          <span>Meld</span>
                          <ScoreInput
                            value={r.melds[p.id] ?? null}
                            onChange={(v) => setMeld(i, p.id, v)}
                            ariaLabel={`${p.name}, round ${i + 1} melded points`}
                          />
                        </label>
                        <label className="rummy-field">
                          <span>Hand</span>
                          <ScoreInput
                            value={r.hands[p.id] ?? null}
                            onChange={(v) => setHand(i, p.id, v)}
                            ariaLabel={`${p.name}, round ${i + 1} hand points`}
                          />
                        </label>
                      </div>
                      <div className="rummy-net-row">
                        <span
                          className={`rummy-net${
                            net != null && net < 0 ? ' negative' : ''
                          }`}
                        >
                          {net == null ? '–' : net > 0 ? `+${net}` : net}
                        </span>
                        <label
                          className="rummy-out"
                          title={`Mark ${p.name} as going out in round ${i + 1}`}
                        >
                          <input
                            type="checkbox"
                            checked={r.wentOut.includes(p.id)}
                            onChange={() => toggleWentOut(i, p.id)}
                          />
                          <span>out</span>
                        </label>
                      </div>
                    </td>
                  );
                })}
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
          Net = melded points − cards left in hand. Target: {game.target} points
          {game.mustGoOut ? ' · must go out to win' : ''}. Card values: A = 15
          (1 or 5 when used low), K/Q/J/10 = 10, 2–9 = face value, Joker = 15.
        </p>
      </div>
    </section>
  );
}
