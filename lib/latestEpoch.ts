import {
  FUTURE_TECHNOLOGY,
  advanceIndex,
  rowAt,
} from '@civ-clone/civ2-science/lib/advanceIndex';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

/**
 * An advance's epoch, 0 (Ancient) to 3 (Modern), RULES.TXT's @CIVILIZE column (`civ2-science`'s `data/advances`), or
 * `undefined` for Future Technology, which can be repeated, and for an advance that isn't Civilization II's. Plumbing,
 * which no one can learn, keeps its own.
 */
export const epochOf = (AdvanceType: typeof Advance): number | undefined => {
  const index = advanceIndex(AdvanceType);

  return index < 0 || index === FUTURE_TECHNOLOGY ? undefined : rowAt(index)[5];
};

/**
 * The latest epoch `playerResearch`'s player knows an advance of, and 0 knowing none: the index of the age it is in
 * (`Ages`). Worked out from the epochs rather than asked of the ages' own rule, so it holds whether the ages are
 * switched on or not.
 */
export const latestEpoch = (playerResearch: PlayerResearch): number =>
  playerResearch
    .complete()
    .reduce(
      (latest: number, advance: Advance): number =>
        Math.max(latest, epochOf(advance.sourceClass<typeof Advance>()) ?? 0),
      0
    );

export default latestEpoch;
