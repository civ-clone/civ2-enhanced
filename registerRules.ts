import {
  ATTITUDE_DRIFT,
  BORDER_INTRUDERS,
  ENHANCED,
  FIXED_RESEARCH_COSTS,
  TREATY_BREAKING,
} from './RuleSets';
import {
  ATTITUDE_DRIFT_RULE,
  BORDER_INTRUDERS_RULE,
  TIERED_COST_RULE,
  TREATY_BREAKING_RULE,
} from './RuleIds';
import { COST_RULE as CIV2_COST_RULE } from '@civ-clone/civ2-science/RuleIds';
import researchCost from './Rules/Research/cost';
import {
  ATTITUDE_DRIFT_RULE as CIV2_ATTITUDE_DRIFT_RULE,
  BORDER_INTRUDERS_RULE as CIV2_BORDER_INTRUDERS_RULE,
  TREATY_BREAKING_RULE as CIV2_TREATY_BREAKING_RULE,
} from '@civ-clone/civ2-diplomacy/RuleIds';
import { Game, defaultGame } from '@civ-clone/core-game';
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

  // civ-clone/web-renderer#1072: civ2-science is loaded after this, so its cost rule isn't there to be placed after;
  //  only one of the two is ever on.
  game.rules.register(...researchCost(game));
};

// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
register(defaultGame);

export default register;
