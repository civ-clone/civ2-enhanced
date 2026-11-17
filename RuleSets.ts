// The ids of the rule sets this package registers, for whatever switches them. Each is a departure from Civilization
//  II as the original plays it (OpenCiv2's Classic behaviour), the fix OpenCiv2 makes by default; all are beneath
//  `ENHANCED`, so a game can switch them as one.

/** Every rule set of this package. */
export const ENHANCED = 'civ2-enhanced';

/**
 * A computer player's attitude to a person drifts each turn by its own terms, starting from 0 (OpenCiv2's fix of
 * B3). Takes the place of `civ2-diplomacy`'s drift, which, as the original, starts from a stale value that pins the
 * attitude at 100 every turn without a border incident. On to start with.
 */
export const ATTITUDE_DRIFT = 'civ2-enhanced:attitude-drift';

/**
 * Every square of a city's radius that a person's units intrude on counts as a border incident (OpenCiv2's fix of B4).
 * Takes the place of `civ2-diplomacy`'s count, which, as the original, looks only at the first intruded square of
 * each city. On to start with.
 */
export const BORDER_INTRUDERS = 'civ2-enhanced:border-intruders';

/**
 * A computer player that breaks a treaty it meant to break does so openly, and the treaty ends on both sides
 * (OpenCiv2's fix of B37). Takes the place of `civ2-diplomacy`'s rule, which, as the original, breaks it without a
 * word. On to start with.
 */
export const TREATY_BREAKING = 'civ2-enhanced:treaty-breaking';

/**
 * Each advance costs a fixed weight by its tier (`ResearchTiers`) times Civilization II's ratio, however many advances
 * its player knows, so a beeline costs what learning steadily does (civ-clone/web-renderer#1072). Takes the place of
 * `civ2-science`'s cost while it is on. Off to start with.
 */
export const FIXED_RESEARCH_COSTS = 'civ2-enhanced:fixed-research-costs';
