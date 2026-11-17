"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.ownPollution = void 0;
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Pollution_1 = require("@civ-clone/base-tile-improvement-pollution/Pollution");
const RuleIds_1 = require("../../RuleIds");
const Score_1 = require("@civ-clone/core-score/Rules/Score");
const isHuman_1 = require("@civ-clone/civ2-difficulty/isHuman");
const scoring_1 = require("@civ-clone/civ2-score/lib/scoring");
const pollution_1 = require("@civ-clone/civ2-score/lib/pollution");
/**
 * `player`'s own pollution, as `civ2-score`'s `worldPollution` counts the world's: the polluted squares in its cities'
 *  radii, and, for a computer player, those counted again for each of its cities that holds them.
 */
const ownPollution = (game, player) => {
    const cities = game.cities
        .getByPlayer(player)
        .filter((city) => !city.destroyed()), radii = new Set(cities.flatMap((city) => city.tiles().entries()));
    return (0, pollution_1.default)(game.tileImprovements.filter((improvement) => improvement instanceof Pollution_1.default && radii.has(improvement.tile())), (0, isHuman_1.default)(player, game.clients) ? [] : cities);
};
exports.ownPollution = ownPollution;
/** `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution rather than the world's. */
const getRules = (game) => [
    new Score_1.default(RuleIds_1.POLLUTION_SCORE_RULE, new Effect_1.default((player) => {
        const { polluted, discounted } = (0, exports.ownPollution)(game, player);
        return { term: 'pollution', value: (0, scoring_1.pollutionScore)(polluted, discounted) };
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution.js.map