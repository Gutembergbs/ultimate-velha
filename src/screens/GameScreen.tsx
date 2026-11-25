import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import { styles } from '../styles/styles';
import { SmallBoard } from '../components/SmallBoard';
import { GameMode } from '../helpers/types';
import { useGameState } from '../hooks/useGameState';
import { useTimer } from '../hooks/useTimer';
import { useAI } from '../hooks/useAI';

type Props = {
  mode: GameMode;
  onExit: () => void;
};

export function GameScreen({ mode, onExit }: Props) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 390);

  const game = useGameState(mode, undefined, () => {
    timer.resetTimer();
  });
  const timer = useTimer(game);

  useAI(game);

  const handleReset = () => {
    game.resetGame();
    timer.resetTimer();
  };

  const isDraw =
    !game.bigWinner &&
    game.state.winners.every(w => w !== null);

  React.useEffect(() => {
    if (game.bigWinner || isDraw) {
      timer.stop();
    }
  }, [game.bigWinner, isDraw]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={styles.gameContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, styles.gameTitle]}>Ultimate Jogo da Velha</Text>

        <View style={[
          styles.statusCard,
          game.bigWinner && { borderColor: '#F97316' },
          isDraw && { borderColor: '#FBBF24' }
        ]}>
          <Text style={[
            styles.statusText,
            isDraw && { color: '#FBBF24' },
            game.bigWinner && { color: '#FDBA74' }
          ]}>
            {game.bigWinner
              ? `✨ ${game.bigWinner.player} venceu! ✨`
              : isDraw
                ? '🤝 Deu velha!'
                : mode === 'AI' && game.currentPlayer === 'O'
                  ? 'Vez da IA (O)'
                  : `Vez de ${game.currentPlayer}`}
          </Text>
        </View>

        {mode === 'LOCAL' && (
          <View style={styles.timerPanel}>
            <Text style={styles.timerText}>⏱  {timer.timeLeft}s por jogada</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                onPress={() => timer.updateBaseTime(-30)}
                style={styles.modeBtn}
              >
                <Text style={styles.buttonText}>−30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => timer.updateBaseTime(30)}
                style={styles.modeBtn}
              >
                <Text style={styles.buttonText}>+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={timer.start} style={[styles.modeBtn, styles.primaryButton]}>
                <Text style={styles.buttonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={[styles.bigBoard, { width: boardSize, height: boardSize }]}>
          {game.state.boards.map((board, idx) => (
            <SmallBoard
              key={idx}
              board={board}
              index={idx}
              active={game.activeBoard === null || game.activeBoard === idx}
              winnerLine={game.state.winners[idx]?.line ?? null}
              onMove={game.handleMove}
              renderLine={game.renderLine}
            />
          ))}
          {game.bigWinner && (
            <View style={[styles.bigWinLine, game.renderLine(game.bigWinner.line)]} />
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.undoButton, (!!game.bigWinner || isDraw) && { opacity: 0.5 }]}
            onPress={game.undoMove}
            disabled={!!game.bigWinner || isDraw}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeBtn} onPress={onExit}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
