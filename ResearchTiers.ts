import { Tier } from '@civ-clone/base-science-research-tiered-cost/lib/tiers';

/**
 * Civilization II's advances in eight tiers by how many advances each needs in its whole tree, and what a step of the
 * ratio costs in each (civ-clone/web-renderer#1072, as `civ1-enhanced`'s for Civilization). The ratio takes
 * Civilization II's whole ramp, three quarters more, as it has from the twentieth advance on (`civ2-science`'s
 * `researchRate` `ramp: 'full'`), so each weight is the tier's mean cost in steps of that when the 88 advances that can
 * be learnt once are learnt in order of their prerequisites (`fullRampStep`): 2.7, 12.5, 25, 35.5, 46, 56.5, 68.5 and
 * 81.5, rounded. Learning them all then costs within 0.3% of what learning them steadily does by Civilization II's own
 * cost, at every level and on every size of map.
 *
 * 1. Alphabet, Bronze Working, Ceremonial Burial, Horseback Riding, Masonry, Pottery, Warrior Code (7).
 * 2. 1 to 3 prerequisites (13). 3. 4 to 8 (9). 4. 9 to 15 (12). 5. 16 to 25 (9). 6. 26 to 36 (12). 7. 37 to 50 (12).
 * 8. 51 or more (14).
 */
export const researchTiers: Tier[] = [
  { upTo: 0, weight: 3 },
  { upTo: 3, weight: 12 },
  { upTo: 8, weight: 25 },
  { upTo: 15, weight: 36 },
  { upTo: 25, weight: 46 },
  { upTo: 36, weight: 56 },
  { upTo: 50, weight: 69 },
  { upTo: Infinity, weight: 81 },
];

export default researchTiers;
