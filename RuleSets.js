"use strict";
// The ids of the rule sets this package registers, for whatever switches them. Each is a departure from Civilization
//  II as the original plays it (OpenCiv2's Classic behaviour), the fix OpenCiv2 makes by default; all are beneath
//  `ENHANCED`, so a game can switch them as one.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BARBARIAN_CITIES = exports.BARBARIAN_UPRISINGS = exports.FIXED_RESEARCH_COSTS = exports.TREATY_BREAKING = exports.BORDER_INTRUDERS = exports.ATTITUDE_DRIFT = exports.ENHANCED = void 0;
/** Every rule set of this package. */
exports.ENHANCED = 'civ2-enhanced';
/**
 * A computer player's attitude to a person drifts each turn by its own terms, starting from 0 (OpenCiv2's fix of
 * B3). Takes the place of `civ2-diplomacy`'s drift, which, as the original, starts from a stale value that pins the
 * attitude at 100 every turn without a border incident. On to start with.
 */
exports.ATTITUDE_DRIFT = 'civ2-enhanced:attitude-drift';
/**
 * Every square of a city's radius that a person's units intrude on counts as a border incident (OpenCiv2's fix of B4).
 * Takes the place of `civ2-diplomacy`'s count, which, as the original, looks only at the first intruded square of
 * each city. On to start with.
 */
exports.BORDER_INTRUDERS = 'civ2-enhanced:border-intruders';
/**
 * A computer player that breaks a treaty it meant to break does so openly, and the treaty ends on both sides
 * (OpenCiv2's fix of B37). Takes the place of `civ2-diplomacy`'s rule, which, as the original, breaks it without a
 * word. On to start with.
 */
exports.TREATY_BREAKING = 'civ2-enhanced:treaty-breaking';
/**
 * Each advance costs a fixed weight by its tier (`ResearchTiers`) times Civilization II's ratio, however many advances
 * its player knows, so a beeline costs what learning steadily does (civ-clone/web-renderer#1072). Takes the place of
 * `civ2-science`'s cost while it is on. Off to start with.
 */
exports.FIXED_RESEARCH_COSTS = 'civ2-enhanced:fixed-research-costs';
/**
 * A land uprising is sited around the city drawn for it, the same distance east as west, and sized by that city; one
 *  that finds no square is announced (`barbarians:uprising-failed`). Takes the place of `civ2-barbarians`' uprising,
 *  which, as the original, searches lopsided to the east, goes by whichever city is nearest each try (a computer
 *  player's, perhaps) and drops a failed uprising without a word. Off to start with.
 */
exports.BARBARIAN_UPRISINGS = 'civ2-enhanced:barbarian-uprisings';
/**
 * A barbarian city starts with the main unit of the barbarians' own uprising table for what anyone knows, rather than
 *  the original's Legion, or Knights once anyone knows Explosives. Takes the place of `civ2-barbarians`' city build.
 *  Off to start with.
 */
exports.BARBARIAN_CITIES = 'civ2-enhanced:barbarian-cities';
//# sourceMappingURL=RuleSets.js.map