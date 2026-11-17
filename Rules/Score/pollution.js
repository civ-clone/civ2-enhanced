"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.ownPollution = void 0;
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Pollution_1 = require("@civ-clone/base-tile-improvement-pollution/Pollution");
const RuleIds_1 = require("../../RuleIds");
const Score_1 = require("@civ-clone/core-score/Rules/Score");
const scoring_1 = require("@civ-clone/civ2-score/lib/scoring");
const pollution_1 = require("@civ-clone/civ2-score/lib/pollution");
/**
 * How many polluted squares are in `player`'s cities' radii, each once: its own pollution, which it pays for in full.
 */
const ownPollution = (game, player) => {
    const radii = new Set(game.cities
        .getByPlayer(player)
        .filter((city) => !city.destroyed())
        .flatMap((city) => city.tiles().entries()));
    return (0, pollution_1.default)(game.tileImprovements.filter((improvement) => improvement instanceof Pollution_1.default && radii.has(improvement.tile())), []).polluted;
};
exports.ownPollution = ownPollution;
/**
 * `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution: each civilization pays 10 for each
 *  polluted square around its own cities, with no discount, rather than everyone paying for the world's.
 */
const getRules = (game) => [
    new Score_1.default(RuleIds_1.POLLUTION_SCORE_RULE, new Effect_1.default((player) => ({
        term: 'pollution',
        value: (0, scoring_1.pollutionScore)((0, exports.ownPollution)(game, player), 0),
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution.js.map