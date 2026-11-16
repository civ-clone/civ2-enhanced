"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleIds_1 = require("../../RuleIds");
const turnStart_1 = require("@civ-clone/civ2-diplomacy/lib/rules/turnStart");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const registerRules_1 = require("@civ-clone/civ2-diplomacy/registerRules");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const isHuman_1 = require("@civ-clone/civ2-difficulty/isHuman");
/**
 * The fixes to the start of a computer player's turn, through `civ2-diplomacy`'s own functions:
 *
 * - `ATTITUDE_DRIFT_RULE`: the attitude drift starts from 0 (B3);
 * - `BORDER_INTRUDERS_RULE`: every intruded square counts (B4), before the drift as `civ2-diplomacy`'s count is;
 * - `TREATY_BREAKING_RULE`: a treaty broken is broken openly (B37).
 */
const getRules = (game) => {
    const dependencies = (0, registerRules_1.dependenciesOf)(game), 
    // A computer player, as `civ2-diplomacy`'s rules have it: not a person, not the barbarians.
    computer = new Criterion_1.default((player) => {
        if ((0, isHuman_1.default)(player, game.clients)) {
            return false;
        }
        try {
            return !(0, isBarbarian_1.default)(player);
        }
        catch (e) {
            return true;
        }
    });
    return [
        new TurnStart_1.default(RuleIds_1.BORDER_INTRUDERS_RULE, new High_1.default(), computer, new Effect_1.default((player) => (0, turnStart_1.countIncidents)(dependencies, player, true))),
        new TurnStart_1.default(RuleIds_1.ATTITUDE_DRIFT_RULE, computer, new Effect_1.default((player) => (0, turnStart_1.driftAttitude)(dependencies, player, true))),
        new TurnStart_1.default(RuleIds_1.TREATY_BREAKING_RULE, computer, new Effect_1.default((player) => (0, turnStart_1.breakTreaties)(dependencies, player, game.rng, game.engine, true))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turnStart.js.map