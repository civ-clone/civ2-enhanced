import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { RATE_MULTIPLIER_BY_AGE_RULE } from '../../RuleIds';
import RateMultiplier from '@civ-clone/civ2-science/Rules/Research/RateMultiplier';
import { ageRateMultipliers } from '../../AgeResearchRates';
import latestEpoch from '../../lib/latestEpoch';

export const getRules = (): RateMultiplier[] => [
  // The player's own age's multiplier, so a rush into a later age makes every advance after it dearer, the ones left
  //  behind too. Civilization II's cost has no catch-up by the calendar to move, as Civilization's has from AD: its
  //  ratio rises for being ahead of the turn (up to 6) only past a player's own 19th advance.
  new RateMultiplier(
    RATE_MULTIPLIER_BY_AGE_RULE,
    new Effect(
      (playerResearch: PlayerResearch): number =>
        ageRateMultipliers[latestEpoch(playerResearch)]
    )
  ),
];

export default getRules;
