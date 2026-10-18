import { useState } from 'react';
import type { GameSetup, GameType } from '../types';

interface Props {
  type: GameType;
  info: { name: string; blurb: string; rules: string[] };
  onBack: () => void;
  onStart: (type: GameType, setup: GameSetup) => void;
}

export default function SetupScreen({ type, info, onBack, onStart }: Props) {
  const [names, setNames] = useState<string[]>(['', '']);
  const [holeCount, setHoleCount] = useState(9);
  const [conditions, setConditions] = useState<
    { playerIdx: number; text: string }[]
  >([{ playerIdx: 0, text: '' }]);

  const valid = names.filter((n) => n.trim().length > 0);
  const validConditions = conditions.filter((c) => c.text.trim());
  const canStart =
    valid.length >= 2 &&
    (type !== 'custom' || validConditions.length >= 1);

  function updateName(i: number, value: string) {
    setNames((ns) => ns.map((n, idx) => (idx === i ? value : n)));
  }

  function removePlayer(i: number) {
    setNames((ns) => ns.filter((_, idx) => idx !== i));
    setConditions((cs) =>
      cs.map((c) => ({ ...c, playerIdx: Math.min(c.playerIdx, names.length - 2) })),
    );
  }

  function start() {
    if (!canStart) return;
    onStart(type, {
      names,
      holeCount: Math.min(18, Math.max(1, holeCount || 9)),
      conditions: conditions
        .filter((c) => c.text.trim())
        .map((c) => ({
          playerIdx: Math.min(c.playerIdx, names.length - 1),
          text: c.text.trim(),
        })),
    });
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn ghost back" onClick={onBack}>
          ← Back
        </button>
        <h1>{info.name}</h1>
        <p className="muted">{info.blurb}</p>
      </header>

      <details className="rules">
        <summary>How to score</summary>
        <ul>
          {info.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </details>

      <section className="setup-section">
        <h2 className="section-title">Players</h2>
        <p className="muted">At least 2 players. Add everyone at the table.</p>
        <div className="player-inputs">
          {names.map((name, i) => (
            <div key={i} className="player-input-row">
              <input
                autoFocus={i < 2}
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && start()}
              />
              {names.length > 2 && (
                <button
                  className="btn danger small"
                  aria-label={`Remove player ${i + 1}`}
                  onClick={() => removePlayer(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {names.length < 10 && (
          <button className="btn ghost" onClick={() => setNames((ns) => [...ns, ''])}>
            + Add player
          </button>
        )}
      </section>

      {type === 'golf' && (
        <section className="setup-section">
          <h2 className="section-title">Holes</h2>
        <label className="field">
          Number of holes
          <select
            value={holeCount}
            onChange={(e) => setHoleCount(Number(e.target.value))}
          >
            <option value={9}>9 holes</option>
            <option value={18}>18 holes</option>
          </select>
        </label>
          <p className="muted">Pick a 9-hole round or a full 18.</p>
        </section>
      )}

      {type === 'custom' && (
        <section className="setup-section">
          <h2 className="section-title">Win conditions</h2>
          <p className="muted">
            Settle the statements that decide the winner before you start —
            each one is assigned to a player (e.g. “First to 5 wins”).
          </p>
          <div className="player-inputs">
            {conditions.map((cond, i) => (
              <div key={i} className="condition-row">
                <select
                  aria-label={`Player for condition ${i + 1}`}
                  value={String(
                    Math.min(cond.playerIdx, Math.max(names.length - 1, 0)),
                  )}
                  onChange={(e) =>
                    setConditions((cs) =>
                      cs.map((c, idx) =>
                        idx === i
                          ? { ...c, playerIdx: Number(e.target.value) }
                          : c,
                      ),
                    )
                  }
                >
                  {names.map((n, ni) => (
                    <option key={ni} value={ni}>
                      {n.trim() || `Player ${ni + 1}`}
                    </option>
                  ))}
                </select>
                <input
                  placeholder={`Condition ${i + 1} — how does this player win?`}
                  value={cond.text}
                  onChange={(e) =>
                    setConditions((cs) =>
                      cs.map((c, idx) =>
                        idx === i ? { ...c, text: e.target.value } : c,
                      ),
                    )
                  }
                />
                {conditions.length > 1 && (
                  <button
                    className="btn danger small"
                    aria-label={`Remove condition ${i + 1}`}
                    onClick={() =>
                      setConditions((cs) => cs.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            className="btn ghost"
            onClick={() =>
              setConditions((cs) => [
                ...cs,
                { playerIdx: Math.min(cs[cs.length - 1]?.playerIdx ?? 0, valid.length - 1 || 0), text: '' },
              ])
            }
            disabled={valid.length === 0}
          >
            + Add condition
          </button>
          <p className="muted small-note">
            At least one condition is required. You can reassign or edit
            conditions during the game.
          </p>
        </section>
      )}

      <button className="btn primary big" disabled={!canStart} onClick={start}>
        Start game
      </button>
    </div>
  );
}
