"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const RuleSets_1 = require("./RuleSets");
const RuleIds_1 = require("./RuleIds");
const RuleIds_2 = require("@civ-clone/civ2-diplomacy/RuleIds");
const core_game_1 = require("@civ-clone/core-game");
const RuleSet_1 = require("@civ-clone/core-rule/RuleSet");
const turnStart_1 = require("./Rules/Player/turnStart");
const register = (game) => {
    // The ids superseded are imported from their packages, so renaming one breaks this build rather than leaving both
    //  rules running. The sets before their rules, so each rule is switched as it arrives. A set of its own for each
    //  game, as a game may add to its sets.
    game.ruleSets.register(new RuleSet_1.default(RuleSets_1.ENHANCED, new RuleSet_1.default(RuleSets_1.ATTITUDE_DRIFT, { supersedes: [RuleIds_2.ATTITUDE_DRIFT_RULE] }, RuleIds_1.ATTITUDE_DRIFT_RULE), new RuleSet_1.default(RuleSets_1.BORDER_INTRUDERS, { supersedes: [RuleIds_2.BORDER_INTRUDERS_RULE] }, RuleIds_1.BORDER_INTRUDERS_RULE), new RuleSet_1.default(RuleSets_1.TREATY_BREAKING, { supersedes: [RuleIds_2.TREATY_BREAKING_RULE] }, RuleIds_1.TREATY_BREAKING_RULE)));
    // Each where the rule it replaces runs, to keep Civilization II's order. civ2-diplomacy must be loaded first: `after`
    //  throws when the rule named isn't there, so a load-order mistake fails loudly.
    const replaced = {
        [RuleIds_1.TREATY_BREAKING_RULE]: RuleIds_2.TREATY_BREAKING_RULE,
        [RuleIds_1.BORDER_INTRUDERS_RULE]: RuleIds_2.BORDER_INTRUDERS_RULE,
        [RuleIds_1.ATTITUDE_DRIFT_RULE]: RuleIds_2.ATTITUDE_DRIFT_RULE,
    };
    (0, turnStart_1.default)(game).forEach((rule) => game.rules.after(replaced[rule.id()], rule));
};
exports.register = register;
// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map