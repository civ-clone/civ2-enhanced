import {
  UprisingGame,
  UprisingOptions,
} from '@civ-clone/civ2-barbarians/lib/uprising';
import { ActivityGame } from '@civ-clone/civ2-barbarians/lib/activity';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
/** Emitted with the city's player and the city when an uprising drawn for it finds no square. */
export declare const UPRISING_FAILED = 'barbarians:uprising-failed';
/**
 * The uprising as the original means it: the square's offset east runs −12 to 12 half columns (the same as west, as
 *  north and south run −6 to 6 rows), each try is centred on the city drawn, which the square must share a land mass
 *  with and which sizes the horde; and a failure is announced.
 */
export declare const fixedUprising: (game: UprisingGame) => UprisingOptions;
/** `civ2-barbarians`' `LAND_UPRISING_RULE`, with `fixedUprising` in place of the original's choices. */
export declare const getRules: (game: UprisingGame & ActivityGame) => Start[];
export default getRules;
