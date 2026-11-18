import {
  AGES,
  ATTITUDE_DRIFT,
  BARBARIAN_CITIES,
  BARBARIAN_UPRISINGS,
  BORDER_INTRUDERS,
  COMPUTER_LAUNCH_WAIT,
  ENHANCED,
  FIXED_RESEARCH_COSTS,
  POLLUTION_SCORE,
  RESEARCH_COST_BY_AGE,
  TREATY_BREAKING,
} from '../RuleSets';
import {
  ATTITUDE_DRIFT_RULE,
  BORDER_INTRUDERS_RULE,
  TREATY_BREAKING_RULE,
} from '../RuleIds';
import {
  ATTITUDE_DRIFT_RULE as CIV2_ATTITUDE_DRIFT,
  BORDER_INTRUDERS_RULE as CIV2_BORDER_INTRUDERS,
  TREATY_BREAKING_RULE as CIV2_TREATY_BREAKING,
} from '@civ-clone/civ2-diplomacy/RuleIds';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Client from '@civ-clone/core-client/Client';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import { attitude } from '@civ-clone/civ2-diplomacy/lib/relations';
import { expect } from 'chai';
import makeContact from '@civ-clone/base-diplomacy-interaction-contact/makeContact';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';

// The Civ2 rules this package's sets change, and the rules they change them with: all on to start with.
const replacements: [string, string, string][] = [
  [ATTITUDE_DRIFT, CIV2_ATTITUDE_DRIFT, ATTITUDE_DRIFT_RULE],
  [BORDER_INTRUDERS, CIV2_BORDER_INTRUDERS, BORDER_INTRUDERS_RULE],
  [TREATY_BREAKING, CIV2_TREATY_BREAKING, TREATY_BREAKING_RULE],
];

const loadGame = (): Game => {
  const game = new Game();

  // The plugin loader's order: by name.
  registerDiplomacy(game);
  register(game);

  return game;
};

const enabled = (game: Game, id: string): boolean =>
  game.rules.getById(id)!.enabled();

describe('registerRules', (): void => {
  it('holds its sets under one parent: three superseding a civ2-diplomacy rule, the fixed research costs, the ages, the cost by age, the two barbarian fixes, the pollution score and the computer launch wait', (): void => {
    const game = loadGame();

    expect(ENHANCED).equal('civ2-enhanced');
    expect(game.ruleSets.get(ENHANCED)!.memberIds()).eql([
      ATTITUDE_DRIFT,
      BORDER_INTRUDERS,
      TREATY_BREAKING,
      FIXED_RESEARCH_COSTS,
      AGES,
      RESEARCH_COST_BY_AGE,
      BARBARIAN_UPRISINGS,
      BARBARIAN_CITIES,
      POLLUTION_SCORE,
      COMPUTER_LAUNCH_WAIT,
    ]);
    replacements.forEach(([set, civ2Rule, rule]) => {
      expect(game.ruleSets.get(set)!.supersedes(), set).eql([civ2Rule]);
      expect(game.ruleSets.get(set)!.memberIds(), set).eql([rule]);
    });
  });

  it('starts with every fix on and the fixed research costs, the ages and the cost by age off, and gives back the original rules when switched off', (): void => {
    const game = loadGame();

    expect(game.ruleSets.state(ENHANCED)).equal('mixed');
    expect(game.ruleSets.state(FIXED_RESEARCH_COSTS)).equal('off');
    expect(game.ruleSets.state(AGES)).equal('off');
    expect(game.ruleSets.state(RESEARCH_COST_BY_AGE)).equal('off');
    replacements.forEach(([, civ2Rule, rule]) => {
      expect(enabled(game, civ2Rule), civ2Rule).false;
      expect(enabled(game, rule), rule).true;
    });
    expect(game.ruleSets.choices()).eql([]);

    game.ruleSets.set(ENHANCED, false);

    replacements.forEach(([, civ2Rule, rule]) => {
      expect(enabled(game, civ2Rule), civ2Rule).true;
      expect(enabled(game, rule), rule).false;
    });
  });

  it("drifts a computer player's attitude from 0 rather than pinning it at 100", (): void => {
    const run = (on: boolean): number => {
      const game = loadGame(),
        person = new Player(game.rules),
        computer = new Player(game.rules);

      game.players.register(person, computer);
      game.clients.register(
        Object.assign(Object.create(Client.prototype), {
          player: () => person,
        }),
        Object.assign(Object.create(AIClient.prototype), {
          player: () => computer,
        })
      );
      game.ruleSets.set(ENHANCED, on);
      makeContact(game.interactions, person, computer, game.rules);
      attitude({
        interactionRegistry: game.interactions,
        ruleRegistry: game.rules,
        turn: game.turn,
      }).set(computer, person, 40);

      game.rules.process(TurnStart, computer);

      return attitude({
        interactionRegistry: game.interactions,
        ruleRegistry: game.rules,
        turn: game.turn,
      }).get(computer, person)!;
    };

    expect(run(false)).equal(100);
    expect(run(true)).lessThan(100);
  });

  it('runs each fix where the rule it replaces would: treaties broken, borders counted, then the drift (`civ.cpp:7123`, `:7223`)', (): void => {
    const game = loadGame(),
      order = () =>
        game.rules
          .get(TurnStart)
          .map((rule) => rule.id())
          .filter((id): id is string => id !== null),
      fixed = order();

    expect(fixed.indexOf(TREATY_BREAKING_RULE)).lessThan(
      fixed.indexOf(BORDER_INTRUDERS_RULE)
    );
    expect(fixed.indexOf(BORDER_INTRUDERS_RULE)).lessThan(
      fixed.indexOf(ATTITUDE_DRIFT_RULE)
    );

    game.ruleSets.set(ENHANCED, false);

    const original = order();

    replacements.forEach(([, civ2Rule, rule]) =>
      expect(fixed.indexOf(rule), rule).equal(original.indexOf(civ2Rule))
    );
  });

  it('fails to load before civ2-diplomacy, rather than run its fixes out of order', (): void => {
    expect(() => register(new Game())).throw();
  });
});
