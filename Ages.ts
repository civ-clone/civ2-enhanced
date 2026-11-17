import Age from '@civ-clone/base-science-age/Age';

// Civilization II's four epochs as ages (civ-clone/web-renderer#1076's for Civilization II): each advance's epoch is
//  RULES.TXT's @CIVILIZE column, `civ2-science`'s `data/advances`, where the original uses it only to choose the
//  advance's picture. Named as Civilization's ages of the same name are, so the interface's words serve both.
export class Ancient extends Age {}
export class Renaissance extends Age {}
export class Industrial extends Age {}
export class Modern extends Age {}

/** The ages in order: the n-th is the age of the advances of epoch n. */
export const researchAges: (typeof Age)[] = [
  Ancient,
  Renaissance,
  Industrial,
  Modern,
];

export default researchAges;
