import { BigBoardState } from '../helpers/types';
import {
  evaluateSmall,
  opponentCanScoreNext
} from './ai';
import {
  checkWinnerWithLine,
  checkBigWinnerWithLine
} from '../helpers/gameLogic';

type AIMove = { b: number; i: number } | null;

export function getBestAIMove(
  state: BigBoardState,
  activeBoard: number | null
): AIMove {

  let bestScore = -Infinity;
  let bestMove: AIMove = null;

  const playableBoards =
    activeBoard !== null
      ? [activeBoard]
      : state.boards
          .map((_, i) => i)
          .filter(i => !state.winners[i]);

  const movesPlayed =
    state.boards.flat().filter(Boolean).length;

  const earlyGame = movesPlayed < 6;

  for (const b of playableBoards) {
    for (let i = 0; i < 9; i++) {
      if (state.boards[b][i]) continue;

      // Clona estado
      const testBoards = JSON.parse(JSON.stringify(state.boards));
      const testWinners = [...state.winners];

      testBoards[b][i] = 'O';

      let score = 0;

      // Vitória local
      const sw = checkWinnerWithLine(testBoards[b]);
      if (sw) {
        testWinners[b] = sw;
        score += 100;
      }

      // Vitória global
      const bw = checkBigWinnerWithLine(testWinners);
      if (bw) score += 1000;

      // Avaliação heurística
      score += evaluateSmall(testBoards[b], 'O');
      score -= evaluateSmall(testBoards[b], 'X');

      // Preferências posicionais
      if (i === 4) score += 3;
      if ([0, 2, 6, 8].includes(i)) score += 2;

      // Evitar dar ponto ao jogador
      if (opponentCanScoreNext(testBoards, testWinners, i)) {
        score -= 50;
      }

      // Aleatoriedade leve no início
      if (earlyGame) {
        score += Math.random() * 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = { b, i };
      }
    }
  }

  return bestMove;
}
