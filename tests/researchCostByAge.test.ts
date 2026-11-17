import * as Difficulties from '@civ-clone/civ2-difficulty/Difficulties';
import { AGES, FIXED_RESEARCH_COSTS, RESEARCH_COST_BY_AGE } from '../RuleSets';
import {
  Alphabet,
  FusionPower,
  FutureTechnology,
  Philosophy,
  Recycling,
  Writing,
} from '@civ-clone/civ2-science/Advances';
import { COST_RULE as CIV2_COST } from '@civ-clone/civ2-science/RuleIds';
import {
  CostContext,
  costInputs,
} from '@civ-clone/civ2-science/Rules/Research/cost';
import researchCost, {
  ResearchCostInputs,
  rampedStep,
  researchRate,
} from '@civ-clone/civ2-science/lib/cost';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Advance from '@civ-clone/core-science/Advance';
import Client from '@civ-clone/core-client/Client';
import Cost from '@civ-clone/core-science/Rules/Cost';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import RateMultiplier from '@civ-clone/civ2-science/Rules/Research/RateMultiplier';
import { advanceIndex } from '@civ-clone/civ2-science/lib/advanceIndex';
import advanceTiers from '../lib/advanceTiers';
import { ageRateMultipliers } from '../AgeResearchRates';
import { epochOf } from '../lib/latestEpoch';
import { expect } from 'chai';
import prerequisiteCounts from '@civ-clone/base-science-research-tiered-cost/lib/prerequisites';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';
import { register as registerScience } from '@civ-clone/civ2-science/registerRules';
import researchTiers from '../ResearchTiers';
import { advances as rows } from '@civ-clone/civ2-science/data/advances';
import { tieredAdvances } from '../lib/advanceTiers';

const { King, Chieftain } = Difficulties;

// A game with civ2-diplomacy, this package and civ2-science, in the plugin loader's order (by name), and a person (or a
//  computer player) at `Level` knowing `known`, the sets switched as given (`null` leaves a set as it starts).
const setUp = ({
  byAge = true as boolean | null,
  fixed = null as boolean | null,
  ages = null as boolean | null,
  human = true,
  Level = King as typeof King,
  known = [] as (typeof Advance)[],
} = {}) => {
  const game = new Game();

  game.advances.register(...rows.map(([AdvanceType]) => AdvanceType));
  registerDiplomacy(game);
  register(game);
  registerScience(game);

  (
    [
      [RESEARCH_COST_BY_AGE, byAge],
      [FIXED_RESEARCH_COSTS, fixed],
      [AGES, ages],
    ] as [string, boolean | null][]
  ).forEach(([id, value]) => {
    if (value !== null) {
      game.ruleSets.set(id, value);
    }
  });

  const player = new Player(game.rules),
    playerResearch = game.playerResearch.getByPlayer(player);

  game.difficulty.set(Level);
  game.clients.register(human ? new Client(player) : new AIClient(player));
  known.forEach((Known) => playerResearch.addAdvance(Known));

  const context: CostContext = {
    gameDifficultyRegistry: game.difficulty,
    clientRegistry: game.clients,
    playerResearchRegistry: game.playerResearch,
    turn: game.turn,
    playerWorldRegistry: game.playerWorlds,
  };

  return {
    game,
    playerResearch,
    cost: (AdvanceType: typeof Advance): number =>
      game.rules.process(Cost, AdvanceType, playerResearch)[0],
    rules: (AdvanceType: typeof Advance): (string | undefined)[] =>
      game.rules
        .get(Cost)
        .filter((rule) => rule.validate(AdvanceType, playerResearch))
        .map((rule) => rule.id()),
    // Civilization II's own cost now, as `civ2-science` works it out with no multiplier.
    inputs: (): ResearchCostInputs => costInputs(context, playerResearch),
  };
};

// The steady path the fixed research costs' tiers were set by: the advances in order of how many advances each needs,
//  RULES.TXT's order among those with as many.
const steadyPath = (): (typeof Advance)[] => {
  const { game } = setUp(),
    counts = prerequisiteCounts(
      tieredAdvances(game),
      game.requirements.entries()
    );

  return [...counts.keys()].sort(
    (a, b) =>
      counts.get(a)! - counts.get(b)! || advanceIndex(a) - advanceIndex(b)
  );
};

// What learning `path` in turn costs with the multipliers, over what it costs without: each advance at its player's
//  age before it, the n-th costing `step(n, advance)`.
const totalRatio = (
  path: (typeof Advance)[],
  step: (n: number, AdvanceType: typeof Advance) => number
): number => {
  let latest = 0,
    by = 0,
    today = 0;

  path.forEach((AdvanceType, index) => {
    const cost = step(index + 1, AdvanceType);

    by += cost * ageRateMultipliers[latest];
    today += cost;
    latest = Math.max(latest, epochOf(AdvanceType)!);
  });

  return by / today;
};

describe('research cost by age (civ-clone/web-renderer#1077, for Civilization II)', (): void => {
  it('should be off to start with, supersede nothing, and add no multiplier', (): void => {
    const { game, playerResearch } = setUp({ byAge: null });

    expect(game.ruleSets.state(RESEARCH_COST_BY_AGE)).to.equal('off');
    expect(game.ruleSets.get(RESEARCH_COST_BY_AGE)!.supersedes()).to.eql([]);
    expect(game.rules.process(RateMultiplier, playerResearch)).to.eql([]);
  });

  it('should slide from 0.5 over the four ages, each a little over 4/3 the last', (): void => {
    expect(ageRateMultipliers).to.have.length(4);
    expect(ageRateMultipliers[0]).to.equal(0.5);
    ageRateMultipliers
      .slice(1)
      .forEach((multiplier, index) =>
        expect(multiplier / ageRateMultipliers[index]).to.be.closeTo(
          1.328,
          0.01
        )
      );
  });

  it("should cost about what learning every advance steadily does today, by Civilization II's cost or the fixed costs", (): void => {
    const path = steadyPath(),
      { game } = setUp(),
      tiers = advanceTiers(game);

    expect(path).to.have.length(88);
    // By Civilization II's own cost: the n-th advance costs n times the ratio, with its ramp.
    expect(totalRatio(path, (n) => rampedStep(n))).to.be.closeTo(1, 0.005);
    // By the fixed research costs: each its tier's weight.
    expect(
      totalRatio(
        path,
        (n, AdvanceType) => researchTiers[tiers.get(AdvanceType)!].weight
      )
    ).to.be.closeTo(1, 0.005);
  });

  it("should leave Civilization II's cost as it is with the set off, whatever is known and whoever plays, the ages on or off", (): void => {
    const learnable = rows
      .map(([AdvanceType]) => AdvanceType)
      .filter((AdvanceType) => AdvanceType !== FutureTechnology);
    let checked = 0;

    [false, null].forEach((byAge) =>
      [null, true].forEach((ages) =>
        [true, false].forEach((human) =>
          Object.values(Difficulties).forEach((Level) => {
            const { cost, rules, inputs, playerResearch } = setUp({
              byAge,
              ages,
              human,
              Level: Level as typeof King,
            });

            learnable.forEach((Known, index) => {
              if (index % 4 === 0) {
                expect(rules(Writing)).to.eql([CIV2_COST]);
                expect(cost(Writing), `${Level.name} ${index}`).to.equal(
                  researchCost(inputs())
                );
                expect(cost(FutureTechnology)).to.equal(researchCost(inputs()));
                checked++;
              }

              playerResearch.addAdvance(Known);
            });
          })
        )
      )
    );

    expect(checked).to.equal(
      2 * 2 * 2 * Object.values(Difficulties).length * 23
    );
  });

  it('should leave the fixed research costs as they are with the set off', (): void => {
    const { cost, inputs } = setUp({
      byAge: false,
      fixed: true,
      known: [Alphabet],
    });

    // Writing is in the second tier: 12 × the ratio with the whole ramp and no floor, 15.
    expect(cost(Writing)).to.equal(
      12 * researchRate(inputs(), { ramp: 'full', floor: false })
    );
    expect(cost(Writing)).to.equal(180);
  });

  it("should multiply Civilization II's cost by the player's age's, to the nearest whole bulb", (): void => {
    // Knowing Alphabet, 2 counted: 12, extra 0, × 67 / 89 = 9, the floor 11 − 2 = 9; × 2 = 18, × 0.5 in the Ancient.
    expect(setUp({ byAge: false, known: [Alphabet] }).cost(Writing)).to.equal(
      18
    );
    expect(setUp({ known: [Alphabet] }).cost(Writing)).to.equal(9);
    // Knowing Philosophy, the Renaissance: 18 × 0.66 = 11.88, to 12, for any advance, Writing too.
    expect(setUp({ known: [Philosophy] }).cost(Writing)).to.equal(12);
    // Knowing Fusion Power, the Modern: 18 × 1.17 = 21.06, to 21.
    expect(setUp({ known: [FusionPower] }).cost(Writing)).to.equal(21);
  });

  it("should keep a person's floor of 11 − n, as today's cost has it, and multiply it", (): void => {
    // On Chieftain, knowing nothing: 6 × 67 / 89 = 4, raised to 11 − 1 = 10; × 0.5 = 5, not 4 × 0.5 = 2.
    expect(setUp({ byAge: false, Level: Chieftain }).cost(Writing)).to.equal(
      10
    );
    expect(setUp({ Level: Chieftain }).cost(Writing)).to.equal(5);
  });

  it("should multiply the fixed costs by the player's age's too", (): void => {
    // Alphabet is in the first tier, 3 × 15 = 45, × 0.5 = 22.5, to 23; Writing in the second, 12 × 15 = 180, × 0.5.
    expect(setUp({ fixed: true }).cost(Alphabet)).to.equal(23);
    expect(setUp({ fixed: true, known: [Alphabet] }).cost(Writing)).to.equal(
      90
    );
    // Knowing Philosophy, the Renaissance: 180 × 0.66 = 118.8, to 119.
    expect(setUp({ fixed: true, known: [Philosophy] }).cost(Writing)).to.equal(
      119
    );
  });

  it('should multiply Future Technology too, by either cost', (): void => {
    [null, true].forEach((fixed) => {
      const off = setUp({
          byAge: false,
          fixed,
          known: [FusionPower, Recycling],
        }),
        on = setUp({ fixed, known: [FusionPower, Recycling] });

      expect(on.cost(FutureTechnology)).to.equal(
        Math.round(off.cost(FutureTechnology) * 1.17)
      );
    });
  });

  it('should price the advance that starts a new age at the age before', (): void => {
    const { playerResearch } = setUp({ known: [Alphabet] });

    playerResearch.research(Philosophy);

    // Still in the Ancient: 18 × 0.5.
    expect(playerResearch.cost().value()).to.equal(9);
  });

  it('should never turn a cost under 32000 into 32000 by multiplying it, nor round it to nothing', (): void => {
    let checked = 0;

    [0, 1, 2, 5, 10, 19, 20, 40, 88, 120, 250].forEach((advances) =>
      [0, 5, 20, 60].forEach((reference) =>
        [0, 1, 2, 3, 4, 5].forEach((level) =>
          [true, false].forEach((human) =>
            [0, 1, 151, 400].forEach((turn) =>
              (['small', 'normal', 'large'] as const).forEach((mapSize) => {
                const inputs: ResearchCostInputs = {
                    advances,
                    reference,
                    level,
                    human,
                    turn,
                    techParadigm: 10,
                    enabledAdvances: 89,
                    mapSize,
                  },
                  today = researchCost(inputs);

                if (today === 32000) {
                  return;
                }

                ageRateMultipliers.forEach((multiplier) => {
                  const by = researchCost(inputs, multiplier);

                  expect(by).to.be.at.least(1);
                  expect(by).to.equal(
                    Math.min(Math.round(today * multiplier), 32000)
                  );
                });
                checked++;
              })
            )
          )
        )
      )
    );

    expect(checked).to.be.above(1000);
  });
});
