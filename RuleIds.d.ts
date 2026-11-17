/** A computer player's attitude drifts each turn from 0. */
export declare const ATTITUDE_DRIFT_RULE =
  'civ2-enhanced:player/turn-start/attitude-drift';
/** A computer player counts every square its borders are intruded on. */
export declare const BORDER_INTRUDERS_RULE =
  'civ2-enhanced:player/turn-start/border-intruders';
/** A computer player breaks a treaty openly, on both sides. */
export declare const TREATY_BREAKING_RULE =
  'civ2-enhanced:player/turn-start/treaty-breaking';
/** An advance costs its tier's weight times Civilization II's ratio, whatever its player knows. */
export declare const TIERED_COST_RULE = 'civ2-enhanced:research/cost/by-tier';
/** A land uprising sited and sized by the city drawn for it, and announced when it finds no square. */
export declare const UPRISING_RULE = 'civ2-enhanced:turn/start/land-uprising';
/** A barbarian city starts with the main unit of the barbarians' uprising table. */
export declare const BARBARIAN_CITY_BUILD_RULE =
  'civ2-enhanced:city/build/barbarian';
/** A civilization's score loses 10 for each polluted square in its own cities' radii, each once. */
export declare const POLLUTION_SCORE_RULE =
  'civ2-enhanced:player/score/pollution';
