import { POLLUTION_SCORE } from '../RuleSets';
import { POLLUTION_SCORE_RULE } from '../RuleIds';
import CIV2_SCORE_RULE_IDS from '@civ-clone/civ2-score/RuleIds';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import City from '@civ-clone/core-city/City';
import Client from '@civ-clone/core-client/Client';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import Pollution from '@civ-clone/base-tile-improvement-pollution/Pollution';
import Score from '@civ-clone/core-score/Rules/Score';
import Tile from '@civ-clone/core-world/Tile';
import { expect } from 'chai';
import pollutionRules from '../Rules/Score/pollution';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';
import { register as registerScore } from '@civ-clone/civ2-score/registerRules';

// Squares are plain objects here: only their identity counts.
const squares = Array.from({ length: 10 }, () => ({} as Tile));

const setUp = () => {
  const game = new Game(),
    person = new Player(game.rules),
    computer = new Player(game.rules),
    seat = (player: Player, Type: typeof Client) =>
      game.clients.register(
        Object.assign(Object.create(Type.prototype), { player: () => player })
      ),
    cities: City[] = [],
    city = (player: Player, ...tiles: Tile[]): City => {
      const city = {
        player: () => player,
        destroyed: () => false,
        tiles: () => ({ entries: () => tiles }),
      } as unknown as City;

      cities.push(city);

      return city;
    },
    pollution: Pollution[] = [];

  seat(person, Client);
  seat(computer, AIClient);

  const stub = {
    cities: {
      entries: () => cities,
      getByPlayer: (player: Player) =>
        cities.filter((city) => city.player() === player),
    },
    clients: game.clients,
    tileImprovements: {
      filter: (iterator: (improvement: Pollution) => boolean) =>
        pollution.filter(iterator),
    },
  } as any;

  const pollute = (...tiles: Tile[]) =>
    tiles.forEach((tile) =>
      pollution.push(
        Object.assign(Object.create(Pollution.prototype), { tile: () => tile })
      )
    );

  return { city, computer, game, person, pollute, stub };
};

const score = (stub: any, player: Player): number =>
  pollutionRules(stub)
    .map((rule: Score) => rule.process(player) as any)
    .find((answer: any) => answer.term === 'pollution').value;

describe('pollution score (civ_calc_score)', (): void => {
  it("costs each civilization 10 for each polluted square in its own cities' radii, its computer cities discounting theirs", (): void => {
    const { city, computer, person, pollute, stub } = setUp();

    city(person, squares[0], squares[1], squares[2]);
    city(computer, squares[2], squares[3]);
    city(computer, squares[3], squares[4]);
    pollute(squares[0], squares[2], squares[3], squares[9]);

    // The person: squares 0 and 2 polluted in their radius, none discounted: −20.
    expect(score(stub, person)).equal(-20);
    // The computer: 2 and 3 polluted (3 in two of its radii): 2 − 3 = −1, × −10: 10.
    expect(score(stub, computer)).equal(10);
  });
});

describe('pollution score: registration', (): void => {
  it("takes civ2-score's pollution term's place, off to start with", (): void => {
    const game = new Game();

    // The plugin loader's order: by name.
    registerDiplomacy(game);
    register(game);
    registerScore(game);

    const civ2Rule = CIV2_SCORE_RULE_IDS.pollution;

    expect(game.ruleSets.state(POLLUTION_SCORE)).equal('off');
    expect(game.ruleSets.get(POLLUTION_SCORE)!.supersedes()).eql([civ2Rule]);
    expect(game.rules.getById(civ2Rule)!.enabled()).equal(true);
    expect(game.rules.getById(POLLUTION_SCORE_RULE)!.enabled()).equal(false);

    game.ruleSets.set(POLLUTION_SCORE, true);

    expect(game.rules.getById(civ2Rule)!.enabled()).equal(false);
    expect(game.rules.getById(POLLUTION_SCORE_RULE)!.enabled()).equal(true);
  });
});
