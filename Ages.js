"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.researchAges = exports.Modern = exports.Industrial = exports.Renaissance = exports.Ancient = void 0;
const Age_1 = require("@civ-clone/base-science-age/Age");
// Civilization II's four epochs as ages (civ-clone/web-renderer#1076's for Civilization II): each advance's epoch is
//  RULES.TXT's @CIVILIZE column, `civ2-science`'s `data/advances`, where the original uses it only to choose the
//  advance's picture. Named as Civilization's ages of the same name are, so the interface's words serve both.
class Ancient extends Age_1.default {
}
exports.Ancient = Ancient;
class Renaissance extends Age_1.default {
}
exports.Renaissance = Renaissance;
class Industrial extends Age_1.default {
}
exports.Industrial = Industrial;
class Modern extends Age_1.default {
}
exports.Modern = Modern;
/** The ages in order: the n-th is the age of the advances of epoch n. */
exports.researchAges = [
    Ancient,
    Renaissance,
    Industrial,
    Modern,
];
exports.default = exports.researchAges;
//# sourceMappingURL=Ages.js.map