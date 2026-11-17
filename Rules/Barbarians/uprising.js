"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.fixedUprising = exports.UPRISING_FAILED = void 0;
const uprising_1 = require("@civ-clone/civ2-barbarians/lib/uprising");
const activity_1 = require("@civ-clone/civ2-barbarians/lib/activity");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const RuleIds_1 = require("../../RuleIds");
const pickResearch_1 = require("@civ-clone/civ2-science/lib/pickResearch");
const level_1 = require("@civ-clone/civ2-difficulty/level");
const spawning_1 = require("@civ-clone/base-barbarians/lib/spawning");
const onset_1 = require("@civ-clone/civ2-barbarians/lib/onset");
const seaRaid_1 = require("@civ-clone/civ2-barbarians/lib/seaRaid");
/** Emitted with the city's player and the city when an uprising drawn for it finds no square. */
exports.UPRISING_FAILED = 'barbarians:uprising-failed';
/**
 * The uprising as the original means it: the square's offset east runs −12 to 12 half columns (the same as west, as
 *  north and south run −6 to 6 rows), each try is centred on the city drawn, which the square must share a land mass
 *  with and which sizes the horde; and a failure is announced.
 */
const fixedUprising = (game) => ({
    ...uprising_1.CLASSIC_UPRISING,
    xOffset: (roll) => (roll - 6) * 2,
    byRolledCity: true,
    dropped: (city) => {
        game.engine.emit(exports.UPRISING_FAILED, city.player(), city);
    },
});
exports.fixedUprising = fixedUprising;
/** `civ2-barbarians`' `LAND_UPRISING_RULE`, with `fixedUprising` in place of the original's choices. */
const getRules = (game) => [
    new Start_1.default(RuleIds_1.UPRISING_RULE, new Criterion_1.default((turn) => (0, spawning_1.default)(game.rules, turn)), new Effect_1.default((turn) => {
        if ((0, seaRaid_1.uprisingSkipped)(game, turn.value())) {
            return;
        }
        const city = (0, uprising_1.uprisingCity)(game, () => (0, pickResearch_1.cRand)(game.rng));
        if (city === null) {
            return;
        }
        (0, uprising_1.default)(game, city, (0, activity_1.activityLevel)(game), (0, level_1.levelOf)(game.difficulty), (0, onset_1.spawnTurn)(turn), (0, exports.fixedUprising)(game));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=uprising.js.map