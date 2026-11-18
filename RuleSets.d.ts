/** Every rule set of this package. */
export declare const ENHANCED = 'civ2-enhanced';
/**
 * A computer player's attitude to a person drifts each turn by its own terms, starting from 0 (OpenCiv2's fix of
 * B3). Takes the place of `civ2-diplomacy`'s drift, which, as the original, starts from a stale value that pins the
 * attitude at 100 every turn without a border incident. On to start with.
 */
export declare const ATTITUDE_DRIFT = 'civ2-enhanced:attitude-drift';
/**
 * Every square of a city's radius that a person's units intrude on counts as a border incident (OpenCiv2's fix of B4).
 * Takes the place of `civ2-diplomacy`'s count, which, as the original, looks only at the first intruded square of
 * each city. On to start with.
 */
export declare const BORDER_INTRUDERS = 'civ2-enhanced:border-intruders';
/**
 * A computer player that breaks a treaty it meant to break does so openly, and the treaty ends on both sides
 * (OpenCiv2's fix of B37). Takes the place of `civ2-diplomacy`'s rule, which, as the original, breaks it without a
 * word. On to start with.
 */
export declare const TREATY_BREAKING = 'civ2-enhanced:treaty-breaking';
/**
 * Each advance costs a fixed weight by its tier (`ResearchTiers`) times Civilization II's ratio, however many advances
 * its player knows, so a beeline costs what learning steadily does (civ-clone/web-renderer#1072). Takes the place of
 * `civ2-science`'s cost while it is on. Off to start with.
 */
export declare const FIXED_RESEARCH_COSTS =
  'civ2-enhanced:fixed-research-costs';
/**
 * Each civilization moves through Civilization II's four epochs as ages as it learns (`Ages`): it enters an age with
 * the first advance it gains of that epoch, and is told so (civ-clone/web-renderer#1076). The original uses an
 * advance's epoch only to choose its picture. Rules added to Civilization II's, so nothing to supersede. Off to start
 * with.
 */
export declare const AGES = 'civ2-enhanced:ages';
/**
 * The research cost follows the player's age, from half in the Ancient to 1.17 times in the Modern, learning every
 * advance costing about what it does today (`AgeResearchRates`, civ-clone/web-renderer#1077). With either research
 * cost. Civilization II has no factor of its own to replace, so it adds a `civ2-science` `RateMultiplier` rule and
 * supersedes nothing. Off to start with.
 */
export declare const RESEARCH_COST_BY_AGE =
  'civ2-enhanced:research-cost-by-age';
/**
 * A land uprising is sited around the city drawn for it, the same distance east as west, and sized by that city; one
 *  that finds no square is announced (`barbarians:uprising-failed`). Takes the place of `civ2-barbarians`' uprising,
 *  which, as the original, searches lopsided to the east, goes by whichever city is nearest each try (a computer
 *  player's, perhaps) and drops a failed uprising without a word. Off to start with.
 */
export declare const BARBARIAN_UPRISINGS = 'civ2-enhanced:barbarian-uprisings';
/**
 * A barbarian city starts with the main unit of the barbarians' own uprising table for what anyone knows, rather than
 *  the original's Legion, or Knights once anyone knows Explosives. Takes the place of `civ2-barbarians`' city build.
 *  Off to start with.
 */
export declare const BARBARIAN_CITIES = 'civ2-enhanced:barbarian-cities';
/**
 * Each civilization pays for its own pollution: its score loses 10 for each polluted square in its own cities' radii,
 *  each once, rather than for every polluted square in the world. Takes the place of `civ2-score`'s pollution
 *  term, which, as the original, gives every civilization the same, whole-world penalty. Off to start with.
 */
export declare const POLLUTION_SCORE = 'civ2-enhanced:pollution-score';
/**
 * Above King, a computer player waits to launch while another computer player's ship in flight would arrive before its
 *  own. Takes the place of `civ2-spaceship`'s launch, which, as the original, compares the other's arrival with the
 *  barbarians' ship's, always 0, so it never waits. Off to start with.
 */
export declare const COMPUTER_LAUNCH_WAIT =
  'civ2-enhanced:computer-launch-wait';
