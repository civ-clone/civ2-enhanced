import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import { IScoreTerm } from '@civ-clone/core-score/Rules/Score';
import Player from '@civ-clone/core-player/Player';
import Pollution from '@civ-clone/base-tile-improvement-pollution/Pollution';
import { POLLUTION_SCORE_RULE } from '../../RuleIds';
import Score from '@civ-clone/core-score/Rules/Score';
import Tile from '@civ-clone/core-world/Tile';
import isHuman from '@civ-clone/civ2-difficulty/isHuman';
import { pollutionScore } from '@civ-clone/civ2-score/lib/scoring';
import worldPollution from '@civ-clone/civ2-score/lib/pollution';

export type PollutionScoreGame = Pick<
  Game,
  'cities' | 'clients' | 'tileImprovements'
>;

/**
 * `player`'s own pollution, as `civ2-score`'s `worldPollution` counts the world's: the polluted squares in its cities'
 *  radii, and, for a computer player, those counted again for each of its cities that holds them.
 */
export const ownPollution = (game: PollutionScoreGame, player: Player) => {
  const cities = game.cities
      .getByPlayer(player)
      .filter((city: City): boolean => !city.destroyed()),
    radii = new Set<Tile>(
      cities.flatMap((city: City): Tile[] => city.tiles().entries())
    );

  return worldPollution(
    game.tileImprovements.filter(
      (improvement) =>
        improvement instanceof Pollution && radii.has(improvement.tile())
    ),
    isHuman(player, game.clients) ? [] : cities
  );
};

/** `civ2-score`'s pollution term (`civ_calc_score`), from `player`'s own pollution rather than the world's. */
export const getRules = (game: PollutionScoreGame): Score[] => [
  new Score(
    POLLUTION_SCORE_RULE,
    new Effect((player: Player): IScoreTerm => {
      const { polluted, discounted } = ownPollution(game, player);

      return { term: 'pollution', value: pollutionScore(polluted, discounted) };
    })
  ),
];

export default getRules;
