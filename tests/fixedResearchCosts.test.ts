import {
  Alphabet,
  FutureTechnology,
  TheRepublic,
  Writing,
} from '@civ-clone/civ2-science/Advances';
import { COST_RULE as CIV2_COST } from '@civ-clone/civ2-science/RuleIds';
import { TIERED_COST_RULE as TIERED_COST } from '../RuleIds';
import {
  positionWeights,
  tierOf,
} from '@civ-clone/base-science-research-tiered-cost/lib/tiers';
import Advance from '@civ-clone/core-science/Advance';
import Client from '@civ-clone/core-client/Client';
import Cost from '@civ-clone/core-science/Rules/Cost';
import { FIXED_RESEARCH_COSTS } from '../RuleSets';
import { Game } from '@civ-clone/core-game/Game';
import { King } from '@civ-clone/civ2-difficulty/Difficulties';
import Player from '@civ-clone/core-player/Player';
import check from '@civ-clone/base-science-research-tiered-cost/lib/check';
import { expect } from 'chai';
import prerequisiteCounts from '@civ-clone/base-science-research-tiered-cost/lib/prerequisites';
import { rampedStep } from '@civ-clone/civ2-science/lib/cost';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';
import { register as registerScience } from '@civ-clone/civ2-science/registerRules';
import researchTiers from '../ResearchTiers';
import { advances as rows } from '@civ-clone/civ2-science/data/advances';
import { tieredAdvances } from '../lib/advanceTiers';

// A game with civ2-diplomacy, this package and civ2-science, in the plugin loader's order (by name), and a person at
//  King knowing `known`, the set switched as given.
const setUp = ({
  on = true as boolean | null,
  known = [] as (typeof Advance)[],
} = {}) => {
  const game = new Game();

  game.advances.register(...rows.map(([AdvanceType]) => AdvanceType));
  registerDiplomacy(game);
  register(game);
  registerScience(game);

  const player = new Player(game.rules),
    playerResearch = game.playerResearch.getByPlayer(player);

  if (on !== null) {
    game.ruleSets.set(FIXED_RESEARCH_COSTS, on);
  }

  game.difficulty.set(King);
  game.clients.register(new Client(player));
  known.forEach((Known) => playerResearch.addAdvance(Known));

  return {
    game,
    cost: (AdvanceType: typeof Advance) => {
      const rules = game.rules
        .get(Cost)
        .filter((rule) => rule.validate(AdvanceType, playerResearch));

      return {
        rules: rules.map((rule) => rule.id()),
        cost: game.rules.process(Cost, AdvanceType, playerResearch)[0],
      };
    },
  };
};

describe('fixed research costs (civ-clone/web-renderer#1072)', (): void => {
  it("should be off to start with, leaving civ2-science's cost", (): void => {
    const { game, cost } = setUp({ on: null, known: [Alphabet] });

    expect(game.ruleSets.state(FIXED_RESEARCH_COSTS)).to.equal('off');
    // 12, extra 9 × 2 / 20 = 0, × 67 / 89 = 9, the floor 11 − 2 = 9; × 2.
    expect(cost(Writing)).to.eql({ rules: [CIV2_COST], cost: 18 });
  });

  it("should have tiers that rise, near the steady path by Civilization II's own ramp, no advance cheaper than one it needs", (): void => {
    const { game } = setUp(),
      advances = tieredAdvances(game);

    expect(advances).to.have.length(88);
    expect(
      check(advances, game.requirements.entries(), researchTiers, {
        stepCost: rampedStep,
        tolerance: 0.005,
      })
    ).to.eql([]);

    // Each weight is its tier's mean step cost, rounded.
    const exact = positionWeights(
      prerequisiteCounts(advances, game.requirements.entries()),
      researchTiers.map(({ upTo }) => upTo),
      rampedStep
    );

    researchTiers.forEach(({ weight }, index) =>
      expect(weight, `tier ${index + 1}`).to.be.closeTo(exact[index], 0.5)
    );
  });

  it("should cost an advance its tier's weight times the ratio without the ramp or the floor", (): void => {
    // Knowing nothing (1, as Civilization II counts): 12 × 67 / 89 = 9. Alphabet is in the first tier: 5 × 9.
    expect(setUp().cost(Alphabet)).to.eql({ rules: [TIERED_COST], cost: 45 });
    // Writing needs Alphabet, the second tier: 22 × 9.
    expect(setUp({ known: [Alphabet] }).cost(Writing).cost).to.equal(198);
  });

  it('should cost the same however many advances its player knows, so a beeline gets no discount', (): void => {
    const tiers = prerequisiteCounts(
        tieredAdvances(setUp().game),
        setUp().game.requirements.entries()
      ),
      republic = researchTiers[tierOf(tiers.get(TheRepublic)!, researchTiers)];

    // Fewer than 20 known, level with the reference: the ratio is 9 however many.
    expect(setUp({ known: [Alphabet] }).cost(TheRepublic).cost).to.equal(
      republic.weight * 9
    );
    expect(
      setUp({
        known: rows
          .map(([AdvanceType]) => AdvanceType)
          .filter((AdvanceType) => AdvanceType !== TheRepublic)
          .slice(0, 12),
      }).cost(TheRepublic).cost
    ).to.equal(republic.weight * 9);
  });

  it("should leave Future Technology to civ2-science's cost", (): void => {
    expect(setUp().cost(FutureTechnology).cost).to.equal(
      setUp({ on: false }).cost(FutureTechnology).cost
    );
  });
});
