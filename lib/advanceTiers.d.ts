import Advance from '@civ-clone/core-science/Advance';
import { Game } from '@civ-clone/core-game/Game';
/** The parts of a game an advance's tier is read from. */
export type TiersGame = Pick<Game, 'advances' | 'requirements'>;
/**
 * The advances that have a tier: Civilization II's that the game makes available (not Plumbing) and that can't be
 * repeated. One a plugin adds that isn't Civilization II's has none, and costs what it does by `civ2-science`'s rule.
 */
export declare const tieredAdvances: (game: TiersGame) => (typeof Advance)[];
/**
 * Which of `researchTiers` each advance with a tier is in, by its index (civ-clone/web-renderer#1072).
 *
 * Read from the game's advances and `requires` entries when first asked for: this package is loaded before
 * `civ2-science`, so they aren't there yet when it registers, and a plugin's changes to them count. Kept for the game
 * only once some advance needs another, so an answer asked for before the entries are added isn't kept for good.
 */
export declare const advanceTiers: (
  game: TiersGame
) => Map<typeof Advance, number>;
export default advanceTiers;
