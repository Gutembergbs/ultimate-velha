import { useEffect } from 'react';
import { evaluateSmall, opponentCanScoreNext } from '../ai/ai';
import {
  checkWinnerWithLine,
  checkBigWinnerWithLine
} from '../helpers/gameLogic';

export function useAI(game: any) {
  const isAITurn = game.mode === 'AI' && game.currentPlayer === 'O';

  useEffect(() => {
    if (!isAITurn || game.bigWinner) return;

    const makeAIMove = () => {
      let bestScore = -Infinity;
      let best: any = null;

      const getPlayableBoards = () => {
        if (game.activeBoard !== null) return [game.activeBoard];
        return game.state.boards
          .map((_:any, i:number) => i)
          .filter((i:number) => game.state.boards[i].some((cell:any) => cell === null));
      };

      const moves = game.state.boards.flat().filter((c:any)=>c).length;
      const early = moves < 6;

      for (const b of getPlayableBoards()) {
        for (let i = 0; i < 9; i++) {
          if (game.state.boards[b][i]) continue;

          const tb = JSON.parse(JSON.stringify(game.state.boards));
          tb[b][i] = 'O';

          let score = 0;

          const sw = checkWinnerWithLine(tb[b]);
          if (sw) score += 100;

          const tw = [...game.state.winners];
          if (sw) tw[b] = sw;

          const bw = checkBigWinnerWithLine(tw);
          if (bw) score += 1000;

          score += evaluateSmall(tb[b], 'O');
          score -= evaluateSmall(tb[b], 'X');

          if (i === 4) score += 3;
          if ([0,2,6,8].includes(i)) score += 2;

          if (opponentCanScoreNext(tb, tw, i)) score -= 50;
          if (early) score += Math.random() * 5;

          if (score > bestScore) {
            bestScore = score;
            best = { b, i };
          }
        }
      }

      if (best) {
        game.handleMove(best.b, best.i);
      }
    };

    const t = setTimeout(makeAIMove, 400);
    return () => clearTimeout(t);

  }, [game.currentPlayer]);
}
