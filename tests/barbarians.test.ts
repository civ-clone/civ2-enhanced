import { Archer, Chariot, Knight } from '@civ-clone/civ2-unit/Units';
import { BARBARIAN_CITIES, BARBARIAN_UPRISINGS } from '../RuleSets';
import { BARBARIAN_CITY_BUILD_RULE, UPRISING_RULE } from '../RuleIds';
import {
  CITY_BUILD_RULE as CIV2_CITY_BUILD_RULE,
  LAND_UPRISING_RULE as CIV2_LAND_UPRISING_RULE,
} from '@civ-clone/civ2-barbarians/RuleIds';
import { Explosives, Gunpowder } from '@civ-clone/civ2-science/Advances';
import { UPRISING_FAILED, fixedUprising } from '../Rules/Barbarians/uprising';
import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { CLASSIC_UPRISING } from '@civ-clone/civ2-barbarians/lib/uprising';
import City from '@civ-clone/core-city/City';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import barbarianBuild from '@civ-clone/civ2-barbarians/lib/cityBuild';
import { expect } from 'chai';
import { fixedBarbarianBuild } from '../Rules/Barbarians/cityBuild';
import register from '../registerRules';
import { register as registerBarbarians } from '@civ-clone/civ2-barbarians/registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';

const loadGame = (withBarbarians = true): Game => {
  const game = new Game();

  // The plugin loader's order: by name.
  if (withBarbarians) {
    registerBarbarians(game);
  }

  registerDiplomacy(game);
  register(game);

  return game;
};

const ids = (rules: { id(): string | null }[]): (string | null)[] =>
  rules.map((rule) => rule.id());

describe('barbarian fixes: registration', (): void => {
  it("takes each civ2-barbarians rule's place right after it, off to start with", (): void => {
    const game = loadGame();

    [
      [BARBARIAN_UPRISINGS, CIV2_LAND_UPRISING_RULE, UPRISING_RULE, Start],
      [
        BARBARIAN_CITIES,
        CIV2_CITY_BUILD_RULE,
        BARBARIAN_CITY_BUILD_RULE,
        Build,
      ],
    ].forEach(([set, civ2Rule, rule, Type]: any[]) => {
      expect(game.ruleSets.state(set)).equal('off');
      expect(game.rules.getById(civ2Rule)!.enabled()).equal(true);
      expect(game.rules.getById(rule)!.enabled()).equal(false);
      expect(ids(game.rules.get(Type))).include(civ2Rule);
      expect(ids(game.rules.get(Type))).not.include(rule);

      game.ruleSets.set(set, true);

      expect(game.rules.getById(civ2Rule)!.enabled()).equal(false);
      expect(game.rules.getById(rule)!.enabled()).equal(true);
      expect(ids(game.rules.get(Type))).include(rule);
      expect(ids(game.rules.get(Type))).not.include(civ2Rule);

      game.ruleSets.set(set, false);

      expect(game.rules.getById(civ2Rule)!.enabled()).equal(true);
      expect(game.rules.getById(rule)!.enabled()).equal(false);
    });
  });

  it('loads without civ2-barbarians, its fixes only orphans', (): void => {
    const game = loadGame(false);

    expect(game.rules.getById(UPRISING_RULE)).not.equal(null);
    expect(game.rules.getById(BARBARIAN_CITY_BUILD_RULE)).not.equal(null);
    expect(game.rules.getById(CIV2_LAND_UPRISING_RULE)).equal(null);
  });
});

describe('barbarian fixes: uprisings (barbarians_city_uprising)', (): void => {
  it('searches as far east as west, by the city drawn, where the original searches −6 to 18 half columns by the nearest', (): void => {
    const game = new Game(),
      fixed = fixedUprising(game as any);

    expect([0, 6, 12].map(CLASSIC_UPRISING.xOffset)).eql([-6, 6, 18]);
    expect([0, 6, 12].map(fixed.xOffset)).eql([-12, 0, 12]);
    expect(CLASSIC_UPRISING.byRolledCity).equal(false);
    expect(fixed.byRolledCity).equal(true);
    expect(CLASSIC_UPRISING.dropped).equal(null);
  });

  it('announces an uprising that finds no square', (): void => {
    const game = new Game(),
      events: unknown[][] = [],
      player = new Player(game.rules),
      city = { player: () => player } as unknown as City;

    game.engine.on(UPRISING_FAILED, (...args: unknown[]) => events.push(args));
    fixedUprising(game as any).dropped!(city);

    expect(events).length(1);
    expect(events[0][0] === player).true;
    expect(events[0][1] === city).true;
  });
});

describe("barbarian fixes: a barbarian city's first unit (city_choose_production_barbarian)", (): void => {
  const setUp = (...known: (typeof Explosives)[]) => {
    const game = new Game(),
      player = new Player(game.rules),
      research = new PlayerResearch(player, game.advances, game.rules),
      city = {
        player: () => player,
        originalPlayer: () => player,
      } as unknown as City;

    known.forEach((Advance) => research.addAdvance(Advance));
    game.playerResearch.register(research);

    return {
      city,
      game: Object.assign(Object.create(game), {
        cityBuilds: {
          getByCity: () => ({ building: () => null, cleared: () => null }),
        },
        playerResearch: game.playerResearch,
        clients: game.clients,
        difficulty: game.difficulty,
      }) as any,
    };
  };

  it("is the uprising table's main unit, where the original's is the Legion, or Knights with Explosives", (): void => {
    const explosives = setUp(Explosives);

    expect(barbarianBuild(explosives.game, explosives.city)).equal(Knight);
    expect(fixedBarbarianBuild(explosives.game, explosives.city)).equal(
      Chariot
    );

    const gunpowder = setUp(Gunpowder, Explosives);

    expect(fixedBarbarianBuild(gunpowder.game, gunpowder.city)).equal(Archer);
  });
});
