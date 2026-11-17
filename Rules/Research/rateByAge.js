"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Effect_1 = require("@civ-clone/core-rule/Effect");
const RuleIds_1 = require("../../RuleIds");
const RateMultiplier_1 = require("@civ-clone/civ2-science/Rules/Research/RateMultiplier");
const AgeResearchRates_1 = require("../../AgeResearchRates");
const latestEpoch_1 = require("../../lib/latestEpoch");
const getRules = () => [
    // The player's own age's multiplier, so a rush into a later age makes every advance after it dearer, the ones left
    //  behind too. Civilization II's cost has no catch-up by the calendar to move, as Civilization's has from AD: its
    //  ratio rises for being ahead of the turn (up to 6) only past a player's own 19th advance.
    new RateMultiplier_1.default(RuleIds_1.RATE_MULTIPLIER_BY_AGE_RULE, new Effect_1.default((playerResearch) => AgeResearchRates_1.ageRateMultipliers[(0, latestEpoch_1.default)(playerResearch)])),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=rateByAge.js.map