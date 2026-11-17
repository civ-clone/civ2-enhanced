"use strict";
// The ids of this package's rules that another package is expected to name: a host that switches or describes them.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BARBARIAN_CITY_BUILD_RULE = exports.UPRISING_RULE = exports.TIERED_COST_RULE = exports.TREATY_BREAKING_RULE = exports.BORDER_INTRUDERS_RULE = exports.ATTITUDE_DRIFT_RULE = void 0;
/** A computer player's attitude drifts each turn from 0. */
exports.ATTITUDE_DRIFT_RULE = 'civ2-enhanced:player/turn-start/attitude-drift';
/** A computer player counts every square its borders are intruded on. */
exports.BORDER_INTRUDERS_RULE = 'civ2-enhanced:player/turn-start/border-intruders';
/** A computer player breaks a treaty openly, on both sides. */
exports.TREATY_BREAKING_RULE = 'civ2-enhanced:player/turn-start/treaty-breaking';
/** An advance costs its tier's weight times Civilization II's ratio, whatever its player knows. */
exports.TIERED_COST_RULE = 'civ2-enhanced:research/cost/by-tier';
/** A land uprising sited and sized by the city drawn for it, and announced when it finds no square. */
exports.UPRISING_RULE = 'civ2-enhanced:turn/start/land-uprising';
/** A barbarian city starts with the main unit of the barbarians' uprising table. */
exports.BARBARIAN_CITY_BUILD_RULE = 'civ2-enhanced:city/build/barbarian';
//# sourceMappingURL=RuleIds.js.map