import landUprising, {
  CLASSIC_UPRISING,
  UprisingGame,
  UprisingOptions,
  uprisingCity,
} from '@civ-clone/civ2-barbarians/lib/uprising';
import {
  ActivityGame,
  activityLevel,
} from '@civ-clone/civ2-barbarians/lib/activity';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import { UPRISING_RULE } from '../../RuleIds';
import { cRand } from '@civ-clone/civ2-science/lib/pickResearch';
import { levelOf } from '@civ-clone/civ2-difficulty/level';
import spawning from '@civ-clone/base-barbarians/lib/spawning';
import { spawnTurn } from '@civ-clone/civ2-barbarians/lib/onset';
import { uprisingSkipped } from '@civ-clone/civ2-barbarians/lib/seaRaid';

/** Emitted with the city's player and the city when an uprising drawn for it finds no square. */
export const UPRISING_FAILED = 'barbarians:uprising-failed';

/**
 * The uprising as the original means it: the square's offset east runs −12 to 12 half columns (the same as west, as
 *  north and south run −6 to 6 rows), each try is centred on the city drawn, which the square must share a land mass
 *  with and which sizes the horde; and a failure is announced.
 */
export const fixedUprising = (game: UprisingGame): UprisingOptions => ({
  ...CLASSIC_UPRISING,
  xOffset: (roll: number): number => (roll - 6) * 2,
  byRolledCity: true,
  dropped: (city: City): void => {
    game.engine.emit(UPRISING_FAILED, city.player(), city);
  },
});

/** `civ2-barbarians`' `LAND_UPRISING_RULE`, with `fixedUprising` in place of the original's choices. */
export const getRules = (game: UprisingGame & ActivityGame): Start[] => [
  new Start(
    UPRISING_RULE,
    new Criterion((turn: Turn): boolean => spawning(game.rules, turn)),
    new Effect((turn: Turn): void => {
      if (uprisingSkipped(game, turn.value())) {
        return;
      }

      const city = uprisingCity(game, () => cRand(game.rng));

      if (city === null) {
        return;
      }

      landUprising(
        game,
        city,
        activityLevel(game),
        levelOf(game.difficulty),
        spawnTurn(turn),
        fixedUprising(game)
      );
    })
  ),
];

export default getRules;
