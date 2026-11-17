// The ids of this package's rules that another package is expected to name: a host that switches or describes them.

/** A computer player's attitude drifts each turn from 0. */
export const ATTITUDE_DRIFT_RULE =
  'civ2-enhanced:player/turn-start/attitude-drift';

/** A computer player counts every square its borders are intruded on. */
export const BORDER_INTRUDERS_RULE =
  'civ2-enhanced:player/turn-start/border-intruders';

/** A computer player breaks a treaty openly, on both sides. */
export const TREATY_BREAKING_RULE =
  'civ2-enhanced:player/turn-start/treaty-breaking';

/** An advance costs its tier's weight times Civilization II's ratio, whatever its player knows. */
export const TIERED_COST_RULE = 'civ2-enhanced:research/cost/by-tier';

/** A civilization's age is that of the latest epoch it knows an advance of (civ-clone/web-renderer#1076). */
export const AGE_BY_EPOCH_RULE = 'civ2-enhanced:research/age/by-epoch';

/** A civilization added tells of no age for what it is given, until the next turn starts. */
export const AGES_JOINED_RULE = 'civ2-enhanced:player/added/hold-ages';

/** As a turn starts, the civilizations added before it tell of their ages. */
export const AGES_SETTLED_RULE = 'civ2-enhanced:turn/start/settle-ages';

/** An advance gained that starts a new age for its player reaches it. */
export const REACH_AGE_RULE = 'civ2-enhanced:research/complete/reach-age';

/** A player reaching an age is told to the engine's listeners (`player:age-reached`). */
export const AGE_REACHED_RULE = 'civ2-enhanced:player/age-reached/emit';

/** The research cost is multiplied by the player's age's (civ-clone/web-renderer#1077). */
export const RATE_MULTIPLIER_BY_AGE_RULE =
  'civ2-enhanced:research/rate-multiplier/by-age';

/** A land uprising sited and sized by the city drawn for it, and announced when it finds no square. */
export const UPRISING_RULE = 'civ2-enhanced:turn/start/land-uprising';

/** A barbarian city starts with the main unit of the barbarians' uprising table. */
export const BARBARIAN_CITY_BUILD_RULE = 'civ2-enhanced:city/build/barbarian';

/** A civilization's score loses 10 for each polluted square in its own cities' radii, each once. */
export const POLLUTION_SCORE_RULE = 'civ2-enhanced:player/score/pollution';
