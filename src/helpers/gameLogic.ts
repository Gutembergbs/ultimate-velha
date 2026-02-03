import { Player, SmallBoardState, SmallWinner, BigWinner } from './types';

export const emptySmallBoard = (): SmallBoardState =>
  Array(9).fill(null);

export const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export const checkWinnerWithLine = (
  board: SmallBoardState
): SmallWinner | null => {
  for (const l of winningLines) {
    const [a,b,c] = l;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: l };
    }
  }
  return null;
};

export const checkBigWinnerWithLine = (
  winners: (SmallWinner | null)[]
): BigWinner => {
  const board = winners.map(w => w?.player ?? null);
  for (const l of winningLines) {
    const [a,b,c] = l;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: l };
    }
  }
  return null;
};
