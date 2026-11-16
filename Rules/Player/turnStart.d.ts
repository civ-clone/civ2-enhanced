import { Game } from '@civ-clone/core-game';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
/**
 * The fixes to the start of a computer player's turn, through `civ2-diplomacy`'s own functions:
 *
 * - `ATTITUDE_DRIFT_RULE`: the attitude drift starts from 0 (B3);
 * - `BORDER_INTRUDERS_RULE`: every intruded square counts (B4), before the drift as `civ2-diplomacy`'s count is;
 * - `TREATY_BREAKING_RULE`: a treaty broken is broken openly (B37).
 */
export declare const getRules: (
  game: Pick<
    Game,
    | 'cities'
    | 'clients'
    | 'difficulty'
    | 'engine'
    | 'interactions'
    | 'landMasses'
    | 'playerGovernments'
    | 'players'
    | 'playerResearch'
    | 'playerTreasuries'
    | 'playerWorlds'
    | 'requirements'
    | 'rng'
    | 'rules'
    | 'tileImprovements'
    | 'traits'
    | 'turn'
    | 'units'
    | 'wonders'
  >
) => TurnStart[];
export default getRules;
