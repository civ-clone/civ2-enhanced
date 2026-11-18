import {
  AGES,
  ATTITUDE_DRIFT,
  BARBARIAN_CITIES,
  BARBARIAN_UPRISINGS,
  BORDER_INTRUDERS,
  COMPUTER_LAUNCH_WAIT,
  ENHANCED,
  POLLUTION_SCORE,
  FIXED_RESEARCH_COSTS,
  RESEARCH_COST_BY_AGE,
  TREATY_BREAKING,
} from './RuleSets';
import {
  AGE_BY_EPOCH_RULE,
  AGE_REACHED_RULE,
  AGES_JOINED_RULE,
  AGES_SETTLED_RULE,
  ATTITUDE_DRIFT_RULE,
  BARBARIAN_CITY_BUILD_RULE,
  BORDER_INTRUDERS_RULE,
  COMPUTER_LAUNCH_WAIT_RULE,
  POLLUTION_SCORE_RULE,
  RATE_MULTIPLIER_BY_AGE_RULE,
  REACH_AGE_RULE,
  TIERED_COST_RULE,
  TREATY_BREAKING_RULE,
  UPRISING_RULE,
} from './RuleIds';
import {
  CITY_BUILD_RULE as CIV2_CITY_BUILD_RULE,
  LAND_UPRISING_RULE as CIV2_LAND_UPRISING_RULE,
} from '@civ-clone/civ2-barbarians/RuleIds';
import CIV2_SCORE_RULE_IDS from '@civ-clone/civ2-score/RuleIds';
import CIV2_SPACESHIP_RULE_IDS from '@civ-clone/civ2-spaceship/RuleIds';
import computerLaunch from './Rules/Spaceship/computerLaunch';
import barbarianCityBuild from './Rules/Barbarians/cityBuild';
import pollutionScore from './Rules/Score/pollution';
import barbarianUprising from './Rules/Barbarians/uprising';
import { COST_RULE as CIV2_COST_RULE } from '@civ-clone/civ2-science/RuleIds';
import researchAge from './Rules/Research/age';
import researchCost from './Rules/Research/cost';
import rateByAge from './Rules/Research/rateByAge';
import {
  ATTITUDE_DRIFT_RULE as CIV2_ATTITUDE_DRIFT_RULE,
  BORDER_INTRUDERS_RULE as CIV2_BORDER_INTRUDERS_RULE,
  TREATY_BREAKING_RULE as CIV2_TREATY_BREAKING_RULE,
} from '@civ-clone/civ2-diplomacy/RuleIds';
import { Game, defaultGame } from '@civ-clone/core-game';
import Rule from '@civ-clone/core-rule/Rule';
import RuleSet from '@civ-clone/core-rule/RuleSet';
import playerTurnStart from './Rules/Player/turnStart';

export const register = (game: Game): void => {
  // The ids superseded are imported from their packages, so renaming one breaks this build rather than leaving both
  //  rules running. The sets before their rules, so each rule is switched as it arrives. A set of its own for each
  //  game, as a game may add to its sets.
  game.ruleSets.register(
    new RuleSet(
      ENHANCED,
      new RuleSet(
        ATTITUDE_DRIFT,
        { supersedes: [CIV2_ATTITUDE_DRIFT_RULE] },
        ATTITUDE_DRIFT_RULE
      ),
      new RuleSet(
        BORDER_INTRUDERS,
        { supersedes: [CIV2_BORDER_INTRUDERS_RULE] },
        BORDER_INTRUDERS_RULE
      ),
      new RuleSet(
        TREATY_BREAKING,
        { supersedes: [CIV2_TREATY_BREAKING_RULE] },
        TREATY_BREAKING_RULE
      ),
      // civ-clone/web-renderer#1072
      new RuleSet(
        FIXED_RESEARCH_COSTS,
        { enabled: false, supersedes: [CIV2_COST_RULE] },
        TIERED_COST_RULE
      ),
      // civ-clone/web-renderer#1076: rules added to Civilization II's, so nothing to supersede.
      new RuleSet(
        AGES,
        { enabled: false },
        AGE_BY_EPOCH_RULE,
        AGES_JOINED_RULE,
        AGES_SETTLED_RULE,
        REACH_AGE_RULE,
        AGE_REACHED_RULE
      ),
      // civ-clone/web-renderer#1077: a multiplier Civilization II's cost asks for and has none of its own.
      new RuleSet(
        RESEARCH_COST_BY_AGE,
        { enabled: false },
        RATE_MULTIPLIER_BY_AGE_RULE
      ),
      new RuleSet(
        BARBARIAN_UPRISINGS,
        { enabled: false, supersedes: [CIV2_LAND_UPRISING_RULE] },
        UPRISING_RULE
      ),
      new RuleSet(
        BARBARIAN_CITIES,
        { enabled: false, supersedes: [CIV2_CITY_BUILD_RULE] },
        BARBARIAN_CITY_BUILD_RULE
      ),
      new RuleSet(
        POLLUTION_SCORE,
        { enabled: false, supersedes: [CIV2_SCORE_RULE_IDS.pollution] },
        POLLUTION_SCORE_RULE
      ),
      new RuleSet(
        COMPUTER_LAUNCH_WAIT,
        {
          enabled: false,
          supersedes: [CIV2_SPACESHIP_RULE_IDS.computerLaunch],
        },
        COMPUTER_LAUNCH_WAIT_RULE
      )
    )
  );

  // Each where the rule it replaces runs, to keep Civilization II's order. civ2-diplomacy must be loaded first: `after`
  //  throws when the rule named isn't there, so a load-order mistake fails loudly.
  const replaced: { [id: string]: string } = {
    [TREATY_BREAKING_RULE]: CIV2_TREATY_BREAKING_RULE,
    [BORDER_INTRUDERS_RULE]: CIV2_BORDER_INTRUDERS_RULE,
    [ATTITUDE_DRIFT_RULE]: CIV2_ATTITUDE_DRIFT_RULE,
  };

  playerTurnStart(game).forEach((rule) =>
    game.rules.after(replaced[rule.id()!], rule)
  );

  // civ2-barbarians loads before this package (by name): each fix where the rule it replaces runs, as above. A game
  //  without civ2-barbarians has nothing to replace, and the fix is only an orphan, never switched on by anything.
  (
    [
      [CIV2_LAND_UPRISING_RULE, barbarianUprising(game)],
      [CIV2_CITY_BUILD_RULE, barbarianCityBuild(game)],
    ] as [string, Rule<any, any>[]][]
  ).forEach(([replaces, rules]) => {
    if (game.rules.getById(replaces)) {
      game.rules.after(replaces, ...rules);

      return;
    }

    game.rules.register(...rules);
  });

  // civ-clone/web-renderer#1072: civ2-science is loaded after this, so its cost rule isn't there to be placed after;
  //  only one of the two is ever on.
  game.rules.register(...researchCost(game));

  // civ-clone/web-renderer#1076, #1077: rules of their own, which replace none of civ2-science's.
  game.rules.register(...researchAge(game), ...rateByAge());

  // civ2-score loads after this, too: only one of the two pollution terms is ever on.
  game.rules.register(...pollutionScore(game));

  // civ2-spaceship loads after this, too: only one of the two launches is ever on.
  game.rules.register(...computerLaunch(game));
};

// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
register(defaultGame);

export default register;
