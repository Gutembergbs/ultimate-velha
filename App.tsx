import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';

/* =======================
   TIPOS
======================= */
type Player = 'X' | 'O' | null;
type SmallBoardState = Player[];

type SmallWinner = {
  player: Player;
  line: number[] | null;
};

type BigWinner = {
  player: Player;
  line: number[];
} | null;

type BigBoardState = {
  boards: SmallBoardState[];
  winners: (SmallWinner | null)[];
};

type GameMode = 'LOCAL' | 'AI';

/* =======================
   HELPERS
======================= */
const emptySmallBoard = (): SmallBoardState => Array(9).fill(null);

const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const checkWinnerWithLine = (board: SmallBoardState): SmallWinner | null => {
  for (const l of winningLines) {
    const [a,b,c] = l;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: l };
    }
  }
  return null;
};

const checkBigWinnerWithLine = (
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
  const [bigWinner, setBigWinner] = useState<BigWinner>(null);
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
      setActiveBoard(null); // libera geral
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
     IA INSANA
  ======================= */
  const getPlayableBoards = () => {
    if (activeBoard !== null) return [activeBoard];
    return state.boards.map((_,i)=>i).filter(i => !state.winners[i]);
  };

  const evaluateSmall = (board:SmallBoardState, p:Player) => {
    let score = 0;
    for (const l of winningLines) {
      const v = l.map(i=>board[i]);
      if (v.filter(x=>x===p).length===2 && v.includes(null)) score+=5;
      if (v.filter(x=>x===p).length===1 && v.includes(null)) score+=1;
    }
    return score;
  };

  const opponentCanScoreNext = (
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

  const makeAIMove = () => {
    let bestScore=-Infinity;
    let best:any=null;

    const moves = state.boards.flat().filter(c=>c).length;
    const early = moves < 6;

    for (const b of getPlayableBoards()) {
      for (let i=0;i<9;i++) {
        if (state.boards[b][i]) continue;

        const tb = JSON.parse(JSON.stringify(state.boards));
        tb[b][i]='O';

        let score = 0;
        const sw = checkWinnerWithLine(tb[b]);
        if (sw) score+=100;

        const tw=[...state.winners];
        if (sw) tw[b]=sw;

        const bw = checkBigWinnerWithLine(tw);
        if (bw) score+=1000;

        score += evaluateSmall(tb[b],'O');
        score -= evaluateSmall(tb[b],'X');

        if (i===4) score+=3;
        if ([0,2,6,8].includes(i)) score+=2;

        if (opponentCanScoreNext(tb,tw,i)) score-=50;
        if (early) score+=Math.random()*5;

        if (score>bestScore) {
          bestScore=score;
          best={b,i};
        }
      }
    }
    if (best) handleMove(best.b,best.i);
  };

  useEffect(()=>{
    if (isAITurn && !bigWinner) {
      const t=setTimeout(makeAIMove,400);
      return ()=>clearTimeout(t);
    }
  },[currentPlayer]);

  /* =======================
     RENDER
  ======================= */
  const renderLine = (line:number[]) => {
    const k=line.join('-');
    const m:any={
      '0-1-2':styles.lineH1,'3-4-5':styles.lineH2,'6-7-8':styles.lineH3,
      '0-3-6':styles.lineV1,'1-4-7':styles.lineV2,'2-5-8':styles.lineV3,
      '0-4-8':styles.lineD1,'2-4-6':styles.lineD2
    };
    return m[k];
  };

  const renderSmallBoard = (board:SmallBoardState, idx:number) => {
    const w = state.winners[idx];
    const active = activeBoard===null || activeBoard===idx;

    return (
      <View key={idx} style={[styles.smallBoard,!active&&styles.disabledBoard]}>
        {board.map((c,i)=>(
          <TouchableOpacity key={i} style={styles.cell}
            onPress={()=>handleMove(idx,i)}>
            <Text style={[
              styles.cellText,
              c==='X'?styles.xColor:styles.oColor
            ]}>{c}</Text>
          </TouchableOpacity>
        ))}
        {w?.line && <View style={[styles.winLine,renderLine(w.line)]} />}
      </View>
    );
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
        {state.boards.map(renderSmallBoard)}
        {bigWinner && (
          <View style={[styles.bigWinLine,renderLine(bigWinner.line)]} />
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

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#020617',alignItems:'center',justifyContent:'center'},
  title:{fontSize:26,fontWeight:'bold',color:'#fff'},
  bigBoard:{width:330,height:330,flexDirection:'row',flexWrap:'wrap',borderWidth:4,borderColor:'#f8fafc'},
  smallBoard:{width:'33.33%',height:'33.33%',borderWidth:3,borderColor:'#f8fafc',flexDirection:'row',flexWrap:'wrap'},
  cell:{width:'33.33%',height:'33.33%',borderWidth:1.5,borderColor:'#94a3b8',alignItems:'center',justifyContent:'center'},
  cellText:{fontSize:26,fontWeight:'bold'},
  xColor:{color:'#22d3ee'},
  oColor:{color:'#facc15'},
  disabledBoard:{opacity:0.5},
  winLine:{position:'absolute',backgroundColor:'red'},
  lineH1:{top:'16%',left:0,right:0,height:4},
  lineH2:{top:'50%',left:0,right:0,height:4},
  lineH3:{top:'83%',left:0,right:0,height:4},
  lineV1:{left:'16%',top:0,bottom:0,width:4},
  lineV2:{left:'50%',top:0,bottom:0,width:4},
  lineV3:{left:'83%',top:0,bottom:0,width:4},
  lineD1:{left:'-20%',top:'50%',width:'140%',height:4,transform:[{rotate:'45deg'}]},
  lineD2:{left:'-20%',top:'50%',width:'140%',height:4,transform:[{rotate:'-45deg'}]},
  bigWinLine:{position:'absolute',backgroundColor:'red'},
  buttons:{flexDirection:'row',marginTop:12,gap:10},
  undoButton:{backgroundColor:'#64748b',padding:12,borderRadius:8},
  resetButton:{backgroundColor:'#ef4444',padding:12,borderRadius:8},
  modeBtn:{backgroundColor:'#334155',padding:10,borderRadius:8},
  buttonText:{color:'#fff',fontWeight:'bold'}
});
