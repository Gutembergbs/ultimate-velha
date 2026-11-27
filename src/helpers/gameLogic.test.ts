import { describe, expect, it } from 'vitest';
import {
  checkBigWinnerWithLine,
  checkWinnerWithLine,
  getNextActiveBoard,
  isBigBoardDraw,
  isSmallBoardFull
} from './gameLogic';
import { SmallBoardState, SmallWinner } from './types';

describe('gameLogic', () => {
  it('detecta uma vitoria em tabuleiro pequeno', () => {
    const board: SmallBoardState = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkWinnerWithLine(board))
      .toEqual({ player: 'X', line: [0, 1, 2] });
  });

  it('detecta tabuleiro pequeno cheio sem vencedor', () => {
    const board: SmallBoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkWinnerWithLine(board)).toBeNull();
    expect(isSmallBoardFull(board)).toBe(true);
  });

  it('detecta empate quando todos os tabuleiros foram concluidos', () => {
    const drawWinners: (SmallWinner | null)[] =
      Array(9).fill({ player: null, line: null });
    expect(isBigBoardDraw(drawWinners)).toBe(true);
  });

  it('reconstroi uma vitoria no tabuleiro principal', () => {
    const winners: (SmallWinner | null)[] = Array(9).fill(null);
    winners[0] = { player: 'O', line: [0, 1, 2] };
    winners[1] = { player: 'O', line: [0, 1, 2] };
    winners[2] = { player: 'O', line: [0, 1, 2] };

    expect(checkBigWinnerWithLine(winners)).toEqual({
      player: 'O',
      line: [0, 1, 2]
    });
  });

  it('libera a escolha entre tabuleiros quando o destino ficou cheio', () => {
    const boards: SmallBoardState[] = Array(9).fill(null).map(() =>
      ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    );
    expect(getNextActiveBoard(boards, 4)).toBeNull();
  });
});
