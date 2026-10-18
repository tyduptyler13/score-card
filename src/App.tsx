import { useEffect, useMemo, useState } from 'react';
import type { Game, GameSetup, GameType } from './types';
import { createGame, GAME_TYPE_INFO } from './games';
import { loadGames, saveGames } from './storage';
import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import ScorecardScreen from './screens/ScorecardScreen';

type View =
  | { screen: 'home' }
  | { screen: 'setup'; type: GameType }
  | { screen: 'game'; id: string };

export default function App() {
  const [games, setGames] = useState<Game[]>(() => loadGames());
  const [view, setView] = useState<View>({ screen: 'home' });

  useEffect(() => {
    saveGames(games);
  }, [games]);

  const activeGame = useMemo(
    () =>
      view.screen === 'game'
        ? (games.find((g) => g.id === view.id) ?? null)
        : null,
    [view, games],
  );

  function updateGame(id: string, fn: (g: Game) => Game) {
    setGames((gs) =>
      gs.map((g) =>
        g.id === id ? { ...fn(g), updatedAt: Date.now() } : g,
      ),
    );
  }

  function startGame(type: GameType, setup: GameSetup) {
    const game = createGame(type, setup);
    setGames((gs) => [game, ...gs]);
    setView({ screen: 'game', id: game.id });
  }

  function deleteGame(id: string) {
    setGames((gs) => gs.filter((g) => g.id !== id));
  }

  if (view.screen === 'setup') {
    return (
      <SetupScreen
        type={view.type}
        info={GAME_TYPE_INFO[view.type]}
        onBack={() => setView({ screen: 'home' })}
        onStart={startGame}
      />
    );
  }

  if (view.screen === 'game') {
    if (!activeGame) {
      return (
        <div className="page">
          <p className="muted">That game no longer exists.</p>
          <button className="btn" onClick={() => setView({ screen: 'home' })}>
            Back home
          </button>
        </div>
      );
    }
    return (
      <ScorecardScreen
        game={activeGame}
        onChange={(fn) => updateGame(activeGame.id, fn)}
        onBack={() => setView({ screen: 'home' })}
      />
    );
  }

  return (
    <HomeScreen
      games={games}
      onNew={(type) => setView({ screen: 'setup', type })}
      onOpen={(id) => setView({ screen: 'game', id })}
      onDelete={deleteGame}
    />
  );
}
