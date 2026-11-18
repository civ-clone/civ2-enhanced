import ComputerLaunch from '@civ-clone/base-spaceship/lib/Rules/ComputerLaunch';
import { Game } from '@civ-clone/core-game';
import { COMPUTER_LAUNCH_WAIT_RULE } from '../../RuleIds';
import { computerLaunchRule } from '@civ-clone/civ2-spaceship/Rules/Spaceship/computer';

export type ComputerLaunchGame = Pick<
  Game,
  | 'clients'
  | 'difficulty'
  | 'pendingEffects'
  | 'playerResearch'
  | 'players'
  | 'playerTreasuries'
  | 'rules'
  | 'spaceships'
  | 'year'
>;

/**
 * A computer player's launch as civ2-spaceship decides it, except that above King it waits while another computer
 *  player's ship in flight would arrive before its own, which is what the original means to do (`'other-computers'`).
 */
export const getRules = (game: ComputerLaunchGame): ComputerLaunch[] => [
  computerLaunchRule(COMPUTER_LAUNCH_WAIT_RULE, 'other-computers', {
    clientRegistry: game.clients,
    gameDifficultyRegistry: game.difficulty,
    pendingEffectRegistry: game.pendingEffects,
    playerRegistry: game.players,
    playerResearchRegistry: game.playerResearch,
    playerTreasuryRegistry: game.playerTreasuries,
    ruleRegistry: game.rules,
    spaceshipRegistry: game.spaceships,
    year: game.year,
  }),
];

export default getRules;
