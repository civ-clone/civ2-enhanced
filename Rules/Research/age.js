"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleIds_1 = require("../../RuleIds");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const AgeOf_1 = require("@civ-clone/base-science-age/Rules/AgeOf");
const AgeReached_1 = require("@civ-clone/base-science-age/Rules/AgeReached");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const events_1 = require("@civ-clone/base-science-age/lib/events");
const latestEpoch_1 = require("../../lib/latestEpoch");
const joining_1 = require("@civ-clone/base-science-age/lib/joining");
const latestAge_1 = require("@civ-clone/base-science-age/lib/latestAge");
const reached_1 = require("@civ-clone/base-science-age/lib/reached");
const Ages_1 = require("../../Ages");
const getRules = (game) => {
    const held = (0, joining_1.default)();
    return [
        // A civilization is in the age of the latest epoch it knows an advance of, and in the first knowing none.
        new AgeOf_1.default(RuleIds_1.AGE_BY_EPOCH_RULE, new Effect_1.default((0, latestAge_1.latestAge)(Ages_1.default, (AdvanceType) => {
            const epoch = (0, latestEpoch_1.epochOf)(AdvanceType);
            return epoch === undefined ? undefined : Ages_1.default[epoch];
        }))),
        // A civilization added, as the game is set up or when a civil war splits one part-way through a turn with the
        //  advances it inherits, tells of no age for what it is given until the next turn starts (`lib/joining`). The
        //  advances `civ2-player`'s start balancing gives are given before the first turn, and tell of none either.
        new Added_1.default(RuleIds_1.AGES_JOINED_RULE, new Effect_1.default(held.joined)),
        new Start_1.default(RuleIds_1.AGES_SETTLED_RULE, new Effect_1.default(held.settled)),
        // After `civ2-science`'s rule tells of the advance itself.
        new Complete_1.default(RuleIds_1.REACH_AGE_RULE, new Low_1.default(), new Effect_1.default((0, reached_1.reachAge)(game.rules, (playerResearch) => game.turn.value() > 0 && held.ready(playerResearch)))),
        new AgeReached_1.default(RuleIds_1.AGE_REACHED_RULE, new Effect_1.default((0, events_1.emitAgeReached)(game.engine))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=age.js.map