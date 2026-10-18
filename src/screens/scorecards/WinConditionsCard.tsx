import type { CustomGame } from '../../types';

interface Props {
  game: CustomGame;
  update: (fn: (g: CustomGame) => CustomGame) => void;
}

export default function WinConditionsCard({ game, update }: Props) {
  const edit = (idx: number, value: string) =>
    update((g) => ({
      ...g,
      conditions: g.conditions.map((c, i) =>
        i === idx ? { ...c, text: value } : c,
      ),
    }));

  const reassign = (idx: number, playerId: string | null) =>
    update((g) => ({
      ...g,
      conditions: g.conditions.map((c, i) =>
        i === idx ? { ...c, playerId } : c,
      ),
    }));

  const add = () =>
    update((g) => ({
      ...g,
      conditions: [
        ...g.conditions,
        {
          playerId:
            game.conditions[game.conditions.length - 1]?.playerId ??
            game.players[0]?.id ??
            null,
          text: '',
        },
      ],
    }));

  const remove = (idx: number) =>
    update((g) => ({
      ...g,
      conditions: g.conditions.filter((_, i) => i !== idx),
    }));

  return (
    <section className="card">
      <div className="condition-list">
        {game.conditions.map((cond, i) => (
          <div key={i} className="condition-row">
            <span className="condition-num">{i + 1}</span>
            <select
              aria-label={`Player for condition ${i + 1}`}
              value={cond.playerId ?? ''}
              onChange={(e) =>
                reassign(i, e.target.value === '' ? null : e.target.value)
              }
            >
              {game.players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="">Unassigned</option>
            </select>
            <input
              value={cond.text}
              placeholder="How is the winner decided?"
              onChange={(e) => edit(i, e.target.value)}
            />
            <button
              className="btn danger small"
              aria-label={`Remove condition ${i + 1}`}
              onClick={() => remove(i)}
            >
              ✕
            </button>
          </div>
        ))}
        {game.conditions.length === 0 && (
          <p className="muted empty">
            No conditions — add one so the table knows how the game ends.
          </p>
        )}
      </div>
      <div className="table-actions">
        <button className="btn primary" onClick={add}>
          + Add condition
        </button>
        <p className="muted small-note">
          These were agreed before the game started — keep them visible so
          nobody argues about the finish line.
        </p>
      </div>
    </section>
  );
}
