import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
/**
 * An advance's epoch, 0 (Ancient) to 3 (Modern), RULES.TXT's @CIVILIZE column (`civ2-science`'s `data/advances`), or
 * `undefined` for Future Technology, which can be repeated, and for an advance that isn't Civilization II's. Plumbing,
 * which no one can learn, keeps its own.
 */
export declare const epochOf: (
  AdvanceType: typeof Advance
) => number | undefined;
/**
 * The latest epoch `playerResearch`'s player knows an advance of, and 0 knowing none: the index of the age it is in
 * (`Ages`). Worked out from the epochs rather than asked of the ages' own rule, so it holds whether the ages are
 * switched on or not.
 */
export declare const latestEpoch: (playerResearch: PlayerResearch) => number;
export default latestEpoch;
