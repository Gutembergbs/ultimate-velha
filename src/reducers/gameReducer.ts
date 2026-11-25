import { BigBoardState, Player } from '../helpers/types';

export type GameAction =
  | { type: 'RESET' }
  | { type: 'SET_STATE'; payload: BigBoardState }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_ACTIVE_BOARD'; payload: number | null }
  | { type: 'SET_WINNER'; payload: any };

export const initialGameState: BigBoardState = {
  boards: Array(9).fill(null).map(() => Array(9).fill(null)),
  winners: Array(9).fill(null),
};

export function gameReducer(
  state: BigBoardState,
  action: GameAction
): BigBoardState {
  switch (action.type) {
    case 'RESET':
      return initialGameState;

    case 'SET_STATE':
      return action.payload;

    default:
      return state;
  }
}
