"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.fixedBarbarianBuild = void 0;
const cityBuild_1 = require("@civ-clone/civ2-barbarians/lib/cityBuild");
const uprising_1 = require("@civ-clone/civ2-barbarians/lib/uprising");
const RuleIds_1 = require("../../RuleIds");
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const units_1 = require("@civ-clone/civ2-barbarians/lib/units");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const Units_1 = require("@civ-clone/civ2-unit/Units");
/**
 * What a barbarian city builds: as `civ2-barbarians`' `barbarianBuild`, but a city that isn't building a unit starts
 *  with the main unit of the barbarians' own uprising table for what anyone knows (`uprisingTypes`, unswapped), rather
 *  than the Legion, or Knights once anyone knows Explosives.
 */
const fixedBarbarianBuild = (game, city) => {
    const last = (0, cityBuild_1.lastBuilt)(game, city);
    if (last === null || (0, units_1.indexOf)(last) < 1 || last === Units_1.Settlers) {
        const [main] = (0, uprising_1.uprisingTypes)((0, uprising_1.uprisingKnowledge)(game, city), false);
        return main;
    }
    return (0, cityBuild_1.upgradeOf)(game, last);
};
exports.fixedBarbarianBuild = fixedBarbarianBuild;
/** `civ2-barbarians`' `CITY_BUILD_RULE`, with `fixedBarbarianBuild` in place of `barbarianBuild`. */
const getRules = (game) => [
    new Build_1.Build(RuleIds_1.BARBARIAN_CITY_BUILD_RULE, new Criterion_1.default((city) => (0, isBarbarian_1.default)(city.player())), new Effect_1.default((city, Item) => new Criterion_1.default(() => Item ===
        (0, exports.fixedBarbarianBuild)(game, city)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cityBuild.js.map