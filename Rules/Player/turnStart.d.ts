import { Game } from '@civ-clone/core-game';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
/**
 * The fixes to the start of a computer player's turn, through `civ2-diplomacy`'s own functions:
 *
 * - `ATTITUDE_DRIFT_RULE`: the attitude drift starts from 0 (B3);
 * - `BORDER_INTRUDERS_RULE`: every intruded square counts (B4);
 * - `TREATY_BREAKING_RULE`: a treaty broken is broken openly (B37).
 *
 * Each runs where the rule it replaces would (`registerRules`), so the original's order holds: treaties broken, then
 *  the border incidents counted, then the drift (`civ.cpp:7123`, `:7223`).
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
