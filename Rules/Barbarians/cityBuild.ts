import {
  CityBuildGame,
  lastBuilt,
  upgradeOf,
} from '@civ-clone/civ2-barbarians/lib/cityBuild';
import {
  UprisingGame,
  uprisingKnowledge,
  uprisingTypes,
} from '@civ-clone/civ2-barbarians/lib/uprising';
import { BARBARIAN_CITY_BUILD_RULE } from '../../RuleIds';
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Unit from '@civ-clone/core-unit/Unit';
import { indexOf } from '@civ-clone/civ2-barbarians/lib/units';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import { Settlers } from '@civ-clone/civ2-unit/Units';

export type FixedCityBuildGame = CityBuildGame & UprisingGame;

/**
 * What a barbarian city builds: as `civ2-barbarians`' `barbarianBuild`, but a city that isn't building a unit starts
 *  with the main unit of the barbarians' own uprising table for what anyone knows (`uprisingTypes`, unswapped), rather
 *  than the Legion, or Knights once anyone knows Explosives.
 */
export const fixedBarbarianBuild = (
  game: FixedCityBuildGame,
  city: City
): typeof Unit => {
  const last = lastBuilt(game, city);

  if (last === null || indexOf(last) < 1 || last === Settlers) {
    const [main] = uprisingTypes(uprisingKnowledge(game, city), false);

    return main;
  }

  return upgradeOf(game, last as typeof Unit);
};

/** `civ2-barbarians`' `CITY_BUILD_RULE`, with `fixedBarbarianBuild` in place of `barbarianBuild`. */
export const getRules = (game: FixedCityBuildGame): Build[] => [
  new Build(
    BARBARIAN_CITY_BUILD_RULE,
    new Criterion((city: City): boolean => isBarbarian(city.player())),
    new Effect(
      (city: City, Item: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            Item ===
            (fixedBarbarianBuild(game, city) as unknown as IConstructor)
        )
    )
  ),
];

export default getRules;
