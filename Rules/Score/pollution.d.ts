import { Game } from '@civ-clone/core-game';
import Player from '@civ-clone/core-player/Player';
import Score from '@civ-clone/core-score/Rules/Score';
export type PollutionScoreGame = Pick<
  Game,
  'cities' | 'clients' | 'tileImprovements'
>;
/**
 * `player`'s own pollution, as `civ2-score`'s `worldPollution` counts the world's: the polluted squares in its cities'
 *  radii, and, for a computer player, those counted again for each of its cities that holds them.
 */
export declare const ownPollution: (
  game: PollutionScoreGame,
  player: Player
) => import('@civ-clone/civ2-score/lib/pollution').WorldPollution;
/** `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution rather than the world's. */
export declare const getRules: (game: PollutionScoreGame) => Score[];
export default getRules;
