import Age from '@civ-clone/base-science-age/Age';
export declare class Ancient extends Age {}
export declare class Renaissance extends Age {}
export declare class Industrial extends Age {}
export declare class Modern extends Age {}
/** The ages in order: the n-th is the age of the advances of epoch n. */
export declare const researchAges: (typeof Age)[];
export default researchAges;
