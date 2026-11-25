import { Player, SmallBoardState } from '../helpers/types';
import { checkWinnerWithLine } from '../helpers/gameLogic';

/**
 * Avalia um tabuleiro pequeno e retorna um score
 */
export function evaluateSmall(board: SmallBoardState, player: Player): number {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  let score = 0;

  // Centro
  if (board[4] === player) score += 3;

  // Cantos
  [0, 2, 6, 8].forEach(i => {
    if (board[i] === player) score += 2;
  });

  // Linhas possíveis
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const line of lines) {
    const pCount = line.filter(i => board[i] === player).length;
    const oCount = line.filter(i => board[i] === opponent).length;

    if (oCount === 0) {
      if (pCount === 2) score += 10;
      if (pCount === 1) score += 2;
    }

    if (pCount === 0 && oCount === 2) {
      score -= 8; // perigo
    }
  }

  // Vitória direta
  const win = checkWinnerWithLine(board);
  if (win?.player === player) score += 100;
  if (win?.player === opponent) score -= 100;

  return score;
}

/**
 * Verifica se o oponente pode pontuar na próxima jogada
 */
export function opponentCanScoreNext(
  boards: SmallBoardState[],
  winners: (any | null)[],
  nextBoard: number
): boolean {
  if (winners[nextBoard]) return false;

  const board = boards[nextBoard];
  if (!board) return false;

  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;

    const test = [...board];
    test[i] = 'X';

    if (checkWinnerWithLine(test)) return true;
  }

  return false;
}
