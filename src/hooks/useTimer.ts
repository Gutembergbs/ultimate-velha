import { useEffect, useRef, useState } from 'react';

export function useTimer(game: any) {
  const [baseTime, setBaseTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ⏱️ Loop do timer
  useEffect(() => {
    if (game.mode !== 'LOCAL' || !running || game.bigWinner) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, game.mode, game.bigWinner]);

  // ⏱️ Tempo esgotado
  useEffect(() => {
    if (timeLeft > 0) return;

    setRunning(false);
    setTimeLeft(baseTime);

    game.setCurrentPlayer((p: any) => (p === 'X' ? 'O' : 'X'));
    game.setActiveBoard(null);
  }, [timeLeft, baseTime]);

  // ⏱️ Ajustar tempo base
  const updateBaseTime = (delta: number) => {
    setBaseTime(prev => {
      const next = Math.max(30, prev + delta);
      setTimeLeft(next);
      setRunning(false);
      return next;
    });
  };

  // 🔁 RESET CORRETO (reinicia e já começa)
  const resetTimer = () => {
    setTimeLeft(baseTime);
    setRunning(true);
  };

  const stop = () => {
    setTimeLeft(baseTime);
    setRunning(false);
  };

  return {
    timeLeft,
    start: () => setRunning(true),
    updateBaseTime,
    resetTimer,
    stop
  };
}
