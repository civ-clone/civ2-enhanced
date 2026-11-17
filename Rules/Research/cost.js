"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const cost_1 = require("@civ-clone/civ2-science/Rules/Research/cost");
const cost_2 = require("@civ-clone/civ2-science/lib/cost");
const Cost_1 = require("@civ-clone/core-science/Rules/Cost");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const RuleIds_1 = require("../../RuleIds");
const advanceTiers_1 = require("../../lib/advanceTiers");
const ResearchTiers_1 = require("../../ResearchTiers");
const getRules = (game) => {
    const context = {
        gameDifficultyRegistry: game.difficulty,
        clientRegistry: game.clients,
        playerResearchRegistry: game.playerResearch,
        turn: game.turn,
        playerWorldRegistry: game.playerWorlds,
        ruleRegistry: game.rules,
    };
    return [
        // Civilization II's ratio (the level, the reference player, past 19 advances, the paradigm, the ramp, the 89
        //  advances and the map's size) times the advance's tier's weight, in place of times the advances gained. The ramp
        //  whole, as from the twentieth advance on, so the ratio rounds as Civilization II's does, and the weights carry
        //  the rest of it; without a person's floor of 11 − n, as `civ1-enhanced`'s leaves out Civilization's. Stopping at
        //  32000, as Civilization II's does. An advance with no tier (Future Technology, Plumbing, or one that isn't
        //  Civilization II's) costs what it does by `civ2-science`'s rule. Either times the game's `RateMultiplier` rules
        //  (`RESEARCH_COST_BY_AGE`, civ-clone/web-renderer#1077), as `civ2-science`'s own cost is: 1 with none.
        new Cost_1.default(RuleIds_1.TIERED_COST_RULE, new Effect_1.default((CostAdvance, playerResearch) => {
            const inputs = (0, cost_1.costInputs)(context, playerResearch), multiplier = (0, cost_1.rateMultiplier)(context, playerResearch), tier = (0, advanceTiers_1.default)(game).get(CostAdvance);
            return tier === undefined
                ? (0, cost_2.default)(inputs, multiplier)
                : (0, cost_2.multipliedCost)(ResearchTiers_1.default[tier].weight *
                    (0, cost_2.researchRate)(inputs, { ramp: 'full', floor: false }), multiplier);
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map