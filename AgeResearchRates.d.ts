/**
 * What the research cost is multiplied by in each of the four ages (`Ages`, Civilization II's epochs), by the player's
 * own latest (civ-clone/web-renderer#1077's for Civilization II): a steady slide from half, as Civilization's first
 * age, each 1.328 times the last, rounded. Civilization II's cost doesn't double from AD as Civilization's does, so
 * the slide is set to keep the total where Civilization II's own is, not to replace a doubling: learning every advance
 * along the steady path (`civ2-science`'s `rampedStep`, by prerequisites, as the fixed research costs' tiers were set),
 * each at its player's age before it, costs 0.998 times what it does today, and 0.996 with the fixed research costs.
 * Over the computer players' own choices it costs about 1.04 times. The Modern epoch carries about three fifths of the
 * cost, as a civilization enters it only around its fiftieth advance, so a slide as steep as Civilization's (to 3)
 * can't keep that total: learning every advance would cost about 2.3 times as much. For play-testing.
 */
export declare const ageRateMultipliers: number[];
export default ageRateMultipliers;
