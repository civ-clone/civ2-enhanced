import {
  ATTITUDE_DRIFT_RULE,
  BORDER_INTRUDERS_RULE,
  TREATY_BREAKING_RULE,
} from '../../RuleIds';
import {
  breakTreaties,
  countIncidents,
  driftAttitude,
} from '@civ-clone/civ2-diplomacy/lib/rules/turnStart';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Player from '@civ-clone/core-player/Player';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import { dependenciesOf } from '@civ-clone/civ2-diplomacy/registerRules';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import isHuman from '@civ-clone/civ2-difficulty/isHuman';

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
export const getRules = (
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
): TurnStart[] => {
  const dependencies = dependenciesOf(game as Game),
    // A computer player, as `civ2-diplomacy`'s rules have it: not a person, not the barbarians.
    computer = new Criterion((player: Player): boolean => {
      if (isHuman(player, game.clients)) {
        return false;
      }

      try {
        return !isBarbarian(player);
      } catch (e) {
        return true;
      }
    });

  return [
    new TurnStart(
      BORDER_INTRUDERS_RULE,
      computer,
      new Effect((player: Player): void =>
        countIncidents(dependencies, player, true, game.rng, game.engine)
      )
    ),
    new TurnStart(
      ATTITUDE_DRIFT_RULE,
      computer,
      new Effect((player: Player): void =>
        driftAttitude(dependencies, player, true)
      )
    ),
    new TurnStart(
      TREATY_BREAKING_RULE,
      computer,
      new Effect((player: Player): void =>
        breakTreaties(dependencies, player, game.rng, game.engine, true)
      )
    ),
  ];
};

export default getRules;
