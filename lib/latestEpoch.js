"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestEpoch = exports.epochOf = void 0;
const advanceIndex_1 = require("@civ-clone/civ2-science/lib/advanceIndex");
/**
 * An advance's epoch, 0 (Ancient) to 3 (Modern), RULES.TXT's @CIVILIZE column (`civ2-science`'s `data/advances`), or
 * `undefined` for Future Technology, which can be repeated, and for an advance that isn't Civilization II's. Plumbing,
 * which no one can learn, keeps its own.
 */
const epochOf = (AdvanceType) => {
    const index = (0, advanceIndex_1.advanceIndex)(AdvanceType);
    return index < 0 || index === advanceIndex_1.FUTURE_TECHNOLOGY ? undefined : (0, advanceIndex_1.rowAt)(index)[5];
};
exports.epochOf = epochOf;
/**
 * The latest epoch `playerResearch`'s player knows an advance of, and 0 knowing none: the index of the age it is in
 * (`Ages`). Worked out from the epochs rather than asked of the ages' own rule, so it holds whether the ages are
 * switched on or not.
 */
const latestEpoch = (playerResearch) => playerResearch
    .complete()
    .reduce((latest, advance) => { var _a; return Math.max(latest, (_a = (0, exports.epochOf)(advance.sourceClass())) !== null && _a !== void 0 ? _a : 0); }, 0);
exports.latestEpoch = latestEpoch;
exports.default = exports.latestEpoch;
//# sourceMappingURL=latestEpoch.js.map