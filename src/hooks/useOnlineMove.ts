import { Player } from '../helpers/types';
import { checkWinnerWithLine, checkBigWinnerWithLine } from '../helpers/gameLogic';

export function useOnlineMove(game: any, online: any) {

  return (boardIndex: number, cellIndex: number) => {

    if (game.bigWinner) return;
    if (!online.symbol || online.symbol !== game.currentPlayer) return;

    const isDraw = game.state.winners.every((w: any) => w !== null);
    if (isDraw) return;

    if (game.state.boards[boardIndex][cellIndex] !== null) return;

    if (game.activeBoard !== null && game.activeBoard !== boardIndex) return;

    // Atualização local (Supabase vem depois via realtime)
    game.handleMove(boardIndex, cellIndex);
  };
}
