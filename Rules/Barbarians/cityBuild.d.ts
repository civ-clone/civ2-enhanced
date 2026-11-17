import { CityBuildGame } from '@civ-clone/civ2-barbarians/lib/cityBuild';
import { UprisingGame } from '@civ-clone/civ2-barbarians/lib/uprising';
import { Build } from '@civ-clone/core-city-build/Rules/Build';
import City from '@civ-clone/core-city/City';
import Unit from '@civ-clone/core-unit/Unit';
export type FixedCityBuildGame = CityBuildGame & UprisingGame;
/**
 * What a barbarian city builds: as `civ2-barbarians`' `barbarianBuild`, but a city that isn't building a unit starts
 *  with the main unit of the barbarians' own uprising table for what anyone knows (`uprisingTypes`, unswapped), rather
 *  than the Legion, or Knights once anyone knows Explosives.
 */
export declare const fixedBarbarianBuild: (
  game: FixedCityBuildGame,
  city: City
) => typeof Unit;
/** `civ2-barbarians`' `CITY_BUILD_RULE`, with `fixedBarbarianBuild` in place of `barbarianBuild`. */
export declare const getRules: (game: FixedCityBuildGame) => Build[];
export default getRules;
