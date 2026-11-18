import ComputerLaunch from '@civ-clone/base-spaceship/lib/Rules/ComputerLaunch';
import { Game } from '@civ-clone/core-game';
export type ComputerLaunchGame = Pick<
  Game,
  | 'clients'
  | 'difficulty'
  | 'pendingEffects'
  | 'playerResearch'
  | 'players'
  | 'playerTreasuries'
  | 'rules'
  | 'spaceships'
  | 'year'
>;
/**
 * A computer player's launch as civ2-spaceship decides it, except that above King it waits while another computer
 *  player's ship in flight would arrive before its own, which is what the original means to do (`'other-computers'`).
 */
export declare const getRules: (game: ComputerLaunchGame) => ComputerLaunch[];
export default getRules;
