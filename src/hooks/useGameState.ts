import { useState } from 'react';
import {
  emptySmallBoard,
  checkWinnerWithLine,
  checkBigWinnerWithLine,
  getNextActiveBoard,
  isSmallBoardFull
} from '../helpers/gameLogic';
import { BigBoardState, Player, GameMode } from '../helpers/types';
import { styles } from '../styles/styles';

type HistoryItem = {
  state: BigBoardState;
  player: Player;
  activeBoard: number | null;
};

type OnlineHook = {
  symbol: Player | null;
  sendMove: (
    boards: any[],
    winners: any[],
    nextPlayer: Player,
    activeBoard: number | null,
    expectedPlayer: Player
  ) => void;
};

export function useGameState(initialMode: GameMode, online?: OnlineHook, onMove?: () => void) {
  /* ======================
     ESTADO PRINCIPAL
  ====================== */
  const [state, setState] = useState<BigBoardState>({
    boards: Array(9).fill(null).map(() => emptySmallBoard()),
    winners: Array(9).fill(null)
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [bigWinner, setBigWinner] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode] = useState<GameMode>(initialMode);


  /* ======================
     RESET
  ====================== */
  const resetGame = () => {
    setState({
      boards: Array(9).fill(null).map(() => emptySmallBoard()),
      winners: Array(9).fill(null)
    });
    setCurrentPlayer('X');
    setActiveBoard(null);
    setBigWinner(null);
    setHistory([]);
  };

  /* ======================
     UNDO
  ====================== */
  const undoMove = () => {
    if (bigWinner || mode === 'ONLINE') return;

    if (history.length === 0) return;

    // Modo IA: desfaz duas jogadas (IA + jogador)
    const steps = mode === 'AI' ? 2 : 1;
    const targetIndex = history.length - steps;

    if (targetIndex < 0) return;

    const target = history[targetIndex];

    setState(target.state);
    setCurrentPlayer(target.player);
    setActiveBoard(target.activeBoard);
    setHistory(h => h.slice(0, targetIndex));
  };


  /* ======================
     MOVE
  ====================== */
  const handleMove = (boardIndex: number, cellIndex: number) => {
    if (bigWinner) return;

    // ⚡ Modo online: só jogador da vez pode jogar
    if (mode === 'ONLINE' && online?.symbol && online.symbol !== currentPlayer) return;

    // Bloqueio de célula ocupada ou activeBoard
    if (activeBoard !== null && activeBoard !== boardIndex) return;
    if (state.boards[boardIndex][cellIndex]) return;

    // Salvar histórico LOCAL (somente para LOCAL)
    if (mode !== 'ONLINE' && onMove) {
      onMove();
      setHistory(h => [
        ...h,
        { state: JSON.parse(JSON.stringify(state)), player: currentPlayer, activeBoard }
      ]);
    }


    // Atualiza o tabuleiro
    const newBoards = state.boards.map((b, i) =>
      i === boardIndex ? b.map((c, j) => (j === cellIndex ? currentPlayer : c)) : b
    );

    // Atualiza vencedores locais
    const newWinners = [...state.winners];
    const sw = checkWinnerWithLine(newBoards[boardIndex]);

    if (!newWinners[boardIndex]) {
      if (sw) {
        newWinners[boardIndex] = sw;
      } else if (isSmallBoardFull(newBoards[boardIndex])) {
        newWinners[boardIndex] = { player: null, line: null };
      }
    }


    // Atualiza grande vencedor
    const bw = checkBigWinnerWithLine(newWinners);
    if (bw) setBigWinner(bw);

    setState({ boards: newBoards, winners: newWinners });

    // Próximo jogador e activeBoard
    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    const nextActiveBoard = getNextActiveBoard(newBoards, cellIndex);

    setCurrentPlayer(nextPlayer);
    setActiveBoard(nextActiveBoard);

    // ⚡ Envia para Supabase se online
    if (mode === 'ONLINE' && online?.symbol) {
      const safeWinners = newWinners.map((w, i) =>
        state.winners[i] ? state.winners[i] : w
      );

      online.sendMove(
        newBoards,
        safeWinners,
        nextPlayer,
        nextActiveBoard,
        currentPlayer
      );
    }

  };

  /* ======================
     LINHAS DE VITÓRIA
  ====================== */
  const renderLine = (line: number[]) => {
    const map: any = {
      '0-1-2': styles.lineH1,
      '3-4-5': styles.lineH2,
      '6-7-8': styles.lineH3,
      '0-3-6': styles.lineV1,
      '1-4-7': styles.lineV2,
      '2-5-8': styles.lineV3,
      '0-4-8': styles.lineD1,
      '2-4-6': styles.lineD2
    };
    return map[line.join('-')];
  };


  /* ======================
     EXPORT
  ====================== */
  return {
    // estado
    state,
    currentPlayer,
    activeBoard,
    bigWinner,
    mode,

    // setters (timer / IA / online usam)
    setCurrentPlayer,
    setActiveBoard,
    setState,
    setBigWinner,

    // ações
    handleMove,
    undoMove,
    resetGame,

    // util
    renderLine
  };
}
