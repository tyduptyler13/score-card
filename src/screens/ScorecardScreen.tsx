import type { Game } from '../types';
import { GAME_TYPE_INFO, playerName, sortedStandings, winnerIds } from '../games';
import Phase10Card from './scorecards/Phase10Card';
import FiveCrownsCard from './scorecards/FiveCrownsCard';
import GolfCard from './scorecards/GolfCard';
import WinConditionsCard from './scorecards/WinConditionsCard';

interface Props {
  game: Game;
  onChange: (fn: (g: Game) => Game) => void;
  onBack: () => void;
}

export default function ScorecardScreen({ game, onChange, onBack }: Props) {
  const info = GAME_TYPE_INFO[game.type];
  const standings = sortedStandings(game);
  const winners = winnerIds(game);

  return (
    <div className="page wide">
      <header className="scorecard-header">
        <button className="btn ghost back" onClick={onBack}>
          ← All games
        </button>
        <div className="scorecard-title">
          <span className="pill">{info.name}</span>
          <h1>{game.players.map((p) => p.name).join(' vs ')}</h1>
        </div>
      </header>

      {winners && (
        <div className="banner win">
          🏆{' '}
          {winners.map((id) => playerName(game, id)).join(' & ')}{' '}
          {winners.length > 1 ? 'tie the game' : 'wins!'}
        </div>
      )}

      {game.type !== 'custom' && (
        <div className="standings">
          {standings.map((s, i) => (
            <div
              key={s.playerId}
              className={`standing ${
                winners?.includes(s.playerId) ? 'winner' : ''
              }`}
            >
              <span className="rank">{i + 1}</span>
              <span className="name">{playerName(game, s.playerId)}</span>
              <span className="value">{s.value}</span>
              <span className="detail">{s.detail}</span>
            </div>
          ))}
        </div>
      )}

      {game.type === 'phase10' && (
        <Phase10Card game={game} update={(fn) => onChange((g) => (g.type === 'phase10' ? fn(g) : g))} />
      )}
      {game.type === 'fivecrowns' && (
        <FiveCrownsCard game={game} update={(fn) => onChange((g) => (g.type === 'fivecrowns' ? fn(g) : g))} />
      )}
      {game.type === 'golf' && (
        <GolfCard game={game} update={(fn) => onChange((g) => (g.type === 'golf' ? fn(g) : g))} />
      )}
      {game.type === 'custom' && (
        <WinConditionsCard game={game} update={(fn) => onChange((g) => (g.type === 'custom' ? fn(g) : g))} />
      )}
    </div>
  );
}
