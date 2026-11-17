"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceTiers = exports.tieredAdvances = void 0;
const advanceIndex_1 = require("@civ-clone/civ2-science/lib/advanceIndex");
const prerequisites_1 = require("@civ-clone/base-science-research-tiered-cost/lib/prerequisites");
const ResearchTiers_1 = require("../ResearchTiers");
const tiers_1 = require("@civ-clone/base-science-research-tiered-cost/lib/tiers");
/**
 * The advances that have a tier: Civilization II's that the game makes available (not Plumbing) and that can't be
 * repeated. One a plugin adds that isn't Civilization II's has none, and costs what it does by `civ2-science`'s rule.
 */
const tieredAdvances = (game) => game.advances.filter((AdvanceType) => !AdvanceType.repeatable &&
    (0, advanceIndex_1.advanceIndex)(AdvanceType) >= 0 &&
    (0, advanceIndex_1.isEnabled)((0, advanceIndex_1.advanceIndex)(AdvanceType)));
exports.tieredAdvances = tieredAdvances;
const kept = new WeakMap();
/**
 * Which of `researchTiers` each advance with a tier is in, by its index (civ-clone/web-renderer#1072).
 *
 * Read from the game's advances and `requires` entries when first asked for: this package is loaded before
 * `civ2-science`, so they aren't there yet when it registers, and a plugin's changes to them count. Kept for the game
 * only once some advance needs another, so an answer asked for before the entries are added isn't kept for good.
 */
const advanceTiers = (game) => {
    const known = kept.get(game);
    if (known !== undefined) {
        return known;
    }
    const counts = (0, prerequisites_1.default)((0, exports.tieredAdvances)(game), game.requirements.entries()), tiers = new Map([...counts].map(([AdvanceType, count]) => [
        AdvanceType,
        (0, tiers_1.tierOf)(count, ResearchTiers_1.default),
    ]));
    if ([...counts.values()].some((count) => count > 0)) {
        kept.set(game, tiers);
    }
    return tiers;
};
exports.advanceTiers = advanceTiers;
exports.default = exports.advanceTiers;
//# sourceMappingURL=advanceTiers.js.map