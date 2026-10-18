import type { Phase10Game } from '../../types';
import { PHASES, PHASE_EXAMPLES, phaseOf } from '../../games';
import { RoundHeader, ScoreInput } from './shared';

interface Props {
  game: Phase10Game;
  update: (fn: (g: Phase10Game) => Phase10Game) => void;
}

export default function Phase10Card({ game, update }: Props) {
  const setScore = (roundIdx: number, playerId: string, value: number | null) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) =>
        i === roundIdx ? { ...r, scores: { ...r.scores, [playerId]: value } } : r,
      ),
    }));

  const togglePhase = (roundIdx: number, playerId: string) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const done = r.phaseCompleted.includes(playerId);
        return {
          ...r,
          phaseCompleted: done
            ? r.phaseCompleted.filter((id) => id !== playerId)
            : [...r.phaseCompleted, playerId],
        };
      }),
    }));

  const addRound = () =>
    update((g) => ({
      ...g,
      rounds: [...g.rounds, { scores: {}, phaseCompleted: [] }],
    }));

  const deleteRound = (idx: number) =>
    update((g) => ({
      ...g,
      rounds: g.rounds.filter((_, i) => i !== idx),
    }));

  const total = (playerId: string) =>
    game.rounds.reduce((acc, r) => acc + (r.scores[playerId] ?? 0), 0);

  const completedCount = (playerId: string) =>
    game.rounds.filter((r) => r.phaseCompleted.includes(playerId)).length;

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
                  onDelete={() => deleteRound(i)}
                />
              ))}
              <th className="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map((p) => {
              const phase = phaseOf(game, p.id);
              return (
                <tr key={p.id}>
                  <th className="player-col" scope="row">
                    <span className="player-name">{p.name}</span>
                    <span className="phase-badge" title={PHASES[phase - 1]}>
                      Phase {phase}
                      {phase <= 10 && <em> · {PHASES[phase - 1]}</em>}
                    </span>
                  </th>
                  {game.rounds.map((r, i) => (
                    <td key={i} className="round-col">
                      <ScoreInput
                        value={r.scores[p.id] ?? null}
                        onChange={(v) => setScore(i, p.id, v)}
                        ariaLabel={`${p.name}, round ${i + 1} score`}
                      />
                      <label
                        className="phase-check"
                        title={`Mark ${p.name} as completing their phase in round ${i + 1}`}
                      >
                        <input
                          type="checkbox"
                          checked={r.phaseCompleted.includes(p.id)}
                          onChange={() => togglePhase(i, p.id)}
                        />
                        <span>done</span>
                      </label>
                    </td>
                  ))}
                  <td className="total-col">{total(p.id)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-actions">
        <button className="btn primary" onClick={addRound}>
          + Add round
        </button>
        <p className="muted small-note">
          Tick “done” when a player completes their phase this round — their
          phase badge advances automatically. If a phase is failed, leave it
          unticked and they stay on it.
        </p>
      </div>

      <div className="phase-goals">
        <h3>Phase goals</h3>
        <ol>
          {PHASES.map((goal, i) => {
            const phase = i + 1;
            const onPhase = game.players.filter(
              (p) => phaseOf(game, p.id) === phase,
            );
            const doneBy = game.players.filter(
              (p) => completedCount(p.id) >= phase,
            );
            return (
              <li key={goal} className={onPhase.length > 0 ? 'current' : ''}>
                <span className="goal">
                  <strong>{phase}.</strong> {goal}
                  <em className="example"> e.g. {PHASE_EXAMPLES[i]}</em>
                </span>
                <span className="goal-tags">
                  {onPhase.map((p) => (
                    <span key={p.id} className="tag on">
                      {p.name}
                    </span>
                  ))}
                  {doneBy.map((p) => (
                    <span key={p.id} className="tag done">
                      ✓ {p.name}
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
