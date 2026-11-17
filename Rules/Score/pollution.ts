import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import { IScoreTerm } from '@civ-clone/core-score/Rules/Score';
import Player from '@civ-clone/core-player/Player';
import Pollution from '@civ-clone/base-tile-improvement-pollution/Pollution';
import { POLLUTION_SCORE_RULE } from '../../RuleIds';
import Score from '@civ-clone/core-score/Rules/Score';
import Tile from '@civ-clone/core-world/Tile';
import { pollutionScore } from '@civ-clone/civ2-score/lib/scoring';
import worldPollution from '@civ-clone/civ2-score/lib/pollution';

export type PollutionScoreGame = Pick<
  Game,
  'cities' | 'clients' | 'tileImprovements'
>;

/**
 * How many polluted squares are in `player`'s cities' radii, each once: its own pollution, which it pays for in full.
 */
export const ownPollution = (
  game: PollutionScoreGame,
  player: Player
): number => {
  const radii = new Set<Tile>(
    game.cities
      .getByPlayer(player)
      .filter((city: City): boolean => !city.destroyed())
      .flatMap((city: City): Tile[] => city.tiles().entries())
  );

  return worldPollution(
    game.tileImprovements.filter(
      (improvement) =>
        improvement instanceof Pollution && radii.has(improvement.tile())
    ),
    []
  ).polluted;
};

/**
 * `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution: each civilization pays 10 for each
 *  polluted square around its own cities, with no discount, rather than everyone paying for the world's.
 */
export const getRules = (game: PollutionScoreGame): Score[] => [
  new Score(
    POLLUTION_SCORE_RULE,
    new Effect(
      (player: Player): IScoreTerm => ({
        term: 'pollution',
        value: pollutionScore(ownPollution(game, player), 0),
      })
    )
  ),
];

export default getRules;
