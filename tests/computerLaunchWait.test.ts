import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '@civ-clone/civ2-spaceship/Parts';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import { COMPUTER_LAUNCH_WAIT } from '../RuleSets';
import { COMPUTER_LAUNCH_WAIT_RULE } from '../RuleIds';
import CIV2_SPACESHIP_RULE_IDS from '@civ-clone/civ2-spaceship/RuleIds';
import ComputerLaunch from '@civ-clone/base-spaceship/lib/Rules/ComputerLaunch';
import { Emperor, King } from '@civ-clone/civ2-difficulty/Difficulties';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game/Game';
import Part from '@civ-clone/core-spaceship/Part';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Year';
import YearRule from '@civ-clone/core-game-year/Rules/Year';
import { expect } from 'chai';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';
import { register as registerSpaceship } from '@civ-clone/civ2-spaceship/registerRules';

// Two computer players at `Level`, a year a turn from 1990, with civ2-diplomacy, this package and civ2-spaceship (the
//  plugin loader's order, by name). The first launches a fast ship; the second has one that would arrive later.
const setUp = (Level: typeof King, on: boolean) => {
  const rules = new RuleRegistry(),
    turn = new Turn(),
    year = new Year(turn, rules),
    game = new Game({ rules, turn, year }),
    first = new Player(rules),
    second = new Player(rules);

  rules.register(new YearRule(new Effect((value: number) => 1990 + value)));
  registerDiplomacy(game);
  register(game);
  registerSpaceship(game);
  game.difficulty.set(Level);
  game.ruleSets.set(COMPUTER_LAUNCH_WAIT, on);
  game.players.register(first, second);
  game.clients.register(new AIClient(first), new AIClient(second));
  [first, second].forEach((player) =>
    game.playerResearch.register(
      new PlayerResearch(player, game.advances, rules)
    )
  );

  const complete = (player: Player, counts: [typeof Part, number][]): void =>
    counts.forEach(([PartType, count]) => {
      const city = {
        player: () => player,
        destroyed: () => false,
        id: () => 'city',
      } as unknown as City;

      for (let i = 0; i < count; i++) {
        rules.process(
          BuildingComplete,
          {} as CityBuild,
          new PartType(city, rules)
        );
      }
    });

  // 33 structurals, 8 + 8 components and a module of each: 8 years.
  complete(first, [
    [Structural, 33],
    [Propulsion, 8],
    [Fuel, 8],
    [Habitation, 1],
    [LifeSupport, 1],
    [Power, 1],
  ]);
  game.spaceships.getActiveByPlayer(first)!.launch();

  // 15 structurals, 2 + 2 components and a module of each: 87%, 28 years.
  complete(second, [
    [Structural, 15],
    [Propulsion, 2],
    [Fuel, 2],
    [Habitation, 1],
    [LifeSupport, 1],
    [Power, 1],
  ]);

  return {
    game,
    launches: (): boolean[] =>
      rules.process(ComputerLaunch, game.spaceships.getActiveByPlayer(second)!),
  };
};

describe('the computer launch wait', (): void => {
  it("is off to start with, and supersedes civ2-spaceship's launch when on", (): void => {
    const { game } = setUp(Emperor, true);

    expect(game.ruleSets.get(COMPUTER_LAUNCH_WAIT)!.supersedes()).eql([
      CIV2_SPACESHIP_RULE_IDS.computerLaunch,
    ]);
    expect(game.rules.getById(COMPUTER_LAUNCH_WAIT_RULE)!.enabled()).true;
    expect(
      game.rules.getById(CIV2_SPACESHIP_RULE_IDS.computerLaunch)!.enabled()
    ).false;

    const off = setUp(Emperor, false).game;

    expect(off.rules.getById(COMPUTER_LAUNCH_WAIT_RULE)!.enabled()).false;
    expect(off.rules.getById(CIV2_SPACESHIP_RULE_IDS.computerLaunch)!.enabled())
      .true;
  });

  it("waits above King while another computer player's ship arrives first, as the original never does", (): void => {
    expect(setUp(Emperor, false).launches()).eql([true]);
    expect(setUp(Emperor, true).launches()).eql([false]);
  });

  it("doesn't wait at King", (): void => {
    expect(setUp(King, true).launches()).eql([true]);
  });
});
