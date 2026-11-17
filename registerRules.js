"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const RuleSets_1 = require("./RuleSets");
const RuleIds_1 = require("./RuleIds");
const RuleIds_2 = require("@civ-clone/civ2-barbarians/RuleIds");
const cityBuild_1 = require("./Rules/Barbarians/cityBuild");
const uprising_1 = require("./Rules/Barbarians/uprising");
const RuleIds_3 = require("@civ-clone/civ2-science/RuleIds");
const cost_1 = require("./Rules/Research/cost");
const RuleIds_4 = require("@civ-clone/civ2-diplomacy/RuleIds");
const core_game_1 = require("@civ-clone/core-game");
const RuleSet_1 = require("@civ-clone/core-rule/RuleSet");
const turnStart_1 = require("./Rules/Player/turnStart");
const register = (game) => {
    // The ids superseded are imported from their packages, so renaming one breaks this build rather than leaving both
    //  rules running. The sets before their rules, so each rule is switched as it arrives. A set of its own for each
    //  game, as a game may add to its sets.
    game.ruleSets.register(new RuleSet_1.default(RuleSets_1.ENHANCED, new RuleSet_1.default(RuleSets_1.ATTITUDE_DRIFT, { supersedes: [RuleIds_4.ATTITUDE_DRIFT_RULE] }, RuleIds_1.ATTITUDE_DRIFT_RULE), new RuleSet_1.default(RuleSets_1.BORDER_INTRUDERS, { supersedes: [RuleIds_4.BORDER_INTRUDERS_RULE] }, RuleIds_1.BORDER_INTRUDERS_RULE), new RuleSet_1.default(RuleSets_1.TREATY_BREAKING, { supersedes: [RuleIds_4.TREATY_BREAKING_RULE] }, RuleIds_1.TREATY_BREAKING_RULE), 
    // civ-clone/web-renderer#1072
    new RuleSet_1.default(RuleSets_1.FIXED_RESEARCH_COSTS, { enabled: false, supersedes: [RuleIds_3.COST_RULE] }, RuleIds_1.TIERED_COST_RULE), new RuleSet_1.default(RuleSets_1.BARBARIAN_UPRISINGS, { enabled: false, supersedes: [RuleIds_2.LAND_UPRISING_RULE] }, RuleIds_1.UPRISING_RULE), new RuleSet_1.default(RuleSets_1.BARBARIAN_CITIES, { enabled: false, supersedes: [RuleIds_2.CITY_BUILD_RULE] }, RuleIds_1.BARBARIAN_CITY_BUILD_RULE)));
    // Each where the rule it replaces runs, to keep Civilization II's order. civ2-diplomacy must be loaded first: `after`
    //  throws when the rule named isn't there, so a load-order mistake fails loudly.
    const replaced = {
        [RuleIds_1.TREATY_BREAKING_RULE]: RuleIds_4.TREATY_BREAKING_RULE,
        [RuleIds_1.BORDER_INTRUDERS_RULE]: RuleIds_4.BORDER_INTRUDERS_RULE,
        [RuleIds_1.ATTITUDE_DRIFT_RULE]: RuleIds_4.ATTITUDE_DRIFT_RULE,
    };
    (0, turnStart_1.default)(game).forEach((rule) => game.rules.after(replaced[rule.id()], rule));
    // civ2-barbarians loads before this package (by name): each fix where the rule it replaces runs, as above. A game
    //  without civ2-barbarians has nothing to replace, and the fix is only an orphan, never switched on by anything.
    [
        [RuleIds_2.LAND_UPRISING_RULE, (0, uprising_1.default)(game)],
        [RuleIds_2.CITY_BUILD_RULE, (0, cityBuild_1.default)(game)],
    ].forEach(([replaces, rules]) => {
        if (game.rules.getById(replaces)) {
            game.rules.after(replaces, ...rules);
            return;
        }
        game.rules.register(...rules);
    });
    // civ-clone/web-renderer#1072: civ2-science is loaded after this, so its cost rule isn't there to be placed after;
    //  only one of the two is ever on.
    game.rules.register(...(0, cost_1.default)(game));
};
exports.register = register;
// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map