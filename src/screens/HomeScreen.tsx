import type { Game, GameType } from '../types';
import { GAME_TYPE_INFO, summary, winnerIds, playerName } from '../games';

const ORDER: GameType[] = ['phase10', 'fivecrowns', 'golf', 'custom'];

interface Props {
  games: Game[];
  onNew: (type: GameType) => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HomeScreen({ games, onNew, onOpen, onDelete }: Props) {
  const sorted = [...games].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Scorecard</h1>
        <p className="muted">Pick a game to start tracking scores.</p>
      </header>

      <section className="game-type-grid">
        {ORDER.map((type) => {
          const info = GAME_TYPE_INFO[type];
          return (
            <button
              key={type}
              className="game-type-card"
              onClick={() => onNew(type)}
            >
              <h2>{info.name}</h2>
              <p>{info.blurb}</p>
              <span className="cta">New game →</span>
            </button>
          );
        })}
      </section>

      <section>
        <h2 className="section-title">Saved games</h2>
        {sorted.length === 0 ? (
          <p className="muted empty">Nothing in progress yet.</p>
        ) : (
          <ul className="game-list">
            {sorted.map((game) => {
              const winners = winnerIds(game);
              return (
                <li key={game.id} className="game-list-item">
                  <div className="game-list-main">
                    <span className="pill">
                      {GAME_TYPE_INFO[game.type].name}
                    </span>
                    <strong>
                      {game.players.map((p) => p.name).join(', ')}
                    </strong>
                    <span className="muted">
                      {winners
                        ? `Winner: ${winners
                            .map((id) => playerName(game, id))
                            .join(' & ')}`
                        : summary(game)}
                    </span>
                  </div>
                  <div className="game-list-actions">
                    <button className="btn primary" onClick={() => onOpen(game.id)}>
                      Resume
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => {
                        if (confirm('Delete this game?')) onDelete(game.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
