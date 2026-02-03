import { winningLines, checkWinnerWithLine } from '../helpers/gameLogic';
import { Player, SmallBoardState, SmallWinner } from '../helpers/types';

export const evaluateSmall = (board:SmallBoardState, p:Player) => {
  let score = 0;
  for (const l of winningLines) {
    const v = l.map(i=>board[i]);
    if (v.filter(x=>x===p).length===2 && v.includes(null)) score+=5;
    if (v.filter(x=>x===p).length===1 && v.includes(null)) score+=1;
  }
  return score;
};

export const opponentCanScoreNext = (
  boards:SmallBoardState[],
  winners:(SmallWinner|null)[],
  nextBoard:number
) => {
  if (winners[nextBoard]) return false;
  const b = boards[nextBoard];
  for (let i=0;i<9;i++) {
    if (b[i]) continue;
    const t=[...b]; t[i]='X';
    if (checkWinnerWithLine(t)) return true;
  }
  return false;
};
