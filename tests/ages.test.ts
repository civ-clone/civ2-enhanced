import {
  Alphabet,
  Astronomy,
  CeremonialBurial,
  CodeOfLaws,
  FusionPower,
  FutureTechnology,
  Literacy,
  Mysticism,
  Philosophy,
  Plumbing,
  Railroad,
  Writing,
} from '@civ-clone/civ2-science/Advances';
import { AGES, FIXED_RESEARCH_COSTS } from '../RuleSets';
import { AGES_SETTLED_RULE, TIERED_COST_RULE } from '../RuleIds';
import {
  Ancient,
  Industrial,
  Modern,
  Renaissance,
  researchAges,
} from '../Ages';
import { advances as rows, NONE } from '@civ-clone/civ2-science/data/advances';
import Advance from '@civ-clone/core-science/Advance';
import Age from '@civ-clone/base-science-age/Age';
import Cost from '@civ-clone/core-science/Rules/Cost';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Research from '@civ-clone/core-science/Yields/Research';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import { ageOf } from '@civ-clone/base-science-age/lib/ageOf';
import { epochOf } from '../lib/latestEpoch';
import { expect } from 'chai';
import { playerAge } from '@civ-clone/base-science-age/lib/ageOf';
import register from '../registerRules';
import { register as registerDiplomacy } from '@civ-clone/civ2-diplomacy/registerRules';
import { register as registerScience } from '@civ-clone/civ2-science/registerRules';

// A game with civ2-diplomacy, this package and civ2-science, in the plugin loader's order (by name), the ages switched
//  as given, and a player who has `known`. `turn` is the game's turn: 0 while the game is set up. The player is added
//  during it, and unless `settled` is false, a turn has started since, as for a player who has been in the game a
//  while.
const setUp = ({
  on = true as boolean | null,
  turn = 1,
  settled = true,
  known = [] as (typeof Advance)[],
} = {}) => {
  let now = turn;

  const game = new Game({
      turn: { value: (): number => now } as unknown as Turn,
    }),
    heard: string[] = [];

  game.advances.register(...rows.map(([AdvanceType]) => AdvanceType));
  registerDiplomacy(game);
  register(game);
  registerScience(game);

  // As a game is set up: its sets before its players.
  if (on !== null) {
    game.ruleSets.set(AGES, on);
  }

  // Another player added and what is heard of their research, told apart by `name`.
  const addPlayer = (name: string = '') => {
      const player = new Player(game.rules),
        playerResearch = game.playerResearch.getByPlayer(player),
        prefix = name === '' ? '' : `${name}: `;

      game.engine.on(
        'player:research-complete',
        (research: PlayerResearch, advance: Advance): void => {
          if (research === playerResearch) {
            heard.push(`${prefix}${advance.sourceClass().name}`);
          }
        }
      );
      game.engine.on(
        'player:age-reached',
        (
          research: PlayerResearch,
          age: typeof Age,
          previous: typeof Age
        ): void => {
          if (research === playerResearch) {
            heard.push(`${prefix}${previous.name} to ${age.name}`);
          }
        }
      );

      return playerResearch;
    },
    // A new turn starting: only the ages' own `Start` rule, as the others want a world.
    startTurn = (value: number = now + 1): void => {
      now = value;
      game.rules.getById(AGES_SETTLED_RULE)!.process(game.turn);
    },
    playerResearch = addPlayer();

  if (settled) {
    startTurn(now);
  }

  known.forEach((Known) => playerResearch.addAdvance(Known));

  return {
    game,
    playerResearch,
    heard,
    addPlayer,
    startTurn,
    age: () => playerAge(playerResearch, game.rules),
  };
};

describe('ages (civ-clone/web-renderer#1076, for Civilization II)', (): void => {
  it('should be off to start with: no age, and nothing told', (): void => {
    const { game, heard, age } = setUp({ on: null, known: [Philosophy] });

    expect(game.ruleSets.state(AGES)).to.equal('off');
    expect(age()).to.equal(null);
    expect(heard).to.eql(['Philosophy']);
  });

  it("should put each advance that can be learnt once in its epoch's age, never before an advance it needs", (): void => {
    const learnable = rows
      .map(([AdvanceType]) => AdvanceType)
      .filter((AdvanceType) => !AdvanceType.repeatable);

    // RULES.TXT's 89 rows up to Future Technology, Plumbing (which no one can learn) among them.
    expect(learnable).to.have.length(89);
    expect(
      researchAges.map(
        (AgeType) =>
          learnable.filter(
            (AdvanceType) => researchAges[epochOf(AdvanceType)!] === AgeType
          ).length
      )
    ).to.eql([25, 18, 19, 27]);
    expect(epochOf(Plumbing)).to.equal(1);
    expect(epochOf(FutureTechnology)).to.equal(undefined);

    class Extra extends Advance {}

    expect(epochOf(Extra)).to.equal(undefined);

    // RULES.TXT's epochs never fall along the tree: an advance's prerequisites are of its epoch or an earlier one.
    rows.forEach(([AdvanceType, first, second]) =>
      [first, second]
        .filter((index) => index > NONE)
        .forEach((index) => {
          const [Required] = rows[index];

          if (Required === FutureTechnology || AdvanceType.repeatable) {
            return;
          }

          expect(
            epochOf(Required)!,
            `${Required.name}, for ${AdvanceType.name}`
          ).to.be.at.most(epochOf(AdvanceType)!);
        })
    );
  });

  it("should give each advance known alone its own epoch's age, as the Civilopedia asks, and the latest of several", (): void => {
    const { game } = setUp();

    expect(ageOf([Alphabet], game.rules)).to.equal(Ancient);
    expect(ageOf([Plumbing], game.rules)).to.equal(Renaissance);
    expect(ageOf([Railroad], game.rules)).to.equal(Industrial);
    expect(ageOf([FusionPower], game.rules)).to.equal(Modern);
    expect(ageOf([FusionPower, Alphabet], game.rules)).to.equal(Modern);
    expect(ageOf([], game.rules)).to.equal(Ancient);
  });

  it('should be the age of the latest epoch its player knows an advance of, and the first knowing none', (): void => {
    const { age, playerResearch } = setUp();

    expect(age()).to.equal(Ancient);

    playerResearch.addAdvance(Alphabet);

    expect(age()).to.equal(Ancient);

    playerResearch.addAdvance(Philosophy);

    expect(age()).to.equal(Renaissance);

    playerResearch.addAdvance(CodeOfLaws);

    expect(age()).to.equal(Renaissance);
  });

  it('should tell of each new age once, after the advance that starts it', (): void => {
    const { heard } = setUp({
      known: [Alphabet, CodeOfLaws, Mysticism, Philosophy, Astronomy, Writing],
    });

    expect(heard).to.eql([
      'Alphabet',
      'CodeOfLaws',
      'Mysticism',
      'Philosophy',
      'Ancient to Renaissance',
      'Astronomy',
      'Writing',
    ]);
  });

  it('should tell of the later age once when an advance jumps over ages', (): void => {
    const { heard } = setUp({ known: [Alphabet, FusionPower] });

    expect(heard).to.eql(['Alphabet', 'FusionPower', 'Ancient to Modern']);
  });

  it('should tell nothing of the advances a civilization starts with, before the first turn, as the start balancing gives them', (): void => {
    const { heard, age, playerResearch, startTurn } = setUp({
      turn: 0,
      settled: false,
      known: [Philosophy],
    });

    expect(heard).to.eql(['Philosophy']);
    expect(age()).to.equal(Renaissance);

    startTurn(1);
    playerResearch.addAdvance(Writing);
    playerResearch.addAdvance(Railroad);

    expect(heard).to.eql([
      'Philosophy',
      'Writing',
      'Railroad',
      'Renaissance to Industrial',
    ]);
  });

  it('should tell nothing while the game is set up, on turn 0, even of a civilization that has settled in', (): void => {
    const { heard, playerResearch, startTurn } = setUp({
      turn: 0,
      known: [Philosophy],
    });

    expect(heard).to.eql(['Philosophy']);

    startTurn(1);
    playerResearch.addAdvance(Railroad);

    expect(heard).to.eql([
      'Philosophy',
      'Railroad',
      'Renaissance to Industrial',
    ]);
  });

  it('should tell nothing of what a civilization added part-way through a turn is given, until the next turn starts', (): void => {
    // As a civil war splits off a civilization, with the advances it inherits, on turn 40.
    const { heard, addPlayer, startTurn } = setUp({ turn: 40 }),
      split = addPlayer('split');

    [Alphabet, CodeOfLaws, Philosophy, Railroad].forEach((Known) =>
      split.addAdvance(Known)
    );

    expect(heard.filter((line) => line.includes(' to '))).to.eql([]);

    startTurn();
    split.addAdvance(FusionPower);

    expect(heard.filter((line) => line.includes(' to '))).to.eql([
      'split: Industrial to Modern',
    ]);
  });

  it("should tell of each player's ages for that player alone", (): void => {
    const { heard, playerResearch, addPlayer, startTurn } = setUp(),
      other = addPlayer('other');

    startTurn();
    other.addAdvance(Philosophy);
    playerResearch.addAdvance(Alphabet);
    other.addAdvance(Writing);
    playerResearch.addAdvance(Philosophy);

    expect(heard).to.eql([
      'other: Philosophy',
      'other: Ancient to Renaissance',
      'Alphabet',
      'other: Writing',
      'Philosophy',
      'Ancient to Renaissance',
    ]);
  });

  it('should tell of an age reached by research, as by any other way', (): void => {
    // Philosophy needs Mysticism and Literacy.
    const { heard, playerResearch } = setUp({
      known: [
        Alphabet,
        CeremonialBurial,
        CodeOfLaws,
        Writing,
        Mysticism,
        Literacy,
      ],
    });

    expect(playerResearch.available()).to.include(Philosophy);

    playerResearch.research(Philosophy);
    playerResearch.add(new Research(32000));

    expect(heard.slice(-2)).to.eql(['Philosophy', 'Ancient to Renaissance']);
  });

  it('should work alongside the fixed research costs, which leave it as it is', (): void => {
    const { game, age, heard, playerResearch } = setUp();

    game.ruleSets.set(FIXED_RESEARCH_COSTS, true);
    playerResearch.addAdvance(Railroad);

    expect(game.rules.getById(TIERED_COST_RULE)!.enabled()).true;
    expect(game.rules.process(Cost, Writing, playerResearch)[0]).to.be.a(
      'number'
    );
    expect(age()).to.equal(Industrial);
    expect(heard).to.eql(['Railroad', 'Ancient to Industrial']);
  });
});
