import {
  CostContext,
  costInputs,
} from '@civ-clone/civ2-science/Rules/Research/cost';
import researchCost, {
  capped,
  researchRate,
} from '@civ-clone/civ2-science/lib/cost';
import Advance from '@civ-clone/core-science/Advance';
import Cost from '@civ-clone/core-science/Rules/Cost';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game/Game';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { TIERED_COST_RULE } from '../../RuleIds';
import advanceTiers from '../../lib/advanceTiers';
import researchTiers from '../../ResearchTiers';

/** The parts of a game the cost is read from. */
export type ResearchCostGame = Pick<
  Game,
  | 'advances'
  | 'clients'
  | 'difficulty'
  | 'playerResearch'
  | 'playerWorlds'
  | 'requirements'
  | 'turn'
>;

export const getRules = (game: ResearchCostGame): Cost[] => {
  const context: CostContext = {
    gameDifficultyRegistry: game.difficulty,
    clientRegistry: game.clients,
    playerResearchRegistry: game.playerResearch,
    turn: game.turn,
    playerWorldRegistry: game.playerWorlds,
  };

  return [
    // Civilization II's ratio (the level, the reference player, past 19 advances, the paradigm, the ramp, the 89
    //  advances and the map's size) times the advance's tier's weight, in place of times the advances gained. The ramp
    //  whole, as from the twentieth advance on, so the ratio rounds as Civilization II's does, and the weights carry
    //  the rest of it; without a person's floor of 11 − n, as `civ1-enhanced`'s leaves out Civilization's. Stopping
    //  at 32000, as Civilization II's does. An advance with no tier (Future Technology) costs what it does by
    //  `civ2-science`'s rule.
    new Cost(
      TIERED_COST_RULE,
      new Effect(
        (
          CostAdvance: typeof Advance,
          playerResearch: PlayerResearch
        ): number => {
          const inputs = costInputs(context, playerResearch),
            tier = advanceTiers(game).get(CostAdvance);

          return tier === undefined
            ? researchCost(inputs)
            : capped(
                researchTiers[tier].weight *
                  researchRate(inputs, { ramp: 'full', floor: false })
              );
        }
      )
    ),
  ];
};

export default getRules;
