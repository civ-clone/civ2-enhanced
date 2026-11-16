"use strict";
// The ids of the rule sets this package registers, for whatever switches them. Each is a departure from Civilization
//  II as the original plays it (OpenCiv2's Classic behaviour), the fix OpenCiv2 makes by default; all are beneath
//  `ENHANCED`, so a game can switch them as one.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TREATY_BREAKING = exports.BORDER_INTRUDERS = exports.ATTITUDE_DRIFT = exports.ENHANCED = void 0;
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
//# sourceMappingURL=RuleSets.js.map