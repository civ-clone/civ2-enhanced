import { Tier } from '@civ-clone/base-science-research-tiered-cost/lib/tiers';
/**
 * Civilization II's advances in eight tiers by how many advances each needs in its whole tree, and what a step of the
 * ratio costs in each (civ-clone/web-renderer#1072, as `civ1-enhanced`'s for Civilization). Each weight is the tier's
 * mean cost when the 88 advances that can be learnt once are learnt in order of their prerequisites, the n-th costing
 * n and three quarters more by the twentieth, as Civilization II's ramp has it (`civ2-science`'s `rampedStep`):
 * 4.75, 21.9, 43.75, 62.1, 80.5, 98.9, 119.9 and 142.6, rounded. They add up to 6,811 steps of the ratio, 0.1% more
 * than learning them steadily by Civilization II's own cost (6,803).
 *
 * 1. Alphabet, Bronze Working, Ceremonial Burial, Horseback Riding, Masonry, Pottery, Warrior Code (7).
 * 2. 1 to 3 prerequisites (13). 3. 4 to 8 (9). 4. 9 to 15 (12). 5. 16 to 25 (9). 6. 26 to 36 (12). 7. 37 to 50 (12).
 * 8. 51 or more (14).
 */
export declare const researchTiers: Tier[];
export default researchTiers;
