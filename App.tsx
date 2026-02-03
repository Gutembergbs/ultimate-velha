import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import {
  emptySmallBoard,
  checkWinnerWithLine,
  checkBigWinnerWithLine
} from './src/helpers/gameLogic';

import {
  Player,
  BigBoardState,
  GameMode
} from './src/helpers/types';

import { evaluateSmall, opponentCanScoreNext } from './src/ai/ai';
import { SmallBoard } from './src/components/SmallBoard';
import { styles } from './src/styles/styles';

/* =======================
   APP
======================= */
export default function App() {
  const [state, setState] = useState<BigBoardState>({
    boards: Array(9).fill(null).map(() => emptySmallBoard()),
    winners: Array(9).fill(null)
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [bigWinner, setBigWinner] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [mode, setMode] = useState<GameMode>('LOCAL');

  const isAITurn = mode === 'AI' && currentPlayer === 'O';

  /* =======================
     TIMER (LOCAL)
  ======================= */
  const [baseTime, setBaseTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (mode !== 'LOCAL' || !timerRunning || bigWinner) return;

    if (timeLeft <= 0) {
      setTimerRunning(false);
      setTimeLeft(baseTime);
      setActiveBoard(null);
      setCurrentPlayer(p => p === 'X' ? 'O' : 'X');
      return;
    }

    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerRunning, mode, baseTime, bigWinner]);

  const updateBaseTime = (delta:number) => {
    setBaseTime(prev => {
      const next = Math.max(30, prev + delta);
      setTimeLeft(next);
      return next;
    });
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(baseTime);
  };

  /* =======================
     RESET / UNDO
  ======================= */
  const resetGame = () => {
    setState({
      boards: Array(9).fill(null).map(() => emptySmallBoard()),
      winners: Array(9).fill(null)
    });
    setCurrentPlayer('X');
    setActiveBoard(null);
    setBigWinner(null);
    setHistory([]);
    resetTimer();
  };

  const undoMove = () => {
    if (bigWinner) return;
    const last = history[history.length - 1];
    if (!last) return;

    setState(last.state);
    setCurrentPlayer(last.player);
    setActiveBoard(last.activeBoard);
    setHistory(history.slice(0, -1));
    resetTimer();
  };

  /* =======================
     MOVE
  ======================= */
  const handleMove = (boardIndex:number, cellIndex:number) => {
    if (bigWinner) return;
    if (activeBoard !== null && activeBoard !== boardIndex) return;
    if (state.boards[boardIndex][cellIndex]) return;

    setHistory([...history,{
      state: JSON.parse(JSON.stringify(state)),
      player: currentPlayer,
      activeBoard
    }]);

    const newBoards = state.boards.map((b,i)=>
      i===boardIndex ? b.map((c,j)=> j===cellIndex?currentPlayer:c) : b
    );

    const newWinners = [...state.winners];
    if (!newWinners[boardIndex]) {
      const sw = checkWinnerWithLine(newBoards[boardIndex]);
      if (sw) newWinners[boardIndex] = sw;
    }

    const bw = checkBigWinnerWithLine(newWinners);
    if (bw) setBigWinner(bw);

    setState({ boards:newBoards, winners:newWinners });

    if (!bw) {
      if (newBoards[cellIndex]?.every(c=>c!==null)) {
        setActiveBoard(null);
      } else {
        setActiveBoard(cellIndex);
      }
      setCurrentPlayer(currentPlayer==='X'?'O':'X');
      resetTimer();
    }
  };

  /* =======================
     IA
  ======================= */
  const getPlayableBoards = () => {
    if (activeBoard !== null) return [activeBoard];
    return state.boards.map((_,i)=>i).filter(i => !state.winners[i]);
  };

  const makeAIMove = () => {
    let bestScore = -Infinity;
    let best:any = null;

    const moves = state.boards.flat().filter(c=>c).length;
    const early = moves < 6;

    for (const b of getPlayableBoards()) {
      for (let i=0;i<9;i++) {
        if (state.boards[b][i]) continue;

        const tb = JSON.parse(JSON.stringify(state.boards));
        tb[b][i] = 'O';

        let score = 0;
        const sw = checkWinnerWithLine(tb[b]);
        if (sw) score += 100;

        const tw = [...state.winners];
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

    if (best) handleMove(best.b, best.i);
  };

  useEffect(() => {
    if (isAITurn && !bigWinner) {
      const t = setTimeout(makeAIMove, 400);
      return () => clearTimeout(t);
    }
  }, [currentPlayer]);

  /* =======================
     RENDER
  ======================= */
  const renderLine = (line:number[]) => {
    const k = line.join('-');
    const m:any = {
      '0-1-2':styles.lineH1,'3-4-5':styles.lineH2,'6-7-8':styles.lineH3,
      '0-3-6':styles.lineV1,'1-4-7':styles.lineV2,'2-5-8':styles.lineV3,
      '0-4-8':styles.lineD1,'2-4-6':styles.lineD2
    };
    return m[k];
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ultimate Jogo da Velha</Text>

      <Text style={{ color:'#e5e7eb', marginVertical:6 }}>
        Próxima jogada: {mode==='AI' && currentPlayer==='O' ? 'IA (O)' : currentPlayer}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={()=>setMode('LOCAL')} style={styles.modeBtn}>
          <Text style={styles.buttonText}>2 Jogadores</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMode('AI')} style={styles.modeBtn}>
          <Text style={styles.buttonText}>Vs IA</Text>
        </TouchableOpacity>
      </View>

      {mode==='LOCAL' && (
        <View style={{ alignItems:'center', marginVertical:10 }}>
          <Text style={{ color:'#fff', fontSize:18 }}>⏱ {timeLeft}s</Text>
          <View style={{ flexDirection:'row', gap:8, marginTop:6 }}>
            <TouchableOpacity onPress={()=>updateBaseTime(-30)} style={styles.modeBtn}>
              <Text style={styles.buttonText}>-30s</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateBaseTime(30)} style={styles.modeBtn}>
              <Text style={styles.buttonText}>+30s</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setTimerRunning(true)} style={styles.resetButton}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.bigBoard}>
        {state.boards.map((board,idx)=>(
          <SmallBoard
            key={idx}
            board={board}
            index={idx}
            active={activeBoard===null || activeBoard===idx}
            winnerLine={state.winners[idx]?.line ?? null}
            onMove={handleMove}
            renderLine={renderLine}
          />
        ))}
        {bigWinner && (
          <View style={[styles.bigWinLine,renderLine(bigWinner.line)]}/>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.undoButton} onPress={undoMove}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
