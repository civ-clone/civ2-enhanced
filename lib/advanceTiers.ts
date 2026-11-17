import {
  advanceIndex,
  isEnabled,
} from '@civ-clone/civ2-science/lib/advanceIndex';
import Advance from '@civ-clone/core-science/Advance';
import { Game } from '@civ-clone/core-game/Game';
import prerequisiteCounts from '@civ-clone/base-science-research-tiered-cost/lib/prerequisites';
import researchTiers from '../ResearchTiers';
import { tierOf } from '@civ-clone/base-science-research-tiered-cost/lib/tiers';

/** The parts of a game an advance's tier is read from. */
export type TiersGame = Pick<Game, 'advances' | 'requirements'>;

/**
 * The advances that have a tier: Civilization II's that the game makes available (not Plumbing) and that can't be
 * repeated. One a plugin adds that isn't Civilization II's has none, and costs what it does by `civ2-science`'s rule.
 */
export const tieredAdvances = (game: TiersGame): (typeof Advance)[] =>
  game.advances.filter(
    (AdvanceType: typeof Advance): boolean =>
      !AdvanceType.repeatable &&
      advanceIndex(AdvanceType) >= 0 &&
      isEnabled(advanceIndex(AdvanceType))
  );

const kept = new WeakMap<TiersGame, Map<typeof Advance, number>>();

/**
 * Which of `researchTiers` each advance with a tier is in, by its index (civ-clone/web-renderer#1072).
 *
 * Read from the game's advances and `requires` entries when first asked for: this package is loaded before
 * `civ2-science`, so they aren't there yet when it registers, and a plugin's changes to them count. Kept for the game
 * only once some advance needs another, so an answer asked for before the entries are added isn't kept for good.
 */
export const advanceTiers = (game: TiersGame): Map<typeof Advance, number> => {
  const known = kept.get(game);

  if (known !== undefined) {
    return known;
  }

  const counts = prerequisiteCounts(
      tieredAdvances(game),
      game.requirements.entries()
    ),
    tiers = new Map(
      [...counts].map(([AdvanceType, count]): [typeof Advance, number] => [
        AdvanceType,
        tierOf(count, researchTiers),
      ])
    );

  if ([...counts.values()].some((count: number): boolean => count > 0)) {
    kept.set(game, tiers);
  }

  return tiers;
};

export default advanceTiers;
