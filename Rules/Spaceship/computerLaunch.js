"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleIds_1 = require("../../RuleIds");
const computer_1 = require("@civ-clone/civ2-spaceship/Rules/Spaceship/computer");
/**
 * A computer player's launch as civ2-spaceship decides it, except that above King it waits while another computer
 *  player's ship in flight would arrive before its own, which is what the original means to do (`'other-computers'`).
 */
const getRules = (game) => [
    (0, computer_1.computerLaunchRule)(RuleIds_1.COMPUTER_LAUNCH_WAIT_RULE, 'other-computers', {
        clientRegistry: game.clients,
        gameDifficultyRegistry: game.difficulty,
        pendingEffectRegistry: game.pendingEffects,
        playerRegistry: game.players,
        playerResearchRegistry: game.playerResearch,
        playerTreasuryRegistry: game.playerTreasuries,
        ruleRegistry: game.rules,
        spaceshipRegistry: game.spaceships,
        year: game.year,
    }),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=computerLaunch.js.map