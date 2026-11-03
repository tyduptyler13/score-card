export type GameType =
  | 'phase10'
  | 'fivecrowns'
  | 'golf'
  | 'rummy500'
  | 'custom';

export interface Player {
  id: string;
  name: string;
}

export type Scores = Record<string, number | null>;

interface BaseGame {
  id: string;
  players: Player[];
  createdAt: number;
  updatedAt: number;
}

export interface Phase10Game extends BaseGame {
  type: 'phase10';
  rounds: { scores: Scores; phaseCompleted: string[] }[];
}

export interface FiveCrownsGame extends BaseGame {
  type: 'fivecrowns';
  rounds: { scores: Scores }[];
}

export interface GolfGame extends BaseGame {
  type: 'golf';
  holes: Scores[];
  holeCount: number;
}

export interface Rummy500Round {
  melds: Scores;
  hands: Scores;
  wentOut: string[];
}

export interface Rummy500Game extends BaseGame {
  type: 'rummy500';
  target: number;
  mustGoOut: boolean;
  rounds: Rummy500Round[];
}

export interface WinCondition {
  playerId: string | null;
  text: string;
}

export interface CustomGame extends BaseGame {
  type: 'custom';
  conditions: WinCondition[];
}

export type Game =
  | Phase10Game
  | FiveCrownsGame
  | GolfGame
  | Rummy500Game
  | CustomGame;

export interface GameSetup {
  names: string[];
  holeCount: number;
  conditions: { playerIdx: number; text: string }[];
  targetScore: number;
  mustGoOut: boolean;
}

export interface Standing {
  playerId: string;
  value: number;
  detail: string;
  finished: boolean;
}
