import { Game } from '@civ-clone/core-game';
import Player from '@civ-clone/core-player/Player';
import Score from '@civ-clone/core-score/Rules/Score';
export type PollutionScoreGame = Pick<
  Game,
  'cities' | 'clients' | 'tileImprovements'
>;
/**
 * How many polluted squares are in `player`'s cities' radii, each once: its own pollution, which it pays for in full.
 */
export declare const ownPollution: (
  game: PollutionScoreGame,
  player: Player
) => number;
/**
 * `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution: each civilization pays 10 for each
 *  polluted square around its own cities, with no discount, rather than everyone paying for the world's.
 */
export declare const getRules: (game: PollutionScoreGame) => Score[];
export default getRules;
